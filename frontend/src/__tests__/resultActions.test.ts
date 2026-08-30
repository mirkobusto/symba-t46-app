import { describe, expect, it } from 'vitest'

import { actionItems, answersFor } from '../pages/resultActions'
import type { Case } from '../types/api'

const CASE: Case = {
  q1: 'B',
  q2: 'D',
  q3: { env: true, eco: true, soc: false },
  q4: ['E'],
  q6a: 'wastewater_sludge_biofactories',
  q6b: 'TRL7-8',
  q7: 'B',
  flows: [{ id: 'f1', name: 'sludge', q5: 'a' }],
  sites: [],
  alternative_scenarios: [],
  advanced: {},
}

describe('answersFor', () => {
  it('resolves the questions a trigger refers to', () => {
    expect(answersFor('Q7 ∈ {B, C, D}', CASE)).toEqual([{ label: 'Q7', value: 'B' }])
  })

  it('renders Q3 as the list of active dimensions', () => {
    expect(answersFor('Q3 has ≥2 dims active', CASE)).toEqual([
      { label: 'Q3', value: 'env + eco' },
    ])
  })

  it('reports each question once, in order of appearance', () => {
    expect(answersFor('Q1=B and Q7 with Q1 again', CASE)).toEqual([
      { label: 'Q1', value: 'B' },
      { label: 'Q7', value: 'B' },
    ])
  })

  it('skips questions the case has not answered', () => {
    expect(answersFor('Q7 ∈ {B}', { ...CASE, q7: undefined })).toEqual([])
  })

  it('is empty for a missing trigger', () => {
    expect(answersFor(null, CASE)).toEqual([])
  })
})

describe('actionItems', () => {
  it('orders blocks first, then violations, then decisions', () => {
    const items = actionItems({
      ...CASE,
      blocked_by: ['block_C2_plus_E-LCC'],
      rule_violations: [{ rule_id: 'B-05', message: 'boom' }],
      cdp_flags: [
        { cdp_id: 'CDP-03', name: 'Trade-off', tension: null, severity: 'LOW', methods: [], resolution_at_l3: null },
      ],
    })
    expect(items.map((i) => i.kind)).toEqual(['block', 'violation', 'decision'])
  })

  it('carries the rule row through to the card', () => {
    const [item] = actionItems({
      ...CASE,
      rule_violations: [
        {
          rule_id: 'B-05',
          message: 'Geographic spread requires explicit transport.',
          name: 'Geographic Spread Transport Coupling',
          trigger: 'Q7 ∈ {B, C, D}',
          fields: ['lca.transport.foreground', 'lcc.transport_costs'],
        },
      ],
    })
    expect(item.title).toBe('Geographic Spread Transport Coupling')
    expect(item.fields).toHaveLength(2)
    expect(item.answers).toEqual([{ label: 'Q7', value: 'B' }])
  })

  it('sorts decisions by severity', () => {
    const items = actionItems({
      ...CASE,
      cdp_flags: [
        { cdp_id: 'CDP-01', name: 'low', tension: null, severity: 'LOW', methods: [], resolution_at_l3: null },
        { cdp_id: 'CDP-02', name: 'high', tension: null, severity: 'HIGH', methods: [], resolution_at_l3: null },
      ],
    })
    expect(items.map((i) => i.code)).toEqual(['CDP-02', 'CDP-01'])
  })

  it('is empty for a null result', () => {
    expect(actionItems(null)).toEqual([])
  })
})
