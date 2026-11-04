// The network as the app draws it, for the Data Collection files (owner
// decision 2026-11-03: a faithful image in Word and Excel). React Flow draws
// nodes in HTML and edges in SVG, all inside one viewport element: that is
// what is captured, moved and scaled so every node is in the picture. The
// canvas as it stands on screen cut off whatever was panned out of view
// (Kimi test 2026-11-04, A2-01, A4-01).

import { toPng } from 'html-to-image'

const LEFT_OUT = ['react-flow__controls', 'react-flow__minimap', 'react-flow__attribution', 'react-flow__panel']
/** Room around the nodes, in flow units, for arrows that bend outside them. */
const PADDING = 60
/** Width of the picture before the pixel ratio; larger networks are scaled down. */
const MAX_WIDTH = 1800

export interface Bounds { x: number; y: number; width: number; height: number }

/** The box around the nodes and the edges, in the coordinates of the flow. */
export function networkBounds(viewport: Element): Bounds | null {
  const boxes: Bounds[] = []
  viewport.querySelectorAll<HTMLElement>('.react-flow__node').forEach((node) => {
    const m = /translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px\s*\)/.exec(node.style.transform)
    if (!m) return
    boxes.push({ x: Number(m[1]), y: Number(m[2]), width: node.offsetWidth, height: node.offsetHeight })
  })
  if (boxes.length === 0) return null
  // the edges live in an SVG with no viewBox: their boxes are flow coordinates
  viewport.querySelectorAll<SVGGraphicsElement>('.react-flow__edge-path').forEach((path) => {
    try {
      const b = path.getBBox()
      if (b.width || b.height) boxes.push({ x: b.x, y: b.y, width: b.width, height: b.height })
    } catch {
      // not laid out (jsdom, hidden tab): the nodes and the padding will do
    }
  })
  const x = Math.min(...boxes.map((b) => b.x))
  const y = Math.min(...boxes.map((b) => b.y))
  return {
    x,
    y,
    width: Math.max(...boxes.map((b) => b.x + b.width)) - x,
    height: Math.max(...boxes.map((b) => b.y + b.height)) - y,
  }
}

/** Base64 PNG (data URL) of the whole network, or null when nothing is drawn. */
export async function captureNetworkPng(root: ParentNode = document): Promise<string | null> {
  const viewport = root.querySelector<HTMLElement>('.react-flow .react-flow__viewport')
  // the preview built from the questionnaire flows: the files say no network
  // is drawn yet, a picture of one would contradict them (A1-02)
  if (viewport?.closest('[data-placeholder]')) return null
  const bounds = viewport ? networkBounds(viewport) : null
  if (!viewport || !bounds) return null
  const scale = Math.min(1, MAX_WIDTH / (bounds.width + 2 * PADDING))
  const width = Math.ceil((bounds.width + 2 * PADDING) * scale)
  const height = Math.ceil((bounds.height + 2 * PADDING) * scale)
  try {
    return await toPng(viewport, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${(PADDING - bounds.x) * scale}px, ${(PADDING - bounds.y) * scale}px) scale(${scale})`,
      },
      filter: (node) => !(node instanceof Element && LEFT_OUT.some((c) => node.classList.contains(c))),
    })
  } catch {
    // a picture is a bonus: the files are still useful without it
    return null
  }
}
