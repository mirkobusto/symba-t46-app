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

// lca_mc_17 per flow, by the start of its value: the row says what each
// flow's multifunctionality comes to, which analysts and reviewers check first
// and could only find as JSON in the technical detail (UX round 2026-11-02)
const FLOW_TREATMENT: [string, string][] = [
  ['zero-burden', 'waste'],
  ['EVT', 'evt'],
  ['substitution', 'coproduct'],
  ['integrated', 'integrated'],
  ['allocation', 'allocation'],
  ['aggregated', 'aggregated'],
]

function texts(...values: unknown[]): string[] {
  return values.filter((v): v is string => typeof v === 'string' && v.trim() !== '')
}

export function configurationRows(
  kase: Case, t: Translate, opts: { audience?: string } = {},
): ConfigRow[] {
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
        : type.includes('S') ? 'result.config.why.lccPolicy'
          : env ? 'result.config.why.lccNoPolicy' : 'result.config.why.lccNoPolicyNoLca'))
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
    // residents asked whether they would be heard (UX round 4, B3)
    value: opts.audience === 'community'
      ? t(kase.q3?.soc ? 'result.config.values.community.slcaOn' : 'result.config.values.community.slcaOff')
      : kase.q3?.soc && kase.slca_activation_state
        ? t(`narrative.slca.${kase.slca_activation_state}.short`)
        : t('result.config.values.slcaOff'),
    why: kase.q3?.soc ? undefined : t('result.config.why.slcaOff'),
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
      // alone, the asset lifetime puts a "future" next to a study of the present
      // year: say so (P1-04, P3-02, UX round 2026-11-03)
      reasons.push(t(reasons.length === 0 && !(period != null && period > threshold)
        ? 'result.config.why.horizonLifetimeOnly' : 'result.config.why.horizonLifetime', { years: lifetime, threshold }))
    }
    rows.push({
      key: 'horizon',
      label: label('horizon'),
      value: t(future ? 'result.config.values.horizonFuture' : 'result.config.values.horizonPresent'),
      why: future ? (reasons.join('; ') || t('result.config.why.horizonFutureGeneric'))
        // "mature technology" was asserted for a case that never answered Q8 or Q6b
        : kase.operating_start == null && kase.analysis_period_years == null
          && lifetime == null && kase.q6b == null
          ? t('result.config.why.horizonUnanswered', { threshold })
          : t('result.config.why.horizonPresent', { threshold }),
      nodeText: texts(lca['background_futurisation'], lcc['background_dynamic']),
    })

    // Scale-up and Pedigree, which CIR-07 and CIR-02 name only when both LCA and
    // LCC are on (#214): the single-method study reads them here (D4.1 L01132-L01148,
    // D4.2 L00845, L00875-L00907; Fable, 2026-11-03)
    const lowTrl = kase.q6b === 'TRL5-6' || kase.q6b === 'TRL<5'
    const scaleUp = lowTrl && (activated.has('lca_mc_20') || activated.has('lcc_hc_15'))
    const pedigree = kase.q2 === 'B'
    if (scaleUp || pedigree) {
      rows.push({
        key: 'prospective',
        label: label('prospective'),
        value: [
          ...(scaleUp ? [t('result.config.values.prospectiveScaleUp')] : []),
          ...(pedigree ? [t('result.config.values.prospectivePedigree')] : []),
        ].join('; '),
        why: [
          ...(scaleUp ? [t('result.config.why.horizonTrl')] : []),
          ...(pedigree ? [t('result.config.why.referenceNotYet')] : []),
        ].join('; '),
        nodeText: texts(lca['scale_up_framework'], lcc['scale_up_framework'],
          lca['uncertainty.pedigree'], lcc['uncertainty.pedigree']),
      })
    }
  }

  // the LCC shares the reference scenario of the LCA, done or not (D4.2 L00725)
  if ((env || eco) && kase.ilcd_situation === 'ILCD Situation C2') {
    rows.push({
      key: 'reference',
      label: label('reference'),
      value: t('result.config.values.reference_c2'),
      why: t('result.config.why.referenceC2'),
      nodeText: texts(lca['reference_scenario.content']),
    })
  } else if ((env || eco) && kase.q2) {
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
      why: [t(kase.q2 === 'B' ? 'result.config.why.referenceNotYet'
        : kase.network_long_standing ? 'result.config.why.referenceLongStanding'
          : 'result.config.why.referenceRunning'),
      // without LCA the situation prescribes no costing model, only the reference (P2-08)
      !env && kase.ilcd_situation
        ? t('result.config.why.referenceNoLca', { situation: kase.ilcd_situation.replace('ILCD Situation ', '') })
        : null].filter(Boolean).join('; '),
      nodeText: texts(lca['reference_scenario.type'], lca['reference_scenario.content']),
    })
  }

  // how multifunctionality is resolved follows the ILCD situation; with Q4 = D
  // the PEF CFF partitions in A/C1, is a sensitivity in B and is not applied in
  // C2 (decided by Fable on the UX round of 2026-11-03, P2-01)
  if (env && kase.ilcd_situation) {
    const sit = kase.ilcd_situation.replace('ILCD Situation ', '')
    const kind = sit === 'B' ? 'Consequential' : sit === 'C2' ? 'Allocation' : 'Substitution'
    const pef = (kase.q4 ?? []).includes('D') ? t(`result.config.values.multiPef${kind}`) : ''
    rows.push({
      key: 'multifunctionality',
      label: label('multifunctionality'),
      value: `${t(`result.config.values.multi${kind}`)}${pef}`,
      why: t('result.config.why.multifunctionality'),
      nodeText: texts(lca['allocation_method']),
    })
  }

  const perFlow = lca['zero_burden_classification']
  if (env && perFlow && typeof perFlow === 'object' && (kase.flows ?? []).length > 0) {
    const treatments = (kase.flows ?? []).map((f) => {
      const raw = String((perFlow as Record<string, unknown>)[f.id] ?? '')
      const kind = FLOW_TREATMENT.find(([start]) => raw.startsWith(start))?.[1]
      // without a costing the interdependent row spoke of E-LCC and C-LCC (P3-12)
      const key = kind === 'integrated' && !eco ? 'integratedLca' : kind
      return `${f.name || f.id}: ${key ? t(`result.config.values.flowTreatment.${key}`) : raw || '—'}`
    })
    rows.push({
      key: 'flows',
      label: label('flows'),
      value: treatments.join('; '),
      why: t('result.config.why.flows'),
      // per flow, by name: the JSON of flow ids was no citation (UX round 4, P2-06)
      nodeText: (kase.flows ?? []).map((f) =>
        `${f.name || f.id}: ${String((perFlow as Record<string, unknown>)[f.id] ?? '—')}`),
    })
  } else if (!env && eco && (kase.flows ?? []).length > 0) {
    // a costing without LCA still values each flow (C-LCC at the negotiated price,
    // D4.2 §6.3): decided by Fable, UX round 4, P2-08
    rows.push({
      key: 'flows',
      label: t('result.config.labels.flowsLcc'),
      value: (kase.flows ?? []).map((f) =>
        `${f.name || f.id}: ${f.q5 ? t(`result.config.values.flowCost.${f.q5}`) : '—'}`).join('; '),
      why: t('result.config.why.flows'),
      nodeText: texts(lcc['secondary_flow_valuation']),
    })
  }

  if (!env && eco) {
    // without a parallel LCA the costing still needs a functional equivalent (D4.2 §3.1)
    const goal = kase.comparison_goal
    const kind = goal === 'waste_treatment' ? 'waste_treatment' : goal ? 'dual' : 'function'
    rows.push({
      key: 'fu',
      label: t('result.config.labels.fuLcc'),
      value: t(`result.config.values.fuLcc_${kind}`),
      why: goal ? t('result.config.why.fuGoal', { goal: t(`questionnaire.q11.options.${goal}`) })
        : t('result.config.why.fuDefault'),
      nodeText: texts(lcc['functional_equivalent']),
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
    const community = opts.audience === 'community'
    rows.push({
      key: 'regional',
      label: community ? t('result.config.labels.communityRegional') : label('regional'),
      value: community
        ? t('result.config.values.community.regional', {
          where: t(`result.config.values.community.where_${kase.q7 ?? 'unset'}`),
        })
        : t(`result.config.values.regional_${kase.q7 ?? 'unset'}`),
      why: kase.q7 ? `${t(`questionnaire.q7.options.${kase.q7}.label`)} (Q7)` : t('result.config.why.regionalUnset'),
      nodeText: texts(lca['lcia_method']),
    })
  }

  // the Community view answers residents in their words: transport, local effects,
  // what is spread on fields, whether they are heard, what is not covered
  // (decided by Fable, UX round 4, B3; D4.1 §13.3.1, §13.3.3, Part 2 §4.3.3,
  // §6.3.3, §9.3; D4.3 §5.1, §6.2)
  const forCommunity = opts.audience === 'community'
  if (forCommunity && (env || eco)) {
    rows.push({
      key: 'transport',
      label: t('result.config.labels.transport'),
      value: t(env ? 'result.config.values.community.transport' : 'result.config.values.community.transportLcc'),
      nodeText: texts(lca['transport.foreground'], lcc['transport_costs']),
    })
  }
  const spreading = (kase.sector_rules ?? []).some((r) => r.id === 'p2_agrifood_03' || r.id === 'p2_wastewater_01')
  if (forCommunity && env && spreading) {
    rows.push({
      key: 'fieldSpreading',
      label: t('result.config.labels.fieldSpreading'),
      value: t('result.config.values.community.fieldSpreading'),
      nodeText: [],
    })
  }
  if (forCommunity && env) {
    rows.push({
      key: 'notCovered',
      label: t('result.config.labels.notCovered'),
      value: t('result.config.values.community.notCovered'),
      nodeText: [],
    })
  }

  if (kase.q4 !== undefined) {
    // not gated on the LCA: lca_mc_36 and IR-18 follow Q4 alone; Q4 = D also
    // asks the panel review (lca_mc_36, a T4.6 choice) but forbids no weighting
    const claim = (kase.q4 ?? []).includes('C')
    const policy = !claim && (kase.q4 ?? []).includes('D')
    // the end user holds a product label: "no public comparative claim" read as
    // a denial of the label (UX round 2026-11-03, decided by Fable)
    const endUser = opts.audience === 'end-user'
    rows.push({
      key: 'claim',
      label: endUser ? t('result.config.labels.claimPublic') : label('claim'),
      value: endUser
        ? t(`result.config.values.claimPublic.${claim ? 'claim' : policy ? 'policy' : 'none'}`)
        : t(claim ? 'result.config.values.claim'
          : policy ? 'result.config.values.claimPolicy' : 'result.config.values.claimNone'),
      why: claim ? t('result.config.why.claim') : policy ? t('result.config.why.claimPolicy') : undefined,
      nodeText: claim ? texts((kase.review ?? {})['scope'], lca['weighting_policy'])
        : policy ? texts((kase.review ?? {})['scope']) : [],
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
  if (chapters.size === 0 && env && (kase.flows ?? []).length > 0) {
    // the result said nothing at all for steel, cement or heat: say why
    rows.push({
      key: 'sectors',
      label: label('sectors'),
      value: t('result.config.values.noChapter'),
      why: t('result.config.why.noChapter'),
      nodeText: [],
    })
  } else if (chapters.size > 0) {
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
      // CAPEX and OPEX are costing words: an LCA alone inventories the assets
      // over their technical lifetime (D4.1 §6.3.3; UX round 5, P3-12)
      value: t(eco ? 'result.config.values.shared' : 'result.config.values.sharedLca'),
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
  industry: ['lcc', 'shared', 'horizon', 'reference', 'multifunctionality'],
  community: ['transport', 'regional', 'fieldSpreading', 'slca', 'notCovered'],
  // shared infrastructure is what a public co-funder typically finances
  authority: ['lcc', 'shared', 'reference', 'claim', 'horizon', 'slca'],
  'end-user': ['fu', 'claim', 'slca'],
}

/** A reason without its question codes, for guided mode and public views:
 *  "you answered X (Q9)" → "you answered X"; "B. Regional (Q7)" → "B. Regional". */
export function withoutQCodes(text: string): string {
  return text.replace(/\s*\((?:Q\d+[ab]?(?:\s*[,/]\s*)?)+\)/g, '').replace(/\s+([;:,.])/g, '$1')
}
