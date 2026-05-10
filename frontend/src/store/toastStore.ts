// Lightweight transient-notification store.
//
// Used by:
//   - caseStore.runDraft (success / error after pipeline.run)
//   - any future surface that needs ephemeral UX feedback
//
// API: push(toast) returns the toast id; toasts auto-dismiss after
// `durationMs` (default 5000); dismiss(id) cancels early. Multiple
// toasts can stack.

import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

export interface ToastState {
  toasts: Toast[]
  push: (input: { type: ToastType; message: string; durationMs?: number }) => number
  dismiss: (id: number) => void
}

let _next = 1

// Cap the visible-toast stack so a flurry of errors can't overwhelm
// the screen. Older toasts are dropped FIFO when the cap is exceeded.
const MAX_TOASTS = 3

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: ({ type, message, durationMs = 5000 }) => {
    const id = _next++
    const next = [...get().toasts, { id, type, message }]
    // Drop oldest if over the cap (keep last MAX_TOASTS)
    const trimmed = next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next
    set({ toasts: trimmed })
    if (durationMs > 0) {
      setTimeout(() => get().dismiss(id), durationMs)
    }
    return id
  },
  dismiss: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
