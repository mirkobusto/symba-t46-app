import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DialogHost from '../components/DialogHost'
import i18n from '../i18n'
import ResultPage from '../pages/ResultPage'
import { useAuthStore } from '../store/authStore'
import { useCaseStore } from '../store/caseStore'
import type { Case } from '../types/api'

const RESULT: Case = {
  q1: 'B', q2: 'A', decision_context: 'none', q3: { env: true, eco: true, soc: false }, q4: ['B'],
  flows: [{ id: 'f1', name: 'Beet pulp', q5: 'c' }], sites: [], alternative_scenarios: [], advanced: {},
  ilcd_situation: 'ILCD Situation C1', lcc_type: 'C+E', slca_activation_state: 'deactivated',
  activated_nodes: [], blocked_by: [], applicable_rules: [], cdp_flags: [],
}

function respond(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status < 400, status, statusText: 'x',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)
}

// A reopened case could only be "saved as new"; "Save changes" updates it in
// place (UX round 5, D3), and never with an empty name (Fable review of #202).
describe('Save changes on the result page', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    await i18n.changeLanguage('en')
    fetchMock = vi.fn((url: string, init?: RequestInit) => {
      const u = String(url)
      if (u.includes('/health')) return respond({ status: 'ok', anonymous_save: false })
      if (u.includes('/api/cases/c-1') && (!init || !init.method || init.method === 'GET')) {
        return respond({ id: 'c-1', name: 'Dairy district', case: RESULT })
      }
      if (u.includes('/api/cases/c-1') && init?.method === 'PUT') {
        const body = JSON.parse(String(init.body))
        return respond({ id: 'c-1', name: body.name, case: body.case })
      }
      return respond({ detail: 'not found' }, 404)
    })
    vi.stubGlobal('fetch', fetchMock)
    useAuthStore.setState({ token: 't', user: { email: 'a@b.c', role: 'user' } } as never)
    useCaseStore.setState({ result: RESULT, draft: RESULT, serverCaseId: 'c-1', serverCaseName: null, savedDiverged: true } as never)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    useAuthStore.setState({ token: null, user: null } as never)
  })

  it('updates the open case, fetching its name when the browser lost it', async () => {
    render(<MemoryRouter><ResultPage /><DialogHost /></MemoryRouter>)
    fireEvent.click(screen.getAllByRole('button', { name: 'Save changes' })[0])
    expect(await screen.findByText(/Overwrite the saved case "Dairy district"/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(useCaseStore.getState().savedDiverged).toBe(false))
    const put = fetchMock.mock.calls.find(([, init]) => (init as RequestInit | undefined)?.method === 'PUT')
    expect(put).toBeDefined()
    expect(JSON.parse(String((put![1] as RequestInit).body)).name).toBe('Dairy district')
    expect(useCaseStore.getState().serverCaseName).toBe('Dairy district')
  })
})
