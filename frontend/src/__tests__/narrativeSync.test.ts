import { describe, expect, it } from 'vitest'

// Imported straight from the backend table so there is exactly one
// canonical copy of the English wording in the repo.
import narrative from '../../../backend/app/data/narrative.json'
import en from '../i18n/locales/en'

// The English verdict wording is canonical in the backend table, because
// the .docx report renders from there. en.ts mirrors it for the UI (and
// the other locales translate from en.ts). This test is the guard: touch
// one side only and it fails here rather than in a deliverable.
describe('verdict wording stays in sync with the backend table', () => {
  it('covers the same pathways, with the same text', () => {
    expect(Object.keys(en.narrative.pathway).sort()).toEqual(
      Object.keys(narrative.pathway).sort(),
    )
    for (const [id, entry] of Object.entries(narrative.pathway)) {
      expect(en.narrative.pathway[id as keyof typeof en.narrative.pathway]).toEqual(entry)
    }
  })

  it('covers the same ILCD situations, LCC types and S-LCA states', () => {
    expect(en.narrative.ilcd).toEqual(narrative.ilcd)
    expect(en.narrative.lcc).toEqual(narrative.lcc)
    expect(en.narrative.slca).toEqual(narrative.slca)
    expect(en.narrative.extendedSuffix).toBe(narrative.extendedSuffix)
  })
})
