import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

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
const PublicAboutPage = lazyPage(() => import('./pages/reader/PublicAboutPage'))
const PublicRegionPage = lazyPage(() => import('./pages/reader/PublicRegionPage'))
const PublicReportPage = lazyPage(() => import('./pages/reader/PublicReportPage'))

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
          <Routes>
            <Route element={<Layout />}>
              {/* Reader shell (public share URLs, no auth) */}
              <Route path="/r/about" element={<PublicAboutPage />} />
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
      </BrowserRouter>
    </ErrorBoundary>
  )
}
