import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DialogHost from '../components/DialogHost'
import i18n from '../i18n'
import CasesListPage from '../pages/CasesListPage'
import { useAuthStore } from '../store/authStore'
import { useCaseStore } from '../store/caseStore'

function respond(body: unknown) {
  return Promise.resolve({
    ok: true, status: 200, statusText: 'OK',
    json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)
}

// "Load" replaced unsaved answers without asking — also when the case loaded
// is the open one, worked out again and not saved (UX round 5, P7-09; Fable
// review of #205).
describe('My cases: Load asks before dropping unsaved answers', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (String(url).includes('/health')) return respond({ status: 'ok', anonymous_save: false })
      return respond([{ id: 'c1', name: 'Dairy', slug: 'dairy', ilcd_situation: null,
        created_at: '2026-11-03T10:00:00', updated_at: '2026-11-03T10:00:00', shared_at: null }])
    }))
    useAuthStore.setState({ token: 't', user: { email: 'a@b.c', role: 'user' } } as never)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    useAuthStore.setState({ token: null, user: null } as never)
  })

  it('asks when the open case was worked out again and not saved', async () => {
    useCaseStore.setState({ draft: { q1: 'B' }, serverCaseId: 'c1', savedDiverged: true } as never)
    render(<MemoryRouter><CasesListPage /><DialogHost /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Load' }))
    expect(await screen.findByText(/replaces the answers you are working on/)).toBeInTheDocument()
  })
})
