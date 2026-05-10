import { Link, Outlet } from 'react-router-dom'

import HealthBanner from './HealthBanner'
import HealthCheck from './HealthCheck'
import ToastHost from './ToastHost'

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/" className="layout-brand">
          SYMBA T4.6
        </Link>
        <nav className="layout-nav">
          <Link to="/about">About</Link>
        </nav>
      </header>
      <HealthBanner />
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <span>SYMBA T4.6 — IS Assessment Tool · MVP</span>
        <HealthCheck compact />
      </footer>
      <ToastHost />
    </div>
  )
}
