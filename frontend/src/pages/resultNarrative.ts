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

import type { Case } from '../types/api'

export interface Verdict {
  /** Human title, e.g. "Operational symbiosis — decision support". */
  title: string
  /** One sentence saying what that means for this case. */
  body: string
  /** One line per method: what the pathway implies for LCA / LCC / S-LCA. */
  method: string[]
  /** The codes, kept for traceability. */
  codes: string[]
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

  const method = [
    kase.ilcd_situation ? lookup(t, `narrative.ilcd.${kase.ilcd_situation}`) : null,
    kase.lcc_type ? lookup(t, `narrative.lcc.${kase.lcc_type}`) : null,
    kase.slca_activation_state
      ? lookup(t, `narrative.slca.${kase.slca_activation_state}`)
      : null,
  ].filter((s): s is string => Boolean(s))

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
  }
}
