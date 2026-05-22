// User preference store — persisted in localStorage via Zustand.
//
// Currently holds the questionnaire UX mode (expert vs guided). Future
// preferences (dark-mode override, default language, etc.) can be added
// here without changing the surface API.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UxMode = 'expert' | 'guided'

interface PreferenceState {
  mode: UxMode
  setMode: (mode: UxMode) => void
  toggleMode: () => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set, get) => ({
      mode: 'expert',
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === 'expert' ? 'guided' : 'expert' }),
    }),
    {
      name: 'symba-preferences',
    },
  ),
)
