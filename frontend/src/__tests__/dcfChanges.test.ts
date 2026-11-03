import { describe, expect, it } from 'vitest'

import { dcfChanges, hasChanges } from '../pages/dcfChanges'
import type { DcfPayload } from '../types/dcf'

function payload(obligations: string[], fields: string[]): DcfPayload {
  return {
    schema_version: '1.0-draft',
    case_id: 'c',
    ilcd_situation: null,
    lcc_type: null,
    slca_activation_state: null,
    sections: [
      {
        id: 'actors',
        title_en: 'Actors',
        description_en: '',
        applies_when: 'always',
        row_collection: 'user_added',
        active: true,
        fields: [
          { id: 'actor.id', label_en: 'Actor id', type: 'string', required: true, activation_predicate: 'always', derived: true },
          ...fields.map((id) => ({ id, label_en: id, label: `L:${id}`, type: 'string', required: false, activation_predicate: 'always' })),
        ],
      },
    ],
    obligations: obligations.map((id) => ({
      id, origin: 'mandate' as const, statement: '', method: 'LCA', category: 'x', fields: [], fields_not_applicable: [],
    })),
  } as unknown as DcfPayload
}

describe('dcfChanges', () => {
  it('counts obligations and fields that came and went, by label', () => {
    const before = payload(['a', 'b', 'c'], ['actor.name', 'actor.size_class'])
    const after = payload(['a', 'd'], ['actor.name', 'actor.country_iso2'])
    const c = dcfChanges(before, after)
    expect(c.removed).toBe(2)
    expect(c.added).toBe(1)
    expect(c.fieldsGone).toEqual(['L:actor.size_class'])
    expect(c.fieldsNew).toEqual(['L:actor.country_iso2'])
    expect(hasChanges(c)).toBe(true)
  })

  it('reports no change for the same file', () => {
    const p = payload(['a'], ['actor.name'])
    expect(hasChanges(dcfChanges(p, p))).toBe(false)
  })
})
