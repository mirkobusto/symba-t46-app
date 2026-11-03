import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import '../i18n'
import PublicReportPage from '../pages/reader/PublicReportPage'
import { usePreferenceStore } from '../store/preferenceStore'

// UX round 2026-11-02: readers arrive from a link without the welcome page, so
// the report says what it is, names the exchanges and speaks in words.
const REPORT = {
  id: 'c1',
  name: 'Dairy valley',
  ilcd_situation: 'ILCD Situation A',
  created_at: '2026-11-02T08:00:00Z',
  updated_at: '2026-11-02T08:00:00Z',
  scoring: null,
  case: {
    q1: 'B', q2: 'A', q3: { env: true, eco: true, soc: true }, q4: ['B'],
    q6a: 'agriculture_agrifood_biorefineries', q7: 'B',
    reference_market_region: 'Italy', reference_market_scope: 'national',
    flows: [
      { id: 'f1', name: 'Cheese whey to biogas plant', q5: 'a' },
      { id: 'f2', name: 'Digestate to local farms', q5: 'b' },
    ],
    sites: [], ilcd_situation: 'ILCD Situation A', lcc_type: 'C+E', slca_activation_state: 'active',
  },
}

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/r/:caseId/:audience" element={<PublicReportPage />} />
        <Route path="/r/:caseId" element={<PublicReportPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('public report', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200, json: () => Promise.resolve(REPORT),
    } as Response)))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    usePreferenceStore.getState().resetOnboarding()
  })

  it('says it is a plan with no results, and names the exchanges', async () => {
    renderAt('/r/c1/community')
    expect(await screen.findByText('What this page is')).toBeTruthy()
    expect(screen.getByText(/not a certification of any company or product/)).toBeTruthy()
    expect(screen.getByText('Cheese whey to biogas plant')).toBeTruthy()
    expect(screen.getByText('These exchanges already take place.')).toBeTruthy()
    expect(screen.getByText('Reference market: Italy (national)')).toBeTruthy()
  })

  it('names the sector and the scale in words, not as Q-codes', async () => {
    renderAt('/r/c1/community')
    expect(await screen.findByText('Sector: Agriculture / agri-food / biorefineries')).toBeTruthy()
    expect(screen.queryByText(/Q6a:/)).toBeNull()
    expect(screen.queryByText(/Q7:/)).toBeNull()
  })

  it('tells the end user that the assessment is not about the product they bought', async () => {
    renderAt('/r/c1/enduser')
    expect(await screen.findByText(/not the final product you buy/)).toBeTruthy()
  })

  it('does not promise a DNSH check the tool never runs', async () => {
    renderAt('/r/c1/authority')
    expect(await screen.findByText('not assessed by this tool')).toBeTruthy()
    expect(screen.queryByText(/Q4 = /)).toBeNull()
  })

  it("opens a link without a view on the reader's own role", async () => {
    usePreferenceStore.setState({ role: 'authority' })
    renderAt('/r/c1')
    expect(await screen.findByText('Showing for — Local authority')).toBeTruthy()
  })

  // decided by Fable on the UX round of 2026-11-03
  it('opens a bare link on the end-user view and speaks to a product label', async () => {
    renderAt('/r/c1')
    expect(await screen.findByText('Showing for — End user')).toBeTruthy()
    expect(screen.getByText(/Did this link come from a product label\?/)).toBeTruthy()
  })

  it('titles the verdict in words, keeping the ILCD code as a badge', async () => {
    renderAt('/r/c1/community')
    expect(await screen.findByText('A local exchange, assessed with average data')).toBeTruthy()
    expect(screen.queryByText(/limited consequences/)).toBeNull()
    expect(screen.getByText('ILCD Situation A')).toBeTruthy()
  })

  it('tells the authority whether the costing is set up for a public decision', async () => {
    renderAt('/r/c1/authority')
    expect(await screen.findByText('Set up for a public decision (societal LCC)')).toBeTruthy()
    expect(screen.getByText(/ask the analyst to set the study up for a public objective/)).toBeTruthy()
  })

  it('does not tell the end user there is no claim when they hold a label', async () => {
    renderAt('/r/c1/enduser')
    expect(await screen.findByText('Comparisons')).toBeTruthy()
    expect(screen.getByText(/not meant to say that one product is better than, or as good as, another/)).toBeTruthy()
    expect(screen.queryByText('No public comparative claim')).toBeNull()
  })
})
