import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import CasesListPage from '../pages/CasesListPage'
import { deleteCase } from '../services/api'
import { useAuthStore } from '../store/authStore'

// Anonymous saving is off by default on the server (2026-11-02).

const json = (body: unknown) =>
  ({ ok: true, status: 200, statusText: 'OK', json: () => Promise.resolve(body) }) as Response

describe('anonymous saving off', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    useAuthStore.getState().clearSession()
  })

  it('sends the token when deleting, so an owner can delete their own case', async () => {
    useAuthStore.getState().setSession('tok', { id: 'u1', email: 'a@b.eu', role: 'analyst' } as never)
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true, status: 204 } as Response))
    vi.stubGlobal('fetch', fetchMock)
    await deleteCase('c1')
    const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok')
  })

  it('tells a visitor who has not signed in why "My cases" is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve(
          String(url).endsWith('/health')
            ? json({ status: 'ok', version: 'x', anonymous_save: false })
            : json([]),
        ),
      ),
    )
    render(
      <MemoryRouter>
        <CasesListPage />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText(/appear here once you sign in/)).toBeTruthy())
  })
})
