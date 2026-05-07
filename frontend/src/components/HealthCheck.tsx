import { useEffect, useState } from 'react'

type Status = 'loading' | 'ok' | 'unreachable'

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

export default function HealthCheck() {
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

  if (status === 'loading') return <p>Backend: checking…</p>
  if (status === 'ok') return <p>Backend: OK</p>
  return <p>Backend: unreachable</p>
}
