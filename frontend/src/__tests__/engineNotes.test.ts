import { describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { translateNote } from '../i18n/engineNotes'
import de from '../i18n/locales/de'
import en from '../i18n/locales/en'
import es from '../i18n/locales/es'
import fr from '../i18n/locales/fr'
import it_ from '../i18n/locales/it'

function leaves(obj: unknown, prefix = ''): string[] {
  if (typeof obj === 'string') return [prefix]
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k))
}

// Engine notes arrive in English with a code; a locale missing one would show
// the English text in the middle of a translated page.
describe('engine notes in five languages', () => {
  const expected = leaves(en.result.engineNotes).sort()

  it.each([['it', it_], ['fr', fr], ['de', de], ['es', es]])('%s has every note and variant', (_, loc) => {
    expect(leaves(loc.result.engineNotes).sort()).toEqual(expected)
    expect(Object.keys(loc.result.sectorChapters)).toEqual(Object.keys(en.result.sectorChapters))
  })

  it('fills the flow and the translated chapter', async () => {
    await i18n.changeLanguage('it')
    const text = translateNote(i18n.t, {
      code: 'flow_part2_chapter', message: 'English text',
      params: { flow: 'Digestato', chapter: '§4' },
    })
    expect(text).toContain('Digestato')
    expect(text).toContain('§4 Agroalimentare e bioraffinerie')
    const variant = translateNote(i18n.t, {
      code: 'flow_freedom_to_act_settles', message: 'x', params: { flow: 'F', variant: 'waste' },
    })
    expect(variant).toContain('rifiuto')
    await i18n.changeLanguage('en')
  })

  it('falls back to the English message for an unknown code', () => {
    expect(translateNote(i18n.t, { code: 'brand_new_note', message: 'Engine text' })).toBe('Engine text')
  })
})
