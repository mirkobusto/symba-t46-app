// Turns what a reader pasted into the path of a shared report (/r/open).

const VIEWS = new Set(['industry', 'community', 'authority', 'enduser'])

/**
 * The report path for what a reader pasted: a full share URL
 * ("https://…/r/valle-del-formaggio/community"), a path ("/r/…") or the
 * bare case code. Null when nothing usable was pasted.
 */
export function sharedReportPath(input: string): string | null {
  const text = input.trim()
  if (!text) return null
  const marker = text.indexOf('/r/')
  const rest = (marker >= 0 ? text.slice(marker + 3) : text).split(/[?#]/)[0]
  const [key, view] = rest.split('/').filter(Boolean)
  if (!key || !/^[A-Za-z0-9-]+$/.test(key) || key === 'open' || key === 'about') return null
  return view && VIEWS.has(view) ? `/r/${key}/${view}` : `/r/${key}`
}

// The audience tabs of a public report are routes (/r/<case>/<audience>):
// switching tab must not throw the reader back to the top of the page
// (UX round 2026-11-03).
export function sharedCaseOf(pathname: string): string | null {
  const m = /^\/r\/([^/]+)(?:\/[^/]+)?\/?$/.exec(pathname)
  return m && !['about', 'open', 'region'].includes(m[1]) ? m[1] : null
}
