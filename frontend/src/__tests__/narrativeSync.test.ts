import { describe, expect, it } from 'vitest'

// Imported straight from the backend table so there is exactly one
// canonical copy of the English wording in the repo.
import narrative from '../../../backend/app/data/narrative.json'
import { NARRATIVE_SOURCES } from '../i18n/narrativeSources'
import en from '../i18n/locales/en'

// The English verdict wording is canonical in the backend table, because
// the .docx report renders from there. en.ts mirrors the translatable
// half (short + detail) and narrativeSources.ts the citations. This test
// is the guard: touch one side only and it fails here rather than in a
// deliverable.
describe('verdict wording stays in sync with the backend table', () => {
  it('covers the same pathways, with the same text', () => {
    expect(Object.keys(en.narrative.pathway).sort()).toEqual(
      Object.keys(narrative.pathway).sort(),
    )
    for (const [id, entry] of Object.entries(narrative.pathway)) {
      expect(en.narrative.pathway[id as keyof typeof en.narrative.pathway]).toEqual({
        title: entry.title,
        body: entry.body,
        detail: entry.detail,
      })
    }
    expect(en.narrative.extendedSuffix).toBe(narrative.extendedSuffix)
  })

  it('covers the same ILCD situations, LCC types and S-LCA states', () => {
    for (const section of ['ilcd', 'lcc', 'slca'] as const) {
      const table = narrative[section] as Record<
        string,
        { short: string; detail: string }
      >
      const locale = en.narrative[section] as Record<
        string,
        { short: string; detail: string }
      >
      expect(Object.keys(locale).sort()).toEqual(Object.keys(table).sort())
      for (const [code, entry] of Object.entries(table)) {
        expect(locale[code]).toEqual({ short: entry.short, detail: entry.detail })
      }
    }
  })

  it('carries every citation the backend table declares', () => {
    for (const section of ['ilcd', 'lcc', 'slca'] as const) {
      const table = narrative[section] as Record<
        string,
        { quote: string; source: string }
      >
      for (const [code, entry] of Object.entries(table)) {
        if (!entry.quote) {
          expect(NARRATIVE_SOURCES[section]?.[code]).toBeUndefined()
          continue
        }
        expect(NARRATIVE_SOURCES[section][code]).toEqual({
          quote: entry.quote,
          source: entry.source,
        })
      }
    }
  })
})
