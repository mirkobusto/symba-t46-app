// A country's name in the reader's language, from its ISO2 code; the code
// itself when the browser cannot name it.

export function countryName(code: string, language: string): string {
  const upper = code.trim().toUpperCase()
  try {
    return new Intl.DisplayNames([language, 'en'], { type: 'region', fallback: 'code' }).of(upper) ?? upper
  } catch {
    return upper
  }
}

// Country names in the five languages of the tool, keyed without case or
// accents, to their ISO2 code; built once, on first use.
const TOOL_LANGUAGES = ['en', 'it', 'fr', 'de', 'es']
let byName: Map<string, string> | null = null

function fold(text: string): string {
  return text.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function countryByName(): Map<string, string> {
  if (byName) return byName
  byName = new Map()
  try {
    const namers = TOOL_LANGUAGES.map((l) => new Intl.DisplayNames([l], { type: 'region', fallback: 'none' }))
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const code = String.fromCharCode(65 + i, 65 + j)
        for (const namer of namers) {
          const name = namer.of(code)
          if (name && name !== code) byName.set(fold(name), code)
        }
      }
    }
  } catch {
    // no Intl.DisplayNames: names stay as typed
  }
  return byName
}

/** The reference market as the author typed it (free text), in the reader's
 * language when it names a country: a two-letter code, or a country's name in
 * one of the tool's languages ("Italia" reads "Italy" on an English page).
 * Anything else (a region, "EU-27") is shown as typed (UX round 6, P5-16). */
export function marketRegionName(text: string, language: string): string {
  const typed = text.trim()
  if (/^[A-Za-z]{2}$/.test(typed)) {
    const name = countryName(typed, language)
    return name === typed.toUpperCase() ? typed : name
  }
  const code = countryByName().get(fold(typed))
  return code ? countryName(code, language) : typed
}
