// AdminShell · Topbar
//
// Sticky top strip with:
//   - global search (⌘K) placeholder — non-functional in Phase 2,
//     wired to the shortcut skeleton in Phase 5 or later
//   - live backend health pill
//   - language switcher (delegated to the existing component)
//   - user menu (email + role badge + sign out) — or sign-in link
//
// Kept minimal on purpose: the sidebar carries navigation, the topbar
// carries context.

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../../store/authStore'
import HealthCheck from '../HealthCheck'
import LanguageSwitcher from '../LanguageSwitcher'

export default function Topbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  return (
    <div className="dd-topbar">
      <label className="dd-topbar-search">
        <span className="visually-hidden">{t('adminShell.searchLabel')}</span>
        <input
          type="search"
          placeholder={t('adminShell.searchPlaceholder')}
          disabled
          aria-disabled="true"
        />
      </label>

      <div className="dd-topbar-right">
        <span className="dd-topbar-pill dd-topbar-pill-health">
          <HealthCheck compact />
        </span>
        <span className="dd-topbar-lang">
          <LanguageSwitcher />
        </span>
        {user ? (
          <span className="dd-topbar-user">
            <span className="dd-topbar-avatar" aria-hidden="true">
              {user.email.slice(0, 1).toUpperCase()}
            </span>
            <span className="dd-topbar-user-info">
              <span className="dd-topbar-user-email">{user.email}</span>
              <span className="dd-topbar-user-role">{t(`auth.roles.${user.role}`, { defaultValue: user.role })}</span>
            </span>
            <button
              type="button"
              className="dd-topbar-logout"
              onClick={handleLogout}
            >
              {t('auth.logout')}
            </button>
          </span>
        ) : (
          // back to this page after signing in or registering, not to the home
          // page (UX round 5, P1-17)
          <Link
            to="/login"
            state={location.pathname === '/login' ? undefined : { from: location.pathname }}
            className="dd-topbar-signin"
          >
            {t('auth.signIn')}
          </Link>
        )}
      </div>
    </div>
  )
}
