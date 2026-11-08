// Turning engine output into a to-do list.
//
// The result page used to restate the engine's own vocabulary — L1
// blocks, L2 violations, L3 CDPs, one list each. What a reader needs
// instead is a single ordered list of things to act on, each carrying
// three answers: what it is, why it applies to *this* case, and what to
// do about it.
//
// L2 rules arrive as `applicable_rules` (trigger fired) rather than as
// `rule_violations` (assertion failed). They are practices to document,
// not errors: the assertions compare values the engine writes as prose,
// and the choices they describe are made outside the tool.
//
// Pure data in, pure data out: the component does the wording.

import type { ApplicableRule, Case, CdpFlag } from '../types/api'

export type ActionKind = 'block' | 'obligation' | 'decision'

export interface AnsweredQuestion {
  label: string
  value: string
}

export interface ActionItem {
  key: string
  kind: ActionKind
  /** Traceability code the reviewer looks for: B-05, CDP-03, block_… */
  code: string
  /** Rule/CDP title, when the schema carries one. */
  title: string | null
  /** The engine's own sentence — kept as the fine print. */
  detail: string
  /** Raw trigger expression, e.g. "Q7 ∈ {B, C, D}". */
  trigger: string | null
  /** The answers that trigger refers to, resolved on this case. */
  answers: AnsweredQuestion[]
  /** Field paths to fill in to clear the item. */
  fields: string[]
  /** How the engine says this one is resolved (CDPs carry it). */
  resolution: string | null
  /** The engine's variant of the resolution, when the schema text does not fit the case. */
  variant?: string | null
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | null
}

const Q_TOKEN = /Q(1[0-2]|[1-9])(a|b)?/g
// Q8 is named in words in the triggers ("asset lifetime > 15y"), not by code
const Q8_PHRASES: [string, string][] = [
  ['operating start', 'Q8a'],
  ['analysis period', 'Q8b'],
  ['asset lifetime', 'Q8c'],
]

function formatAnswer(kase: Case, id: string): string | null {
  switch (id) {
    case 'Q1':
      return kase.q1 ?? null
    case 'Q2':
      return kase.q2 ?? null
    case 'Q3': {
      const dims = kase.q3
      if (!dims) return null
      const active = (['env', 'eco', 'soc'] as const).filter((d) => dims[d])
      return active.length > 0 ? active.join(' + ') : 'none'
    }
    case 'Q4':
      return kase.q4?.length ? kase.q4.join(', ') : null
    case 'Q5':
      return kase.flows?.length
        ? kase.flows.map((f) => `${f.name}: ${f.q5 ?? '—'}`).join(' · ')
        : null
    case 'Q6a':
      return kase.q6a ?? null
    case 'Q6b':
      return kase.q6b ?? null
    case 'Q7':
      return kase.q7 ?? null
    case 'Q8a':
      if (!kase.operating_start) return null
      return kase.operating_start_year
        ? `${kase.operating_start} (${kase.operating_start_year})`
        : kase.operating_start
    case 'Q8b':
      return kase.analysis_period_years == null ? null : `${kase.analysis_period_years} y`
    case 'Q8c':
      return kase.asset_lifetime_years == null ? null : `${kase.asset_lifetime_years} y`
    case 'Q9':
      return kase.decision_context ?? null
    case 'Q10':
      return kase.policy_objective == null ? null : kase.policy_objective ? 'yes' : 'no'
    case 'Q11':
      return kase.comparison_goal ?? null
    case 'Q12':
      return kase.dedicated_shared_assets == null ? null : kase.dedicated_shared_assets ? 'yes' : 'no'
    default:
      return null
  }
}

/**
 * The answers a trigger expression refers to, resolved on this case —
 * "Q7 ∈ {B, C, D}" becomes "Q7 = B", which is the bit that makes a rule
 * feel addressed to the reader rather than quoted at them.
 */
export function answersFor(
  trigger: string | null | undefined,
  kase: Case,
): AnsweredQuestion[] {
  if (!trigger) return []
  const seen = new Set<string>()
  const out: AnsweredQuestion[] = []
  for (const match of trigger.matchAll(Q_TOKEN)) {
    const label = `Q${match[1]}${match[2] ?? ''}`
    if (seen.has(label)) continue
    seen.add(label)
    const value = formatAnswer(kase, label)
    if (value !== null) out.push({ label, value })
  }
  // without this CIR-01 cited only "Q6b = TRL9" when the asset lifetime had
  // triggered it (UX round 2026-11-02)
  const lowered = trigger.toLowerCase()
  let horizon = false
  for (const [phrase, label] of Q8_PHRASES) {
    if (!lowered.includes(phrase)) continue
    horizon = true
    if (seen.has(label)) continue
    seen.add(label)
    const value = formatAnswer(kase, label)
    if (value !== null) out.push({ label, value })
  }
  // the horizon trigger is a disjunction ("future year OR TRL < 7 OR > 15y"):
  // list only the answers that fire it, not "TRL9, now" next to the lifetime
  // that did (UX round 2026-11-03, B7)
  if (horizon && lowered.includes(' or ')) {
    const firing = out.filter((a) => horizonFires(kase, a.label))
    if (firing.length > 0) return firing
  }
  return out
}

function horizonFires(kase: Case, label: string): boolean {
  const custom = Number(kase.advanced?.['future_background_threshold_years'])
  const threshold = Number.isFinite(custom) && custom > 0 ? custom : 15
  switch (label) {
    case 'Q6b':
      return kase.q6b === 'TRL5-6' || kase.q6b === 'TRL<5'
    case 'Q8a':
      return kase.operating_start === 'future'
    case 'Q8b':
      return (kase.analysis_period_years ?? 0) > threshold
    case 'Q8c':
      return (kase.asset_lifetime_years ?? 0) > threshold
    default:
      return true
  }
}

function fromRule(rule: ApplicableRule, kase: Case): ActionItem {
  return {
    key: `rule:${rule.rule_id}`,
    kind: 'obligation',
    code: rule.rule_id,
    title: rule.name ?? null,
    detail: rule.statement,
    trigger: rule.trigger ?? null,
    answers: answersFor(rule.trigger, kase),
    fields: rule.fields ?? [],
    resolution: null,
    severity: null,
  }
}

function fromCdp(c: CdpFlag, kase: Case): ActionItem {
  return {
    key: `decision:${c.cdp_id}`,
    kind: 'decision',
    code: c.cdp_id,
    title: c.name,
    detail: c.tension ?? '',
    trigger: null,
    answers: answersFor(c.tension, kase),
    fields: [],
    // The engine already says how the tension is resolved; the card used
    // to drop it, so "what to do next" stated a dilemma and hid its
    // answer inside the collapsed technical panel.
    resolution: c.resolution_at_l3,
    variant: c.variant ?? null,
    severity: c.severity,
  }
}

function fromBlock(id: string): ActionItem {
  return {
    key: `block:${id}`,
    kind: 'block',
    code: id,
    title: null,
    detail: '',
    trigger: null,
    answers: [],
    fields: [],
    resolution: null,
    severity: 'HIGH',
  }
}

const SEVERITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }

/**
 * Everything the analyst has to act on, hardest-stop first: blocks halt
 * the pipeline outright, obligations are practices this case has to
 * document, and decisions (CDPs) are choices only a human can make.
 */
export function actionItems(kase: Case | null): ActionItem[] {
  if (!kase) return []
  const blocks = (kase.blocked_by ?? []).map(fromBlock)
  const obligations = (kase.applicable_rules ?? []).map((r) => fromRule(r, kase))
  const decisions = [...(kase.cdp_flags ?? [])]
    .sort(
      (a, b) =>
        (SEVERITY_RANK[a.severity ?? 'LOW'] ?? 3) -
        (SEVERITY_RANK[b.severity ?? 'LOW'] ?? 3),
    )
    .map((c) => fromCdp(c, kase))
  return [...blocks, ...obligations, ...decisions]
}
