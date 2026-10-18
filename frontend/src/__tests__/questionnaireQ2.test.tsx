import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q2 has two answers since 2026-10-18 (the exchanges take place / not yet, D4.1
// §11.1). Q2b, asked only when they take place, is the long-standing network of
// D4.1 §11.2.2. Alternative scenarios are open to every study (D4.1 §4.3.3).
describe('Questionnaire Q2 — do the exchanges already take place?', () => {
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

  const q2Values = () =>
    Array.from(document.querySelectorAll<HTMLInputElement>('input[name="q2"]')).map((r) => r.value)
  const run = () => fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))

  it('offers two answers', () => {
    expect(q2Values()).toEqual(['A', 'B'])
  })

  it('asks whether the network is long-standing only when the exchanges take place', async () => {
    expect(document.querySelector('input[name="q2-long-standing"]')).toBeNull()
    fireEvent.click(document.querySelector('input[name="q2"][value="B"]')!)
    expect(document.querySelector('input[name="q2-long-standing"]')).toBeNull()
    fireEvent.click(document.querySelector('input[name="q2"][value="A"]')!)
    fireEvent.click(document.querySelector('input[name="q2-long-standing"][value="yes"]')!)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].q2).toBe('A')
    expect(bodies[0].network_long_standing).toBe(true)
  })

  it('does not send Q2b when the exchanges do not take place yet', async () => {
    fireEvent.click(document.querySelector('input[name="q2"][value="A"]')!)
    fireEvent.click(document.querySelector('input[name="q2-long-standing"][value="no"]')!)
    fireEvent.click(document.querySelector('input[name="q2"][value="B"]')!)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].q2).toBe('B')
    expect(bodies[0].network_long_standing).toBeNull()
  })

  it("does not ask or send Q2b for one company's accounts (C2)", async () => {
    fireEvent.click(document.querySelector('input[name="q2"][value="A"]')!)
    fireEvent.click(document.querySelector('input[name="q2-long-standing"][value="yes"]')!)
    fireEvent.click(document.querySelector('section[aria-labelledby="q9-title"] input[value="corporate_report"]')!)
    expect(document.querySelector('input[name="q2-long-standing"]')).toBeNull()
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].network_long_standing).toBeNull()
  })

  it('shows the alternative scenarios to every study', () => {
    expect(document.querySelector('section[aria-labelledby="q2d-scenarios-title"]')).not.toBeNull()
  })
})
