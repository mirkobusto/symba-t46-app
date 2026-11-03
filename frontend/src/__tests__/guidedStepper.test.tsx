import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'

// Guided mode runs one question at a time (UX round 2026-11-02).
const visibleCards = () =>
  [...document.querySelectorAll('section.qcard')].filter((s) => !(s as HTMLElement).hidden).map((s) => s.id)

function renderPage() {
  render(
    <MemoryRouter>
      <QuestionnairePage />
    </MemoryRouter>,
  )
}

describe('guided questionnaire, one question at a time', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
    usePreferenceStore.setState({ mode: 'guided' })
  })
  afterEach(() => usePreferenceStore.setState({ mode: 'expert' }))

  it('shows one card, with its place and part', () => {
    renderPage()
    expect(visibleCards()).toEqual(['q0'])
    expect(screen.getByText(/Question 1 of \d+ · The study/)).toBeTruthy()
  })

  it('moves forward and back', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
    expect(visibleCards()).toEqual(['q1'])
    fireEvent.click(screen.getByRole('button', { name: '← Back' }))
    expect(visibleCards()).toEqual(['q0'])
  })

  it('adds a card that appears on an answer to the sequence', () => {
    renderPage()
    const before = Number(/of (\d+)/.exec(screen.getByText(/Question 1 of/).textContent!)![1])
    // costs bring Q10 (public objective), and Q12 (shared assets) if it was not there yet
    fireEvent.click(screen.getByLabelText(/Economic \(LCC\)/))
    const after = Number(/of (\d+)/.exec(screen.getByText(/Question 1 of/).textContent!)![1])
    expect(after).toBeGreaterThan(before)
    expect(document.getElementById('q10')).toBeTruthy()
  })

  it('takes a "still to answer" link to that question', () => {
    renderPage()
    fireEvent.click(screen.getByRole('link', { name: /What is the study for/ }))
    expect(visibleCards()).toEqual(['q9'])
  })

  it('can show every question on one page', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Show all the questions on one page' }))
    expect(visibleCards().length).toBeGreaterThan(5)
  })

  it('leaves expert mode on a single page', () => {
    usePreferenceStore.setState({ mode: 'expert' })
    renderPage()
    expect(visibleCards().length).toBeGreaterThan(5)
    expect(screen.queryByRole('button', { name: 'Next →' })).toBeNull()
  })
})
