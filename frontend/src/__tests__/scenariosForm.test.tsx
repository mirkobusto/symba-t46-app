import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import '../i18n'
import ScenariosEditor from '../components/ScenariosEditor'
import ScenariosResultPage from '../pages/ScenariosResultPage'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
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

describe('ScenariosEditor starts from the case', () => {
  const baseline = {
    q3: { env: true, eco: false, soc: true }, decision_context: 'structural',
    flows: [{ id: 'f1', name: 'Slag', q5: 'a' }, { id: 'f2', name: 'Heat', q5: 'c' }],
  } as Partial<Case>

  it('a new change carries the case\'s answer, not a fixed default', () => {
    const onChange = vi.fn()
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'S', overrides: {} }]
    const { rerender } = render(<ScenariosEditor scenarios={scenarios} onChange={onChange} baseline={baseline} />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.click(screen.getByRole('button', { name: /add a change/i }))
    const first = onChange.mock.calls.at(-1)![0] as AlternativeScenario[]
    expect(first[0].overrides).toEqual({ q3: { env: true, eco: false, soc: true } })
    rerender(<ScenariosEditor scenarios={first} onChange={onChange} baseline={baseline} />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Question' }), { target: { value: 'decision_context' } })
    expect((onChange.mock.calls.at(-1)![0] as AlternativeScenario[])[0].overrides).toEqual({ decision_context: 'structural' })
  })

  it('changes who pays whom for one flow', () => {
    const onChange = vi.fn()
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'S', overrides: { flow_q5: { f1: 'a', f2: 'c' } } }]
    render(<ScenariosEditor scenarios={scenarios} onChange={onChange} baseline={baseline} />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'New answer: Slag' }), { target: { value: 'c' } })
    expect((onChange.mock.calls.at(-1)![0] as AlternativeScenario[])[0].overrides).toEqual({ flow_q5: { f1: 'c', f2: 'c' } })
  })

  it('offers no per-flow change when the case has no flows', () => {
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'S', overrides: { q3: { env: true, eco: true, soc: false } } }]
    render(<ScenariosEditor scenarios={scenarios} onChange={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    expect(screen.queryByRole('option', { name: 'Who pays whom, per flow' })).toBeNull()
  })
})

describe('ScenariosEditor ids', () => {
  it('does not reuse the id of a deleted scenario whose network is kept (Fable review)', () => {
    useDcfDataStore.setState({ data: { schema_version: '1.1', case_id: '', rows_by_section: {}, layout: {},
      networks_by_scenario: { alt1: { rows_by_section: {}, layout: {} } } } } as never)
    const onChange = vi.fn()
    render(<ScenariosEditor scenarios={[]} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /add scenario/i }))
    expect((onChange.mock.calls.at(-1)![0] as AlternativeScenario[])[0].id).toBe('alt2')
    useDcfDataStore.getState().reset()
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
    expect(screen.getByText(/the flows themselves and what the engine writes cannot be changed here/)).toBeTruthy()
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

  it('names the flow whose class a scenario changes', () => {
    const base: Case = {
      q1: 'B', q3: { env: true, eco: false, soc: false }, q4: [], sites: [],
      flows: [{ id: 'f1', name: 'Slag', q5: 'a' }],
      ilcd_situation: 'ILCD Situation A', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
      activated_nodes: [], applicable_rules: [], lca: {}, lcc: {},
    }
    const sold: Case = { ...base, flows: [{ id: 'f1', name: 'Slag', q5: 'c' }] }
    useCaseStore.setState({
      scenariosResult: { baseline: base, scenarios: [{ id: 'alt1', label: 'Sold', overrides: { flow_q5: { f1: 'c' } }, result: sold }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText(/Who pays whom: Slag/)).toBeTruthy()
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

  it('says in words where the scenario sends the flows (scenario networks)', () => {
    const base: Case = {
      q1: 'B', q3: { env: true, eco: false, soc: false }, q4: [], sites: [], flows: [],
      ilcd_situation: 'ILCD Situation A', lcc_type: 'deactivated', slca_activation_state: 'deactivated',
      activated_nodes: [], applicable_rules: [], lca: {}, lcc: {},
    }
    const actors = [{ row_id: 'a1', values: { 'actor.name': 'WWTP' } }, { row_id: 'a2', values: { 'actor.name': 'Biogas' } }]
    useCaseStore.setState({
      serverCaseId: null,
      scenariosResult: { baseline: base, scenarios: [
        { id: 'alt1', label: 'Landfill', overrides: {}, result: base },
        { id: 'alt2', label: 'Same', overrides: {}, result: base },
      ] },
    } as never)
    useDcfDataStore.setState({ caseId: null, data: {
      schema_version: '1.1', case_id: '', layout: {},
      rows_by_section: { actors, flow_matrix: [{ row_id: 'f1', values: { 'flow.name': 'sludge', 'flow.origin_actor_id': 'a1', 'flow.dest_actor_id': 'a2' } }] },
      networks_by_scenario: { alt1: { layout: {}, rows_by_section: {
        actors: [...actors, { row_id: 'a9', values: { 'actor.name': 'Landfill Sud' } }],
        flow_matrix: [{ row_id: 'f1', values: { 'flow.name': 'sludge', 'flow.origin_actor_id': 'a1', 'flow.dest_actor_id': 'a9' } }],
      } } },
    } } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText('Actor added: Landfill Sud')).toBeTruthy()
    expect(screen.getByText('sludge: WWTP → Biogas becomes WWTP → Landfill Sud')).toBeTruthy()
    expect(screen.getByText(/This scenario uses the case's network/)).toBeTruthy()
  })
})
