import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'

// UX round 2026-11-02: guided mode covered only the green boxes, and answers
// lived in the page until "run", so leaving the page lost them.
function renderPage() {
  return render(
    <MemoryRouter>
      <QuestionnairePage />
    </MemoryRouter>,
  )
}

describe('guided mode', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
    usePreferenceStore.setState({ mode: 'guided' })
  })
  afterEach(() => usePreferenceStore.setState({ mode: 'expert' }))

  it('shows the plain explanation, not the analyst line above it', () => {
    renderPage()
    const q9 = document.querySelector('section[aria-labelledby="q9-title"]')!
    expect(q9.querySelector('.qcard-plain')).toBeTruthy()
    expect(q9.querySelector('.qcard-help')).toBeNull()
    // the analyst line is still one click away, in the methodological note
    expect(q9.querySelector('.qcard-details')?.textContent).toMatch(/ILCD A, B, C1 or C2/)
  })

  it('gives an example for every Q9 answer', () => {
    renderPage()
    expect(screen.getByText(/giving your sawdust to the pellet plant/)).toBeTruthy()
    expect(screen.getByText(/sustainability report \(CSRD/)).toBeTruthy()
  })

  it('leaves out the JSON scenarios and the expert overrides', () => {
    renderPage()
    expect(document.getElementById('q2d-scenarios')).toBeNull()
    expect(document.querySelector('.advanced-card')).toBeNull()
  })
})

describe('questionnaire answers', () => {
  beforeEach(() => useCaseStore.getState().reset())

  it('are kept when the page is left before running', () => {
    const { unmount } = renderPage()
    fireEvent.click(document.querySelector('input[name="q1"][value="B"]')!)
    fireEvent.click(document.querySelector('section[aria-labelledby="q9-title"] input[value="none"]')!)
    unmount()
    expect(useCaseStore.getState().draft.q1).toBe('B')
    expect(useCaseStore.getState().draft.decision_context).toBe('none')
  })
})
