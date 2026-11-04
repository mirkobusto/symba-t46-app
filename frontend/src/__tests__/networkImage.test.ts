import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('html-to-image', () => ({ toPng: vi.fn(async () => 'data:image/png;base64,AAAA') }))

import { toPng } from 'html-to-image'
import { captureNetworkPng, networkBounds } from '../pages/networkImage'

const node = (x: number, y: number) =>
  `<div class="react-flow__node" style="transform: translate(${x}px, ${y}px)">A</div>`
const flow = (inner: string) =>
  `<div class="react-flow"><div class="react-flow__viewport" style="transform: translate(-500px, 0px) scale(1)">${inner}</div>`
  + '<div class="react-flow__panel react-flow__controls"></div></div>'

// The network picture sent with a download (owner decision 2026-11-03).
describe('captureNetworkPng', () => {
  beforeEach(() => {
    vi.mocked(toPng).mockClear()
  })

  it('is null when no network is on screen', async () => {
    document.body.innerHTML = flow('')
    expect(await captureNetworkPng()).toBeNull()
  })

  it('captures the viewport, without the zoom buttons', async () => {
    document.body.innerHTML = flow(node(0, 0))
    expect(await captureNetworkPng()).toBe('data:image/png;base64,AAAA')
    const [target, options] = vi.mocked(toPng).mock.calls[0]
    expect(target).toBe(document.querySelector('.react-flow__viewport'))
    expect(options!.filter!(document.querySelector('.react-flow__controls')!)).toBe(false)
    expect(options!.filter!(document.querySelector('.react-flow__node')!)).toBe(true)
  })

  // Kimi test 2026-11-04, A2-01 / A4-01: a node panned out of view was cut off
  it('frames every node, wherever the canvas is panned', async () => {
    document.body.innerHTML = flow(node(-200, 40) + node(900, 300))
    expect(networkBounds(document.querySelector('.react-flow__viewport')!))
      .toEqual({ x: -200, y: 40, width: 1100, height: 260 })
    await captureNetworkPng()
    const options = vi.mocked(toPng).mock.calls[0][1]!
    expect(options.width).toBe(1220)
    expect(options.style!.transform).toBe('translate(260px, 20px) scale(1)')
  })

  it('scales a wide network down to a readable picture', async () => {
    document.body.innerHTML = flow(node(0, 0) + node(3480, 0))
    await captureNetworkPng()
    const options = vi.mocked(toPng).mock.calls[0][1]!
    expect(options.width).toBe(1800)
    expect(options.style!.transform).toMatch(/scale\(0\.5\)$/)
  })

  it('a failed capture still lets the files download', async () => {
    vi.mocked(toPng).mockRejectedValueOnce(new Error('tainted canvas'))
    document.body.innerHTML = flow(node(0, 0))
    expect(await captureNetworkPng()).toBeNull()
  })
})
