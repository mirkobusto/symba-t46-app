// AdminShell · Topbar
//
// Sticky top strip with:
//   - live backend health pill
//   - language switcher (delegated to the existing component)
//   - user menu (email + role badge + sign out) — or sign-in link
//
// Kept minimal on purpose: the sidebar carries navigation, the topbar
// carries context. A search box (disabled, with a ⌘K shortcut that did
// nothing) promised a function that does not exist: removed until it does
// (UX round 6, P7-08).

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../../store/authStore'
import { clearLocalWork, confirmDiscard } from '../../store/signOut'
import HealthCheck from '../HealthCheck'
import LanguageSwitcher from '../LanguageSwitcher'

export default function Topbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  async function handleLogout() {
    // the case and the network go with the account: the next person on this
    // browser must not find them (Kimi test 2026-11-04, A1-01); answers
    // changed and not worked out again count too (UX round 6, P7-03)
    if (!(await confirmDiscard('signOut'))) return
    clearSession()
    clearLocalWork()
    navigate('/')
  }

  return (
    <div className="dd-topbar">
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
              onClick={() => void handleLogout()}
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
