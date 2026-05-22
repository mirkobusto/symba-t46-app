import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../store/authStore'
import EuFooter from './EuFooter'
import HealthBanner from './HealthBanner'
import HealthCheck from './HealthCheck'
import LanguageSwitcher from './LanguageSwitcher'
import SaveStatus from './SaveStatus'
import ShortcutsHelp from './ShortcutsHelp'
import ToastHost from './ToastHost'

export default function Layout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="layout-header">
        <Link to="/" className="layout-brand">
          <span className="layout-brand-symba">SYMBA</span>
          <span className="layout-brand-divider">·</span>
          <span className="layout-brand-task">T4.6</span>
          <span className="layout-brand-tag">{t('layout.brandTag')}</span>
        </Link>
        <nav className="layout-nav" aria-label="Primary">
          <Link to="/cases">{t('cases.navLink')}</Link>
          <Link to="/aggregate">{t('aggregate.navLink')}</Link>
          <Link to="/about">{t('layout.about')}</Link>
          {user ? (
            <span className="layout-user-block">
              <span className="layout-user-email">{user.email}</span>
              {user.role === 'admin' ? (
                <span className="layout-user-role">admin</span>
              ) : null}
              <button
                type="button"
                className="layout-logout-btn"
                onClick={handleLogout}
              >
                {t('auth.logout')}
              </button>
            </span>
          ) : (
            <Link to="/login" className="layout-login-link">
              {t('auth.signIn')}
            </Link>
          )}
          <LanguageSwitcher />
        </nav>
      </header>
      <HealthBanner />
      <main className="layout-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <EuFooter />
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
