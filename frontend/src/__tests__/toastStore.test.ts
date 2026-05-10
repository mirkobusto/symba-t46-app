import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToastStore } from '../store/toastStore'

describe('toastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Clear any toasts left from a previous test
    useToastStore.setState({ toasts: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts empty', () => {
    expect(useToastStore.getState().toasts).toEqual([])
  })

  it('push adds a toast and returns its id', () => {
    const id = useToastStore.getState().push({
      type: 'success',
      message: 'hi',
    })
    expect(id).toBeGreaterThan(0)
    const t = useToastStore.getState().toasts[0]
    expect(t.message).toBe('hi')
    expect(t.type).toBe('success')
  })

  it('auto-dismisses after the configured duration', () => {
    useToastStore.getState().push({
      type: 'info',
      message: 'fades',
      durationMs: 1000,
    })
    expect(useToastStore.getState().toasts.length).toBe(1)
    vi.advanceTimersByTime(1000)
    expect(useToastStore.getState().toasts.length).toBe(0)
  })

  it('dismiss removes a specific toast by id', () => {
    const a = useToastStore.getState().push({
      type: 'info', message: 'a', durationMs: 0,
    })
    const b = useToastStore.getState().push({
      type: 'info', message: 'b', durationMs: 0,
    })
    expect(useToastStore.getState().toasts.length).toBe(2)
    useToastStore.getState().dismiss(a)
    const remaining = useToastStore.getState().toasts
    expect(remaining.length).toBe(1)
    expect(remaining[0].id).toBe(b)
  })

  it('durationMs=0 does not schedule auto-dismiss', () => {
    useToastStore.getState().push({
      type: 'info', message: 'persistent', durationMs: 0,
    })
    vi.advanceTimersByTime(60000)
    expect(useToastStore.getState().toasts.length).toBe(1)
  })

  it('caps the visible toast stack at 3, dropping oldest FIFO', () => {
    const push = useToastStore.getState().push
    push({ type: 'info', message: '1', durationMs: 0 })
    push({ type: 'info', message: '2', durationMs: 0 })
    push({ type: 'info', message: '3', durationMs: 0 })
    push({ type: 'info', message: '4', durationMs: 0 })
    push({ type: 'info', message: '5', durationMs: 0 })
    const messages = useToastStore.getState().toasts.map((t) => t.message)
    // Oldest two ('1', '2') dropped
    expect(messages).toEqual(['3', '4', '5'])
  })
})
