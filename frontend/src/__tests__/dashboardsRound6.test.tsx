// UX round 6, theme J: country pages, the cases dashboard, funding bodies,
// the privacy notice at registration (P3-08, P7-23, P4-20, P3-15, P3-14, P4-14).

import '@testing-library/jest-dom'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import AboutPage from '../pages/AboutPage'
import AggregatePage from '../pages/AggregatePage'
import LoginPage from '../pages/LoginPage'
import PrivacyPage from '../pages/PrivacyPage'
import PublicRegionPage from '../pages/reader/PublicRegionPage'

function stubFetch(byUrl: Record<string, unknown>) {
  vi.stubGlobal('fetch', vi.fn((url: string) => {
    const key = Object.keys(byUrl).find((k) => String(url).includes(k))
    return Promise.resolve({
      ok: key !== undefined, status: key ? 200 : 404,
      json: () => Promise.resolve(key ? byUrl[key] : { detail: 'not found' }),
    } as Response)
  }))
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})
afterEach(() => vi.unstubAllGlobals())

describe('country page', () => {
  function renderAt(path: string) {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes><Route path="/r/region/:code" element={<PublicRegionPage />} /></Routes>
      </MemoryRouter>,
    )
  }

  const IT = {
    region: 'IT', total: 2,
    by_ilcd_situation: [{ key: '(none)', count: 1 }, { key: 'ILCD Situation A', count: 1 }],
    by_sector: [{ key: '(none)', count: 2 }],
    cases: [
      { key: 'valle-del-formaggio-1a2b3c4d', name: 'Valle del formaggio', shared_at: '2026-11-02T10:00:00' },
      { key: 'segheria-9f8e7d6c', name: 'Segheria', shared_at: null },
    ],
  }

  it('names the country, not a region, and lists the shared cases with their reports', async () => {
    stubFetch({ '/api/public/region/IT': IT })
    renderAt('/r/region/IT')
    expect(await screen.findByRole('heading', { level: 1, name: 'Italy: shared cases' })).toBeInTheDocument()
    expect(screen.getByText('Country page · IT')).toBeInTheDocument()
    expect(screen.queryByText(/Region/)).toBeNull()
    expect(screen.getByRole('link', { name: 'Valle del formaggio' }))
      .toHaveAttribute('href', '/r/valle-del-formaggio-1a2b3c4d')
    expect(screen.getByRole('link', { name: 'Segheria' })).toHaveAttribute('href', '/r/segheria-9f8e7d6c')
  })

  it('says what is counted and links to the dashboard', async () => {
    stubFetch({ '/api/public/region/IT': IT })
    renderAt('/r/region/IT')
    expect(await screen.findByText(/whose network is not drawn, does not appear/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /the cases dashboard/ })).toHaveAttribute('href', '/aggregate')
  })

  it('shows the cases without a value apart, never as a value of the table', async () => {
    stubFetch({ '/api/public/region/IT': IT })
    renderAt('/r/region/IT')
    await screen.findByRole('heading', { level: 1 })
    const tables = screen.getAllByRole('table')
    expect(tables).toHaveLength(1)   // the sector table had only "not answered": no table
    expect(within(tables[0]).queryByText(/no environmental assessment/)).toBeNull()
    expect(screen.getByText('1 case not counted above: no environmental assessment (costing only).')).toBeInTheDocument()
    expect(screen.getByText('2 cases not counted above: no sector stated.')).toBeInTheDocument()
  })
})

describe('cases dashboard', () => {
  const AGGREGATE = {
    total: 13,
    by_lcc_type: [{ key: 'C+E', count: 13 }],
    by_q6a_sector: [{ key: '(none)', count: 7 }, { key: 'pulp_paper', count: 6 }],
    by_q7_geographic_scope: [{ key: '(none)', count: 13 }],
    by_ilcd_situation: [{ key: 'ILCD Situation A', count: 13 }],
  }

  it('does not rank "not answered" as the most common value', async () => {
    stubFetch({ '/api/cases/aggregate/breakdown': AGGREGATE, '/api/public/countries': [] })
    render(<MemoryRouter><AggregatePage /></MemoryRouter>)
    expect(await screen.findAllByText('Pulp & paper')).not.toHaveLength(0)
    const sectorCard = screen.getAllByText('By sector')[0].closest('.dd-kpi') as HTMLElement
    expect(within(sectorCard).getByText('Pulp & paper')).toBeInTheDocument()
    expect(within(sectorCard).queryByText('no sector stated')).toBeNull()
    const scopeCard = screen.getAllByText('By concentration of the interactions')[0].closest('.dd-kpi') as HTMLElement
    expect(within(scopeCard).getByText('—')).toBeInTheDocument()
    expect(within(scopeCard).getByText('No case states one')).toBeInTheDocument()
    expect(screen.getByText('7 cases not counted above: no sector stated.')).toBeInTheDocument()
  })

  it('says what it counts and leads to the country pages and to the guidance for funders', async () => {
    stubFetch({
      '/api/cases/aggregate/breakdown': AGGREGATE,
      '/api/public/countries': [{ code: 'IT', count: 2 }, { code: 'FR', count: 1 }],
    })
    render(<MemoryRouter><AggregatePage /></MemoryRouter>)
    expect(await screen.findByRole('link', { name: 'Italy (IT): 2 cases' })).toHaveAttribute('href', '/r/region/IT')
    expect(screen.getByRole('link', { name: 'France (FR): 1 case' })).toHaveAttribute('href', '/r/region/FR')
    expect(screen.getByText(/shared or not, from every country/)).toBeInTheDocument()
    expect(screen.queryByText(/filter by region/)).toBeNull()
    expect(screen.getByRole('link', { name: 'guidance for funding bodies' })).toHaveAttribute('href', '/about#funders')
  })
})

describe('guidance for funding bodies', () => {
  it('says what to ask applicants, what is not certified, and whom to ask about the future', () => {
    render(<MemoryRouter><AboutPage /></MemoryRouter>)
    const section = document.getElementById('funders') as HTMLElement
    expect(section).toBeInTheDocument()
    const text = section.textContent ?? ''
    for (const fact of ['Local authority view', 'Word report (.docx)', 'Data Collection File',
      'nobody at SYMBA checks them', 'Grant Agreement 101135562', 'contact page']) {
      expect(text).toContain(fact)
    }
    // no end date is promised
    expect(text).not.toMatch(/until 20\d\d|M36/)
    expect(within(section).getByRole('link', { name: 'Privacy notice' })).toHaveAttribute('href', '/privacy')
  })
})

describe('privacy notice', () => {
  it('is linked from the registration form', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.queryByRole('link', { name: 'Read how your data are handled' })).toBeNull()
    fireEvent.click(screen.getByRole('tab', { name: 'Create account' }))
    expect(screen.getByRole('link', { name: 'Read how your data are handled' })).toHaveAttribute('href', '/privacy')
  })

  it.each([
    ['fr', /n'existe pour l'instant qu'en anglais/],
    ['de', /vorerst nur auf Englisch/],
    ['es', /solo está disponible en inglés/],
  ])('says in %s that the draft is in English only', async (lang, sentence) => {
    await i18n.changeLanguage(lang)
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>)
    expect(screen.getAllByRole('note')[0]).toHaveTextContent(sentence)
  })

  it.each(['en', 'it'])('adds no language note in %s, where the draft is in the page language', async (lang) => {
    await i18n.changeLanguage(lang)
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>)
    expect(screen.getAllByRole('note')).toHaveLength(1)
  })
})
