import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import HealthBanner from './HealthBanner'
import HealthCheck from './HealthCheck'
import LanguageSwitcher from './LanguageSwitcher'
import SaveStatus from './SaveStatus'
import ShortcutsHelp from './ShortcutsHelp'
import ToastHost from './ToastHost'

export default function Layout() {
  const { t } = useTranslation()
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="layout-header">
        <Link to="/" className="layout-brand">
          {t('layout.brand')}
        </Link>
        <nav className="layout-nav" aria-label="Primary">
          <Link to="/about">{t('layout.about')}</Link>
          <LanguageSwitcher />
        </nav>
      </header>
      <HealthBanner />
      <main className="layout-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="layout-footer">
        <span>
          {t('layout.footer')}
          <span className="muted"> · </span>
          <span>
            {t('layout.shortcutsHint', { key: '?' }).split('?')[0]}
          </span>
          <kbd>?</kbd>
        </span>
        <span className="layout-footer-right">
          <SaveStatus />
          <HealthCheck compact />
        </span>
      </footer>
      <ToastHost />
      <ShortcutsHelp />
    </div>
  )
}
