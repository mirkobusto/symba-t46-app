// In-app confirm and text dialogs, in place of window.confirm/prompt.
//
// The native dialogs looked like system pop-ups, could not be styled or
// translated beyond their text, and blocked the headless browser the UX
// agents drive (UX round 2026-11-03). Callers await a promise:
//   if (!(await askConfirm(text))) return
//   const name = await askText(text, defaultValue)   // null = cancelled

import { create } from 'zustand'

interface DialogRequest {
  /** set by open(): keys the dialog so each request starts fresh */
  id?: number
  message: string
  /** present for a text dialog: the initial value of the field */
  input?: string
  confirmLabel?: string
  resolve: (value: string | boolean | null) => void
}

interface DialogState {
  current: DialogRequest | null
  open: (req: DialogRequest) => void
  close: (value: string | boolean | null) => void
}

let nextId = 1

export const useDialogStore = create<DialogState>((set, get) => ({
  current: null,
  open: (req) => {
    get().current?.resolve(null)   // a newer request cancels a pending one
    set({ current: { ...req, id: nextId++ } })
  },
  close: (value) => {
    const cur = get().current
    set({ current: null })
    cur?.resolve(value)
  },
}))

export function askConfirm(message: string, confirmLabel?: string): Promise<boolean> {
  return new Promise((resolve) =>
    useDialogStore.getState().open({ message, confirmLabel, resolve: (v) => resolve(v === true) }),
  )
}

export function askText(message: string, initial = '', confirmLabel?: string): Promise<string | null> {
  return new Promise((resolve) =>
    useDialogStore.getState().open({
      message, input: initial, confirmLabel,
      resolve: (v) => resolve(typeof v === 'string' ? v : null),
    }),
  )
}
