import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import i18n from '../i18n'
import FlowsEditor from '../components/FlowsEditor'
import QuestionCard from '../components/QuestionCard'
import { usePreferenceStore } from '../store/preferenceStore'

// UX round 2026-11-03: the flows table was where a newcomer gave up (codes a-e,
// "(A)/(B)", "Part 2"), and the Q-codes came out of order (P3-04, P7-03, P7-12).
describe('guided questionnaire', () => {
  beforeEach(async () => { await i18n.changeLanguage('en') })
  afterEach(() => usePreferenceStore.setState({ mode: 'expert' }))

  it('asks who pays whom in words', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    render(<FlowsEditor flows={[{ id: 'f1', name: 'sawdust' }]} onChange={() => {}} />)
    expect(screen.getByRole('option', { name: /Nobody pays, or it is not clear yet/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /^b\. / })).toBeNull()
    expect(screen.getByText(/For wood, sawdust, forest or paper-mill residues/)).toBeInTheDocument()
  })

  it('keeps the analyst labels in expert mode', () => {
    render(<FlowsEditor flows={[{ id: 'f1', name: 'sawdust' }]} onChange={() => {}} />)
    expect(screen.getByRole('option', { name: /^b\. / })).toBeInTheDocument()
  })

  it('hides the Q-code of a question in guided mode', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    render(<QuestionCard id="q9" title="Q9 — Which decision?" help="h">x</QuestionCard>)
    expect(screen.getByRole('heading', { name: 'Which decision?' })).toBeInTheDocument()
    expect(screen.queryByText('Q9')).toBeNull()
  })
})
