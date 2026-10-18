// The verdict, in words.
//
// The engine speaks in codes — "ILCD Situation B", "C+E". Those are the
// right identifiers for a reviewer and useless as a first sentence, so the
// page leads with what they mean and keeps the codes as badges beside it.
// The headline is the ILCD situation (D4.1 Table 1), the variable that sets
// paradigm, background and multifunctionality; the IS-01..IS-05 pathways,
// a T4.6 construct the deliverables do not know, were removed on 2026-10-18.
//
// The English wording is canonical in backend/app/data/narrative.json
// (the .docx report reads the same table); the locales mirror it and a
// test checks the two have not drifted.

import { NARRATIVE_SOURCES } from '../i18n/narrativeSources'
import type { Case } from '../types/api'

export interface VerdictDetail {
  /** Which axis this is — the audience views show only some of them. */
  section: 'ilcd' | 'lcc' | 'slca'
  /** The code this expands on, e.g. "ILCD Situation A". */
  code: string
  /** Short line, as shown collapsed. */
  short: string
  /** Faithful paraphrase of the deliverable. */
  detail: string
  /** Verbatim citation — English, never translated. */
  quote?: string
  /** Where it comes from, e.g. "D4.1 Part 1 §7.2.1". */
  source?: string
}

export interface Verdict {
  /** Human title, e.g. "Decision support with limited consequences (ILCD Situation A)". */
  title: string
  /** One sentence saying what that situation means for the modelling. */
  body: string
  /** One line per remaining axis: the LCC structure and the S-LCA state. */
  method: string[]
  /** The codes, kept for traceability. */
  codes: string[]
  /** Long-form explanation behind the "more info" disclosure. */
  details: VerdictDetail[]
}

type Translate = (key: string, fallback?: string) => string

function lookup(t: Translate, key: string): string | null {
  const value = t(key, '')
  return value && value !== key ? value : null
}

export function verdictFor(kase: Case | null, t: Translate): Verdict | null {
  if (!kase) return null
  const situation = kase.ilcd_situation ?? null
  if (!situation) return null

  const entries: [VerdictDetail['section'], string | null | undefined][] = [
    ['ilcd', kase.ilcd_situation],
    ['lcc', kase.lcc_type],
    ['slca', kase.slca_activation_state],
  ]

  const method: string[] = []
  const details: VerdictDetail[] = []
  for (const [section, code] of entries) {
    if (!code) continue
    const short = lookup(t, `narrative.${section}.${code}.short`)
    if (!short) continue
    // the situation is the headline; the other axes are the lines under it
    if (section !== 'ilcd') method.push(short)
    const citation = NARRATIVE_SOURCES[section]?.[code]
    details.push({
      section,
      code,
      short,
      detail: lookup(t, `narrative.${section}.${code}.detail`) ?? short,
      quote: citation?.quote,
      source: citation?.source,
    })
  }

  const codes = [
    situation,
    kase.lcc_type && kase.lcc_type !== 'deactivated' ? `LCC ${kase.lcc_type}` : null,
  ].filter((s): s is string => Boolean(s))

  return {
    title: lookup(t, `narrative.ilcd.${situation}.title`) ?? situation,
    body: lookup(t, `narrative.ilcd.${situation}.short`) ?? '',
    method,
    codes,
    details,
  }
}
