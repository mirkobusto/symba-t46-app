import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import { configurationRows } from '../pages/configurationRows'
import ResultPage from '../pages/ResultPage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type { Case } from '../types/api'

// UX round 2026-11-03: a plant manager and a newcomer did not know what to do
// with the result (P3-01, P7-02); an analyst read "future background" next to
// a study of the present year with no explanation (P1-04, P3-02).
const RESULT: Case = {
  q1: 'B', q2: 'A', decision_context: 'none', q3: { env: true, eco: true, soc: false }, q4: ['B'],
  flows: [{ id: 'f1', name: 'Beet pulp', q5: 'c' }], sites: [], alternative_scenarios: [], advanced: {},
  ilcd_situation: 'ILCD Situation C1', lcc_type: 'C+E', slca_activation_state: 'deactivated',
  activated_nodes: ['lca_mc_21'], blocked_by: [], applicable_rules: [],
  cdp_flags: [{ cdp_id: 'CDP-01', name: 'Displaced Products Divergence', tension: null, severity: 'HIGH',
    methods: [], resolution_at_l3: 'x' }],
  operating_start: 'now', asset_lifetime_years: 25,
}

describe('result in guided mode', () => {
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

  it('says what the result means and what to do, and folds the analyst points', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    render(<MemoryRouter><ResultPage /></MemoryRouter>)
    expect(screen.getByText('What this means for you')).toBeInTheDocument()
    expect(screen.getByText(/It does not calculate whether the exchange pays off/)).toBeInTheDocument()
    expect(screen.getByText('Decision points for the analyst (1)')).toBeInTheDocument()
    expect(screen.getByText('An existing network, described as it runs')).toBeInTheDocument()
  })

  it('keeps the analyst view in expert mode', () => {
    render(<MemoryRouter><ResultPage /></MemoryRouter>)
    expect(screen.queryByText('What this means for you')).toBeNull()
    expect(screen.queryByText(/Points for the analyst/)).toBeNull()
  })

  it('explains a future background asked only by the asset lifetime', () => {
    const t = (k: string, o?: Record<string, unknown>) => i18n.t(k, o ?? {}) as string
    const horizon = configurationRows(RESULT, t).find((r) => r.key === 'horizon')!
    expect(horizon.why).toMatch(/even though the study describes the present year/)
  })
})
