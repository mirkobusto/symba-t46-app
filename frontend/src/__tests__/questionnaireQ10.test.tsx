import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q10 (policy / territorial planning purpose) is optional: unanswered must reach
// the API as null (the LCC type is then inferred from Q1, as before Q10 existed).
describe('Questionnaire Q10 — policy purpose', () => {
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

  const q10Radios = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>('section[aria-labelledby="q10-title"] input[type="radio"]'),
    )
  const q10Pick = (value: string) =>
    fireEvent.click(q10Radios().find((r) => r.value === value)!)
  const run = () => fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))

  it('offers yes, no and "not answered", unanswered by default', () => {
    expect(q10Radios().map((r) => r.value)).toEqual(['', 'yes', 'no'])
    expect(q10Radios().filter((r) => r.checked).map((r) => r.value)).toEqual([''])
  })

  it.each([
    ['yes', true],
    ['no', false],
  ])('sends %s as a boolean', async (value, expected) => {
    q10Pick(value)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].policy_objective).toBe(expected)
  })

  it('sends null when left unanswered', async () => {
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].policy_objective).toBeNull()
  })
})
