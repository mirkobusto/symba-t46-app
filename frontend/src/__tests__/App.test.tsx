import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import '../i18n'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'ok', version: '0.0.1' }),
        } as Response),
      ),
    )
  })

  // the welcome wizard was removed on 2026-11-09 (owner): a first visit opens Home
  it('opens a first visit on the Home page', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        name: /SYMBA: assessing industrial symbiosis/i,
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Welcome to SYMBA/i })).toBeNull()
  })
})
