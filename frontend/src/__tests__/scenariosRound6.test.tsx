import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import ScenariosEditor from '../components/ScenariosEditor'
import { answerChanges, changedAnswers, inertAnswerHints, withFollowUps } from '../components/scenarioChanges'
import QuestionnairePage from '../pages/QuestionnairePage'
import ScenariosResultPage from '../pages/ScenariosResultPage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type { AlternativeScenario, Case } from '../types/api'
import i18n from '../i18n'

// UX round of 2026-11-08: a structural scenario could never reach Situation B
// (P1-01), the comparison said only "Nothing changes", named no practice
// (P6-09), and a scenario with unreadable JSON ran as if it had none (P7-05).

const t = i18n.t.bind(i18n) as unknown as (k: string, o?: Record<string, unknown>) => string

describe('Scenario follow-up questions', () => {
  const micro = { q3: { env: true, eco: true, soc: false }, decision_context: 'micro' } as Partial<Case>

  it('a structural decision brings the market screening with it', () => {
    expect(withFollowUps({ decision_context: 'structural' }, micro, 'decision_context'))
      .toEqual({ decision_context: 'structural', market_screening_documented: false })
  })

  it('drops the screening once the decision is no longer structural', () => {
    expect(withFollowUps({ decision_context: 'none', market_screening_documented: true }, micro, 'decision_context'))
      .toEqual({ decision_context: 'none' })
  })

  it('a case already structural keeps its own screening answer unless changed', () => {
    const structural = { ...micro, decision_context: 'structural', market_screening_documented: false } as Partial<Case>
    expect(withFollowUps({ decision_context: 'structural' }, structural, 'decision_context'))
      .toEqual({ decision_context: 'structural' })
  })

  it('the editor shows the screening right under the decision and offers it only when asked', () => {
    const onChange = vi.fn()
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'B', overrides: { decision_context: 'micro' } }]
    const { rerender } = render(<ScenariosEditor scenarios={scenarios} onChange={onChange} baseline={micro} />)
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    expect(screen.queryByRole('option', { name: 'Is the market screening documented?' })).toBeNull()
    const answer = screen.getAllByRole('combobox', { name: 'New answer' })[0]
    fireEvent.change(answer, { target: { value: '1' } })   // structural
    const next = onChange.mock.calls.at(-1)![0] as AlternativeScenario[]
    expect(next[0].overrides).toEqual({ decision_context: 'structural', market_screening_documented: false })
    rerender(<ScenariosEditor scenarios={next} onChange={onChange} baseline={micro} />)
    const questions = screen.getAllByRole('combobox', { name: 'Question' }) as HTMLSelectElement[]
    expect(questions.map((q) => q.value)).toEqual(['decision_context', 'market_screening_documented'])
    expect(screen.getByRole('option', { name: 'Yes, it is documented (Situation B)' })).toBeTruthy()
  })

  it('offers the year of operation only for a future operation', () => {
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'S', overrides: { operating_start: 'now' } }]
    render(<ScenariosEditor scenarios={scenarios} onChange={vi.fn()} baseline={micro} />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    expect(screen.queryByRole('option', { name: 'Year of operation' })).toBeNull()
    expect(screen.getAllByRole('option', { name: /What are you analyzing/ }).length).toBeGreaterThan(0)
  })
})

describe('Scenario JSON that cannot be read', () => {
  it('is reported by name, and cleared once fixed', () => {
    const onInvalid = vi.fn()
    const scenarios: AlternativeScenario[] = [{ id: 'alt1', label: 'Broken JSON test', overrides: {} }]
    render(<ScenariosEditor scenarios={scenarios} onChange={vi.fn()} onInvalidChange={onInvalid} />)
    fireEvent.click(screen.getByRole('button', { name: 'Broken JSON test' }))
    fireEvent.click(screen.getByText(/as JSON/i))
    const box = document.querySelector('textarea.scenario-overrides-input') as HTMLTextAreaElement
    fireEvent.change(box, { target: { value: '{"q2": B' } })
    expect(onInvalid).toHaveBeenLastCalledWith(['Broken JSON test'])
    expect(screen.getByText(/cannot be read/)).toBeTruthy()
    fireEvent.change(box, { target: { value: '{"q2": "B"}' } })
    expect(onInvalid).toHaveBeenLastCalledWith([])
  })

  describe('in the questionnaire', () => {
    beforeEach(() => {
      useCaseStore.getState().reset()
      usePreferenceStore.setState({ mode: 'expert' })
      vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
        ok: true, status: 200, json: () => Promise.resolve({ ilcd_situation: 'ILCD Situation A' }),
      } as Response)))
    })
    afterEach(() => vi.unstubAllGlobals())

    it('keeps "Work out the configuration" disabled while a scenario JSON is unreadable (P7-05)', () => {
      useCaseStore.getState().patchDraft({
        q1: 'A', decision_context: 'micro', q3: { env: true, eco: false, soc: false },
        alternative_scenarios: [{ id: 'alt1', label: 'Broken JSON test', overrides: {} }],
      })
      render(<MemoryRouter><QuestionnairePage /></MemoryRouter>)
      const button = screen.getByRole('button', { name: /work out the configuration/i })
      expect(button).toBeEnabled()
      fireEvent.click(screen.getByRole('button', { name: 'Broken JSON test' }))
      fireEvent.click(screen.getByText(/as JSON/i))
      const box = document.querySelector('textarea.scenario-overrides-input') as HTMLTextAreaElement
      fireEvent.change(box, { target: { value: '{"q2": B' } })
      expect(button).toBeDisabled()
      expect(screen.getByText(/Alternative scenarios: the JSON of Broken JSON test cannot be read/)).toBeTruthy()
      fireEvent.change(box, { target: { value: '' } })
      expect(button).toBeEnabled()
    })
  })
})

const BASE: Case = {
  q1: 'B', q2: 'B', q3: { env: true, eco: true, soc: false }, q4: [], flows: [], sites: [],
  decision_context: 'micro', policy_objective: false,
  ilcd_situation: 'ILCD Situation A', lcc_type: 'C+E', slca_activation_state: 'deactivated',
  activated_nodes: [], applicable_rules: [], warnings: [], lca: {}, lcc: {},
}

describe('Scenario comparison says why', () => {
  afterEach(() => usePreferenceStore.setState({ mode: 'expert' }))

  it('names the answers that change and why a structural scenario stays A (P1-01)', () => {
    const structural: Case = { ...BASE, decision_context: 'structural', warnings: [
      { code: 'structural_screening_missing', message: 'Q9 says the effects are structural…' }] }
    useCaseStore.setState({
      scenariosResult: { baseline: BASE, scenarios: [{ id: 'alt1', label: 'Situation B sensitivity', result: structural,
        node_changes: { added: [], removed: [], changed: [] } }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText(/Which decision does the study support.*→/)).toBeTruthy()
    expect(screen.getByText(/These answers do not change the configuration/)).toBeTruthy()
    expect(screen.getByText(/Still Situation A.*Is the market screening documented\?.*Yes, it is documented/)).toBeTruthy()
    // the engine note says the same: not twice
    expect(screen.queryByText(/Q9 says the effects are structural/)).toBeNull()
  })

  it('leads with the situation when it changes, and lists the practices (P6-09)', () => {
    const b: Case = { ...BASE, decision_context: 'structural', market_screening_documented: true,
      ilcd_situation: 'ILCD Situation B' }
    useCaseStore.setState({
      scenariosResult: { baseline: BASE, scenarios: [{ id: 'alt1', label: 'B', result: b, node_changes: {
        added: [], changed: [],
        removed: [{ id: 'lca_hc_14', method: 'LCA', source_section: 'D4.1 §13.3.2', text: 'Monte Carlo mandatory' }],
      } }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText(/ILCD Situation A → ILCD Situation B/)).toBeTruthy()
    expect(screen.getByText('1 practice removed')).toBeTruthy()
    expect(screen.getByText(/Monte Carlo mandatory/)).toBeTruthy()
    expect(screen.queryByText(/These answers do not change/)).toBeNull()
  })

  it('names the changes set as JSON outside the form', () => {
    useCaseStore.setState({
      draft: { ...BASE, alternative_scenarios: [{ id: 'alt1', label: 'Expert', overrides: { advanced: { x: 1 } } }] },
      scenariosResult: { baseline: BASE, scenarios: [{ id: 'alt1', label: 'Expert', result: BASE }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText('1 other change set as JSON')).toBeTruthy()
    expect(screen.queryByText('Same answers as the case.')).toBeNull()
  })

  it('a result stored before node changes existed still renders', () => {
    useCaseStore.setState({
      scenariosResult: { baseline: BASE, scenarios: [{ id: 'alt1', label: 'Old', result: { ...BASE, q7: 'B' } }] },
    } as never)
    render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    expect(screen.getByText(/Old — what changes/)).toBeTruthy()
  })

  it('in guided mode, says it without question codes and without the analysts\' notes', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    const structural: Case = { ...BASE, decision_context: 'structural', warnings: [
      { code: 'structural_screening_missing', message: 'Q9 says…' }, { code: 'lcc_without_lca', message: 'Q3 has…' }] }
    useCaseStore.setState({
      scenariosResult: { baseline: BASE, scenarios: [{ id: 'alt1', label: 'S', result: structural }] },
    } as never)
    const { container } = render(<MemoryRouter><ScenariosResultPage /></MemoryRouter>)
    const section = container.querySelector('.scenario-diff')!
    expect(section.textContent).not.toMatch(/\bQ\d+[ab]?\b/)
    expect(section.textContent).toMatch(/the market check is documented/)
  })
})

describe('changedAnswers / inertAnswerHints', () => {
  it('reads the changes off the two runs, flows included', () => {
    const base = { ...BASE, flows: [{ id: 'f1', name: 'Slag', q5: 'a' as const }] }
    const sc = { ...base, q4: ['C' as const], flows: [{ id: 'f1', name: 'Slag', q5: 'c' as const }] }
    expect(changedAnswers(base, sc)).toEqual({ q4: ['C'], flow_q5: { f1: 'c' } })
    expect(answerChanges(changedAnswers(base, sc), base, t).changes.map((c) => c.question))
      .toEqual(['How will you use and communicate the results?', 'Who pays whom: Slag'])
  })

  it('says when an answer counts only with another one', () => {
    const noEco = { ...BASE, q3: { env: true, eco: false, soc: false } }
    expect(inertAnswerHints({ policy_objective: true }, noEco, t)[0]).toMatch(/only with the economic dimension/)
    expect(inertAnswerHints({ market_screening_documented: true }, BASE, t)[0]).toMatch(/only when the decision has structural effects/)
  })
})
