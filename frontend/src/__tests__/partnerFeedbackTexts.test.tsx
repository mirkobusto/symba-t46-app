import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'

// Texts changed after a partner company tested the questionnaire (2026-11).
function renderPage() {
  render(
    <MemoryRouter>
      <QuestionnairePage />
    </MemoryRouter>,
  )
}

describe('questionnaire texts after the partner test', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
    usePreferenceStore.setState({ mode: 'expert' })
  })
  afterEach(() => usePreferenceStore.setState({ mode: 'expert' }))

  it('says what the questions are for, who answers and where the answers are kept', () => {
    renderPage()
    const lead = document.querySelector('.questionnaire-lead')!.textContent!
    expect(lead).toContain('how the study is set up')
    expect(lead).toContain('whoever coordinates the study')
    expect(lead).toContain('does not compute the results')
    expect(lead).toContain('Your answers stay in this browser')
    expect(lead).toContain('free account')
  })

  it('says it in plain words in guided mode, on the first question only', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    renderPage()
    expect(document.querySelector('.questionnaire-lead')!.textContent).toContain('does not do the calculations')
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
    expect(document.querySelector('.questionnaire-lead')).toBeNull()
  })

  it('does not offer two identical answers for the operating year', () => {
    renderPage()
    const labels = [...document.querySelectorAll('input[name="q8-start"]')]
      .map((i) => i.parentElement!.textContent)
    expect(labels).toEqual(['Not answered', 'Now: the year of the study', 'A future year'])
  })

  it('tells that the type of reuse can stay unanswered, in both registers', () => {
    renderPage()
    // the column exists with the environmental study (LCA) only
    fireEvent.click(screen.getByLabelText(/Environmental \(LCA\)/))
    fireEvent.click(screen.getByRole('button', { name: 'Add flow' }))
    const expert = [...document.querySelectorAll('.flows-q5-note')].map((n) => n.textContent).join(' ')
    expect(expert).toContain('leave “none of these / not answered”')
    expect(expert).toContain('biowaste turned into materials or bioplastics')

    act(() => usePreferenceStore.setState({ mode: 'guided' }))
    const guided = [...document.querySelectorAll('.flows-q5-note')].map((n) => n.textContent).join(' ')
    expect(guided).toContain('the rules for the sector you picked still apply')
  })
})
