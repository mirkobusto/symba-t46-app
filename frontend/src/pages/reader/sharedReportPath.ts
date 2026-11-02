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
