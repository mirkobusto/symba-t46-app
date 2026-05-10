// Zustand store for the in-progress Case object + the pipeline result.
//
// State shape (4-A foundation):
//   draft     — the Case being built by the questionnaire (input)
//   result    — the Case returned by POST /api/pipeline/run (output)
//   loading   — true while the pipeline call is in-flight
//   error     — last error message (cleared on next run)
//
// 4-B+ will add per-question setters; 4-A only exposes setDraft / runDraft
// / reset so the foundation is exercised end-to-end.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { ApiError, runPipeline } from '../services/api'
import type { Case } from '../types/api'

const EMPTY_DRAFT: Case = {
  q3: { env: false, eco: false, soc: false },
  q4: [],
  flows: [],
  sites: [],
  alternative_scenarios: [],
  advanced: {},
}

export interface CaseState {
  draft: Case
  result: Case | null
  loading: boolean
  error: string | null

  setDraft: (next: Case) => void
  patchDraft: (patch: Partial<Case>) => void
  runDraft: () => Promise<Case | null>
  reset: () => void
}

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      draft: { ...EMPTY_DRAFT },
      result: null,
      loading: false,
      error: null,

      setDraft: (next) => set({ draft: next }),

      patchDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),

      async runDraft() {
        set({ loading: true, error: null })
        try {
          const result = await runPipeline(get().draft)
          set({ result, loading: false })
          return result
        } catch (e) {
          const detail =
            e instanceof ApiError
              ? `${e.status}: ${e.detail}`
              : e instanceof Error
                ? e.message
                : 'Unknown error'
          set({ loading: false, error: detail, result: null })
          return null
        }
      },

      reset: () =>
        set({ draft: { ...EMPTY_DRAFT }, result: null, error: null }),
    }),
    {
      name: 'symba-case-draft',
      // Persist only draft + result; transient flags (loading/error) reset
      // on hydration.
      partialize: (state) => ({ draft: state.draft, result: state.result }),
    },
  ),
)
