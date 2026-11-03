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

  const situationBadge = lookup(t, `result.situationBadge.${situation.replace('ILCD Situation ', '')}`) ?? situation
  const lcc = kase.lcc_type && kase.lcc_type !== 'deactivated' ? kase.lcc_type : null
  const lccBadge = lcc ? lookup(t, `result.lccBadge.${lcc}`) ?? `LCC ${lcc}` : null
  // no LCA: the ILCD situation prescribes no modelling, so the costing heads
  // the verdict and the situation steps down to a badge (decided by Fable,
  // UX round 2026-11-03)
  if (!kase.q3?.env && lcc) {
    return {
      title: lookup(t, `result.lccTitle.${lcc}`) ?? lccBadge ?? lcc,
      body: lookup(t, `narrative.lcc.${lcc}.short`) ?? '',
      method: method.filter((m) => m !== lookup(t, `narrative.lcc.${lcc}.short`)),
      // the ILCD situations are LCA categories: no badge without an LCA (P2-08)
      codes: [lccBadge].filter((s): s is string => Boolean(s)),
      details,
    }
  }

  const codes = [situationBadge, lccBadge].filter((s): s is string => Boolean(s))

  return {
    title: lookup(t, `narrative.ilcd.${situation}.title`) ?? situation,
    body: lookup(t, `narrative.ilcd.${situation}.short`) ?? '',
    method,
    codes,
    details,
  }
}

/**
 * The verdict in words for a public reader. "Decision support with limited
 * consequences" read as "the effects are small" to a resident, a consumer and
 * a regional officer (UX round 2026-11-03, decided by Fable): the public
 * views say what kind of study it is, the ILCD code stays in the badges.
 * A study with no LCA keeps the costing headline of verdictFor.
 */
export function plainVerdict(kase: Case, verdict: Verdict, t: Translate): { title: string; body: string } {
  const situation = kase.ilcd_situation?.replace('ILCD Situation ', '')
  if (!kase.q3?.env || !situation) return { title: verdict.title, body: verdict.body }
  return {
    title: lookup(t, `reader.verdict.${situation}.title`) ?? verdict.title,
    body: lookup(t, `reader.verdict.${situation}.body`) ?? verdict.body,
  }
}
