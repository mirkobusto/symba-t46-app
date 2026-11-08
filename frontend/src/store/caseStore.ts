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

// The answers that make a case, as the questionnaire writes them: what a
// saved copy is compared on. Derived output (situation, nodes, rules) and the
// bookkeeping fields are left out.
const INPUT_KEYS = [
  'study_purpose', 'q1', 'q2', 'network_long_standing', 'q3', 'q4', 'flows',
  'alternative_scenarios', 'q6a', 'q6b', 'q7', 'reference_market_region',
  'reference_market_scope', 'operating_start', 'operating_start_year',
  'analysis_period_years', 'asset_lifetime_years', 'decision_context',
  'market_screening_documented', 'policy_objective', 'comparison_goal',
  'dedicated_shared_assets', 'advanced', 'sites',
] as const

/** A value with its empty parts dropped and its keys sorted: an unanswered
 * question is null in a loaded case, undefined or absent in the
 * questionnaire's draft, and must compare equal. */
function normalised(value: unknown): unknown {
  if (value === null || value === undefined || value === '') return undefined
  if (Array.isArray(value)) {
    const items = value.map(normalised).filter((v) => v !== undefined)
    return items.length ? items : undefined
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value as object).sort()) {
      const v = normalised((value as Record<string, unknown>)[key])
      if (v !== undefined) out[key] = v
    }
    return Object.keys(out).length ? out : undefined
  }
  return value
}

/** The answers of a case, as a string that two equal sets of answers share. */
export function answersFingerprint(kase: Case): string {
  const picked: Record<string, unknown> = {}
  for (const key of INPUT_KEYS) picked[key] = (kase as Record<string, unknown>)[key]
  // Q4 is a set
  if (Array.isArray(picked.q4)) picked.q4 = [...(picked.q4 as string[])].sort()
  // the questionnaire opens with "environmental" ticked: that alone is no answer
  const q3 = kase.q3
  if (!q3 || (!q3.eco && !q3.soc)) delete picked.q3
  return JSON.stringify(normalised(picked) ?? {})
}

const BLANK_FINGERPRINT = answersFingerprint({})

/** Whether a draft holds no answer at all. */
export function isBlankDraft(kase: Case): boolean {
  return answersFingerprint(kase) === BLANK_FINGERPRINT
}

// The questionnaire keeps the answers being typed in its own state and writes
// them to the draft on run, on leaving the page and on reload. Whoever asks
// whether work would be lost first asks it to write them (UX round 6, P7-03).
let draftFlush: (() => void) | null = null

/** Register the function that writes the answers on screen to the draft;
 * returns the function that unregisters it. */
export function registerDraftFlush(flush: () => void): () => void {
  draftFlush = flush
  return () => {
    if (draftFlush === flush) draftFlush = null
  }
}

/** Write the answers on screen, if any page holds some, to the draft. */
export function flushDraft(): void {
  draftFlush?.()
}

/** An error in words: a failed fetch (server down, no network) said only
 * "Failed to fetch" next to the run button (Kimi test 2026-11-04, A8-02). */
function errorDetail(e: unknown): string {
  if (e instanceof ApiError) return `${e.status}: ${e.detail}`
  if (e instanceof TypeError) return i18n.t('common.serverUnreachable')
  return e instanceof Error ? e.message : 'Unknown error'
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
  /**
   * The answers were worked out again after the case was saved or loaded:
   * what the pages show may no longer be what the server holds, and the
   * files of a saved case are built from the server copy. Cleared when the
   * case is saved or loaded (UX round 5, D3).
   */
  savedDiverged: boolean
  /** The answers of the saved copy (answersFingerprint) when the case was
   * saved or loaded; null while it is not saved. */
  savedAnswers: string | null
  /** Name of the saved case that was deleted while open: the pages say so
   * until the answers are saved again or put away (UX round 6, P7-01). */
  deletedCaseName: string | null
  /** Bumped by reset(): a page that wrote answers from before it must not
   * write them back after it (sign out, new assessment). */
  generation: number

  setDraft: (next: Case) => void
  /** Adopt an already-run case as the current result (loading a saved
   * case, which was stored post-pipeline). */
  setResult: (next: Case | null) => void
  /** Bind the draft to a saved case; `saved` is the copy the server holds
   * (the draft when left out). */
  setServerCase: (id: string | null, name?: string | null, saved?: Case) => void
  /** The open case no longer exists on the server: keep the answers in this
   * browser as a case not saved yet. */
  detachDeletedCase: () => void
  patchDraft: (patch: Partial<Case>) => void
  runDraft: () => Promise<Case | null>
  runScenariosFromDraft: () => Promise<ScenariosResponse | null>
  reset: () => void
}

// Cases saved before 2026-10-18 may carry retired options, read as the backend
// does (app/domain/models.py): Q2 C (design phase) and D (baseline plus
// alternatives) as B, "not yet"; Q7 D (multi-scale programmes) as C.
export function withCurrentAnswers<T extends {
  q2?: unknown; q7?: unknown; ilcd_situation?: unknown
  advanced?: Record<string, unknown> | null; dedicated_shared_assets?: boolean | null
} | null | undefined>(kase: T): T {
  if (!kase) return kase
  let out = kase
  if (out.q2 === 'C' || out.q2 === 'D') out = { ...out, q2: 'B' }
  if (out.q7 === 'D') out = { ...out, q7: 'C' }
  // retired on 2026-10-15: not a D4.1 category (same reading as the backend)
  if (out.ilcd_situation === 'ILCD Situation A multi-actor') out = { ...out, ilcd_situation: 'ILCD Situation A' }
  // the old advanced key became Q12 (2026-10-18); converted once, as the backend does
  if (out.advanced && 'is_specific_capital_goods' in out.advanced) {
    const { is_specific_capital_goods: raw, ...rest } = out.advanced
    const yes = raw === true || ['true', '1', 'yes'].includes(String(raw).trim().toLowerCase())
    out = {
      ...out,
      advanced: rest,
      dedicated_shared_assets: out.dedicated_shared_assets ?? yes,
    }
  }
  return out
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
      savedDiverged: false,
      savedAnswers: null,
      deletedCaseName: null,
      generation: 0,

      setDraft: (next) => set({ draft: withCurrentAnswers(next), lastSavedAt: Date.now() }),

      setResult: (next) => set({ result: next }),

      setServerCase: (id, name = null, saved) =>
        set({
          serverCaseId: id,
          serverCaseName: name,
          savedDiverged: false,
          savedAnswers: id === null ? null : answersFingerprint(saved ?? get().draft),
          deletedCaseName: null,
        }),

      detachDeletedCase: () => {
        const name = get().serverCaseName
        if (get().serverCaseId === null) return
        set({
          serverCaseId: null,
          serverCaseName: null,
          savedDiverged: false,
          savedAnswers: null,
          deletedCaseName: name ?? '',
        })
      },

      patchDraft: (patch) =>
        set({ draft: { ...get().draft, ...patch }, lastSavedAt: Date.now() }),

      async runDraft() {
        set({ loading: true, error: null })
        try {
          const result = await runPipeline(get().draft)
          set({ result, loading: false, savedDiverged: get().serverCaseId !== null })
          // milliseconds and the English situation code meant nothing to a
          // reader; the result page names the situation in words
          useToastStore.getState().push({
            type: 'success',
            message: i18n.t('toast.pipelineCompleted'),
          })
          return result
        } catch (e) {
          const detail = errorDetail(e)
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
          const detail = errorDetail(e)
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
          savedDiverged: false,
          savedAnswers: null,
          deletedCaseName: null,
          generation: get().generation + 1,
        }),
    }),
    {
      name: 'symba-case-draft',
      // v1 (2026-10-18): Q2 in two answers; v2: Q7 in three; v3: Q12 from the old
      // advanced key, Situation A multi-actor retired. Older drafts are read with
      // withCurrentAnswers.
      version: 3,
      migrate: (persisted) => {
        const state = persisted as {
          draft?: Case
          result?: Case | null
          scenariosResult?: ScenariosResponse | null
        }
        const sr = state.scenariosResult
        return {
          ...state,
          draft: withCurrentAnswers(state.draft),
          result: withCurrentAnswers(state.result),
          scenariosResult: sr ? {
            ...sr,
            baseline: withCurrentAnswers(sr.baseline),
            scenarios: sr.scenarios.map((s) => ({ ...s, result: withCurrentAnswers(s.result) })),
          } : sr,
        }
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
        savedDiverged: state.savedDiverged,
        savedAnswers: state.savedAnswers,
        deletedCaseName: state.deletedCaseName,
      }),
    },
  ),
)
