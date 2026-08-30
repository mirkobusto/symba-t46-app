// Turning engine output into a to-do list.
//
// The result page used to restate the engine's own vocabulary — L1
// blocks, L2 violations, L3 CDPs, one list each. What a reader needs
// instead is a single ordered list of things to act on, each carrying
// three answers: what is wrong, why it applies to *this* case, and what
// to do about it.
//
// Pure data in, pure data out: the component does the wording.

import type { Case, CdpFlag, RuleViolation } from '../types/api'

export type ActionKind = 'block' | 'violation' | 'decision'

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
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | null
}

const Q_TOKEN = /Q([1-7])(a|b)?/g

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
        ? kase.flows.map((f) => `${f.name}: ${f.q5}`).join(' · ')
        : null
    case 'Q6a':
      return kase.q6a ?? null
    case 'Q6b':
      return kase.q6b ?? null
    case 'Q7':
      return kase.q7 ?? null
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
  return out
}

function fromViolation(v: RuleViolation, kase: Case): ActionItem {
  return {
    key: `violation:${v.rule_id}`,
    kind: 'violation',
    code: v.rule_id,
    title: v.name ?? null,
    detail: v.message,
    trigger: v.trigger ?? null,
    answers: answersFor(v.trigger, kase),
    fields: v.fields ?? [],
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
    severity: 'HIGH',
  }
}

const SEVERITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }

/**
 * Everything the analyst has to act on, hardest-stop first: blocks halt
 * the pipeline outright, violations are inconsistencies to fix, and
 * decisions (CDPs) are choices only a human can make.
 */
export function actionItems(kase: Case | null): ActionItem[] {
  if (!kase) return []
  const blocks = (kase.blocked_by ?? []).map(fromBlock)
  const violations = (kase.rule_violations ?? []).map((v) => fromViolation(v, kase))
  const decisions = [...(kase.cdp_flags ?? [])]
    .sort(
      (a, b) =>
        (SEVERITY_RANK[a.severity ?? 'LOW'] ?? 3) -
        (SEVERITY_RANK[b.severity ?? 'LOW'] ?? 3),
    )
    .map((c) => fromCdp(c, kase))
  return [...blocks, ...violations, ...decisions]
}
