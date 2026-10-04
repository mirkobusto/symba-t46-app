// AdminShell · frame around the analyst-facing pages
//
// Composition:
//   ┌──────────────────────────────────────────┐
//   │ SiteHeader (symbaproject.eu look)        │
//   ├────────┬─────────────────────────────────┤
//   │        │ Topbar                          │
//   │ Sidebar├─────────────────────────────────┤
//   │        │ HealthBanner (if backend down)  │
//   │        ├─────────────────────────────────┤
//   │        │ <Outlet /> (page content)       │
//   ├────────┴─────────────────────────────────┤
//   │ EuFooter (mandatory, full width)         │
//   └──────────────────────────────────────────┘
//
// Toast host + shortcuts overlay + save-status live at the shell level
// so they remain available on every admin route.

import { Outlet } from 'react-router-dom'

import SiteHeader from '../brand/SiteHeader'
import EuFooter from '../EuFooter'
import HealthBanner from '../HealthBanner'
import ShortcutsHelp from '../ShortcutsHelp'
import ToastHost from '../ToastHost'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AdminShell() {
  return (
    <div className="dd-shell">
      <a href="#dd-main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <div className="dd-app">
        <Sidebar />
        <div className="dd-app-column">
          <Topbar />
          <HealthBanner />
          <main id="dd-main" className="dd-main" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      </div>
      <EuFooter />
      <ToastHost />
      <ShortcutsHelp />
    </div>
  )
}
