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

  it('sends a first visit on / to the welcome page', () => {
    render(<App />)
    // EN default; the title lost "T4.6" in the UX round of 2026-11-02
    expect(
      screen.getByRole('heading', {
        name: /Welcome to SYMBA/i,
      }),
    ).toBeInTheDocument()
  })
})
