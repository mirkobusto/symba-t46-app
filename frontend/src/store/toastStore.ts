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

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: ({ type, message, durationMs = 5000 }) => {
    const id = _next++
    set({ toasts: [...get().toasts, { id, type, message }] })
    if (durationMs > 0) {
      setTimeout(() => get().dismiss(id), durationMs)
    }
    return id
  },
  dismiss: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
