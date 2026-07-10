import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import AggregatePage from './pages/AggregatePage'
import CasesListPage from './pages/CasesListPage'
import DataCollectionPage from './pages/DataCollectionPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultPage from './pages/ResultPage'
import ScenariosResultPage from './pages/ScenariosResultPage'
import StakeholderReportPage from './pages/StakeholderReportPage'
import WelcomePage from './pages/WelcomePage'
import { usePreferenceStore } from './store/preferenceStore'
import './App.css'

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
    pathname.startsWith('/r/')
  if (!hasOnboarded && !bypass) {
    return <Navigate to="/welcome" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <WelcomeGate>
          <Routes>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route element={<Layout />}>
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </WelcomeGate>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
