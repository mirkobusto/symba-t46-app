// Top-of-page banner shown when the backend is unreachable. Polls
// /health via useHealth and renders a red bar above the main content
// when status === 'unreachable'. Hidden in 'loading' and 'ok' states.

import { AlertTriangle } from 'lucide-react'

import { useHealth } from '../hooks/useHealth'

export default function HealthBanner() {
  const status = useHealth()
  if (status !== 'unreachable') return null
  return (
    <div className="health-banner" role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>
        Backend at <code>http://localhost:8001</code> is unreachable. The
        questionnaire works but pipeline runs will fail until the backend
        is back online.
      </span>
    </div>
  )
}
