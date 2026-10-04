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

  const q9Select = () =>
    document.querySelector('section[aria-labelledby="q9-title"] select') as HTMLSelectElement

  it('offers the three answers plus "not answered", unanswered by default', () => {
    expect(q9Select().value).toBe('')
    expect(Array.from(q9Select().options).map((o) => o.value)).toEqual(['', 'none', 'micro', 'structural'])
  })

  it('sends the chosen scale', async () => {
    fireEvent.change(q9Select(), { target: { value: 'structural' } })
    fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].decision_context).toBe('structural')
  })

  it('sends null when left unanswered', async () => {
    fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].decision_context).toBeNull()
  })
})
