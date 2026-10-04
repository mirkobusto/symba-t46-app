// ReaderShell — light, single-column, mobile-first frame for public
// share URLs (`/r/*`).
//
// No sidebar, no user menu, no admin actions. The SiteHeader gives the
// symbaproject.eu look; a slim sub-bar below it carries the "public
// report" label + language switch; the footer carries the mandatory EU
// funding statement. The content column is capped at 720 px so long
// reports remain comfortable to read on a phone or desktop.

import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import SiteHeader from '../brand/SiteHeader'
import EuFooter from '../EuFooter'
import LanguageSwitcher from '../LanguageSwitcher'
import ToastHost from '../ToastHost'

export default function ReaderShell() {
  const { t } = useTranslation()
  return (
    <div className="dd-reader">
      <a href="#reader-main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <div className="dd-reader-header">
        <Link to="/r/about" className="dd-reader-brand">
          <img
            className="dd-reader-brand-icon"
            src="/brand/cropped-icona-192x192.png"
            alt=""
            width={28}
            height={28}
          />
          <span className="dd-reader-brand-text">
            <span className="dd-reader-brand-name">SYMBA</span>
            <span className="dd-reader-brand-sub">{t('reader.tagline')}</span>
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
      <main id="reader-main" className="dd-reader-main" tabIndex={-1}>
        <Outlet />
      </main>
      <EuFooter />
      <ToastHost />
    </div>
  )
}
