// Engine notes (Case.warnings) in the reader's language.
//
// The engine writes each note in English (`message`) with a stable `code` and,
// where the text depends on the case, `params`: the flow, the D4.1 Part 2
// chapter (§4…§8) and the variant of the text. The translations live in the
// locales under result.engineNotes; the English message stays the fallback, so
// a note the client does not know yet is never lost. A backend test
// (test_engine_notes_i18n.py) keeps the codes and variants in step with en.ts.

import type { TFunction } from 'i18next'

import type { CaseWarning } from '../types/api'

export function chapterName(t: TFunction, chapter?: string): string | undefined {
  if (!chapter) return undefined
  const number = chapter.split(' ')[0]
  return t(`result.sectorChapters.${number}`, { defaultValue: chapter })
}

export function translateNote(t: TFunction, w: CaseWarning): string {
  const p = w.params ?? {}
  const key = p.variant ? `result.engineNotes.${w.code}.${p.variant}` : `result.engineNotes.${w.code}`
  return t(key, {
    flow: p.flow,
    configuration: p.configuration,
    chapter: chapterName(t, p.chapter),
    declared: chapterName(t, p.declared),
    defaultValue: w.message,
  })
}
