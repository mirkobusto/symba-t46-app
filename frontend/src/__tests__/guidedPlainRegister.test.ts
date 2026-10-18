import { describe, expect, it } from 'vitest'

import de from '../i18n/locales/de'
import en from '../i18n/locales/en'
import es from '../i18n/locales/es'
import fr from '../i18n/locales/fr'
import itLocale from '../i18n/locales/it'

// Guided mode shows `plain` instead of opening the analyst note. The
// point of `plain` is the register, and a register is easy to lose in
// translation, so the rules are enforced here rather than left to a
// reviewer: no paragraph references, no node identifiers, no rule codes,
// no pathway codes, and shorter than the analyst note it stands in for.

const LOCALES = { en, it: itLocale, fr, de, es }

const QUESTIONS = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6a', 'q6b', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12',
] as const

type Q = (typeof QUESTIONS)[number]

const FORBIDDEN: [RegExp, string][] = [
  [/§/, 'paragraph sign'],
  [/\bD4\.\d/, 'deliverable reference'],
  [/\b(lca|lcc|slca)_[a-z]+_\d+/i, 'node identifier'],
  [/\bIS-0\d/, 'pathway code'],
  [/\b(CIR|IR|FU|CDP|B)-\d+/, 'rule code'],
  [/BLOCK/, 'L1 block'],
  [/\bISO \d/, 'standard number'],
  [/\bTRL ?\d/, 'TRL number'],
]

function plainOf(locale: typeof en, q: Q): string {
  const block = locale.questionnaire[q] as unknown as Record<string, string>
  return block.plain
}

function detailsOf(locale: typeof en, q: Q): string {
  const block = locale.questionnaire[q] as unknown as Record<string, string>
  return block.details
}

describe('the guided-mode plain register', () => {
  it('exists for every question, in every language', () => {
    for (const [tag, locale] of Object.entries(LOCALES)) {
      for (const q of QUESTIONS) {
        const plain = plainOf(locale, q)
        expect(plain, `${tag}.${q}.plain`).toBeTruthy()
        expect(plain.length, `${tag}.${q}.plain too short`).toBeGreaterThan(80)
      }
    }
  })

  it('carries no methodological shorthand', () => {
    for (const [tag, locale] of Object.entries(LOCALES)) {
      for (const q of QUESTIONS) {
        const plain = plainOf(locale, q)
        for (const [re, what] of FORBIDDEN) {
          expect(re.test(plain), `${tag}.${q}.plain contains a ${what}`).toBe(false)
        }
      }
    }
  })

  it('stays a shorter register than the analyst note', () => {
    // Per question rather than per string: q9's analyst note is unusually
    // terse, and no test should force prose to be trimmed to satisfy it.
    for (const [tag, locale] of Object.entries(LOCALES)) {
      let plainTotal = 0
      let detailsTotal = 0
      for (const q of QUESTIONS) {
        const plain = plainOf(locale, q)
        const details = detailsOf(locale, q)
        expect(details, `${tag}.${q}.details`).toBeTruthy()
        expect(plain.length, `${tag}.${q}.plain is too long for the register`)
          .toBeLessThan(800)
        plainTotal += plain.length
        detailsTotal += details.length
      }
      expect(plainTotal, `${tag}: plain is not lighter than details overall`)
        .toBeLessThan(detailsTotal * 0.7)
    }
  })

  it('labels the collapsed analyst note differently in guided mode', () => {
    for (const [tag, locale] of Object.entries(LOCALES)) {
      expect(locale.common.methodologicalNote, `${tag}`).toBeTruthy()
      expect(locale.common.methodologicalNote).not.toBe(locale.common.examplesAndContext)
    }
  })
})
