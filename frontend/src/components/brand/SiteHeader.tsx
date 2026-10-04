// SiteHeader — the header of https://www.symbaproject.eu/ carried into the
// tool, which is deployed on a subdomain of that website.
//
// Same language as the site: white bar, logo on the left (linking back to
// the website), the website's top-level menu in uppercase Noto Sans with a
// lime hover/underline, a burger menu on narrow viewports. Menu entries
// are plain links to the website; the last one, "Monitoring tool", marks
// where the visitor currently is. `actions` is a slot on the right (the
// language switcher on pages that have no topbar).

import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SITE_NAV, SITE_URL } from './siteLinks'

interface SiteHeaderProps {
  actions?: ReactNode
}

export default function SiteHeader({ actions }: SiteHeaderProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  // Escape closes the mobile menu (it is a disclosure, not a modal, so
  // focus is left alone).
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href={SITE_URL} className="site-header-logo" title={t('siteHeader.logoTitle')}>
          <img
            src="/brand/logo.png"
            alt={t('siteHeader.logoAlt')}
            width={148}
            height={45}
          />
        </a>

        <nav
          id="site-header-nav"
          className={open ? 'site-nav site-nav-open' : 'site-nav'}
          aria-label={t('siteHeader.navLabel')}
        >
          <ul className="site-nav-list">
            {SITE_NAV.map((item) => (
              <li key={item.key}>
                <a href={item.href}>{t(`siteHeader.nav.${item.key}`)}</a>
              </li>
            ))}
            <li>
              <Link
                to="/"
                className="site-nav-current"
                aria-current="true"
                onClick={() => setOpen(false)}
              >
                {t('siteHeader.tool')}
              </Link>
            </li>
            <li className="site-nav-back">
              <a href={SITE_URL}>{t('siteHeader.backToSite')}</a>
            </li>
          </ul>
        </nav>

        {actions ? <div className="site-header-actions">{actions}</div> : null}

        <button
          type="button"
          className="site-header-burger"
          aria-expanded={open}
          aria-controls="site-header-nav"
          aria-label={open ? t('siteHeader.menuClose') : t('siteHeader.menuOpen')}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="28" height="18" viewBox="0 0 36 21" aria-hidden="true" focusable="false">
            <path d="M0 0H36V2H0Z" />
            <path d="M0 9.5H36V11.5H0Z" />
            <path d="M0 19H36V21H0Z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
