import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q12 — new dedicated shared assets (D4.2 §4.2, D4.1 §6.3.3), asked when LCA or
// LCC is on (2026-10-18).
describe('Questionnaire Q12 — dedicated shared assets', () => {
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

  it('sends the answer as a boolean', async () => {
    fireEvent.click(document.querySelector('input[name="q12"][value="yes"]')!)
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].dedicated_shared_assets).toBe(true)
  })

  it('is hidden, and sent as null, for a social-only study', async () => {
    // switch to social only
    fireEvent.click(screen.getByLabelText(/Social \(S-LCA\)/))
    fireEvent.click(screen.getByLabelText(/Environmental \(LCA\)/))
    expect(document.querySelector('input[name="q12"]')).toBeNull()
    run()
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].dedicated_shared_assets).toBeNull()
  })
})
