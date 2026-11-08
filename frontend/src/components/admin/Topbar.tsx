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
// (UX round 6, P7-08). On a phone the strip is hidden and the language and
// account controls sit in the sidebar's menu (UX round 6, P4-06).

import HealthCheck from '../HealthCheck'
import LanguageSwitcher from '../LanguageSwitcher'
import AccountControls from './AccountControls'

export default function Topbar() {
  return (
    <div className="dd-topbar">
      <div className="dd-topbar-right">
        <span className="dd-topbar-pill dd-topbar-pill-health">
          <HealthCheck compact />
        </span>
        <span className="dd-topbar-lang">
          <LanguageSwitcher />
        </span>
        <AccountControls />
      </div>
    </div>
  )
}
