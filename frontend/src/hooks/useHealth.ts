// Backend-health polling hook.
//
// Poll the /health endpoint every `intervalMs` (default 30 s) and
// return both status and version (parsed from the JSON body).
// Multiple consumers each get their own polling timer.

import { useEffect, useState } from 'react'

import { checkHealth } from '../services/api'

export type HealthStatus = 'loading' | 'ok' | 'unreachable'

export interface HealthInfo {
  status: HealthStatus
  version: string | null
}

export function useHealth(intervalMs = 30000): HealthInfo {
  const [info, setInfo] = useState<HealthInfo>({ status: 'loading', version: null })

  useEffect(() => {
    let active = true
    async function poll() {
      try {
        const body = await checkHealth()
        if (active) setInfo({ status: 'ok', version: body.version ?? null })
      } catch {
        if (active) setInfo({ status: 'unreachable', version: null })
      }
    }
    poll()
    const id = window.setInterval(poll, intervalMs)
    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [intervalMs])

  return info
}
