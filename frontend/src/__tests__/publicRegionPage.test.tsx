import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import PublicRegionPage from '../pages/reader/PublicRegionPage'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/r/region/:code" element={<PublicRegionPage />} /></Routes>
    </MemoryRouter>,
  )
}

// Kimi test 2026-11-04, A6-02 / A6-03
describe('PublicRegionPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('says a code is not a country instead of showing an empty dashboard', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderAt('/r/region/XX')
    expect(screen.getByText('Unknown country code')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('says when no shared case has a partner in the country yet', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ region: 'FR', total: 0, by_ilcd_situation: [], by_sector: [] }),
    } as Response)))
    renderAt('/r/region/FR')
    expect(await screen.findByText('No shared case has a company in this country yet.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
