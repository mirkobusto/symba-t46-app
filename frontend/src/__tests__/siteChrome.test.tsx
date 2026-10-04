// The website-style header and footer: the EU emblem must always travel
// with the funding acknowledgement (Grant Agreement 101135562), and the
// logo must link back to the project website.

import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import i18n from '../i18n'
import SiteHeader from '../components/brand/SiteHeader'
import EuFooter from '../components/EuFooter'

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

describe('EuFooter', () => {
  it('shows the EU emblem together with the funding acknowledgement', () => {
    render(<EuFooter />)

    const emblem = screen.getByAltText('Funded by the European Union')
    expect(emblem).toHaveAttribute(
      'src',
      expect.stringContaining('/brand/EN_FundedbytheEU_RGB_NEG'),
    )
    expect(
      screen.getByText('Funded by the European Union under G.A. 101135562.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Neither the European Union nor the European Research Executive Agency/),
    ).toBeInTheDocument()
  })

  it('links back to the project website and to its legal pages', () => {
    render(<EuFooter />)

    expect(screen.getByRole('link', { name: 'Symba Project' })).toHaveAttribute(
      'href',
      'https://www.symbaproject.eu/',
    )
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      'https://www.symbaproject.eu/privacy-policy/',
    )
    expect(screen.getByRole('link', { name: 'Cookie policy' })).toHaveAttribute(
      'href',
      'https://www.symbaproject.eu/cookie-policy/',
    )
  })

  it('carries the funding statement in every supported language', async () => {
    for (const lang of ['it', 'fr', 'de', 'es']) {
      await i18n.changeLanguage(lang)
      const { unmount } = render(<EuFooter />)
      expect(document.body.textContent).toContain('101135562')
      unmount()
    }
  })
})

describe('SiteHeader', () => {
  function renderHeader() {
    return render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    )
  }

  it('links the logo back to the project website', () => {
    renderHeader()

    const logo = screen.getByAltText('Symba Project')
    expect(logo.closest('a')).toHaveAttribute('href', 'https://www.symbaproject.eu/')
  })

  it('offers the website menu and marks the tool as the current section', () => {
    renderHeader()

    for (const label of ['About', 'Project', 'Partners', 'News & Events', 'Download', 'Contact Us']) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        expect.stringMatching(/^https:\/\/www\.symbaproject\.eu\//),
      )
    }
    expect(screen.getByRole('link', { name: 'Monitoring tool' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('opens and closes the mobile menu with the burger button and Escape', () => {
    renderHeader()

    const burger = screen.getByRole('button', { name: 'Open menu' })
    expect(burger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(burger)
    const open = screen.getByRole('button', { name: 'Close menu' })
    expect(open).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('site-header-nav')).toHaveClass('site-nav-open')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
