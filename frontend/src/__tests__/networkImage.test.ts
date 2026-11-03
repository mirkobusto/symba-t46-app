import { describe, expect, it, vi } from 'vitest'

vi.mock('html-to-image', () => ({ toPng: vi.fn(async () => 'data:image/png;base64,AAAA') }))

import { toPng } from 'html-to-image'
import { captureNetworkPng } from '../pages/networkImage'

// The network picture sent with a download (owner decision 2026-11-03).
describe('captureNetworkPng', () => {
  it('is null when no network is on screen', async () => {
    document.body.innerHTML = '<div class="react-flow"></div>'
    expect(await captureNetworkPng()).toBeNull()
  })

  it('captures the canvas without the zoom buttons', async () => {
    document.body.innerHTML = '<div class="react-flow"><div class="react-flow__node">A</div><div class="react-flow__controls"></div></div>'
    expect(await captureNetworkPng()).toBe('data:image/png;base64,AAAA')
    const options = vi.mocked(toPng).mock.calls[0][1]!
    expect(options.filter!(document.querySelector('.react-flow__controls')!)).toBe(false)
    expect(options.filter!(document.querySelector('.react-flow__node')!)).toBe(true)
  })

  it('a failed capture still lets the files download', async () => {
    vi.mocked(toPng).mockRejectedValueOnce(new Error('tainted canvas'))
    document.body.innerHTML = '<div class="react-flow"><div class="react-flow__node">A</div></div>'
    expect(await captureNetworkPng()).toBeNull()
  })
})
