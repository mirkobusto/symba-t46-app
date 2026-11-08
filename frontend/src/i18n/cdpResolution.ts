// How a critical decision point is resolved, in the reader's language. The
// schema text of CDP-01 speaks of Situation B and that of CDP-08 of Q4 = D; when
// the branch does not apply the engine sends `variant: 'default'` and the case's
// own sentence (UX round 6, P6-08, decided by Fable). The same keys word the
// Word report (docxReport.cdpCase).
import type { TFunction } from 'i18next'

const DEFAULT_KEY: Record<string, string> = {
  'CDP-01': 'docxReport.cdpCase.cdp01NotB',
  'CDP-08': 'docxReport.cdpCase.cdp08NoD',
}

export function cdpResolution(
  t: TFunction,
  code: string,
  variant: string | null | undefined,
  translated: string | null | undefined,
  engine: string | null | undefined,
): string | null {
  if (variant === 'default' && DEFAULT_KEY[code]) return t(DEFAULT_KEY[code])
  return translated || engine || null
}
