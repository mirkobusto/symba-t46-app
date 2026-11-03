import { lazy, useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import CasesListPage from './pages/CasesListPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultPage from './pages/ResultPage'
import WelcomePage from './pages/WelcomePage'
import { usePreferenceStore } from './store/preferenceStore'
import './App.css'
import { sharedCaseOf } from './pages/reader/sharedReportPath'

// Loaded on demand: the network editor (React Flow), the dashboards and the
// public reader pages are not needed to answer the questionnaire (the bundle
// was ~1.4 MB in one chunk). The Suspense boundary sits in the shells.
const AggregatePage = lazy(() => import('./pages/AggregatePage'))
const DataCollectionPage = lazy(() => import('./pages/DataCollectionPage'))
const ScenariosResultPage = lazy(() => import('./pages/ScenariosResultPage'))
const StakeholderReportPage = lazy(() => import('./pages/StakeholderReportPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const OpenSharedReportPage = lazy(() => import('./pages/reader/OpenSharedReportPage'))
const PublicAboutPage = lazy(() => import('./pages/reader/PublicAboutPage'))
const PublicRegionPage = lazy(() => import('./pages/reader/PublicRegionPage'))
const PublicReportPage = lazy(() => import('./pages/reader/PublicReportPage'))

/**
 * Redirects first-time visitors to /welcome unless they're on a route
 * that must remain publicly reachable regardless of onboarding state:
 * /welcome itself, /login, and (future) `/r/*` reader shell URLs.
 */
function WelcomeGate({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const hasOnboarded = usePreferenceStore((s) => s.hasOnboarded)
  const bypass =
    pathname.startsWith('/welcome') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/r/')
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </WelcomeGate>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
