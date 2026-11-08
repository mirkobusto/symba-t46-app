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
    expect(await screen.findByText('Showing for: Local authority')).toBeTruthy()
  })

  // decided by Fable on the UX round of 2026-11-03
  it('opens a bare link on the end-user view and speaks to a product label', async () => {
    renderAt('/r/c1')
    expect(await screen.findByText('Showing for: End user')).toBeTruthy()
    expect(screen.getByText(/Did this link come from a product label\?/)).toBeTruthy()
  })

  it('puts the choice of view right under what the page is (UX round 6, P4-04)', async () => {
    renderAt('/r/c1')
    const lead = await screen.findByText(/Who are you reading as\?/)
    const tabs = screen.getByRole('tablist')
    const caseTitle = screen.getByText('The case')
    expect(lead.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(tabs.compareDocumentPosition(caseTitle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByRole('link', { name: /Who is behind SYMBA\?/ }).getAttribute('href')).toBe('/r/about')
    expect(screen.getByText(/This page applies to this case only/)).toBeTruthy()
  })

  it('says where the plants are and whose names the exchanges carry (P4-08, P5-03)', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200,
      json: () => Promise.resolve({
        ...REPORT, countries: ['IT'],
        case: { ...REPORT.case, flows: [{ id: 'f1', name: 'Siero al biogas', q5: 'a', sector: 'agriculture_agrifood_biorefineries' }] },
      }),
    } as Response)))
    renderAt('/r/c1/community')
    expect(await screen.findByText('Where the plants are: Italy')).toBeTruthy()
    expect(screen.getByText('The exchanges, as named by whoever prepared the case:')).toBeTruthy()
    expect(screen.getByText('Siero al biogas (Agriculture / agri-food / biorefineries)')).toBeTruthy()
    // the region is the plants', not the reader's (P4-07)
    expect(screen.getByText(/with data for the region or country where the plants are/)).toBeTruthy()
  })

  it('gives the end user rows in words and something to do (P5-02)', async () => {
    renderAt('/r/c1/enduser')
    expect(await screen.findByText('Environmental effects')).toBeTruthy()
    expect(screen.getByText(/transport included/)).toBeTruthy()
    expect(screen.getByText('What is measured')).toBeTruthy()
    expect(screen.queryByText('Functional unit')).toBeNull()
    expect(screen.queryByText(/S-LCA/)).toBeNull()
    expect(screen.getByText(/Not planned in this study/)).toBeTruthy()
    expect(screen.getByText('What you can do')).toBeTruthy()
  })

  it('shows a company asked for data how to fill in the workbook (P2-15)', async () => {
    renderAt('/r/c1/industry')
    expect((await screen.findByRole('link', { name: /How to fill it in/ })).getAttribute('href')).toBe('/r/fill-in')
  })

  it('titles the verdict in words; the ILCD badge only for industry and authority', async () => {
    renderAt('/r/c1/community')
    expect(await screen.findByText('A local exchange, assessed with average data')).toBeTruthy()
    expect(screen.queryByText(/limited consequences/)).toBeNull()
    expect(screen.queryByText('ILCD Situation A')).toBeNull()
  })

  it('tells the authority whether the costing is set up for a public decision', async () => {
    renderAt('/r/c1/authority')
    expect(await screen.findByText('Set up for a public decision (societal LCC)')).toBeTruthy()
    // a case saved before Q10 was required says nothing either way (UX round 6, P4-10)
    expect(screen.getByText(/Not declared: the study does not say whether a public body/)).toBeTruthy()
  })

  it('says "not planned" in the badge when the text says no', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200,
      json: () => Promise.resolve({ ...REPORT, case: { ...REPORT.case, policy_objective: false } }),
    } as Response)))
    renderAt('/r/c1/authority')
    expect(await screen.findByText(/ask the analyst to set the study up for a public objective/)).toBeTruthy()
    expect(screen.queryByText('not declared')).toBeNull()
  })

  it('does not tell the end user there is no claim when they hold a label', async () => {
    renderAt('/r/c1/enduser')
    expect(await screen.findByText('Comparisons')).toBeTruthy()
    expect(screen.getByText(/not meant to say that one product is better than, or as good as, another/)).toBeTruthy()
    expect(screen.queryByText('No public comparative claim')).toBeNull()
  })

  it('says whom to ask about the case', async () => {
    renderAt('/r/c1/community')
    expect((await screen.findAllByText(/ask whoever sent you the link/)).length).toBeGreaterThan(0)
  })
})

describe('community view (UX round 4, B3)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200, json: () => Promise.resolve({ ...REPORT, case_contact: 'study@example.org' }),
    } as Response)))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('tells a company that the data request arrives as an Excel workbook, and from whom', async () => {
    // UX round 5, P2-11 / P6-10
    renderAt('/r/c1/industry')
    expect(await screen.findByText('If you are asked for data')).toBeTruthy()
    expect(screen.getByText(/send it back to study@example.org/)).toBeTruthy()
  })

  it('answers residents in their words and says what they can do', async () => {
    renderAt('/r/c1/community')
    expect(await screen.findByText('Transport')).toBeTruthy()
    expect(screen.getByText(/Odour and noise are not impact categories/)).toBeTruthy()
    expect(screen.getByText(/the local community, consumers/)).toBeTruthy()
    expect(screen.getByText('What you can do')).toBeTruthy()
    expect(screen.queryByText(/characterisation factors/i)).toBeNull()
  })
})
