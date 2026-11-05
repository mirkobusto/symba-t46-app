import { describe, expect, it, vi } from 'vitest'

import { reloadOnce } from '../lazyPage'

function memory() {
  const data = new Map<string, string>()
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
}

// A tab opened before a deploy asks for chunks that are gone (2026-11-05).
describe('reloadOnce', () => {
  it('reloads the page when a chunk fails to load', () => {
    const reload = vi.fn()
    expect(reloadOnce({ storage: memory(), now: 1_000_000, reload })).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('does not loop when the chunk is still missing after the reload', () => {
    const storage = memory()
    const reload = vi.fn()
    reloadOnce({ storage, now: 1_000_000, reload })
    expect(reloadOnce({ storage, now: 1_003_000, reload })).toBe(false)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('reloads again after a later deploy', () => {
    const storage = memory()
    const reload = vi.fn()
    reloadOnce({ storage, now: 1_000_000, reload })
    expect(reloadOnce({ storage, now: 1_000_000 + 3_600_000, reload })).toBe(true)
    expect(reload).toHaveBeenCalledTimes(2)
  })
})
