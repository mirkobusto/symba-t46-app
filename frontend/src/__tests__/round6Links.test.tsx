import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from '../App'
import AdvancedEditor from '../components/AdvancedEditor'
import { activeAdvancedCount, invalidAdvancedKeys } from '../components/advancedKeys'
import { actorsWithInvalidCountry, countryValueValid, normaliseCountry } from '../components/countryCode'
import ShareReportModal from '../components/dd/ShareReportModal'
import ReportNotFound from '../components/reader/ReportNotFound'
import i18n from '../i18n'
import PublicReportPage from '../pages/reader/PublicReportPage'
import { sharedReportPath } from '../pages/reader/sharedReportPath'
import { useAuthStore } from '../store/authStore'
import { usePreferenceStore } from '../store/preferenceStore'

const REPORT = {
  id: 'c1', name: 'Dairy valley', ilcd_situation: 'ILCD Situation A',
  created_at: '2026-11-02T08:00:00Z', updated_at: '2026-11-02T08:00:00Z', scoring: null,
  case: {
    q1: 'B', q2: 'A', q3: { env: true, eco: false, soc: false }, q4: [], q7: 'B', flows: [], sites: [],
    ilcd_situation: 'ILCD Situation A', slca_activation_state: 'deactivated',
  },
}

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>
}

function renderReport(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/r/:caseId/:audience" element={<><PublicReportPage /><Where /></>} />
        <Route path="/r/:caseId" element={<><PublicReportPage /><Where /></>} />
        <Route path="/r/*" element={<ReportNotFound />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  vi.unstubAllGlobals()
  usePreferenceStore.getState().resetOnboarding()
  useAuthStore.setState({ token: null, user: null } as never)
})

describe('links to a shared report (UX round 6, P5-01, P5-11)', () => {
  let asked: string[]
  beforeEach(() => {
    asked = []
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      asked.push(String(url))
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(REPORT) } as Response)
    }))
  })

  it('an unknown view goes to the bare link instead of the Community view', async () => {
    renderReport('/r/c1/xyz')
    expect(await screen.findByText('Showing for: End user')).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/r\/c1$/)
  })

  it('"end-user" and capitals name the end-user view', async () => {
    renderReport('/r/c1/End-User')
    expect(await screen.findByText('Showing for: End user')).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/r\/c1\/enduser$/)
  })

  it('a code in capitals opens the report', async () => {
    renderReport('/r/AGRI-B-SITA-A839E04A')
    expect(await screen.findByText(/Dairy valley/)).toBeInTheDocument()
    expect(asked.some((u) => u.endsWith('/api/public/report/agri-b-sita-a839e04a'))).toBe(true)
  })

  it('/r/open reads a pasted code in capitals and the end-user alias', () => {
    expect(sharedReportPath('  AGRI-B-SITA-A839E04A ')).toBe('/r/agri-b-sita-a839e04a')
    expect(sharedReportPath('https://x.eu/R/Agri-b-sita-a839e04a/end-user')).toBe('/r/agri-b-sita-a839e04a/enduser')
  })

  it('a longer address under /r/ is a report not found, not the Home page (P7-14)', () => {
    renderReport('/r/nonexistent/foo/bar')
    expect(screen.getByText('Report not found')).toBeInTheDocument()
    expect(screen.getByText(/stopped sharing it/)).toBeInTheDocument()
  })
})

describe('an address the app does not have (P5-12, P7-14)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200, json: () => Promise.resolve({ status: 'ok' }),
    } as Response)))
  })

  it('says so, also before the welcome, with a way to a shared report', async () => {
    window.history.pushState({}, '', '/esto-no-existe')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open a shared report' })).toHaveAttribute('href', '/r/open')
    window.history.pushState({}, '', '/')
  })
})

describe('the Share dialog before the case is saved (P7-10)', () => {
  it('names the button that is on the page, and does not ask a signed-in user to sign in', () => {
    useAuthStore.setState({ token: 't', user: { email: 'a@b.c', role: 'user' } } as never)
    render(<MemoryRouter><ShareReportModal caseId={null} onClose={() => {}} /></MemoryRouter>)
    expect(screen.getByText(/Save it first with “Save the case…” on the result page/)).toBeInTheDocument()
    expect(screen.queryByText(/Sign in/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Save as new/)).not.toBeInTheDocument()
  })
})

describe('advanced settings (P7-13)', () => {
  it('counts only values the engine reads, and says what is wrong', () => {
    const advanced = { future_background_threshold_years: 'abc', slca_framework_override: 'absolute' }
    expect(invalidAdvancedKeys(advanced)).toEqual(['future_background_threshold_years'])
    expect(activeAdvancedCount(advanced)).toBe(1)
    expect(activeAdvancedCount({ custom_1: '' })).toBe(0)
    render(<AdvancedEditor advanced={advanced} onChange={() => {}} />)
    expect(screen.getByText('Years: a number above 0, at most 500.')).toBeInTheDocument()
  })

  it('no longer offers a custom key, which the engine would never read', () => {
    const onChange = vi.fn()
    render(<AdvancedEditor advanced={{ custom_1: 'x' }} onChange={onChange} />)
    expect(screen.queryByRole('button', { name: /Add custom key/ })).not.toBeInTheDocument()
    expect(screen.getByText(/Not read by the engine/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remove custom_1' }))
    expect(onChange).toHaveBeenCalledWith({})
  })
})

describe('country codes of the actors (P7-09)', () => {
  it('stores capitals and accepts only a known two-letter code', () => {
    expect(normaliseCountry(' cz ')).toBe('CZ')
    expect(countryValueValid('CZ')).toBe(true)
    expect(countryValueValid('')).toBe(true)
    expect(countryValueValid('CZE')).toBe(false)
    expect(countryValueValid('XX')).toBe(false)
    expect(actorsWithInvalidCountry({
      schema_version: '1.1', case_id: 'c', layout: {},
      rows_by_section: { actors: [
        { row_id: 'a1', values: { 'actor.name': 'Brewery', 'actor.country_iso2': 'CZE' } },
        { row_id: 'a2', values: { 'actor.name': 'Farm', 'actor.country_iso2': 'CZ' } },
      ] },
    })).toEqual(['Brewery'])
  })
})
