import { describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { configurationRows } from '../pages/configurationRows'
import type { Case } from '../types/api'

// UX round 2026-11-02: each flow's treatment on the result page, and reasons
// that do not assert answers the user never gave.
const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options ?? {}) as string

const CASE: Case = {
  q1: 'B', q2: 'A', q3: { env: true, eco: false, soc: false }, q4: [], sites: [],
  flows: [
    { id: 'f1', name: 'Slag to cement', q5: 'c' },
    { id: 'f2', name: 'Waste heat', q5: 'b' },
    { id: 'f3', name: 'Dust', q5: 'a' },
  ],
  ilcd_situation: 'ILCD Situation C1', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
  activated_nodes: [],
  lca: { zero_burden_classification: { f1: 'substitution+Q-correction', f2: 'EVT+sensitivity', f3: 'zero-burden' } },
  lcc: {},
}

const rows = (kase: Case) => Object.fromEntries(configurationRows(kase, t).map((r) => [r.key, r]))

describe('result reasons', () => {
  it("names each flow's treatment", async () => {
    await i18n.changeLanguage('en')
    const flows = rows(CASE).flows
    expect(flows.value).toContain('Slag to cement: co-product: substitution of the product it replaces')
    expect(flows.value).toContain('Waste heat: undecided: economic value test')
    expect(flows.value).toContain('Dust: waste: no burden')
    expect(flows.why).toMatch(/Q5/)
  })

  it('does not claim a mature technology nobody declared', async () => {
    await i18n.changeLanguage('en')
    expect(rows(CASE).horizon.why).toMatch(/no operating year.*answer Q8/)
    expect(rows({ ...CASE, q6b: 'TRL9', operating_start: 'now' }).horizon.why).toMatch(/technology at TRL 7 or above/)
  })

  it('does not speak of value-chain views for a costing without LCA', async () => {
    await i18n.changeLanguage('en')
    const lcc = rows({ ...CASE, q3: { env: false, eco: true, soc: false }, lcc_type: 'C+N', policy_objective: false }).lcc
    expect(lcc.why).toMatch(/each partner's costs, consolidated for the network/)
    expect(lcc.why).not.toMatch(/value-chain/)
  })

  it('says when no Part 2 chapter covers the flows', async () => {
    await i18n.changeLanguage('en')
    expect(rows({ ...CASE, sector_rules: [] }).sectors.value).toMatch(/No chapter of D4.1 Part 2.*only Part 1 applies/)
  })
})

describe('verdict of a study with no LCA (UX round 2026-11-03)', () => {
  it('is headed by the costing, with the LCC badge only', async () => {
    const { verdictFor } = await import('../pages/resultNarrative')
    await i18n.changeLanguage('it')
    const tr = (key: string, fallback?: string) => i18n.t(key, { defaultValue: fallback ?? '' }) as string
    const v = verdictFor({ ...CASE, q3: { env: false, eco: true, soc: false }, ilcd_situation: 'ILCD Situation A', lcc_type: 'C+N' }, tr)!
    expect(v.title).toBe('LCC convenzionale per partner, consolidato a livello di rete')
    expect(v.title).not.toMatch(/attribuzional/i)
    // no ILCD badge without an LCA (UX round 4, P2-08)
    expect(v.codes).toEqual(['C-LCC per partner + rete'])
  })
})
