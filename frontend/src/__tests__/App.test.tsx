import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
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

  it('renders the home page heading on /', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        name: /SYMBA T4\.6 — IS Assessment Tool/i,
      }),
    ).toBeInTheDocument()
  })
})
