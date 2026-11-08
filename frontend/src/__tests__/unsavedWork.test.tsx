import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DialogHost from '../components/DialogHost'
import i18n from '../i18n'
import HomePage from '../pages/HomePage'
import QuestionnairePage from '../pages/QuestionnairePage'
import { ApiError } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { answersFingerprint, isBlankDraft, useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { useDialogStore } from '../store/dialogStore'
import { clearLocalWork, handleCaseGone, hasUnsavedWork } from '../store/signOut'
import type { Case } from '../types/api'

// UX round 6: signing out with answers changed and not worked out again lost
// them without a word (P7-03); "Start new assessment" emptied the answers
// without asking (P1-09, P7-04); a deleted case stayed open and every action
// failed with "Case '<uuid>' not found" (P7-01).

/** A case as GET /api/cases/{id} returns it: unanswered questions are null. */
const SAVED: Case = {
  study_purpose: null, q1: 'B', q2: 'A', network_long_standing: null,
  q3: { env: true, eco: true, soc: false }, q4: ['E'],
  flows: [{ id: 'f1', name: 'Whey', q5: 'c', sellable_elsewhere: null, sector: null, configuration: null }],
  alternative_scenarios: [], q6a: null, q6b: 'TRL9', q7: 'B',
  reference_market_region: 'Italy', reference_market_scope: 'national',
  operating_start: null, operating_start_year: null, analysis_period_years: null, asset_lifetime_years: null,
  decision_context: 'micro', market_screening_documented: null, policy_objective: false,
  comparison_goal: null, dedicated_shared_assets: false, advanced: {}, sites: [],
  ilcd_situation: 'ILCD Situation A', lcc_type: 'C+E', activated_nodes: ['lca_mc_01'],
}

function loadSaved() {
  useCaseStore.getState().setDraft(SAVED)
  useCaseStore.getState().setServerCase('case-1', 'Dairy', SAVED)
}

function renderQuestionnaire() {
  return render(<MemoryRouter><QuestionnairePage /><DialogHost /></MemoryRouter>)
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
  clearLocalWork()
  useDialogStore.setState({ current: null })
})

afterEach(() => {
  useAuthStore.setState({ token: null, user: null } as never)
  vi.unstubAllGlobals()
})

describe('what counts as unsaved work', () => {
  it('a saved case opened and left untouched in the questionnaire is not', () => {
    loadSaved()
    expect(hasUnsavedWork()).toBe(false)
    const { unmount } = renderQuestionnaire()
    expect(hasUnsavedWork()).toBe(false)
    unmount()
    expect(hasUnsavedWork()).toBe(false)
  })

  it('an answer changed on screen and not worked out again is (P7-03)', () => {
    loadSaved()
    renderQuestionnaire()
    fireEvent.click(screen.getByLabelText(/Social \(S-LCA\)/))
    // the questionnaire has not written it to the draft yet: asking writes it
    expect(useCaseStore.getState().draft.q3?.soc).toBe(false)
    expect(hasUnsavedWork()).toBe(true)
    expect(useCaseStore.getState().draft.q3?.soc).toBe(true)
  })

  it('a blank browser, or only the default dimension ticked, is not', () => {
    expect(isBlankDraft({})).toBe(true)
    expect(isBlankDraft({ q3: { env: true, eco: false, soc: false }, q4: [], flows: [], advanced: {} })).toBe(true)
    expect(isBlankDraft({ q1: 'B' })).toBe(false)
  })

  it('compares answers, not the engine output nor null against absent', () => {
    expect(answersFingerprint({ ...SAVED, lca: { x: 1 }, activated_nodes: [] })).toBe(answersFingerprint(SAVED))
    expect(answersFingerprint({ ...SAVED, q6a: undefined, q4: ['E'] })).toBe(answersFingerprint(SAVED))
    expect(answersFingerprint({ ...SAVED, q7: 'C' })).not.toBe(answersFingerprint(SAVED))
  })
})

describe('putting the case away', () => {
  it('a reset while the questionnaire is open is not undone when the page is left (A1-01)', () => {
    loadSaved()
    const { unmount } = renderQuestionnaire()
    fireEvent.click(screen.getByLabelText(/Social \(S-LCA\)/))
    act(() => {
      clearLocalWork()
      unmount()
    })
    expect(isBlankDraft(useCaseStore.getState().draft)).toBe(true)
    expect(useCaseStore.getState().serverCaseId).toBeNull()
  })

  it('"Start a new assessment" on Home asks before emptying unsaved answers (P1-09)', async () => {
    useCaseStore.getState().patchDraft({ q1: 'B' })
    render(<MemoryRouter><HomePage /><DialogHost /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Start a new assessment/ }))
    expect(await screen.findByText(/Start a new assessment\? What you are working on is not saved/)).toBeInTheDocument()
    expect(useCaseStore.getState().draft.q1).toBe('B')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(useDialogStore.getState().current).toBeNull())
    expect(useCaseStore.getState().draft.q1).toBe('B')
  })

  it('says the saved copy stays when the open case has changes (P7-21)', async () => {
    loadSaved()
    useCaseStore.getState().patchDraft({ q7: 'C' })
    render(<MemoryRouter><HomePage /><DialogHost /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Start a new assessment/ }))
    expect(await screen.findByText(/the saved copy stays in My cases/)).toBeInTheDocument()
  })

  it('the questionnaire says which saved case it edits (P6-14)', () => {
    loadSaved()
    renderQuestionnaire()
    expect(screen.getByText(/You are editing the saved case “Dairy”/)).toBeInTheDocument()
  })
})

describe('a case deleted while open (P7-01)', () => {
  it('keeps its answers and its network as a case not saved yet', () => {
    useAuthStore.setState({ token: 't', user: { email: 'a@b.c', role: 'user' } } as never)
    loadSaved()
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('Dairy')
    expect(handleCaseGone(new ApiError(404, "Case 'case-1' not found"))).toBe(true)
    const kase = useCaseStore.getState()
    expect(kase.serverCaseId).toBeNull()
    expect(kase.deletedCaseName).toBe('Dairy')
    expect(kase.draft.q1).toBe('B')
    const dcf = useDcfDataStore.getState()
    expect(dcf.caseId).toBeNull()
    expect(dcf.data.rows_by_section.actors).toHaveLength(1)
    // binding the page to "no case" afterwards keeps the drawing
    dcf.bindTo(null)
    expect(useDcfDataStore.getState().data.rows_by_section.actors).toHaveLength(1)
    expect(hasUnsavedWork()).toBe(true)
  })

  it('is not assumed when the session expired, nor for a network never saved', () => {
    loadSaved()
    expect(handleCaseGone(new ApiError(404, "Case 'case-1' not found"))).toBe(false)
    useAuthStore.setState({ token: 't', user: { email: 'a@b.c', role: 'user' } } as never)
    expect(handleCaseGone(new ApiError(404, "No DCF content stored for case 'case-1'"))).toBe(false)
    expect(useCaseStore.getState().serverCaseId).toBe('case-1')
  })
})

describe('discarding the network changes (P7-02)', () => {
  function respond(status: number, body: unknown) {
    return Promise.resolve({
      ok: status < 400, status, statusText: '',
      json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)),
    } as Response)
  }

  it('brings back the network saved on the server', async () => {
    const saved = { schema_version: '1.1', case_id: 'case-1', layout: {},
      rows_by_section: { actors: [{ row_id: 'a1', values: { 'actor.name': 'Saved dairy' } }] } }
    vi.stubGlobal('fetch', vi.fn(() => respond(200, { data: saved, validation: null })))
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('Example plant')
    expect(useDcfDataStore.getState().dirty).toBe(true)
    expect(await useDcfDataStore.getState().discardChanges()).toBe(true)
    const st = useDcfDataStore.getState()
    expect(st.dirty).toBe(false)
    expect(st.data.rows_by_section.actors?.[0].values['actor.name']).toBe('Saved dairy')
  })

  it('empties the canvas when no network was ever saved', async () => {
    vi.stubGlobal('fetch', vi.fn(() => respond(404, { detail: "No DCF content stored for case 'case-1'" })))
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('Example plant')
    expect(await useDcfDataStore.getState().discardChanges()).toBe(true)
    expect(useDcfDataStore.getState().data.rows_by_section.actors ?? []).toHaveLength(0)
    expect(useDcfDataStore.getState().dirty).toBe(false)
  })
})
