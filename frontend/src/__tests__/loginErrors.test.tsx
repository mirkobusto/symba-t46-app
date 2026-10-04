import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import LoginPage from '../pages/LoginPage'

// The server refuses in English ("Registration is closed", ...). The three refusals a visitor can
// meet on a public instance are shown in the interface language, not as raw server text.
function refuseWith(status: number, detail: string) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: false,
        status,
        statusText: 'x',
        json: () => Promise.resolve({ detail }),
        text: () => Promise.resolve(JSON.stringify({ detail })),
      } as Response),
    ),
  )
}

async function submit(tab: 'Sign in' | 'Create account') {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
  fireEvent.click(screen.getByRole('tab', { name: tab }))
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'someone@example.eu' } })
  fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'hunter2-strong' } })
  fireEvent.click(screen.getAllByRole('button', { name: tab }).find((b) => b.getAttribute('type') === 'submit')!)
}

describe('LoginPage refusals', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })
  afterEach(() => vi.unstubAllGlobals())

  it('explains a closed registration', async () => {
    refuseWith(403, 'Registration is closed')
    await submit('Create account')
    expect(await screen.findByText(/Registration is closed on this instance/)).toBeInTheDocument()
  })

  it('explains an address that is already registered', async () => {
    refuseWith(400, "Email 'someone@example.eu' already registered")
    await submit('Create account')
    expect(await screen.findByText(/already exists. Try signing in/)).toBeInTheDocument()
  })

  it('says wrong email or password on a refused sign-in', async () => {
    refuseWith(401, 'Invalid credentials')
    await submit('Sign in')
    expect(await screen.findByText('Wrong email or password.')).toBeInTheDocument()
  })

  it('translates with the interface language', async () => {
    await i18n.changeLanguage('it')
    refuseWith(403, 'Registration is closed')
    await submit('Crea account' as 'Create account')
    await waitFor(() =>
      expect(screen.getByText(/La registrazione è chiusa su questa istanza/)).toBeInTheDocument(),
    )
  })
})
