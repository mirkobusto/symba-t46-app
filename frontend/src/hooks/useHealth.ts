// Backend-health polling hook.
//
// Poll the /health endpoint every `intervalMs` (default 30 s) and
// return the current status. Multiple consumers can call this; each
// gets its own polling timer. (For app-wide single-source state we'd
// move to a Zustand store, but two consumers — HealthCheck dot in
// the footer and HealthBanner at the top — are fine independently.)

import { useEffect, useState } from 'react'

import { checkHealth } from '../services/api'

export type HealthStatus = 'loading' | 'ok' | 'unreachable'

export function useHealth(intervalMs = 30000): HealthStatus {
  const [status, setStatus] = useState<HealthStatus>('loading')

  useEffect(() => {
    let active = true
    async function poll() {
      try {
        await checkHealth()
        if (active) setStatus('ok')
      } catch {
        if (active) setStatus('unreachable')
      }
    }
    poll()
    const id = window.setInterval(poll, intervalMs)
    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [intervalMs])

  return status
}
