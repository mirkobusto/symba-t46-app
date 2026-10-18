import { describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { AUDIENCE_ROWS, configurationRows, obligationGroups } from '../pages/configurationRows'
import type { Case } from '../types/api'

// "Your configuration" on the result page (R5, 2026-10-18): translated rows
// built from the answers and the derived state, node text attached in English.
const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options ?? {}) as string

const BASE: Case = {
  q1: 'B', q2: 'B', q3: { env: true, eco: true, soc: false }, q4: [],
  q7: 'B', flows: [], sites: [],
  ilcd_situation: 'ILCD Situation A', lcc_type: 'C+E+S', slca_activation_state: 'deactivated',
  policy_objective: true, operating_start: 'future', operating_start_year: 2028,
  reference_market_region: 'Italy', reference_market_scope: 'national',
  comparison_goal: 'waste_treatment', dedicated_shared_assets: true,
  activated_nodes: ['lca_mc_21', 'lcc_hc_23'],
  lca: { 'reference_scenario.type': 'CNSRS: the business-as-usual (D4.1 §11.1)', functional_unit: 'FU (D4.1 §5.2.1)' },
  lcc: {},
}

describe('configurationRows', () => {
  it('says what the answers decided, with the reason', async () => {
    await i18n.changeLanguage('en')
    const rows = Object.fromEntries(configurationRows(BASE, t).map((r) => [r.key, r]))
    expect(Object.keys(rows)).toEqual(['lcc', 'slca', 'horizon', 'reference', 'fu', 'regional', 'claim', 'shared'])
    expect(rows.claim.value).toBe('No public comparative claim')
    expect(rows.slca.value).toBe('Not included')
    expect(rows.slca.why).toMatch(/Q3/)
    expect(rows.horizon.value).toMatch(/Future background/)
    expect(rows.horizon.why).toMatch(/2028/)
    expect(rows.reference.value).toMatch(/time horizon \(CNSRS\).*market: Italy \(national\)/)
    expect(rows.reference.nodeText).toEqual(['CNSRS: the business-as-usual (D4.1 §11.1)'])
    expect(rows.fu.value).toMatch(/Input-based/)
  })

  it('leaves out what does not apply', async () => {
    await i18n.changeLanguage('en')
    const keys = configurationRows({ ...BASE, q3: { env: false, eco: false, soc: true },
      lcc_type: 'deactivated', slca_activation_state: 'active', dedicated_shared_assets: false, activated_nodes: [] }, t)
      .map((r) => r.key)
    expect(keys).toEqual(['slca', 'claim'])   // the public claim follows Q4 alone (lca_mc_36, IR-18)
  })
})

describe('configurationRows edge cases', () => {
  it('strict reporting of one company uses no reference scenario for credits', async () => {
    await i18n.changeLanguage('en')
    const rows = configurationRows({ ...BASE, ilcd_situation: 'ILCD Situation C2', lcc_type: 'C-LCC' }, t)
    const reference = rows.find((r) => r.key === 'reference')!
    expect(reference.value).toMatch(/Not used for credits/)
    expect(rows.find((r) => r.key === 'lcc')!.why).toMatch(/one company/)
  })

  it('an unanswered Q10 says the costing was read off Q1', async () => {
    await i18n.changeLanguage('en')
    const rows = configurationRows({ ...BASE, policy_objective: null, lcc_type: 'C+E' }, t)
    expect(rows.find((r) => r.key === 'lcc')!.why).toMatch(/read off Q1/)
  })
})

describe('AUDIENCE_ROWS', () => {
  it('names only rows the builder knows', async () => {
    await i18n.changeLanguage('en')
    const keys = new Set(configurationRows({ ...BASE, q3: { env: true, eco: true, soc: true }, q4: ['C'],
      slca_activation_state: 'active',
      sector_rules: [{ chapter_key: 'agrifood', chapter: '§4 Agri-Food and Biorefineries', activated_by: [{ kind: 'flow', name: 'x' }],
        id: 'r', group: 'g', strength: 'must', applies_when: null, statement: '', source: '', lines: '' }] }, t)
      .map((r) => r.key))
    for (const rows of Object.values(AUDIENCE_ROWS)) for (const key of rows) expect(keys.has(key)).toBe(true)
  })
})

describe('obligationGroups', () => {
  it('counts the obligations by rule family, in the order of the rule table', () => {
    const rules = ['IR-01', 'B-02', 'IR-07', 'CIR-02', 'FU-01'].map((rule_id) => ({ rule_id, statement: '' }))
    expect(obligationGroups(rules)).toEqual([
      { family: 'IR', count: 2 }, { family: 'CIR', count: 1 }, { family: 'FU', count: 1 }, { family: 'B', count: 1 },
    ])
  })
})
