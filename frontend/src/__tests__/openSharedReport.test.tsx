import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import '../i18n'
import OpenSharedReportPage from '../pages/reader/OpenSharedReportPage'
import { sharedCaseOf, sharedReportPath } from '../pages/reader/sharedReportPath'
import { recommendedRouteFor } from '../store/preferenceStore'

// "Read a shared report" landed on "My cases", with no place to paste the
// link the reader had received (UX round 2026-11-02).
describe('opening a shared report', () => {
  it('reads a full link, a path or a bare code, keeping a known view', () => {
    expect(sharedReportPath('https://biobasedisadvisor.symbaproject.eu/r/agri-b-sita-0e71/community'))
      .toBe('/r/agri-b-sita-0e71/community')
    expect(sharedReportPath('/r/agri-b-sita-0e71?x=1')).toBe('/r/agri-b-sita-0e71')
    expect(sharedReportPath('  agri-b-sita-0e71 ')).toBe('/r/agri-b-sita-0e71')
    expect(sharedReportPath('agri-b-sita-0e71/whatever')).toBe('/r/agri-b-sita-0e71')
  })

  it('refuses what is not a report link', () => {
    expect(sharedReportPath('')).toBeNull()
    expect(sharedReportPath('hello world')).toBeNull()
    expect(sharedReportPath('https://example.org/r/about')).toBeNull()
    // the page for whoever fills in a workbook is no case (UX round 6, P2-15)
    expect(sharedReportPath('/r/fill-in')).toBeNull()
    expect(sharedCaseOf('/r/fill-in')).toBeNull()
  })

  it('is where the welcome sends a reader', () => {
    expect(recommendedRouteFor('community', 'read')).toBe('/r/open')
  })

  it('sends a company with a workbook to fill in to the page that says how', () => {
    expect(recommendedRouteFor('industry', 'fill')).toBe('/r/fill-in')
  })

  it('opens the report from what was pasted', () => {
    render(
      <MemoryRouter initialEntries={['/r/open']}>
        <Routes>
          <Route path="/r/open" element={<OpenSharedReportPage />} />
          <Route path="/r/:caseId/:audience" element={<p>report page</p>} />
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('Link or case code'), {
      target: { value: 'https://x.eu/r/valle-del-formaggio/enduser' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Open the report' }))
    expect(screen.getByText('report page')).toBeTruthy()
  })
})
