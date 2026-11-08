// D4.1 Part 2 sector rules and configurations in the reader's language.
//
// The engine sends each rule in English (sector_overlays.json). The
// translations live in sectorTerms.json, keyed by rule id (statements), by the
// first rule carrying a note (notes, see `note_owners`) and by configuration id
// (the substituted product). The `en` block copies the overlays verbatim; a
// backend test (test_sector_terms_i18n.py) fails when the overlays change and
// the copy does not, which is the signal to review the translations. Missing
// entries fall back to the English text.

import type { TFunction } from 'i18next'

import type { SectorRule } from '../types/api'
import terms from './sectorTerms.json'

type Group = 'rules' | 'notes' | 'substitutes' | 'conditions'
type Bag = Record<Group, Record<string, string>>
const TERMS = terms as unknown as Record<string, Bag> & { note_owners: Record<string, string[]> }

const NOTE_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(TERMS.note_owners).flatMap(([owner, ids]) => ids.map((id) => [id, owner])),
)

function pick(lang: string, group: Group, key: string | undefined): string | undefined {
  if (!key) return undefined
  const base = lang.split('-')[0]
  return TERMS[base]?.[group]?.[key]
}

export function sectorStatement(t: TFunction, lang: string, r: SectorRule): string {
  if (r.group === 'configuration' && r.configuration_id) {
    return t('result.sectorRules.configurationLine', {
      flow: r.flow_name,
      configuration: t(`flows.configurations.${r.configuration_id}`),
      substitutes: pick(lang, 'substitutes', r.configuration_id) ?? r.substitutes,
    })
  }
  return pick(lang, 'rules', r.id) ?? r.statement
}

/** The condition under which a rule applies ("applies_when"), in the reader's
 * language; null for a rule without one. The engine never checks it: the study
 * decides (UX round 6, P1-13, decided by Fable). */
export function sectorCondition(lang: string, r: SectorRule): string | null {
  if (!r.applies_when) return null
  return pick(lang, 'conditions', r.id) ?? r.applies_when
}

export function sectorNote(t: TFunction, lang: string, r: SectorRule): string {
  if (r.group === 'configuration') return t('result.sectorRules.c2NoCredit')
  return pick(lang, 'notes', NOTE_KEY[r.id]) ?? r.note ?? ''
}
