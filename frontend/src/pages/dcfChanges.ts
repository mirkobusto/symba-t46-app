import type { DcfPayload } from '../types/dcf'

/** What working the answers out again changed in the Data Collection File,
 * against the saved version of the case (UX round 5, D3 / P7-06). */
export interface DcfChanges {
  /** Obligations (mandates and rules) the saved version listed and this one does not. */
  removed: number
  /** Obligations this version lists and the saved one did not. */
  added: number
  /** Fields the saved version asked and this one no longer asks, by label. */
  fieldsGone: string[]
  /** Fields this version asks and the saved one did not, by label. */
  fieldsNew: string[]
}

function activeFields(payload: DcfPayload): Map<string, string> {
  const out = new Map<string, string>()
  for (const section of payload.sections) {
    if (!section.active) continue
    for (const field of section.fields) {
      if (field.derived) continue
      out.set(field.id, field.label ?? field.label_en)
    }
  }
  return out
}

export function dcfChanges(before: DcfPayload, after: DcfPayload): DcfChanges {
  const was = new Set(before.obligations.map((o) => o.id))
  const now = new Set(after.obligations.map((o) => o.id))
  const fieldsBefore = activeFields(before)
  const fieldsAfter = activeFields(after)
  return {
    removed: [...was].filter((id) => !now.has(id)).length,
    added: [...now].filter((id) => !was.has(id)).length,
    fieldsGone: [...fieldsBefore].filter(([id]) => !fieldsAfter.has(id)).map(([, l]) => l),
    // labels of the current version are in the reader's language
    fieldsNew: [...fieldsAfter].filter(([id]) => !fieldsBefore.has(id)).map(([, l]) => l),
  }
}

export function hasChanges(c: DcfChanges): boolean {
  return c.removed + c.added + c.fieldsGone.length + c.fieldsNew.length > 0
}
