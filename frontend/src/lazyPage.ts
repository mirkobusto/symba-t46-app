// Pages loaded on demand name their chunk by its build hash. A tab opened
// before a deploy still asks for the old chunk, which no longer exists, and
// the page fell into the error boundary (/stakeholder-report, /aggregate and
// /data-collection after the deploy of 2026-11-05). Reloading fetches the new
// index.html and its chunks: do it once, and show the error if it fails again.

import { lazy, type ComponentType } from 'react'

const KEY = 'symba-stale-chunk-reload'
/** A second failure this soon after a reload is a real error, not a stale tab. */
const WINDOW_MS = 10_000

interface Deps {
  storage: Pick<Storage, 'getItem' | 'setItem'>
  now: number
  reload: () => void
}

/** True when the page is being reloaded; false when it already was, just now. */
export function reloadOnce({ storage, now, reload }: Deps): boolean {
  const last = Number(storage.getItem(KEY) ?? 0)
  if (now - last < WINDOW_MS) return false
  storage.setItem(KEY, String(now))
  reload()
  return true
}

export function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  return lazy(() =>
    load().catch((error: unknown) => {
      let reloading = false
      try {
        reloading = reloadOnce({ storage: sessionStorage, now: Date.now(), reload: () => window.location.reload() })
      } catch {
        // no session storage (private mode): show the error rather than loop
      }
      if (reloading) return new Promise<never>(() => {})   // the page is going away
      throw error
    }),
  )
}
