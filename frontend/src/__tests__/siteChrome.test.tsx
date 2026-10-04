// The website-style header and footer: the EU emblem must always travel
// with the funding acknowledgement (Grant Agreement 101135562), and the
// logo must link back to the project website.

import '@testing-library/jest-dom'
import { readFileSync } from 'node:fs'
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
    // This tool has its own notice (accounts, saved cases, browser storage): the footer
    // links to it, not to the website's policy, which covers the website only.
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Browser storage' })).toHaveAttribute(
      'href',
      '/privacy#data',
    )
  })

  it('carries the funding statement in every supported language', async () => {
    for (const lang of ['it', 'fr', 'de', 'es']) {
      await i18n.changeLanguage(lang)
      const { unmount } = render(<EuFooter />)
      const statement = i18n.t('eu.fundingStatement')
      expect(statement).toContain('101135562')
      expect(document.body.textContent).toContain(statement)   // the translated text, not a hard-coded number
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

  it('moves focus into the menu when it opens, so Tab does not leave it', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const nav = document.getElementById('site-header-nav')!
    expect(nav.contains(document.activeElement)).toBe(true)
    expect(document.activeElement?.tagName).toBe('A')
  })
})

describe('language and print', () => {
  it('keeps <html lang> in step with the language switcher', async () => {
    await i18n.changeLanguage('de')
    expect(document.documentElement.lang).toBe('de')
    await i18n.changeLanguage('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('keeps the mandatory EU footer visible on paper', () => {
    // The emblem is white lettering on a transparent background; without an exact
    // dark background in print it would be white on white.
    // read the file itself: vitest replaces imported CSS with an empty module
    const appCss = readFileSync('src/App.css', 'utf8')   // vitest runs from frontend/
    const print = appCss.slice(appCss.indexOf('@media print'))
    expect(print.length).toBeGreaterThan(0)
    expect(print).toMatch(/\.eu-footer\s*\{[^}]*background:\s*#1f242c\s*!important/)
    expect(print).toMatch(/print-color-adjust:\s*exact/)
  })
})
