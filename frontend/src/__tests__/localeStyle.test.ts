import { describe, expect, it } from 'vitest'

import de from '../i18n/locales/de'
import en from '../i18n/locales/en'
import es from '../i18n/locales/es'
import fr from '../i18n/locales/fr'
import itLocale from '../i18n/locales/it'
import { SCHEMA_TERMS } from '../i18n/schemaTerms'
import { marketRegionName } from '../pages/reader/countryName'
import { PRESETS } from '../presets/papers'

// French, German and Spanish after the style pass of en/it (#240-#243), done
// on the three languages in UX round 6 (P4-21, P5-15, P4-11, P5-14, P4-19).

function flat(node: unknown, prefix = ''): Record<string, string> {
  if (typeof node === 'string') return { [prefix]: node }
  if (node === null || typeof node !== 'object') return {}
  return Object.assign({}, ...Object.entries(node as Record<string, unknown>).map(([k, v]) =>
    flat(v, prefix ? `${prefix}.${k}` : k)))
}

const EN = flat(en)
const LOCALES: [string, Record<string, string>][] = [['fr', flat(fr)], ['de', flat(de)], ['es', flat(es)]]

describe('dashes and arrows in fr, de, es', () => {
  // en keeps a dash or an arrow only where code splits on it ("Q0 — …"
  // titles), in "— none of these" placeholders, in "Next →" and in the
  // before → after lines of the comparisons; the other languages may not
  // have more than en in any string
  it.each(LOCALES)('%s has no dash or arrow that en does not have', (_, strings) => {
    const extra = Object.entries(strings)
      .filter(([k, v]) => ['—', '→'].some((c) => v.split(c).length > (EN[k] ?? '').split(c).length))
      .map(([k]) => k)
    expect(extra).toEqual([])
  })

  it.each([['fr'], ['de'], ['es']])('%s rule wording has no dash aside', (lang) => {
    const bag = SCHEMA_TERMS[lang as keyof typeof SCHEMA_TERMS]
    const texts = flat(bag)
    expect(Object.entries(texts).filter(([, v]) => v.includes('—')).map(([k]) => k)).toEqual([])
  })
})

describe('words', () => {
  it('Spanish speaks to one reader with tú, never vosotros or usted', () => {
    const vosotros = /(?<!\p{L})(vuestr[oa]s?|os|podéis|queréis|habéis|tenéis|dirigíos|pedid|escribid|rellenad(?:lo|la)?|devolv[eé]d(?:lo|la|selo)?|usted)(?!\p{L})/iu
    const offending = Object.entries(flat(es)).filter(([k, v]) => !k.startsWith('privacy.') && vosotros.test(v))
    expect(offending.map(([k]) => k)).toEqual([])
  })

  it('German calls a flow Stoffstrom, not Fluss (a river)', () => {
    const river = /\b(Fluss|Flüsse|Flüssen|Flusses|Flusstabelle|Flussmatrix)\b/
    expect(Object.entries(flat(de)).filter(([, v]) => river.test(v)).map(([k]) => k)).toEqual([])
  })

  it('French elides no acronym: la LCA, le LCC', () => {
    const texts = { ...flat(fr), ...flat(SCHEMA_TERMS.fr) }
    expect(Object.entries(texts).filter(([, v]) => /\b[LlDd]'(LCA|LCC|S-LCA)\b/.test(v)).map(([k]) => k)).toEqual([])
  })

  it.each(LOCALES)('%s has no anglicism the testers flagged', (_, strings) => {
    const flagged = /\b(preset|rationale|Eco-park|End user|End-user|biofactories|Biofactories|downstream|first-of-a-kind|First-of-a-Kind|bench-scale|Bench-Scale|peer-reviewed|peer-reviewte|Gastgebiet)\b/
    const offending = Object.entries(strings)
      .filter(([k, v]) => !k.startsWith('privacy.') && !k.includes('legacy') && flagged.test(v))
      .filter(([k]) => !k.endsWith('wastewater_biofactories'))
    expect(offending.map(([k]) => k)).toEqual([])
  })
})

describe('published examples', () => {
  it.each([['en', en], ['it', itLocale], ['fr', fr], ['de', de], ['es', es]])(
    '%s names and describes every example', (_, locale) => {
      const examples = (locale as typeof en).preset.examples as Record<string, { label: string; description: string }>
      expect(PRESETS.map((p) => p.id).filter((id) => !examples[id]?.label || !examples[id]?.description)).toEqual([])
    })

  it('the English description is the one in the fixture', () => {
    const examples = en.preset.examples as Record<string, { description: string }>
    for (const p of PRESETS) expect(examples[p.id].description).toBe(p.description)
  })
})

describe('reference market in the reader language', () => {
  it('names a country typed in any of the five languages, or as a code', () => {
    expect(marketRegionName('Italia', 'en')).toBe('Italy')
    expect(marketRegionName('italy', 'de')).toBe('Italien')
    expect(marketRegionName('Deutschland', 'fr')).toBe('Allemagne')
    expect(marketRegionName('ES', 'it')).toBe('Spagna')
  })

  it('leaves anything else as typed', () => {
    expect(marketRegionName('Lombardy and Piedmont', 'fr')).toBe('Lombardy and Piedmont')
    expect(marketRegionName('EU-27', 'de')).toBe('EU-27')
  })
})

describe('<html lang>', () => {
  it('follows the stored language from the first render, and every switch', async () => {
    localStorage.setItem('symba-language', 'it')
    document.documentElement.lang = 'en'
    const { default: i18n } = await import('../i18n')
    expect(document.documentElement.lang).toBe('it')
    await i18n.changeLanguage('de')
    expect(document.documentElement.lang).toBe('de')
    localStorage.removeItem('symba-language')
  })
})
