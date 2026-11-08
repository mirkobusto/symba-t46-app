import { describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { configurationRows } from '../pages/configurationRows'
import type {
  Case, ComparisonGoal, IlcdSituation, LccType, Q5, Q7, ReferenceMarketScope, StudyPurpose,
} from '../types/api'

// Every key "Your configuration" can ask for must exist in en.ts: a row of a
// study with LCA only and Q12 = yes showed the raw key
// "result.config.values.sharedLca" on the page and in the Word report (UX
// round 6, P6-01). The rows are built over the answers that pick a key
// (situation, costing, audience, Q0, Q2, Q4, Q5, Q7, Q11, Q12...), so every
// branch of configurationRows is walked.

const SITUATIONS: IlcdSituation[] = ['ILCD Situation A', 'ILCD Situation B', 'ILCD Situation C1', 'ILCD Situation C2']
const LCC_TYPES: LccType[] = ['deactivated', 'C+E', 'C+E+S', 'C-LCC', 'C+N', 'C+N+S']
const Q3S = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => ({ env: !!(n & 1), eco: !!(n & 2), soc: !!(n & 4) }))
const Q2S: { q2?: 'A' | 'B'; network_long_standing?: boolean }[] = [
  {}, { q2: 'A' }, { q2: 'A', network_long_standing: true }, { q2: 'B' },
]
const AUDIENCES = [undefined, 'community', 'end-user', 'industry', 'authority']
const Q7S: (Q7 | undefined)[] = ['A', 'B', 'C', undefined]
const GOALS: (ComparisonGoal | undefined)[] = ['waste_treatment', 'product_substitution', 'co_primary', undefined]
const PURPOSES: (StudyPurpose | undefined)[] = ['analysis', 'improvement', 'expansion', 'design', 'restructuring', undefined]
const Q4S: string[][] = [[], ['A'], ['C'], ['D'], ['C', 'D'], ['E']]
const Q5S: Q5[] = ['a', 'b', 'c', 'd', 'e']
const SCOPES: (ReferenceMarketScope | undefined)[] = ['national', 'sub_national', 'continental', undefined]
// the starts of lca_mc_17's per-flow values (FLOW_TREATMENT), and one unknown
const TREATMENTS = ['zero-burden from…', 'EVT …', 'substitution …', 'integrated …', 'allocation …', 'aggregated …', 'other']
const TRL = ['TRL9', 'TRL7-8', 'TRL5-6', 'TRL<5', undefined] as const
const STARTS = [
  { operating_start: 'future' as const, operating_start_year: 2032 },
  { operating_start: 'future' as const },
  { operating_start: 'now' as const, analysis_period_years: 30 },
  { asset_lifetime_years: 40 },
  {},
]

function pick<T>(list: readonly T[], i: number): T {
  return list[i % list.length]
}

describe('configurationRows keys', () => {
  it('every key the rows can ask for exists in en.ts', async () => {
    await i18n.changeLanguage('en')
    const missing = new Set<string>()
    const t = (key: string, options?: Record<string, unknown>) => {
      // keys with a fallback (chapter names) are allowed to fall back
      if (!options || !('defaultValue' in options)) {
        if (!i18n.exists(key, { lng: 'en' })) missing.add(key)
      }
      return i18n.t(key, options ?? {}) as string
    }
    let i = 0
    let rowsSeen = 0
    for (const ilcd of SITUATIONS) {
      for (const lcc_type of LCC_TYPES) {
        for (const q3 of Q3S) {
          for (const q2 of Q2S) {
            for (const audience of AUDIENCES) {
              i += 1
              const q5 = pick(Q5S, i)
              const kase: Case = {
                q1: 'B', q3, q4: pick(Q4S, i) as Case['q4'], ...q2,
                q7: pick(Q7S, i), q6b: pick(TRL, i),
                comparison_goal: pick(GOALS, i), study_purpose: pick(PURPOSES, i),
                reference_market_region: i % 2 ? 'Italy' : null,
                reference_market_scope: pick(SCOPES, i),
                policy_objective: i % 3 === 0 ? null : i % 3 === 1,
                dedicated_shared_assets: i % 2 === 0,
                ilcd_situation: ilcd, lcc_type,
                slca_activation_state: i % 2 ? 'active' : 'deactivated',
                ...pick(STARTS, i),
                activated_nodes: i % 2 ? ['lca_mc_21', 'lcc_hc_23', 'lca_mc_20', 'lcc_hc_15'] : [],
                flows: [{ id: 'f1', name: 'Whey', q5 }, { id: 'f2', name: '', q5: pick(Q5S, i + 2) }],
                sites: [],
                lca: { zero_burden_classification: { f1: pick(TREATMENTS, i), f2: pick(TREATMENTS, i + 3) } },
                lcc: {},
                sector_rules: i % 4 === 0 ? [{
                  id: 'p2_agrifood_03', chapter: '§4 Agri-Food and Biorefineries', strength: 'must',
                  statement: '', source: '', lines: '',
                  activated_by: [{ kind: 'flow', name: 'Whey' }, { kind: 'case_sector' }],
                } as never] : [],
              }
              const rows = configurationRows(kase, t, { audience })
              rowsSeen += rows.length
              for (const row of rows) {
                // a raw key on screen is the symptom: catch it whatever its origin
                expect(`${row.label} ${row.value} ${row.why ?? ''}`).not.toMatch(
                  /\b(result|narrative|questionnaire)\.[a-zA-Z_]+\.[a-zA-Z_.]+/)
              }
            }
          }
        }
      }
    }
    expect(rowsSeen).toBeGreaterThan(1000)
    expect([...missing]).toEqual([])
  })

  it('a study with LCA only and dedicated assets says how they are inventoried', async () => {
    await i18n.changeLanguage('en')
    const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options ?? {}) as string
    const shared = configurationRows({
      q1: 'B', q3: { env: true, eco: false, soc: false }, q4: [], flows: [], sites: [],
      ilcd_situation: 'ILCD Situation A', dedicated_shared_assets: true,
    }, t).find((r) => r.key === 'shared')!
    expect(shared.label).toBe('Dedicated assets')
    expect(shared.value).toMatch(/^Their production and end of life inventoried in the LCA/)
  })
})
