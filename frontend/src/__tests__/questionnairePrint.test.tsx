import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'

// Print the questions (partner feedback 2026-11): different departments answer
// different parts, so the questionnaire has to reach them on paper.
const visibleCards = () =>
  [...document.querySelectorAll('section.qcard')].filter((s) => !(s as HTMLElement).hidden).map((s) => s.id)

function renderPage() {
  render(
    <MemoryRouter>
      <QuestionnairePage />
    </MemoryRouter>,
  )
}

describe('print the questions', () => {
  let print: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    useCaseStore.getState().reset()
    usePreferenceStore.setState({ mode: 'expert' })
    print = vi.spyOn(window, 'print').mockImplementation(() => {})
  })
  afterEach(() => {
    print.mockRestore()
    usePreferenceStore.setState({ mode: 'expert' })
  })

  it('has a button that prints', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Print the questions' }))
    expect(print).toHaveBeenCalledTimes(1)
  })

  it('puts every question on the page before printing, also in the step-by-step view', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    renderPage()
    expect(visibleCards()).toEqual(['q0'])
    const seen: string[][] = []
    print.mockImplementation(() => { seen.push(visibleCards()) })

    fireEvent.click(screen.getByRole('button', { name: 'Print the questions' }))

    expect(seen).toHaveLength(1)
    expect(seen[0].length).toBeGreaterThan(8)
    // Q10 only appears with the economic dimension: the paper copy has it anyway
    expect(seen[0]).toContain('q10')
    expect(seen[0]).toContain('q5')

    // after printing the step-by-step view is back
    act(() => { window.dispatchEvent(new Event('afterprint')) })
    expect(visibleCards()).toEqual(['q0'])
    expect(document.getElementById('q10')).toBeNull()
  })

  it('lists the options of the questions answered in a drop-down, for the paper', () => {
    renderPage()
    const lists = [...document.querySelectorAll('.print-options')]
    expect(lists.length).toBe(3)
    // Q6a: the whole list of sectors, which a printed drop-down would not show
    expect(document.querySelector('#q6a .print-options')?.querySelectorAll('li').length).toBe(15)
    expect(document.querySelector('#q5 .print-options')?.textContent).toContain('Whoever gives it pays the receiver')
  })
})
