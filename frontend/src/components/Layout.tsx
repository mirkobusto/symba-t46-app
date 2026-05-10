import { Link, Outlet } from 'react-router-dom'

import HealthBanner from './HealthBanner'
import HealthCheck from './HealthCheck'
import ShortcutsHelp from './ShortcutsHelp'
import ToastHost from './ToastHost'

export default function Layout() {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="layout-header">
        <Link to="/" className="layout-brand">
          SYMBA T4.6
        </Link>
        <nav className="layout-nav" aria-label="Primary">
          <Link to="/about">About</Link>
        </nav>
      </header>
      <HealthBanner />
      <main className="layout-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="layout-footer">
        <span>
          SYMBA T4.6 — IS Assessment Tool · MVP
          <span className="muted"> · Press </span>
          <kbd>?</kbd>
          <span className="muted"> for shortcuts</span>
        </span>
        <HealthCheck compact />
      </footer>
      <ToastHost />
      <ShortcutsHelp />
    </div>
  )
}
