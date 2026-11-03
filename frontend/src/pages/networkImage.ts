// The network as the app draws it, for the Data Collection files (owner
// decision 2026-11-03: a faithful image in Word and Excel). React Flow draws
// nodes in HTML and edges in SVG, so the canvas on screen is captured as it
// stands, without the zoom buttons and the attribution.

import { toPng } from 'html-to-image'

const LEFT_OUT = ['react-flow__controls', 'react-flow__minimap', 'react-flow__attribution', 'react-flow__panel']

/** Base64 PNG (data URL) of the network on screen, or null when nothing is drawn. */
export async function captureNetworkPng(root: ParentNode = document): Promise<string | null> {
  const flow = root.querySelector<HTMLElement>('.react-flow')
  if (!flow || !flow.querySelector('.react-flow__node')) return null
  try {
    return await toPng(flow, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      filter: (node) => !(node instanceof Element && LEFT_OUT.some((c) => node.classList.contains(c))),
    })
  } catch {
    // a picture is a bonus: the files are still useful without it
    return null
  }
}
