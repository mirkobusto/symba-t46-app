import { describe, expect, it } from 'vitest'

import de from '../i18n/locales/de'
import en from '../i18n/locales/en'
import es from '../i18n/locales/es'
import fr from '../i18n/locales/fr'
import it_ from '../i18n/locales/it'

// UX round 2026-11-03 (decided by Fable): a reader must not be told that a
// partner will compute the figures for their case. Nobody does, automatically.
describe('no promise of scores', () => {
  it.each([['en', en], ['it', it_], ['fr', fr], ['de', de], ['es', es]])('%s', (_lang, locale) => {
    const text = JSON.stringify((locale as Record<string, unknown>).stakeholder)
    expect(text).not.toMatch(/CIRCE/)
    expect(text).not.toMatch(/scoring arrives|arriveranno i punteggi/)
  })
})

// UX round 6 (P1-19, P7-15): "their results can be loaded here", with no page
// that loads them. Until one exists the texts say that this version cannot.
describe('no promise of loading results', () => {
  it.each([['en', en], ['it', it_], ['fr', fr], ['de', de], ['es', es]])('%s', (_lang, locale) => {
    const text = JSON.stringify(locale)
    expect(text).not.toMatch(/can be loaded|load them here|caricati qui|caricare qui|chargés ici|hier geladen|cargarse aquí|shown here once delivered|aggiunti a questo caso|ajoutés à ce cas|diesem Fall hinzugefügt|añaden a este caso/)
  })
})
