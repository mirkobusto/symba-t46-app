// The verdict, in words.
//
// The engine speaks in codes — IS-01, "ILCD Situation A multi-actor",
// "C+E". Those are the right identifiers for a reviewer and useless as a
// first sentence, so the page leads with what they mean and keeps the
// codes as badges beside it.
//
// The English wording is canonical in backend/app/data/narrative.json
// (the .docx report reads the same table); the locales mirror it and a
// test checks the two have not drifted.

import { NARRATIVE_SOURCES } from '../i18n/narrativeSources'
import type { Case } from '../types/api'

export interface VerdictDetail {
  /** The code this expands on, e.g. "ILCD Situation A". */
  code: string
  /** Short line, as shown collapsed. */
  short: string
  /** Faithful paraphrase of the deliverable. */
  detail: string
  /** Verbatim citation — English, never translated. */
  quote?: string
  /** Where it comes from, e.g. "D4.1 Part 1 §8.2.1". */
  source?: string
}

export interface Verdict {
  /** Human title, e.g. "Operational symbiosis — decision support". */
  title: string
  /** One sentence saying what that means for this case. */
  body: string
  /** One line per method: what the pathway implies for LCA / LCC / S-LCA. */
  method: string[]
  /** The codes, kept for traceability. */
  codes: string[]
  /** Long-form explanation behind the "more info" disclosure. */
  details: VerdictDetail[]
  /** Paraphrase of what the pathway itself means. */
  pathwayDetail: string | null
}

type Translate = (key: string, fallback?: string) => string

function lookup(t: Translate, key: string): string | null {
  const value = t(key, '')
  return value && value !== key ? value : null
}

export function verdictFor(kase: Case | null, t: Translate): Verdict | null {
  if (!kase) return null
  const pathway = kase.pathway_id ?? null
  if (!pathway) return null

  const title = lookup(t, `narrative.pathway.${pathway}.title`) ?? pathway
  const bodyParts = [lookup(t, `narrative.pathway.${pathway}.body`)]
  if (kase.is_01_extended) bodyParts.push(lookup(t, 'narrative.extendedSuffix'))

  const entries: [string, string | null | undefined][] = [
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
    method.push(short)
    const citation = NARRATIVE_SOURCES[section]?.[code]
    details.push({
      code,
      short,
      detail: lookup(t, `narrative.${section}.${code}.detail`) ?? short,
      quote: citation?.quote,
      source: citation?.source,
    })
  }

  const codes = [
    pathway + (kase.is_01_extended ? ' extended' : ''),
    kase.ilcd_situation ?? null,
    kase.lcc_type && kase.lcc_type !== 'deactivated' ? `LCC ${kase.lcc_type}` : null,
  ].filter((s): s is string => Boolean(s))

  return {
    title,
    body: bodyParts.filter(Boolean).join(' '),
    method,
    codes,
    details,
    pathwayDetail: lookup(t, `narrative.pathway.${pathway}.detail`),
  }
}
