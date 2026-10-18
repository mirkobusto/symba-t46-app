import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'

// Q9 (decision and scale) is required since 2026-10-15: the ILCD situation
// follows it (D4.1 Table 1), not Q1. A structural answer asks for the market
// screening (D4.1 §11.3.1).
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
  })

  // The answers are whole sentences: radios let them wrap, a native dropdown cuts them off.
  const q9Radios = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>('section[aria-labelledby="q9-title"] input[type="radio"]'),
    )
  const q9Pick = (value: string) =>
    fireEvent.click(q9Radios().find((r) => r.value === value)!)

  it('offers the four answers, none chosen by default', () => {
    expect(q9Radios().map((r) => r.value)).toEqual(['micro', 'structural', 'none', 'corporate_report'])
    expect(q9Radios().filter((r) => r.checked)).toEqual([])
    expect(document.querySelector('section[aria-labelledby="q9-title"] select')).toBeNull()
  })

  it('keeps the run button disabled until Q9 is answered', () => {
    expect(screen.getByRole('button', { name: /work out the configuration/i })).toBeDisabled()
    q9Pick('micro')
    expect(screen.getByRole('button', { name: /work out the configuration/i })).toBeEnabled()
  })

  it('sends the chosen answer, with no screening unless structural', async () => {
    q9Pick('corporate_report')
    fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].decision_context).toBe('corporate_report')
    expect(bodies[0].market_screening_documented).toBeNull()
  })

  it('asks for the market screening only with a structural answer, and sends it', async () => {
    expect(document.querySelector('input[name="q9-screening"]')).toBeNull()
    q9Pick('structural')
    fireEvent.click(document.querySelector('input[name="q9-screening"][value="no"]')!)
    fireEvent.click(screen.getByRole('button', { name: /work out the configuration/i }))
    await waitFor(() => expect(bodies.length).toBe(1))
    expect(bodies[0].decision_context).toBe('structural')
    expect(bodies[0].market_screening_documented).toBe(false)
  })

  it('shows each answer in full, not cut to a short label', () => {
    const labels = Array.from(
      document.querySelectorAll('section[aria-labelledby="q9-title"] .opt-label'),
    ).map((e) => e.textContent)
    expect(labels).toContain(
      'Strict reporting of one company in isolation (ESG / CSRD), with no credit for what the symbiosis avoids elsewhere (Situation C2)',
    )
  })
})
