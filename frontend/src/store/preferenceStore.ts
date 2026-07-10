// User preference store — persisted in localStorage via Zustand.
//
// Holds:
//   - `mode`   — questionnaire UX mode (expert vs guided) [Phase C]
//   - `role`   — user self-declared role [Phase 4 onboarding]
//   - `task`   — user's initial intent [Phase 4 onboarding]
//   - `hasOnboarded` — set to true after the /welcome flow completes
//
// Adding future preferences (dark-mode override, default language,
// etc.) can happen here without changing the surface API.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UxMode = 'expert' | 'guided'

export type UserRole =
  | 'analyst'         // sustainability analyst, IS practitioner, reviewer
  | 'industry'        // industrial operator
  | 'authority'       // local / regional authority, policymaker
  | 'community'       // community representative
  | 'enduser'         // end-user / citizen
  | 'unknown'         // "not sure yet"

export type UserTask =
  | 'assess'          // start a new IS assessment
  | 'read'            // read a shared report
  | 'explore'         // explore my region / sector
  | 'browse'          // just look around

interface PreferenceState {
  mode: UxMode
  role: UserRole | null
  task: UserTask | null
  hasOnboarded: boolean

  setMode: (mode: UxMode) => void
  toggleMode: () => void

  setRole: (role: UserRole) => void
  setTask: (task: UserTask) => void
  completeOnboarding: (role: UserRole, task: UserTask) => void
  resetOnboarding: () => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set, get) => ({
      mode: 'expert',
      role: null,
      task: null,
      hasOnboarded: false,

      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === 'expert' ? 'guided' : 'expert' }),

      setRole: (role) => set({ role }),
      setTask: (task) => set({ task }),
      completeOnboarding: (role, task) =>
        set({
          role,
          task,
          hasOnboarded: true,
          // Analysts default to expert; everyone else defaults to guided.
          mode: role === 'analyst' ? 'expert' : 'guided',
        }),
      resetOnboarding: () =>
        set({ role: null, task: null, hasOnboarded: false }),
    }),
    { name: 'symba-preferences' },
  ),
)

// Route recommended after onboarding completes.
export function recommendedRouteFor(role: UserRole, task: UserTask): string {
  if (task === 'read') return '/cases'
  if (task === 'explore') return '/aggregate'
  if (task === 'browse') return '/'
  // task === 'assess'
  if (role === 'authority' || role === 'community' || role === 'enduser') {
    return '/questionnaire' // guided-mode kicks in automatically
  }
  return '/questionnaire'
}
