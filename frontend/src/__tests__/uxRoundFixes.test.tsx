import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import DialogHost from '../components/DialogHost'
import PresetLoader from '../components/PresetLoader'
import StakeholderView from '../components/StakeholderView'
import QuestionnairePage from '../pages/QuestionnairePage'
import { answersFor } from '../pages/resultActions'
import { useCaseStore } from '../store/caseStore'
import type { Case } from '../types/api'

// Bugs found by the agent UX round of 2026-11-02.

describe('Questionnaire — flows have no preset Q5', () => {
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
  })

  const runButton = () => screen.getByRole('button', { name: /work out the configuration/i })

  it('names every missing required answer, Q9 included, not only Q1', () => {
    expect(screen.getByText(/Still to answer:/)).toBeTruthy()
    expect(screen.getByRole('link', { name: /What are you analyzing\?/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Which decision does the study support/ })).toBeTruthy()
    // every link points at a card that exists
    for (const link of screen.getAllByRole('link', { name: /analyzing|dimensions|study support/ })) {
      expect(document.getElementById(link.getAttribute('href')!.slice(1))).toBeTruthy()
    }
    expect((runButton() as HTMLButtonElement).disabled).toBe(true)
  })

  it('adds a flow with no answer and does not run until who pays whom is chosen', async () => {
    fireEvent.click(document.querySelector('input[name="q1"][value="A"]')!)
    fireEvent.click(screen.getByLabelText(/Environmental \(LCA\)/))
    fireEvent.click(document.querySelector('section[aria-labelledby="q9-title"] input[value="micro"]')!)
    expect((runButton() as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: /add flow/i }))
    const q5 = screen.getByRole('combobox', { name: 'Who pays whom (Q5)' }) as HTMLSelectElement
    expect(q5.value).toBe('')
    expect((runButton() as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('link', { name: /who pays whom, for every flow/ })).toBeTruthy()

    fireEvent.change(q5, { target: { value: 'b' } })
    fireEvent.click(runButton())
    await waitFor(() => expect(bodies.length).toBe(1))
    expect((bodies[0].flows as Array<{ q5: string }>)[0].q5).toBe('b')
  })
})

describe('StakeholderView with no case', () => {
  it('says no case is open, and nothing about a study that does not exist', () => {
    const empty: Case = { q3: { env: false, eco: false, soc: false }, q4: [], flows: [], sites: [] }
    render(<StakeholderView stakeholderType="authority" caseData={empty} scoring={null} />)
    expect(screen.getByText(/No case is open/)).toBeTruthy()
    expect(screen.queryByText(/environmental dimension was switched off/)).toBeNull()
    expect(screen.queryByText(/Independent peer review/)).toBeNull()
  })
})

describe('answersFor — Q8 named in words', () => {
  it('cites the asset lifetime that triggered CIR-01, not only the TRL', () => {
    const kase: Case = {
      q1: 'B', q3: { env: true, eco: true, soc: false }, q4: [], flows: [], sites: [],
      q6b: 'TRL9', operating_start: 'now', asset_lifetime_years: 30,
    }
    const trigger = 'operating start in a future year OR Q6b < TRL7 OR analysis period or asset lifetime > 15y'
    expect(answersFor(trigger, kase)).toEqual([
      { label: 'Q6b', value: 'TRL9' },
      { label: 'Q8a', value: 'now' },
      { label: 'Q8c', value: '30 y' },
    ])
  })
})

describe('PresetLoader', () => {
  afterEach(() => vi.restoreAllMocks())

  it('asks before replacing a case being built', async () => {
    useCaseStore.getState().reset()
    useCaseStore.getState().setDraft({
      ...useCaseStore.getState().draft,
      q1: 'B',
      flows: [{ id: 'f1', name: 'lignin', q5: 'c' }],
    })
    render(
      <MemoryRouter>
        <PresetLoader />
        <DialogHost />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /load preset/i }))
    // an in-app dialog since 2026-11-03, not window.confirm
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(useCaseStore.getState().draft.flows?.[0].name).toBe('lignin')
  })
})
