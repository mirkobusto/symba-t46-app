import { useEffect, useState } from 'react'

type Status = 'loading' | 'ok' | 'unreachable'

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  'http://localhost:8001'

interface Props {
  compact?: boolean
}

export default function HealthCheck({ compact = false }: Props) {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`${BACKEND_URL}/health`)
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
      ? 'checking'
      : status === 'ok'
        ? 'OK'
        : 'unreachable'

  return (
    <span className={`health-check ${compact ? 'health-check-compact' : ''}`}>
      <span className={dotClass} aria-hidden="true" />
      <span>Backend: {label}</span>
    </span>
  )
}
