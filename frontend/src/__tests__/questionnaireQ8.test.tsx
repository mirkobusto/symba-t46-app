import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q8 (asset lifetime) is optional: empty must reach the API as null (the
// engine then behaves as before Q8 existed), a number must reach it as a number.
describe('Questionnaire Q8 — asset lifetime', () => {
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
  })

  const q8Input = () =>
    document.querySelector('section[aria-labelledby="q8-title"] input[type="number"]')

  function renderPage() {
    render(
      <MemoryRouter>
        <QuestionnairePage />
      </MemoryRouter>,
    )
    fireEvent.click(document.querySelector('input[name="q1"][value="A"]')!)
    // a reset store has no Q3 dimension on, and the run button needs one
    fireEvent.click(screen.getByLabelText(/Environmental \(LCA\)/))
  }

  it('shows the Q8 field, empty by default', () => {
    renderPage()
    const input = q8Input() as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('sends a number when answered', async () => {
    renderPage()
    const input = q8Input() as HTMLInputElement
    fireEvent.change(input, { target: { value: '25' } })
    fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].asset_lifetime_years).toBe(25)
  })

  it('sends null when left empty', async () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /run pipeline/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].asset_lifetime_years).toBeNull()
  })
})
