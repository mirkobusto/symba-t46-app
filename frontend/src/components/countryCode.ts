// ISO 3166-1 alpha-2 country codes, as the network editor stores them on each
// actor (actor.country_iso2) and as /r/region/:code reads them. "cz" and "CZE"
// went in unchecked, and a partner with "CZE" vanished from the country page
// (UX round 6, P7-09). No list is shipped: the browser's Intl.DisplayNames
// knows the region codes.

import { ACTORS_SECTION, type DcfData } from '../types/dcfData'

export const COUNTRY_FIELD = 'actor.country_iso2'

/** Whether `code` names a country: two letters the browser knows as a region. */
export function isCountryCode(code: string): boolean {
  if (!/^[A-Za-z]{2}$/.test(code)) return false
  try {
    return new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' }).of(code.toUpperCase()) !== undefined
  } catch {
    return true   // no Intl support: two letters are enough
  }
}

/** What is typed in the country field, as stored: trimmed, in capitals. */
export function normaliseCountry(raw: string): string {
  return raw.trim().toUpperCase()
}

/** Whether a stored value is acceptable: empty, or a country code. */
export function countryValueValid(value: unknown): boolean {
  if (value === null || value === undefined) return true
  const text = String(value).trim()
  return text === '' || isCountryCode(text)
}

/** The actors, of the case or of a scenario's network, whose country is not
 * a code, by name: the network is not saved until they are fixed. */
export function actorsWithInvalidCountry(data: DcfData): string[] {
  const lists = [
    data.rows_by_section[ACTORS_SECTION] ?? [],
    ...Object.values(data.networks_by_scenario ?? {}).map((n) => n.rows_by_section[ACTORS_SECTION] ?? []),
  ]
  const names = lists.flatMap((rows) => rows
    .filter((r) => !countryValueValid(r.values[COUNTRY_FIELD]))
    .map((r) => String(r.values['actor.name'] ?? '').trim() || r.row_id))
  return [...new Set(names)]
}
