import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q7 is the concentration of the key interactions (three answers since
// 2026-10-18, D4.1 §12.2.3); Q7b names the reference market (D4.1 §11.3.1).
describe('Questionnaire Q7 — interactions and reference market', () => {
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

  it('offers three answers', () => {
    const values = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="q7"]')).map((r) => r.value)
    expect(values).toEqual(['A', 'B', 'C'])
  })

  it('sends the reference market, trimmed, and null when left empty', async () => {
    fireEvent.change(document.querySelector('input[name="q7-market-region"]')!, { target: { value: '  Italy ' } })
    fireEvent.click(document.querySelector('input[name="q7-market-scope"][value="national"]')!)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].reference_market_region).toBe('Italy')
    expect(bodies[0].reference_market_scope).toBe('national')
  })

  it('sends null when the reference market is not given', async () => {
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].reference_market_region).toBeNull()
    expect(bodies[0].reference_market_scope).toBeNull()
  })
})
