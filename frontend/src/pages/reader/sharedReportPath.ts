// Paths of the public report pages (/r/<case>/<view>).

/** Reader pages that sit where a case code would (/r/<page>). */
const RESERVED = ['about', 'region']

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

// The audience tabs of a public report are routes (/r/<case>/<audience>):
// switching tab must not throw the reader back to the top of the page
// (UX round 2026-11-03).
export function sharedCaseOf(pathname: string): string | null {
  const m = /^\/r\/([^/]+)(?:\/[^/]+)?\/?$/.exec(pathname)
  return m && !RESERVED.includes(m[1]) ? m[1] : null
}
