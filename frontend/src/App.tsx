import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import SessionCheck from './components/SessionCheck'
import AboutPage from './pages/AboutPage'
import CasesListPage from './pages/CasesListPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultPage from './pages/ResultPage'
import WelcomePage from './pages/WelcomePage'
import { usePreferenceStore } from './store/preferenceStore'
import './App.css'
import { lazyPage } from './lazyPage'
import { sharedCaseOf } from './pages/reader/sharedReportPath'
import ReportNotFound from './components/reader/ReportNotFound'

// Loaded on demand: the network editor (React Flow), the dashboards and the
// public reader pages are not needed to answer the questionnaire (the bundle
// was ~1.4 MB in one chunk). The Suspense boundary sits in the shells; a
// chunk gone after a deploy reloads the page once (lazyPage).
const AggregatePage = lazyPage(() => import('./pages/AggregatePage'))
const DataCollectionPage = lazyPage(() => import('./pages/DataCollectionPage'))
const ScenariosResultPage = lazyPage(() => import('./pages/ScenariosResultPage'))
const StakeholderReportPage = lazyPage(() => import('./pages/StakeholderReportPage'))
const PrivacyPage = lazyPage(() => import('./pages/PrivacyPage'))
const OpenSharedReportPage = lazyPage(() => import('./pages/reader/OpenSharedReportPage'))
const PublicAboutPage = lazyPage(() => import('./pages/reader/PublicAboutPage'))
const PublicRegionPage = lazyPage(() => import('./pages/reader/PublicRegionPage'))
const PublicReportPage = lazyPage(() => import('./pages/reader/PublicReportPage'))

// The pages of the app shell: the welcome gate applies to these only, so an
// address the app does not have says so instead of opening the welcome
// (UX round 6, P5-12).
const APP_PAGES = new Set([
  '/', '/questionnaire', '/result', '/data-collection', '/stakeholder-report',
  '/aggregate', '/scenarios-result', '/cases', '/about',
])

/**
 * Redirects first-time visitors to /welcome unless they're on a route
 * that must remain publicly reachable regardless of onboarding state:
 * /welcome itself, /login, /privacy, the `/r/*` reader shell URLs, and an
 * address that is no page (its "page not found").
 */
function WelcomeGate({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const hasOnboarded = usePreferenceStore((s) => s.hasOnboarded)
  const page = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const bypass = !APP_PAGES.has(page)
  if (!hasOnboarded && !bypass) {
    return <Navigate to="/welcome" replace />
  }
  return <>{children}</>
}

/**
 * A new page opens at its top. Without this the browser keeps the scroll
 * offset of the page you left, so a result or an About page could open
 * half-way down, showing only a footer (UX round 2026-11-02). In-page
 * anchors (`#q9`) keep their own scrolling.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const previous = useRef(pathname)
  useEffect(() => {
    const sameReport = sharedCaseOf(pathname) !== null && sharedCaseOf(pathname) === sharedCaseOf(previous.current)
    previous.current = pathname
    if (!hash && !sameReport) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <SessionCheck />
        <WelcomeGate>
          <Routes>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route element={<Layout />}>
              {/* Reader shell (public share URLs, no auth) */}
              <Route path="/r/about" element={<PublicAboutPage />} />
              <Route path="/r/open" element={<OpenSharedReportPage />} />
              <Route path="/r/region/:code" element={<PublicRegionPage />} />
              <Route path="/r/:caseId/:audience" element={<PublicReportPage />} />
              <Route path="/r/:caseId" element={<PublicReportPage />} />
              <Route path="/r/*" element={<ReportNotFound />} />

              {/* Admin shell (analyst / internal) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/questionnaire" element={<QuestionnairePage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/data-collection" element={<DataCollectionPage />} />
              <Route path="/stakeholder-report" element={<StakeholderReportPage />} />
              <Route path="/aggregate" element={<AggregatePage />} />
              <Route path="/scenarios-result" element={<ScenariosResultPage />} />
              <Route path="/cases" element={<CasesListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </WelcomeGate>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
