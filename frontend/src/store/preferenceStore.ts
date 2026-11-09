// User preference store — persisted in localStorage via Zustand.
//
// Holds:
//   - `mode`   — questionnaire UX mode (expert vs guided) [Phase C]
//   - `dismissedHints` — per-surface "I've read this" flags for the
//     inline how-it-works strips, keyed by an arbitrary hint id
//
// Adding future preferences (dark-mode override, default language,
// etc.) can happen here without changing the surface API.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UxMode = 'expert' | 'guided'

interface PreferenceState {
  mode: UxMode
  dismissedHints: Record<string, boolean>

  setMode: (mode: UxMode) => void
  toggleMode: () => void

  dismissHint: (id: string) => void
  restoreHints: () => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set, get) => ({
      mode: 'expert',
      dismissedHints: {},

      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === 'expert' ? 'guided' : 'expert' }),

      dismissHint: (id) =>
        set({ dismissedHints: { ...get().dismissedHints, [id]: true } }),
      restoreHints: () => set({ dismissedHints: {} }),
    }),
    { name: 'symba-preferences' },
  ),
)
