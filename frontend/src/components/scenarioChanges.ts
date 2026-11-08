// The answers a scenario can change, in the questionnaire's own words, shared
// by the scenario editor and the scenario comparison (UX round of 2026-11-08).
//
// The list covers every answer the engine reads to set the configuration.
// Follow-up questions (the market screening under a structural decision, the
// long-standing network under exchanges already running, the year under a
// future operation, the reference market outside one company's report) are
// offered only where the questionnaire asks them, judged on the scenario's own
// answers: without the screening a structural scenario could never reach
// Situation B (P1-01). Q0 and the sector of Q6a describe the case and decide
// nothing, so a scenario does not change them.

import type { Case } from '../types/api'

export type Translate = (key: string, options?: Record<string, unknown>) => string

export interface ChangeOption {
  value: unknown
  label: (t: Translate) => string
}

export interface ChangeSpec {
  /** Case field the override sets. */
  key: string
  title: (t: Translate) => string
  kind: 'choice' | 'multi' | 'dims' | 'number' | 'text' | 'flowQ5'
  options?: ChangeOption[]
  /** Asked only when this holds on the scenario's answers (a follow-up). */
  when?: (a: Partial<Case>) => boolean
  /** The question this one follows, shown right under it. */
  parent?: string
  /** The value a new change starts from when the case has none. */
  fallback?: unknown
  min?: number
  max?: number
}

// "Q9 — Which decision…? *" → "Which decision…?"
export function cardTitle(title: string): string {
  return title.replace(/^Q\d+[ab]?\s+—\s+/, '').replace(/\s*\*$/, '')
}

const q = (key: string) => (t: Translate) => cardTitle(t(`questionnaire.${key}.title`))
const choice = (values: string[], label: (v: string) => string): ChangeOption[] =>
  values.map((v) => ({ value: v, label: (t: Translate) => t(label(v)) }))
const yesNo = (base: string): ChangeOption[] => [
  { value: true, label: (t: Translate) => t(`${base}.yes`) },
  { value: false, label: (t: Translate) => t(`${base}.no`) },
]
const oneCompany = (a: Partial<Case>) => a.decision_context === 'corporate_report'

export const CHANGES: ChangeSpec[] = [
  { key: 'q3', title: q('q3'), kind: 'dims' },
  { key: 'q1', title: q('q1'), kind: 'choice',
    options: choice(['A', 'B', 'C', 'D', 'E'], (v) => `questionnaire.q1.options.${v}.label`) },
  { key: 'decision_context', title: q('q9'), kind: 'choice',
    options: choice(['micro', 'structural', 'none', 'corporate_report'], (v) => `questionnaire.q9.options.${v}`) },
  // Q9b: Situation B needs the documented screening (#196, D4.1 §4.3.4)
  { key: 'market_screening_documented', title: (t) => t('scenarios.questions.screening'), kind: 'choice',
    options: yesNo('questionnaire.q9.screening'), parent: 'decision_context', fallback: false,
    when: (a) => a.decision_context === 'structural' },
  { key: 'q2', title: q('q2'), kind: 'choice',
    options: choice(['A', 'B'], (v) => `questionnaire.q2.options.${v}.label`) },
  // Q2b: the modern counterfactual of a long-standing network (D4.1 §11.2.2)
  { key: 'network_long_standing', title: (t) => t('scenarios.questions.longStanding'), kind: 'choice',
    options: [
      { value: true, label: (t) => t('questionnaire.q2.longStanding.yes') },
      { value: false, label: (t) => t('questionnaire.q2.longStanding.no') },
      { value: null, label: (t) => t('questionnaire.q2.longStanding.unknown') },
    ],
    parent: 'q2', fallback: null, when: (a) => a.q2 === 'A' && !oneCompany(a) },
  { key: 'operating_start', title: (t) => t('questionnaire.q8.start.label'), kind: 'choice',
    options: choice(['now', 'future'], (v) => `questionnaire.q8.start.options.${v}`) },
  { key: 'operating_start_year', title: (t) => t('scenarios.questions.startYear'), kind: 'number',
    parent: 'operating_start', fallback: null, min: 1900, max: 2200,
    when: (a) => a.operating_start === 'future' },
  { key: 'analysis_period_years', title: (t) => t('questionnaire.q8.period.label'), kind: 'number', fallback: 20 },
  { key: 'asset_lifetime_years', title: (t) => t('questionnaire.q8.lifetime.label'), kind: 'number', fallback: 20 },
  { key: 'q6b', title: q('q6b'), kind: 'choice',
    options: choice(['TRL9', 'TRL7-8', 'TRL5-6', 'TRL<5'], (v) => `questionnaire.q6b.options.${v}`) },
  // Q10 decides the societal LCC, so it counts only with the economic dimension
  { key: 'policy_objective', title: q('q10'), kind: 'choice', options: yesNo('questionnaire.q10.options'),
    when: (a) => !!a.q3?.eco },
  { key: 'q4', title: q('q4'), kind: 'multi',
    options: choice(['A', 'B', 'C', 'D', 'E'], (v) => `questionnaire.q4.options.${v}.label`) },
  { key: 'comparison_goal', title: q('q11'), kind: 'choice',
    options: choice(['waste_treatment', 'product_substitution', 'co_primary'], (v) => `questionnaire.q11.options.${v}`) },
  { key: 'q7', title: q('q7'), kind: 'choice',
    options: choice(['A', 'B', 'C'], (v) => `questionnaire.q7.options.${v}.label`) },
  // Q7b: the market the replaced products come from (D4.1 §11.3.1); one
  // company's report has no reference scenario to place
  { key: 'reference_market_region', title: (t) => t('scenarios.questions.marketRegion'), kind: 'text',
    parent: 'q7', fallback: '', when: (a) => !oneCompany(a) },
  { key: 'reference_market_scope', title: (t) => t('scenarios.questions.marketScope'), kind: 'choice',
    options: [
      ...choice(['national', 'sub_national', 'continental'], (v) => `questionnaire.q7.market.scope.${v}`),
      { value: null, label: (t) => t('questionnaire.q7.market.scope.unset') },
    ],
    parent: 'q7', fallback: null, when: (a) => !oneCompany(a) },
  { key: 'dedicated_shared_assets', title: q('q12'), kind: 'choice', options: yesNo('questionnaire.q12.options'),
    when: (a) => !!(a.q3?.env || a.q3?.eco) },
  // Q5 per flow (lcc_mc_04/08 are per flow, D4.2 §3.2, §6.2): sent as
  // {flow id: class}, applied by the runner to the case's own flows
  { key: 'flow_q5', title: (t) => t('scenarios.flowQ5Title'), kind: 'flowQ5' },
]
export const SPEC: Record<string, ChangeSpec> = Object.fromEntries(CHANGES.map((c) => [c.key, c]))
export const Q5_KEYS = ['a', 'b', 'c', 'd', 'e'] as const

/** The answers the scenario runs with: the case's, with the changes on top. */
export function effectiveAnswers(baseline: Partial<Case>, overrides: Record<string, unknown>): Partial<Case> {
  return { ...baseline, ...overrides } as Partial<Case>
}

/** Whether the questionnaire would ask this question on these answers. */
export function isAsked(spec: ChangeSpec, answers: Partial<Case>): boolean {
  return !spec.when || spec.when(answers)
}

// a new change starts from the case's own answer, not from a fixed value
// (round 4 leftover: the form did not start from the case)
export function defaultValue(spec: ChangeSpec, baseline: Partial<Case> = {}): unknown {
  if (spec.kind === 'flowQ5') {
    return Object.fromEntries((baseline.flows ?? []).filter((f) => f.q5).map((f) => [f.id, f.q5]))
  }
  const current = (baseline as Record<string, unknown>)[spec.key]
  if (current !== undefined && current !== null && current !== '') {
    if (Array.isArray(current)) return [...current]
    if (typeof current === 'object') return { ...(current as object) }
    return current
  }
  if (spec.fallback !== undefined) return spec.fallback
  if (spec.kind === 'dims') return { env: true, eco: true, soc: false }
  if (spec.kind === 'multi') return []
  return spec.options?.[0]?.value
}

/**
 * The changes after one of them was set: a follow-up whose question is no
 * longer asked is dropped (it would act unseen), and a structural decision
 * brings the screening question with it, since without a documented screening
 * the study stays Situation A (P1-01).
 */
export function withFollowUps(
  overrides: Record<string, unknown>, baseline: Partial<Case>, changedKey?: string,
): Record<string, unknown> {
  const answers = effectiveAnswers(baseline, overrides)
  const screening = SPEC.market_screening_documented
  // the case does not ask the screening yet: the scenario that makes the
  // decision structural asks it right under the decision
  const bringScreening = changedKey === screening.parent && !(screening.key in overrides)
    && isAsked(screening, answers) && !isAsked(screening, baseline)
  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(overrides)) {
    const spec = SPEC[key]
    if (spec?.parent && !isAsked(spec, answers)) continue
    next[key] = value
    if (bringScreening && key === screening.parent) next[screening.key] = defaultValue(screening, baseline)
  }
  return next
}

/** One answer in the questionnaire's words. */
export function describeAnswer(spec: ChangeSpec, value: unknown, t: Translate): string {
  const notAnswered = t('scenarios.notAnswered')
  if (spec.kind === 'dims') {
    const dims = (value ?? {}) as Record<string, boolean>
    const on = (['env', 'eco', 'soc'] as const).filter((d) => dims[d]).map((d) => t(`questionnaire.q3.${d}`))
    return on.length ? on.join(', ') : notAnswered
  }
  if (spec.kind === 'multi') {
    const chosen = (value ?? []) as unknown[]
    const labels = spec.options!.filter((o) => chosen.includes(o.value)).map((o) => o.label(t))
    return labels.length ? labels.join('; ') : t('scenarios.noneChosen')
  }
  if (value === undefined || value === null || value === '') {
    const unset = spec.options?.find((o) => o.value === null)
    return unset ? unset.label(t) : notAnswered
  }
  if (spec.kind === 'choice') {
    return spec.options!.find((o) => o.value === value)?.label(t) ?? String(value)
  }
  return String(value)
}

function comparable(value: unknown): string {
  if (value === undefined || value === null || value === '') return ''
  if (Array.isArray(value)) return JSON.stringify([...value].map(String).sort())
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    return JSON.stringify(Object.keys(obj).sort().map((k) => [k, obj[k]]))
  }
  return JSON.stringify(value)
}

/**
 * The answers on which a scenario's run differs from the case's, as overrides
 * ({field: scenario value}, Q5 per flow as `flow_q5`). Read off the two
 * results, so the comparison describes what actually ran.
 */
export function changedAnswers(base: Partial<Case>, scenario: Partial<Case>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const spec of CHANGES) {
    if (spec.kind === 'flowQ5') continue
    const was = (base as Record<string, unknown>)[spec.key]
    const now = (scenario as Record<string, unknown>)[spec.key]
    if (comparable(was) !== comparable(now)) out[spec.key] = now ?? null
  }
  const baseQ5 = new Map((base.flows ?? []).map((f) => [f.id, f.q5]))
  const flowQ5 = Object.fromEntries((scenario.flows ?? [])
    .filter((f) => f.q5 && baseQ5.has(f.id) && baseQ5.get(f.id) !== f.q5)
    .map((f) => [f.id, f.q5]))
  if (Object.keys(flowQ5).length > 0) out.flow_q5 = flowQ5
  return out
}

export interface AnswerChange {
  question: string
  before: string
  after: string
}

/** What the scenario changes in the answers, question by question. */
export function answerChanges(
  overrides: Record<string, unknown>, baseline: Partial<Case>, t: Translate,
): { changes: AnswerChange[]; otherKeys: string[] } {
  const changes: AnswerChange[] = []
  const otherKeys: string[] = []
  for (const [key, value] of Object.entries(overrides)) {
    const spec = SPEC[key]
    if (!spec) {
      otherKeys.push(key)
      continue
    }
    if (spec.kind === 'flowQ5') {
      const byFlow = (value ?? {}) as Record<string, string>
      for (const f of baseline.flows ?? []) {
        const after = byFlow[f.id]
        if (after && after !== f.q5) {
          changes.push({
            question: t('scenariosResult.flowQ5Row', { flow: f.name || f.id }),
            before: f.q5 ? t(`flows.options.${f.q5}`) : t('scenarios.notAnswered'),
            after: t(`flows.options.${after}`),
          })
        }
      }
      continue
    }
    const before = describeAnswer(spec, (baseline as Record<string, unknown>)[key], t)
    const after = describeAnswer(spec, value, t)
    if (before !== after) changes.push({ question: spec.title(t), before, after })
  }
  return { changes, otherKeys }
}

/**
 * Why answers the scenario changes have no effect, where the reason is a
 * question that must also be answered (the engine adds no note for these).
 * One sentence each, in plain words: the reader sees them under "what
 * changes" when the configuration stays the same (P1-01).
 */
export function inertAnswerHints(
  overrides: Record<string, unknown>, baseline: Partial<Case>, t: Translate, plain = false,
): string[] {
  const a = effectiveAnswers(baseline, overrides)
  const touched = (...keys: string[]) => keys.some((k) => k in overrides)
  const env = !!a.q3?.env
  const eco = !!a.q3?.eco
  const hints: string[] = []
  if (touched('decision_context', 'market_screening_documented')
      && a.decision_context === 'structural' && a.market_screening_documented !== true) {
    hints.push(t(plain ? 'scenariosResult.hints.screeningPlain' : 'scenariosResult.hints.screening', {
      question: t('scenarios.questions.screening'),
      yes: t('questionnaire.q9.screening.yes'),
    }))
  }
  if ('market_screening_documented' in overrides && a.decision_context !== 'structural') {
    hints.push(t('scenariosResult.hints.screeningNotAsked', { question: t('scenarios.questions.screening') }))
  }
  if ('network_long_standing' in overrides && (a.q2 !== 'A' || a.decision_context === 'corporate_report')) {
    hints.push(t('scenariosResult.hints.longStandingNotAsked', { question: t('scenarios.questions.longStanding') }))
  }
  if ('policy_objective' in overrides && !eco) {
    hints.push(t('scenariosResult.hints.policyWithoutEco', { question: cardTitle(t('questionnaire.q10.title')) }))
  } else if ('policy_objective' in overrides && a.decision_context === 'corporate_report') {
    hints.push(t('scenariosResult.hints.policyOneCompany', { question: cardTitle(t('questionnaire.q10.title')) }))
  }
  if ('dedicated_shared_assets' in overrides && !env && !eco) {
    hints.push(t('scenariosResult.hints.needsLcaOrLcc', { question: cardTitle(t('questionnaire.q12.title')) }))
  }
  if ('comparison_goal' in overrides && !env && !eco) {
    hints.push(t('scenariosResult.hints.needsLcaOrLcc', { question: cardTitle(t('questionnaire.q11.title')) }))
  }
  if (touched('reference_market_region', 'reference_market_scope') && a.decision_context === 'corporate_report') {
    hints.push(t('scenariosResult.hints.marketOneCompany'))
  }
  return hints
}
