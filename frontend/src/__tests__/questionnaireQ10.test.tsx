import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q10 (public objective or public decision-maker, D4.2 §2.2-2.3) is required
// since 2026-10-18 when the economic dimension is on, and hidden without it.
describe('Questionnaire Q10 — public objective', () => {
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
    fireEvent.click(screen.getByLabelText(/Economic \(LCC\)/))
    // Q9 is required since 2026-10-15
    fireEvent.click(document.querySelector('input[name="q9"][value="micro"]')!)
  })

  const q10Radios = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>('section[aria-labelledby="q10-title"] input[type="radio"]'),
    )
  const q10Pick = (value: string) =>
    fireEvent.click(q10Radios().find((r) => r.value === value)!)
  const run = () => fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))

  it('offers yes and no, and keeps the run button disabled until answered', () => {
    expect(q10Radios().map((r) => r.value)).toEqual(['yes', 'no'])
    expect(q10Radios().filter((r) => r.checked)).toEqual([])
    const button = screen.getByRole('button', { name: /work out the configuration/i })
    expect(button).toBeDisabled()
    q10Pick('no')
    expect(button).toBeEnabled()
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

  it('is hidden, and sent as null, without the economic dimension', async () => {
    fireEvent.click(screen.getByLabelText(/Economic \(LCC\)/))
    expect(q10Radios()).toEqual([])
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].policy_objective).toBeNull()
  })
})
