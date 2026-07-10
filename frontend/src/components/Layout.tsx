// Layout · shell dispatcher
//
// Routes-in-a-shell come in two flavors:
//   1. Admin (default) — analyst / reviewer console with dark sidebar,
//      topbar, KPI-grade chrome. Used for every authenticated / internal
//      route.
//   2. Reader (future — Phase 6) — light, single-column, no sidebar,
//      mobile-first. Used for `/r/*` public share URLs.
//
// This dispatcher decides which shell wraps <Outlet />. The Reader
// shell is not implemented yet; when it lands, Layout will branch on
// `useLocation().pathname.startsWith('/r/')`.

import AdminShell from './admin/AdminShell'

export default function Layout() {
  return <AdminShell />
}
