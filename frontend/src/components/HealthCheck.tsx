import { useEffect, useState } from 'react'

import { apiBaseUrl } from '../services/api'

type Status = 'loading' | 'ok' | 'unreachable'

interface HealthCheckProps {
  compact?: boolean
}

export default function HealthCheck({ compact = false }: HealthCheckProps) {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`${apiBaseUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(() => {
        if (!cancelled) setStatus('ok')
      })
      .catch(() => {
        if (!cancelled) setStatus('unreachable')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const dotClass =
    status === 'ok'
      ? 'status-dot status-dot-ok'
      : status === 'unreachable'
        ? 'status-dot status-dot-error'
        : 'status-dot status-dot-loading'

  const label =
    status === 'loading'
      ? 'checking…'
      : status === 'ok'
        ? 'OK'
        : 'unreachable'

  if (compact) {
    return (
      <span className="health-check health-check-compact">
        <span className={dotClass} aria-hidden="true" />
        <span>Backend: {label}</span>
      </span>
    )
  }

  return (
    <p className="health-check">
      <span className={dotClass} aria-hidden="true" />
      Backend: {label}
    </p>
  )
}
