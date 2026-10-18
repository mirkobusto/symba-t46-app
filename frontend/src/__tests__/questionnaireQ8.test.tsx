import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q8 (time horizon) is optional: empty fields must reach the API as null, numbers
// as numbers. Q8a (operating year), Q8b (analysis period), Q8c (asset lifetime).
describe('Questionnaire Q8 — time horizon', () => {
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
  })

  const q8Input = () =>
    document.querySelector('section[aria-labelledby="q8-title"] input[data-field="asset-lifetime"]')
  const q8 = (field: string) =>
    document.querySelector(`section[aria-labelledby="q8-title"] input[data-field="${field}"]`) as HTMLInputElement | null

  function renderPage() {
    render(
      <MemoryRouter>
        <QuestionnairePage />
      </MemoryRouter>,
    )
    fireEvent.click(document.querySelector('input[name="q1"][value="A"]')!)
    // a reset store has no Q3 dimension on, and the run button needs one
    fireEvent.click(screen.getByLabelText(/Environmental \(LCA\)/))
    // Q9 is required since 2026-10-15
    fireEvent.click(document.querySelector('input[name="q9"][value="micro"]')!)
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
    fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].asset_lifetime_years).toBe(25)
  })

  it('sends null when left empty', async () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].asset_lifetime_years).toBeNull()
    expect(bodies[0].analysis_period_years).toBeNull()
    expect(bodies[0].operating_start).toBeNull()
    expect(bodies[0].operating_start_year).toBeNull()
  })

  it('asks the year only for a future operating year, and sends it', async () => {
    renderPage()
    expect(q8('operating-start-year')).toBeNull()
    fireEvent.click(document.querySelector('input[name="q8-start"][value="future"]')!)
    fireEvent.change(q8('operating-start-year')!, { target: { value: '2030' } })
    fireEvent.change(q8('analysis-period')!, { target: { value: '25' } })
    fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].operating_start).toBe('future')
    expect(bodies[0].operating_start_year).toBe(2030)
    expect(bodies[0].analysis_period_years).toBe(25)
  })

  it('sends "now" without a year', async () => {
    renderPage()
    fireEvent.click(document.querySelector('input[name="q8-start"][value="now"]')!)
    fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].operating_start).toBe('now')
    expect(bodies[0].operating_start_year).toBeNull()
  })
})
