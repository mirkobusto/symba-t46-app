import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q0 — purpose of the study (D4.1 §4.3.2), optional; it derives nothing (2026-10-18).
describe('Questionnaire Q0 — study purpose', () => {
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
          json: () => Promise.resolve({ ilcd_situation: 'ILCD Situation A' }),
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
    fireEvent.click(document.querySelector('section[aria-labelledby="q9-title"] input[value="micro"]')!)
  })

  const run = () => fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))

  it('offers the five purposes plus "not answered", and sends the choice', async () => {
    const values = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="q0"]')).map((r) => r.value)
    expect(values).toEqual(['', 'analysis', 'improvement', 'expansion', 'design', 'restructuring'])
    fireEvent.click(document.querySelector('input[name="q0"][value="expansion"]')!)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].study_purpose).toBe('expansion')
  })

  it('sends null when not answered', async () => {
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].study_purpose).toBeNull()
  })
})
