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

import i18n from 'i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { ApiError, runPipeline, runScenarios } from '../services/api'
import type { Case, ScenariosResponse } from '../types/api'
import { useToastStore } from './toastStore'

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
  scenariosResult: ScenariosResponse | null
  loading: boolean
  error: string | null
  lastSavedAt: number | null

  setDraft: (next: Case) => void
  patchDraft: (patch: Partial<Case>) => void
  runDraft: () => Promise<Case | null>
  runScenariosFromDraft: () => Promise<ScenariosResponse | null>
  reset: () => void
}

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      draft: { ...EMPTY_DRAFT },
      result: null,
      scenariosResult: null,
      loading: false,
      error: null,
      lastSavedAt: null,

      setDraft: (next) => set({ draft: next, lastSavedAt: Date.now() }),

      patchDraft: (patch) =>
        set({ draft: { ...get().draft, ...patch }, lastSavedAt: Date.now() }),

      async runDraft() {
        const t0 = performance.now()
        set({ loading: true, error: null })
        try {
          const result = await runPipeline(get().draft)
          set({ result, loading: false })
          const ms = Math.round(performance.now() - t0)
          useToastStore.getState().push({
            type: 'success',
            message: i18n.t('toast.pipelineCompleted', {
              ms,
              pathway: result.pathway_id ?? '—',
            }),
          })
          return result
        } catch (e) {
          const detail =
            e instanceof ApiError
              ? `${e.status}: ${e.detail}`
              : e instanceof Error
                ? e.message
                : 'Unknown error'
          set({ loading: false, error: detail, result: null })
          useToastStore.getState().push({
            type: 'error',
            message: i18n.t('toast.pipelineError', { detail }),
            durationMs: 8000,
          })
          return null
        }
      },

      async runScenariosFromDraft() {
        const draft = get().draft
        const scenarios = (draft.alternative_scenarios ?? []).map((s) => ({
          id: s.id,
          label: s.label,
          overrides: s.overrides ?? {},
        }))
        set({ loading: true, error: null })
        try {
          const response = await runScenarios(draft, scenarios)
          set({ scenariosResult: response, loading: false })
          useToastStore.getState().push({
            type: 'success',
            message: i18n.t('toast.scenariosCompleted', {
              n: response.scenarios.length,
            }),
          })
          return response
        } catch (e) {
          const detail =
            e instanceof ApiError
              ? `${e.status}: ${e.detail}`
              : e instanceof Error
                ? e.message
                : 'Unknown error'
          set({ loading: false, error: detail, scenariosResult: null })
          useToastStore.getState().push({
            type: 'error',
            message: i18n.t('toast.scenariosError', { detail }),
            durationMs: 8000,
          })
          return null
        }
      },

      reset: () =>
        set({
          draft: { ...EMPTY_DRAFT },
          result: null,
          scenariosResult: null,
          error: null,
          lastSavedAt: null,
        }),
    }),
    {
      name: 'symba-case-draft',
      // Persist draft + result + scenariosResult + lastSavedAt; transient
      // flags (loading/error) reset on hydration.
      partialize: (state) => ({
        draft: state.draft,
        result: state.result,
        scenariosResult: state.scenariosResult,
        lastSavedAt: state.lastSavedAt,
      }),
    },
  ),
)
