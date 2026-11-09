// Turns what a reader pasted into the path of a shared report (/r/open).

/** Reader pages that sit where a case code would (/r/<page>). */
const RESERVED = ['open', 'about', 'region']

export const VIEWS = ['industry', 'community', 'authority', 'enduser'] as const
export type View = (typeof VIEWS)[number]

/** Other spellings of a view found in links: "end-user" is how the app names
 * the view elsewhere, and a QR printed with it opened the Community view
 * (UX round 6, P5-01). */
const VIEW_ALIASES: Record<string, View> = {
  'end-user': 'enduser',
  end_user: 'enduser',
}

/** The view a link names, read case-blind and with its aliases; null when it
 * names none. */
export function viewOf(segment: string | undefined): View | null {
  if (!segment) return null
  const key = segment.toLowerCase()
  if ((VIEWS as readonly string[]).includes(key)) return key as View
  return VIEW_ALIASES[key] ?? null
}

/**
 * The report path for what a reader pasted: a full share URL
 * ("https://…/r/valle-del-formaggio/community"), a path ("/r/…") or the
 * bare case code. Null when nothing usable was pasted. Case codes are lower
 * case: one copied from a label in capitals is read the same (P5-11).
 */
export function sharedReportPath(input: string): string | null {
  const text = input.trim()
  if (!text) return null
  const marker = text.toLowerCase().indexOf('/r/')
  const rest = (marker >= 0 ? text.slice(marker + 3) : text).split(/[?#]/)[0]
  const [rawKey, rawView] = rest.split('/').filter(Boolean)
  const key = rawKey?.toLowerCase()
  if (!key || !/^[a-z0-9-]+$/.test(key) || RESERVED.includes(key)) return null
  const view = viewOf(rawView)
  return view ? `/r/${key}/${view}` : `/r/${key}`
}

// The audience tabs of a public report are routes (/r/<case>/<audience>):
// switching tab must not throw the reader back to the top of the page
// (UX round 2026-11-03).
export function sharedCaseOf(pathname: string): string | null {
  const m = /^\/r\/([^/]+)(?:\/[^/]+)?\/?$/.exec(pathname)
  return m && !RESERVED.includes(m[1]) ? m[1] : null
}
