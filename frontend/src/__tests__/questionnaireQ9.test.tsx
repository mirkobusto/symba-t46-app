import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q9 (decision and scale) is optional: unanswered must reach the API as null
// (the engine then infers the ILCD situation from Q1, as before Q9 existed).
describe('Questionnaire Q9 — decision and scale', () => {
  let bodies: Array<Record<string, unknown>>

  beforeEach(() => {
    bodies = []
    useCaseStore.getState().reset()
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        if (init?.body) bodies.push(JSON.parse(String(init.body)))
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ pathway_id: 'IS-01' }),
        } as Response)
      }),
    )
    render(
      <MemoryRouter>
        <QuestionnairePage />
      </MemoryRouter>,
    )
    fireEvent.click(document.querySelector('input[name="q1"][value="A"]')!)
    fireEvent.click(screen.getByLabelText(/Environmental \(LCA\)/))
  })

  // The answers are whole sentences: radios let them wrap, a native dropdown cuts them off.
  const q9Radios = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>('section[aria-labelledby="q9-title"] input[type="radio"]'),
    )
  const q9Pick = (value: string) =>
    fireEvent.click(q9Radios().find((r) => r.value === value)!)

  it('offers the three answers plus "not answered", unanswered by default', () => {
    expect(q9Radios().map((r) => r.value)).toEqual(['', 'none', 'micro', 'structural'])
    expect(q9Radios().filter((r) => r.checked).map((r) => r.value)).toEqual([''])
    expect(document.querySelector('section[aria-labelledby="q9-title"] select')).toBeNull()
  })

  it('sends the chosen scale', async () => {
    q9Pick('structural')
    fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].decision_context).toBe('structural')
  })

  it('shows each answer in full, not cut to a short label', () => {
    const labels = Array.from(
      document.querySelectorAll('section[aria-labelledby="q9-title"] .opt-label'),
    ).map((e) => e.textContent)
    expect(labels).toContain(
      'Yes, with large-scale consequences: displaces about 1% or more of the annual new build in the affected market (Situation B; the proof must be documented)',
    )
  })

  it('sends null when left unanswered', async () => {
    fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].decision_context).toBeNull()
  })
})
