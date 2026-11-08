// The keys of `case.advanced` the engine reads, and what a valid value is.
//
// `asset_lifetime` and `future_background_threshold_years` (engine/activate.py)
// and `slca_framework_override` (engine/l1_blocks.py) are the only ones. The
// other keys once listed here never reached a rule (I-17): since R3
// (2026-10-18) is_specific_capital_goods is Q12, FU-02 follows Q11, and
// CIR-03 / CIR-04 / CIR-06 are retired because nodes cover them for every case.
// A value the engine cannot read was dropped in silence, and the header still
// counted it as an "active key" (UX round 6, P7-13).

export const KNOWN_KEYS = [
  { key: 'slca_framework_override', example: 'absolute', kind: 'absolute' },
  { key: 'asset_lifetime', example: '20', kind: 'years' },
  { key: 'future_background_threshold_years', example: '15', kind: 'years' },
] as const

export type AdvancedKind = (typeof KNOWN_KEYS)[number]['kind']

/** The bound the questionnaire puts on years (Q8): a typo guard. */
const MAX_YEARS = 500

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

/** Whether `value` is one the engine reads for a key of this kind. */
export function validAdvancedValue(kind: AdvancedKind, value: unknown): boolean {
  if (kind === 'absolute') return String(value).trim() === 'absolute'
  const n = typeof value === 'number' ? value : Number(String(value).trim())
  return Number.isFinite(n) && n > 0 && n <= MAX_YEARS
}

/** The known keys holding a value the engine cannot read. */
export function invalidAdvancedKeys(advanced: Record<string, unknown>): string[] {
  return KNOWN_KEYS
    .filter((k) => !isEmpty(advanced[k.key]) && !validAdvancedValue(k.kind, advanced[k.key]))
    .map((k) => k.key)
}

/** How many settings the engine will actually read. */
export function activeAdvancedCount(advanced: Record<string, unknown>): number {
  return KNOWN_KEYS.filter((k) => !isEmpty(advanced[k.key]) && validAdvancedValue(k.kind, advanced[k.key])).length
}
