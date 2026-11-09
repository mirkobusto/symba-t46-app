// UX round 6, public pages (G6, J4): a citizen or a company that received a
// link finds the way to it from the app. The page on filling in a workbook was
// removed on 2026-11-09 (the workbook carries its own cover and instructions).

import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import Sidebar from '../components/admin/Sidebar'
import i18n from '../i18n'
import HomePage from '../pages/HomePage'
import StakeholderReportPage from '../pages/StakeholderReportPage'
import WelcomePage from '../pages/WelcomePage'
import { usePreferenceStore } from '../store/preferenceStore'

function renderIn(node: React.ReactNode, url = '/') {
  return render(<MemoryRouter initialEntries={[url]}>{node}</MemoryRouter>)
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  usePreferenceStore.setState({ role: null, task: null, hasOnboarded: false })
})

describe('the way to a report received by link', () => {
  it('is in the app menu (P5-05, P4-16)', () => {
    renderIn(<Sidebar />)
    expect(screen.getByRole('link', { name: /Read a shared report/ })).toHaveAttribute('href', '/r/open')
  })

  it('is at the top of Home for a reader, and a company gets no workbook page (P5-05)', () => {
    usePreferenceStore.setState({ role: 'industry' })
    renderIn(<HomePage />)
    expect(screen.getByText('Did you receive a link or a code?')).toBeInTheDocument()
    expect(screen.queryByText(/Data Collection File to fill in/)).toBeNull()
  })

  it('is not pushed on an analyst', () => {
    usePreferenceStore.setState({ role: 'analyst' })
    renderIn(<HomePage />)
    expect(screen.queryByText('Did you receive a link or a code?')).toBeNull()
  })

  it('replaces the two buttons with no target on the stakeholder page without a case (P4-16)', () => {
    renderIn(<StakeholderReportPage />, '/stakeholder-report')
    expect(screen.queryByRole('link', { name: 'Back to result' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Open Data Collection File' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Read a shared report' })).toHaveAttribute('href', '/r/open')
    expect(screen.getByRole('link', { name: 'See an example' })).toHaveAttribute('href', '/#presets')
  })
})

describe('the welcome page for a company', () => {
  it('offers no workbook task, and the industry role is said in words', () => {
    usePreferenceStore.setState({ role: 'industry' })
    renderIn(<WelcomePage />, '/welcome')
    expect(screen.queryByText(/fill in a Data Collection File/)).toBeNull()
    fireEvent.click(screen.getByText(/Back/))
    expect(screen.getByText(/inside an industrial-symbiosis network/)).toBeInTheDocument()
    expect(screen.queryByText(/IS network/)).toBeNull()
  })

  it('starts unselected when the stored task is the retired workbook one', () => {
    usePreferenceStore.setState({ role: 'industry', task: 'fill' as never })
    renderIn(<WelcomePage />, '/welcome')
    expect(screen.getAllByRole('radio').every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true)
  })
})
