import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import { groupByFamily } from '../pages/configurationRows'
import ResultPage from '../pages/ResultPage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type { ApplicableRule, Case } from '../types/api'

// UX round 6 (P1-06, P1-07, P6-10, P7-11, P3-12, P4-19): "What to do next · 0
// items" stood next to "7 obligations to document", and "the obligations below"
// pointed at a list the page did not have.
const rule = (rule_id: string, name: string): ApplicableRule =>
  ({ rule_id, name, statement: `${name} statement`, trigger: 'Q3 = env', fields: [] }) as ApplicableRule

const RESULT: Case = {
  q1: 'B', q2: 'A', decision_context: 'none', q3: { env: true, eco: false, soc: false }, q4: ['B'],
  flows: [{ id: 'f1', name: 'Beet pulp', q5: 'c' }], sites: [], alternative_scenarios: [], advanced: {},
  ilcd_situation: 'ILCD Situation C1', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
  activated_nodes: [], blocked_by: [],
  applicable_rules: [rule('B-01', 'Boundary one'), rule('IR-02', 'Integration two'), rule('CIR-01', 'Switched one'),
    rule('IR-03', 'Integration three')],
  cdp_flags: [],
}

describe('obligations on the result page', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200, json: () => Promise.resolve({ status: 'ok', anonymous_save: false }),
    } as Response)))
    useCaseStore.setState({ result: RESULT, draft: RESULT } as never)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    usePreferenceStore.setState({ mode: 'expert' })
  })

  it('groups by family in the order of the rule table', () => {
    const groups = groupByFamily([{ code: 'B-01' }, { code: 'IR-02' }, { code: 'X-1' }, { code: 'CIR-01' }, { code: 'IR-03' }])
    expect(groups.map(([f, list]) => [f, list.length])).toEqual([['IR', 2], ['CIR', 1], ['B', 1], ['other', 1]])
  })

  it('gives both counts next to the heading and lists every obligation', () => {
    render(<MemoryRouter><ResultPage /></MemoryRouter>)
    expect(screen.getByText(/0 decision points · 4 obligations/)).toBeInTheDocument()
    expect(screen.getByText(/The obligations listed below still apply/)).toBeInTheDocument()
    expect(screen.getByText('2 on integrating the methods')).toBeInTheDocument()
    expect(screen.getByText('1 on boundaries')).toBeInTheDocument()
    for (const code of ['IR-02', 'IR-03', 'CIR-01', 'B-01']) {
      expect(screen.getByText(code)).toBeInTheDocument()
    }
  })

  it('folds the obligations for the analyst in guided mode', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    render(<MemoryRouter><ResultPage /></MemoryRouter>)
    expect(screen.getByText('Obligations for the analyst (4)')).toBeInTheDocument()
  })
})
