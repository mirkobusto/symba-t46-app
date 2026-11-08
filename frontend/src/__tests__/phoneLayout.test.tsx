// Phone layout (390 px), UX round 6, theme H. jsdom has no CSS layout, so the
// width of the pages was measured in a real browser (headless Chrome at
// 390x844: before the fix /stakeholder-report was 446 px wide, /aggregate 421,
// the authority view 404; after it every page is 390). What can come back
// without anyone seeing it on a desktop is guarded here: the CSS rules that
// caused the sideways scroll, and the one menu of the phone.

import '@testing-library/jest-dom'
import { readFileSync } from 'node:fs'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import Sidebar from '../components/admin/Sidebar'
import { SITE_NAV } from '../components/brand/siteLinks'
import i18n from '../i18n'

// `npm test` runs from frontend/ (see brandContrast.test.ts)
const css = readFileSync('src/App.css', 'utf8') + readFileSync('src/index.css', 'utf8')

/** The declarations of every rule whose selector list contains `selector`. */
function rulesFor(selector: string): string[] {
  const out: string[] = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(re)) {
    const selectors = m[1].split(',').map((s) => s.trim())
    if (selectors.includes(selector)) out.push(m[2])
  }
  return out
}

/** Phone width minus the 16 px gutters on both sides. */
const PHONE_CONTENT = 390 - 2 * 16

describe('phone layout: no sideways scroll at 390 px', () => {
  it('has no grid track with a fixed minimum wider than a phone', () => {
    // minmax(380px, 1fr) made the regional dashboard 421 px wide (P4-20):
    // a wide minimum must be capped, as in minmax(min(380px, 100%), 1fr)
    const wide = [...css.matchAll(/minmax\(\s*(\d+)px/g)]
      .map((m) => Number(m[1]))
      .filter((px) => px > PHONE_CONTENT)
    expect(wide).toEqual([])
  })

  it('lets the tabs wrap instead of pushing the page sideways (P4-01, P5-07)', () => {
    const rules = rulesFor('.dd-tabs')
    expect(rules.some((r) => /flex-wrap:\s*wrap/.test(r))).toBe(true)
    expect(rules.some((r) => /flex-wrap:\s*nowrap/.test(r))).toBe(false)
  })

  it('lets a long name in the compliance checklist shrink (authority view)', () => {
    expect(rulesFor('.dd-check-item').join(' ')).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/)
  })

  it('hides the phone block of the menu outside the phone query, before it', () => {
    // the base rule must come before the media query that shows it, or it wins
    const base = css.indexOf('.dd-sidebar-phone {\n  display: none;')
    const shown = css.indexOf('.dd-sidebar-phone {\n    display: block;')
    expect(base).toBeGreaterThan(-1)
    expect(shown).toBeGreaterThan(base)
  })
})

describe('phone layout: one menu (P4-06, P5-08, P4-09)', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('carries language, sign in and the project website links in the app menu', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )
    const phone = container.querySelector('.dd-sidebar-phone') as HTMLElement
    expect(phone).not.toBeNull()
    const inPhone = within(phone)
    expect(inPhone.getByRole('combobox', { name: 'Language' })).toBeInTheDocument()
    expect(inPhone.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    // the website is in English, and the group says so
    expect(inPhone.getByText('SYMBA project website (in English)')).toBeInTheDocument()
    expect(inPhone.getByRole('link', { name: 'Project website' })).toHaveAttribute(
      'href',
      'https://www.symbaproject.eu/',
    )
    for (const item of SITE_NAV) {
      expect(inPhone.getByRole('link', { name: i18n.t(`siteHeader.nav.${item.key}`) })).toHaveAttribute(
        'href',
        item.href,
      )
    }
    // the menu button still controls the panel that holds all of this
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-controls', 'dd-sidebar-nav')
    expect(phone.closest('#dd-sidebar-nav')).not.toBeNull()
  })

  it('names the tool in Spanish as a tool, not as tracking (P5-09)', async () => {
    await i18n.changeLanguage('es')
    expect(i18n.t('siteHeader.tool')).toBe('Herramienta de evaluación')
    expect(i18n.t('siteHeader.phoneGroup')).toBe('Sitio web del proyecto SYMBA (en inglés)')
  })
})
