import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '../App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(JSON.stringify({ status: 'ok' })),
          json: () => Promise.resolve({ status: 'ok', version: '0.0.1' }),
        } as unknown as Response),
      ),
    )
    localStorage.clear()
  })

  it('renders the home page heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        name: /SYMBA T4\.6 — IS Assessment Tool/i,
      }),
    ).toBeInTheDocument()
  })
})
