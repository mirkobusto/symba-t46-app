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

describe('ScenariosEditor JSON', () => {
  it('refuses keys a scenario cannot change, instead of a silent failed run (UX round 5, P7-11)', () => {
    const onChange = vi.fn()
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'Landfill', overrides: {} }]
    render(<ScenariosEditor scenarios={scenarios} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Landfill' }))
    fireEvent.click(screen.getByText(/as JSON/i))
    const box = document.querySelector('textarea.scenario-overrides-input') as HTMLTextAreaElement
    fireEvent.change(box, { target: { value: '{"flows": [{"id": "f3", "q5": "a"}]}' } })
    expect(screen.getByText(/A scenario changes answers of the questionnaire only/)).toBeTruthy()
    expect(onChange).not.toHaveBeenCalledWith([expect.objectContaining({ overrides: expect.objectContaining({ flows: expect.anything() }) })])
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

  it('reports a scenario that could not run, without a row of dashes (Fable review of #205)', () => {
    const base: Case = {
      q1: 'B', q3: { env: true, eco: false, soc: false }, q4: [], flows: [], sites: [],
      ilcd_situation: 'ILCD Situation A', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
      activated_nodes: [], applicable_rules: [], lca: {}, lcc: {},
    }
    useCaseStore.setState({
      scenariosResult: { baseline: base, scenarios: [{
        id: 'alt1', label: 'Landfill', overrides: {}, result: { ...base, ilcd_situation: null },
        error: 'flows: Extra inputs are not permitted',
      }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText(/could not be run.*flows: Extra inputs/)).toBeTruthy()
    expect(screen.queryByText(/Obligations removed/)).toBeNull()
    expect(screen.getAllByText('Landfill')).toHaveLength(1)
  })
})
