import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q11 (what the study compares) is optional and sets the functional-unit basis
// (D4.1 Part 2 §4.3, §6.3, §8.3); unanswered must reach the API as null.
describe('Questionnaire Q11 — comparison goal', () => {
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
    fireEvent.click(document.querySelector('input[name="q9"][value="micro"]')!)
  })

  const radios = () =>
    Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="q11"]'))
  const run = () => fireEvent.click(screen.getByRole('button', { name: /work out the pathway/i }))

  it('offers the three goals and "not answered", unanswered by default', () => {
    expect(radios().map((r) => r.value)).toEqual(['', 'waste_treatment', 'product_substitution', 'co_primary'])
    expect(radios().filter((r) => r.checked).map((r) => r.value)).toEqual([''])
  })

  it('sends the chosen goal', async () => {
    fireEvent.click(radios().find((r) => r.value === 'product_substitution')!)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].comparison_goal).toBe('product_substitution')
  })

  it('sends null when left unanswered', async () => {
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].comparison_goal).toBeNull()
  })
})
