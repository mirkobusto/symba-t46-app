import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultPage from './pages/ResultPage'
import './App.css'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
