// Layout · shell dispatcher
//
// Routes-in-a-shell come in two flavors:
//   1. Admin (default) — analyst / reviewer console with dark sidebar,
//      topbar, KPI-grade chrome. Used for every authenticated /
//      internal route.
//   2. Reader — light, single-column, mobile-first, no sidebar. Used
//      for public share URLs `/r/*`.
//
// The dispatcher inspects the current pathname and picks the right
// shell. Both wrap <Outlet /> so the router configuration in App.tsx
// remains flat.

import { useLocation } from 'react-router-dom'

import AdminShell from './admin/AdminShell'
import ReaderShell from './reader/ReaderShell'

export default function Layout() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/r/') || pathname === '/r') {
    return <ReaderShell />
  }
  return <AdminShell />
}
