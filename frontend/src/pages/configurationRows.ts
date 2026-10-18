// The configuration the deliverables use, row by row (R5, 2026-10-18).
//
// The verdict card names the ILCD situation; these rows say what else the
// answers decided: costing structure, study horizon, reference scenario and
// market, functional unit, regionalised characterisation, Part 2 chapters,
// shared assets. Values and reasons are translated strings built from the
// answers and the derived state; the node text, in English as traced on the
// deliverables, is attached so the page can show it on demand (owner
// decision: translated rows, node text in English when a row is opened).

import type { ApplicableRule, Case } from '../types/api'
import { chapterName } from '../i18n/engineNotes'

type Translate = (key: string, options?: Record<string, unknown>) => string

export interface ConfigRow {
  key: string
  label: string
  value: string
  why?: string
  /** Node values behind the row, English, with their deliverable sections. */
  nodeText: string[]
}

const DEFAULT_THRESHOLD_YEARS = 15

function num(value: unknown): number | null {
  const n = typeof value === 'string' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) ? n : null
}

function texts(...values: unknown[]): string[] {
  return values.filter((v): v is string => typeof v === 'string' && v.trim() !== '')
}

export function configurationRows(kase: Case, t: Translate): ConfigRow[] {
  const rows: ConfigRow[] = []
  const env = !!kase.q3?.env
  const eco = !!kase.q3?.eco
  const lca = kase.lca ?? {}
  const lcc = kase.lcc ?? {}
  const label = (key: string) => t(`result.config.labels.${key}`)

  if (kase.study_purpose) {
    rows.push({
      key: 'purpose',
      label: label('purpose'),
      value: t(`questionnaire.q0.options.${kase.study_purpose}.label`),
      nodeText: [],
    })
  }

  if (eco && kase.lcc_type && kase.lcc_type !== 'deactivated') {
    const type = kase.lcc_type
    const reasons: string[] = []
    if (type === 'C-LCC') {
      reasons.push(t('result.config.why.lccC2'))
    } else {
      if (!env) reasons.push(t('result.config.why.lccNoLca'))
      reasons.push(t(kase.policy_objective == null ? 'result.config.why.lccPolicyInferred'
        : type.includes('S') ? 'result.config.why.lccPolicy' : 'result.config.why.lccNoPolicy'))
    }
    const why = reasons.join('; ')
    rows.push({
      key: 'lcc',
      label: label('lcc'),
      value: t(`narrative.lcc.${type}.short`),
      why,
      nodeText: texts(lcc['lcc_type'], lcc['discount_rate']),
    })
  }

  rows.push({
    key: 'slca',
    label: label('slca'),
    value: kase.q3?.soc && kase.slca_activation_state
      ? t(`narrative.slca.${kase.slca_activation_state}.short`)
      : t('result.config.values.slcaOff'),
    nodeText: texts((kase.slca ?? {})['boundary']),
  })

  if (env || eco) {
    const activated = new Set(kase.activated_nodes ?? [])
    const future = activated.has('lca_mc_21') || activated.has('lcc_hc_23')
    const custom = num(kase.advanced?.['future_background_threshold_years'])
    const threshold = custom != null && custom > 0 ? custom : DEFAULT_THRESHOLD_YEARS
    const lifetime = num(kase.asset_lifetime_years) ?? num(kase.advanced?.['asset_lifetime'])
    const reasons: string[] = []
    if (kase.operating_start === 'future') {
      reasons.push(kase.operating_start_year
        ? t('result.config.why.horizonYear', { year: kase.operating_start_year })
        : t('result.config.why.horizonFutureYear'))
    }
    if (kase.q6b === 'TRL5-6' || kase.q6b === 'TRL<5') reasons.push(t('result.config.why.horizonTrl'))
    const period = num(kase.analysis_period_years)
    if (period != null && period > threshold) {
      reasons.push(t('result.config.why.horizonPeriod', { years: period, threshold }))
    }
    if (lifetime != null && lifetime > threshold) {
      reasons.push(t('result.config.why.horizonLifetime', { years: lifetime, threshold }))
    }
    rows.push({
      key: 'horizon',
      label: label('horizon'),
      value: t(future ? 'result.config.values.horizonFuture' : 'result.config.values.horizonPresent'),
      why: future ? (reasons.join('; ') || t('result.config.why.horizonFutureGeneric'))
        : t('result.config.why.horizonPresent', { threshold }),
      nodeText: texts(lca['background_futurisation'], lcc['background_dynamic']),
    })
  }

  if (env && kase.ilcd_situation === 'ILCD Situation C2') {
    rows.push({
      key: 'reference',
      label: label('reference'),
      value: t('result.config.values.reference_c2'),
      why: t('result.config.why.lccC2'),
      nodeText: texts(lca['reference_scenario.content']),
    })
  } else if (env && kase.q2) {
    const kind = kase.q2 === 'B' ? 'cnsrs' : kase.network_long_standing ? 'modern' : 'hnsrs'
    const scope = kase.reference_market_scope
      ? t(`result.config.values.scope_${kase.reference_market_scope}`)
      : null
    const market = [kase.reference_market_region?.trim(), scope ? `(${scope})` : null]
      .filter(Boolean).join(' ')
    const value = t(`result.config.values.reference_${kind}`)
    rows.push({
      key: 'reference',
      label: label('reference'),
      value: market ? `${value} — ${t('result.config.values.market', { market })}` : value,
      why: t(kase.q2 === 'B' ? 'result.config.why.referenceNotYet'
        : kase.network_long_standing ? 'result.config.why.referenceLongStanding'
          : 'result.config.why.referenceRunning'),
      nodeText: texts(lca['reference_scenario.type'], lca['reference_scenario.content']),
    })
  }

  if (env) {
    const goal = kase.comparison_goal
    rows.push({
      key: 'fu',
      label: label('fu'),
      value: t(`result.config.values.fu_${goal ?? 'function'}`),
      why: goal ? t('result.config.why.fuGoal', { goal: t(`questionnaire.q11.options.${goal}`) })
        : t('result.config.why.fuDefault'),
      nodeText: texts(lca['functional_unit']),
    })
    rows.push({
      key: 'regional',
      label: label('regional'),
      value: t(`result.config.values.regional_${kase.q7 ?? 'unset'}`),
      why: kase.q7 ? `${t(`questionnaire.q7.options.${kase.q7}.label`)} (Q7)` : t('result.config.why.regionalUnset'),
      nodeText: texts(lca['lcia_method']),
    })
  }

  if (env) {
    const claim = (kase.q4 ?? []).includes('C')
    rows.push({
      key: 'claim',
      label: label('claim'),
      value: t(claim ? 'result.config.values.claim' : 'result.config.values.claimNone'),
      why: claim ? t('result.config.why.claim') : undefined,
      nodeText: claim ? texts((kase.review ?? {})['scope']) : [],
    })
  }

  const chapters = new Map<string, Set<string>>()
  for (const rule of kase.sector_rules ?? []) {
    const flows = chapters.get(rule.chapter) ?? new Set<string>()
    for (const a of rule.activated_by) {
      if (a.kind === 'flow' && a.name) flows.add(a.name)
      else if (a.kind === 'case_sector') flows.add(t('result.sectorRules.byCaseSector'))
    }
    chapters.set(rule.chapter, flows)
  }
  if (chapters.size > 0) {
    rows.push({
      key: 'sectors',
      label: label('sectors'),
      value: [...chapters.entries()]
        .map(([chapter, flows]) => `${chapterName(t as never, chapter) ?? chapter}${flows.size ? ` (${[...flows].join(', ')})` : ''}`)
        .join(' · '),
      why: t('result.config.why.sectors'),
      nodeText: [],
    })
  }

  if (kase.dedicated_shared_assets && (env || eco)) {
    rows.push({
      key: 'shared',
      label: label('shared'),
      value: t('result.config.values.shared'),
      why: t('result.config.why.shared'),
      nodeText: texts(lcc['capital_goods.included'], lca['capital_goods.included']),
    })
  }

  return rows
}

export interface ObligationGroup {
  family: 'IR' | 'CIR' | 'FU' | 'B'
  count: number
}

/** Obligations by rule family, in the order of the rule table: integration of
 *  the methods (IR), rules switched on by the answers (CIR), functional unit
 *  (FU), boundaries (B). Grouping by method says little: most rules govern the
 *  LCA and the LCC together. */
export function obligationGroups(rules: ApplicableRule[]): ObligationGroup[] {
  const order: ObligationGroup['family'][] = ['IR', 'CIR', 'FU', 'B']
  const counts = new Map(order.map((f) => [f, 0]))
  for (const rule of rules) {
    const family = rule.rule_id.split('-')[0] as ObligationGroup['family']
    if (counts.has(family)) counts.set(family, (counts.get(family) ?? 0) + 1)
  }
  return order.map((family) => ({ family, count: counts.get(family) ?? 0 })).filter((g) => g.count > 0)
}

/** The rows of the configuration each audience is shown (R6, 2026-10-18):
 *  costs and assets for industry, local impacts and people for the community,
 *  the public side for the authority, the unit and the claim for the end user. */
export const AUDIENCE_ROWS: Record<'industry' | 'community' | 'authority' | 'end-user', string[]> = {
  industry: ['lcc', 'shared', 'horizon', 'reference'],
  community: ['regional', 'slca', 'sectors'],
  authority: ['lcc', 'reference', 'claim', 'horizon'],
  'end-user': ['fu', 'claim'],
}

