import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import '../i18n'
import ScenariosEditor from '../components/ScenariosEditor'
import ScenariosResultPage from '../pages/ScenariosResultPage'
import { useCaseStore } from '../store/caseStore'
import type { AlternativeScenario, Case } from '../types/api'

// Scenarios as "question → new answer" instead of JSON, and a comparison that
// says what changes (UX round 2026-11-02).
describe('ScenariosEditor', () => {
  it('builds the overrides from a question and an answer', () => {
    const onChange = vi.fn()
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'Claim', overrides: {} }]
    const { rerender } = render(<ScenariosEditor scenarios={scenarios} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Claim' }))
    fireEvent.click(screen.getByRole('button', { name: /add a change/i }))
    const first = onChange.mock.calls.at(-1)![0] as AlternativeScenario[]
    expect(first[0].overrides).toEqual({ q3: { env: true, eco: true, soc: false } })

    rerender(<ScenariosEditor scenarios={first} onChange={onChange} />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Question' }), { target: { value: 'decision_context' } })
    const second = onChange.mock.calls.at(-1)![0] as AlternativeScenario[]
    expect(second[0].overrides).toEqual({ decision_context: 'micro' })
  })
})

describe('Scenario comparison', () => {
  it('names what changes, not only counts', () => {
    const base: Case = {
      q1: 'B', q3: { env: true, eco: false, soc: false }, q4: [], flows: [], sites: [],
      ilcd_situation: 'ILCD Situation A', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
      activated_nodes: [], applicable_rules: [], lca: {}, lcc: {},
    }
    const claim: Case = { ...base, q4: ['C'], applicable_rules: [{ rule_id: 'IR-18', statement: 's' }] }
    useCaseStore.setState({
      scenariosResult: { baseline: base, scenarios: [{ id: 'alt1', label: 'Public claim', overrides: { q4: ['C'] }, result: claim }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText(/Public claim — what changes compared with the case/)).toBeTruthy()
    expect(screen.getByText('Obligations added')).toBeTruthy()
    expect(screen.getByText(/IR-18/)).toBeTruthy()
  })
})
