// UX round 6, public pages (G6, J4). On 2026-11-09 the owner removed the page on
// filling in a workbook (the workbook carries its own cover and instructions),
// the page for pasting a report link (a link received opens the report itself)
// and the welcome wizard.

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import Sidebar from '../components/admin/Sidebar'
import i18n from '../i18n'
import HomePage from '../pages/HomePage'
import StakeholderReportPage from '../pages/StakeholderReportPage'
import { usePreferenceStore } from '../store/preferenceStore'

function renderIn(node: React.ReactNode, url = '/') {
  return render(<MemoryRouter initialEntries={[url]}>{node}</MemoryRouter>)
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  usePreferenceStore.setState({ mode: 'expert' })
})

describe('no page to paste a report link into', () => {
  it('is in the app menu or on Home', () => {
    renderIn(<Sidebar />)
    expect(screen.queryByRole('link', { name: /Read a shared report/ })).toBeNull()
    renderIn(<HomePage />)
    expect(screen.queryByText('Did you receive a link or a code?')).toBeNull()
  })

  it('replaces the two buttons with no target on the stakeholder page without a case (P4-16)', () => {
    renderIn(<StakeholderReportPage />, '/stakeholder-report')
    expect(screen.queryByRole('link', { name: 'Back to result' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Open Data Collection File' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Read a shared report' })).toBeNull()
    expect(screen.getByRole('link', { name: 'See an example' })).toHaveAttribute('href', '/#presets')
  })
})
