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
  /**
   * Id of the server-side case this draft corresponds to, or null while
   * the case only exists locally. Set when a case is saved or loaded;
   * the Network Builder needs it to know where to sync its DCF content.
   */
  serverCaseId: string | null
  /** Name of that server-side case, for the pages that should say which
   * case you are looking at. */
  serverCaseName: string | null

  setDraft: (next: Case) => void
  /** Adopt an already-run case as the current result (loading a saved
   * case, which was stored post-pipeline). */
  setResult: (next: Case | null) => void
  setServerCase: (id: string | null, name?: string | null) => void
  patchDraft: (patch: Partial<Case>) => void
  runDraft: () => Promise<Case | null>
  runScenariosFromDraft: () => Promise<ScenariosResponse | null>
  reset: () => void
}

// Cases saved before 2026-10-18 may carry the retired Q2 options C (design
// phase) and D (baseline plus alternatives): both read as B, "not yet", as the
// backend does (app/domain/models.py).
export function withCurrentQ2<T extends { q2?: unknown } | null | undefined>(kase: T): T {
  if (kase && (kase.q2 === 'C' || kase.q2 === 'D')) return { ...kase, q2: 'B' }
  return kase
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
      serverCaseId: null,
      serverCaseName: null,

      setDraft: (next) => set({ draft: withCurrentQ2(next), lastSavedAt: Date.now() }),

      setResult: (next) => set({ result: next }),

      setServerCase: (id, name = null) =>
        set({ serverCaseId: id, serverCaseName: name }),

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
              situation: result.ilcd_situation ?? '—',
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
          serverCaseId: null,
          serverCaseName: null,
        }),
    }),
    {
      name: 'symba-case-draft',
      // v1 (2026-10-18): Q2 in two answers; older drafts are read with withCurrentQ2.
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { draft?: Case; result?: Case | null }
        return { ...state, draft: withCurrentQ2(state.draft), result: withCurrentQ2(state.result) }
      },
      // Persist draft + result + scenariosResult + lastSavedAt; transient
      // flags (loading/error) reset on hydration.
      partialize: (state) => ({
        draft: state.draft,
        result: state.result,
        scenariosResult: state.scenariosResult,
        lastSavedAt: state.lastSavedAt,
        serverCaseId: state.serverCaseId,
        serverCaseName: state.serverCaseName,
      }),
    },
  ),
)
