// ReaderShell — light, single-column, mobile-first frame for public
// share URLs (`/r/*`).
//
// No sidebar, no user menu, no admin actions. Header carries the
// SYMBA brand + language switch; footer carries the mandatory EU
// funding statement. The content column is capped at 720 px so long
// reports remain comfortable to read on a phone or desktop.

import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
      <header className="dd-reader-header">
        <Link to="/r/about" className="dd-reader-brand">
          <span className="dd-reader-brand-mark" aria-hidden="true">S</span>
          <span className="dd-reader-brand-text">
            <span className="dd-reader-brand-name">SYMBA</span>
            <span className="dd-reader-brand-sub">{t('reader.tagline')}</span>
          </span>
        </Link>
        <LanguageSwitcher />
      </header>
      <main id="reader-main" className="dd-reader-main" tabIndex={-1}>
        <Outlet />
      </main>
      <EuFooter />
      <ToastHost />
    </div>
  )
}
