import { describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { cdpResolution } from '../i18n/cdpResolution'
import { sectorCondition } from '../i18n/sectorTerms'
import { configurationRows } from '../pages/configurationRows'
import { verdictFor } from '../pages/resultNarrative'
import type { Case, SectorRule } from '../types/api'

// Method decisions of UX round 6 (2026-11-08, decided by Fable): the rows and
// the decision points say only what holds for the case.
const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options ?? {}) as string
const tf = ((key: string, options?: Record<string, unknown>) => t(key, options)) as unknown as Parameters<typeof cdpResolution>[0]

const BASE: Case = {
  q1: 'B', q2: 'A', q3: { env: true, eco: false, soc: false }, q4: [], q7: 'A',
  flows: [{ id: 'f1', name: 'Sludge', q5: 'a' }], sites: [],
  ilcd_situation: 'ILCD Situation A', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
  operating_start: 'now', q6b: 'TRL9',
  activated_nodes: [],
  lca: { zero_burden_classification: { f1: 'zero-burden' } },
  lcc: {},
} as Case

const row = (kase: Case, key: string) => configurationRows(kase, t).find((r) => r.key === key)!

describe('UX round 6, method', () => {
  it('names the avoidability test only where there is an E-LCC (P6-06)', async () => {
    await i18n.changeLanguage('en')
    expect(row(BASE, 'flows').value).not.toMatch(/avoidab|E-LCC/)
    const withElcc = { ...BASE, q3: { env: true, eco: true, soc: false }, lcc_type: 'C+E' } as Case
    expect(row(withElcc, 'flows').value).toMatch(/in the E-LCC, zero cost only if the residue is also unavoidable \(D4\.2 §6\.3\)/)
  })

  it('a present-day horizon cites only the answers given (P6-16)', async () => {
    await i18n.changeLanguage('en')
    const why = row(BASE, 'horizon').why!
    expect(why).toMatch(/operation in the present year/)
    expect(why).toMatch(/TRL 7 or above/)
    expect(why).toMatch(/no analysis period or asset lifetime given/)
    expect(why).not.toMatch(/horizon within/)
    const answered = row({ ...BASE, analysis_period_years: 10 } as Case, 'horizon').why!
    expect(answered).toMatch(/an analysis period of 10 years, within 15/)
    expect(answered).not.toMatch(/no analysis period/)
  })

  it('shows the condition of a sector rule in the reader language (P1-13)', () => {
    const rule = { id: 'p2_wastewater_07', applies_when: 'the flow is influent wastewater' } as SectorRule
    expect(sectorCondition('it', rule)).toBe('il flusso è acqua reflua in ingresso')
    expect(sectorCondition('en', rule)).toBe('the flow is influent wastewater')
    expect(sectorCondition('de', { ...rule, applies_when: null })).toBeNull()
  })

  it('a decision point uses the case variant (P6-08)', async () => {
    await i18n.changeLanguage('en')
    expect(cdpResolution(tf, 'CDP-01', 'default', 'schema text', 'engine text')).toMatch(/^Identical reference scenario/)
    expect(cdpResolution(tf, 'CDP-01', null, 'schema text', 'engine text')).toBe('schema text')
    expect(cdpResolution(tf, 'CDP-05', 'default', null, 'engine text')).toBe('engine text')
  })

  it('a costing-only study shows no ILCD modelling card (P6-13)', async () => {
    await i18n.changeLanguage('en')
    const costing = { ...BASE, q3: { env: false, eco: true, soc: false }, lcc_type: 'C+N+S' } as Case
    const verdict = verdictFor(costing, (key, fallback) => i18n.t(key, { defaultValue: fallback ?? '' }) as string)!
    expect(verdict.details.some((d) => d.section === 'ilcd')).toBe(false)
    expect(verdictFor(BASE, (key, fallback) => i18n.t(key, { defaultValue: fallback ?? '' }) as string)!
      .details.some((d) => d.section === 'ilcd')).toBe(true)
  })
})
