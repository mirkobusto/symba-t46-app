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
