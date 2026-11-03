// Field editor for one DCF row (one actor, one flow).
//
// Renders ONLY the fields the backend activated for this case: the
// descriptor already applied the activation predicates. Values of fields
// switched off later are kept as "dormant" and not shown (UX round 5, D3).

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { DcfFieldDescriptor, DcfSection } from '../types/dcf'
import type { DcfDataIssue, DcfRow } from '../types/dcfData'
import type { Q5, Q6a, Site } from '../types/api'

// Engine enums referenced by `enum_ref` in dcf_schema.json. Mirrored
// here rather than fetched: they are the same lists the questionnaire
// already renders.
const Q5_KEYS: Q5[] = ['a', 'b', 'c', 'd', 'e']
const Q6A_KEYS: Q6a[] = [
  'none',
  'agriculture_agrifood_biorefineries',
  'biobased_polymers',
  'plastics_packaging',
  'pulp_paper',
  'chemicals_fertilizers',
  'cement_construction',
  'steel_metals',
  'energy_utilities',
  'wastewater_sludge_biofactories',
  'textile_leather',
  'waste_valorization',
  'food_production',
  'multi_tenant_urban_building',
  'multi_sector',
  'other',
]
const ENUM_REFS: Record<string, string[]> = { Q5: Q5_KEYS, Q6a: Q6A_KEYS }

const TEXTAREA_TYPES = new Set(['text'])
const NUMBER_TYPES = new Set(['float', 'int'])

interface Props {
  section: DcfSection
  row: DcfRow
  /** Actor rows, for fk_actor selects. */
  actors: DcfRow[]
  /** Sites declared on the Case, for fk_site selects. */
  sites: Site[]
  issues: DcfDataIssue[]
  onChange: (fieldId: string, value: unknown) => void
  /** Absent when there is nothing to remove (a questionnaire flow not drawn). */
  onRemove?: () => void
  /** Fields shown as text, not editable (a questionnaire flow's name and
   * payment class are set in the questionnaire, UX round 5 D2). */
  readOnly?: Set<string>
  /** A line above the fields (where the row comes from). */
  note?: string | null
  /** Extra buttons next to Remove (e.g. reverse an arrow). */
  actions?: ReactNode
  /** Label of the remove button, when it does something specific. */
  removeLabel?: string
}

function actorLabel(row: DcfRow, fallback: string): string {
  const name = row.values['actor.name']
  return typeof name === 'string' && name.trim() !== '' ? name : fallback
}

function optionsFor(field: DcfFieldDescriptor): string[] | null {
  if (field.enum_values && field.enum_values.length > 0) return field.enum_values
  if (field.enum_ref && ENUM_REFS[field.enum_ref]) return ENUM_REFS[field.enum_ref]
  return null
}

export default function DcfRowFields({
  section, row, actors, sites, issues, onChange, onRemove, readOnly, note, actions, removeLabel,
}: Props) {
  const { t } = useTranslation()
  const missing = new Set(
    issues.filter((i) => i.code === 'missing_required').map((i) => i.field_id),
  )

  // actor.id / flow.id are filled from row_id server-side; the composer
  // marks them so the form and the descriptor agree on what is asked for.
  const editable = section.fields.filter((f) => !f.derived)

  return (
    <div className="nb-panel-body">
      {note ? <p className="nb-panel-note">{note}</p> : null}
      {editable.map((field) => {
        const value = row.values[field.id]
        const stringValue =
          value === null || value === undefined ? '' : String(value)
        const options = optionsFor(field)
        const isMissing = missing.has(field.id)
        const inputId = `nb-${row.row_id}-${field.id}`

        return (
          <label
            key={field.id}
            className={`nb-field${isMissing ? ' nb-field-missing' : ''}`}
            htmlFor={inputId}
          >
            <span className="nb-field-label">
              {field.label || field.label_en}
              {field.required ? <span className="nb-req"> *</span> : null}
            </span>

            {readOnly?.has(field.id) ? (
              <span id={inputId} className="nb-field-readonly">
                {stringValue === '' ? '—' : (field.enum_labels?.[stringValue] ?? stringValue)}
              </span>
            ) : field.type === 'fk_actor' ? (
              <select
                id={inputId}
                value={stringValue}
                onChange={(e) => onChange(field.id, e.target.value)}
              >
                <option value="">—</option>
                {actors.map((a, i) => (
                  <option key={a.row_id} value={a.row_id}>
                    {actorLabel(a, `${t('networkBuilder.actor')} ${i + 1}`)}
                  </option>
                ))}
              </select>
            ) : field.type === 'fk_site' ? (
              <select
                id={inputId}
                value={stringValue}
                onChange={(e) => onChange(field.id, e.target.value)}
              >
                <option value="">—</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.id}
                  </option>
                ))}
              </select>
            ) : options ? (
              <select
                id={inputId}
                value={stringValue}
                onChange={(e) => onChange(field.id, e.target.value)}
              >
                <option value="">—</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {field.enum_labels?.[opt] ?? opt}
                  </option>
                ))}
              </select>
            ) : TEXTAREA_TYPES.has(field.type) ? (
              <textarea
                id={inputId}
                rows={3}
                value={stringValue}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
            ) : NUMBER_TYPES.has(field.type) ? (
              <input
                id={inputId}
                type="number"
                value={stringValue}
                onChange={(e) =>
                  onChange(
                    field.id,
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
              />
            ) : (
              <input
                id={inputId}
                type="text"
                value={stringValue}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
            )}

            {field.help || field.description_en ? (
              <span className="nb-field-help">{field.help || field.description_en}</span>
            ) : null}

            {/* Why this field is being asked, in words: the raw predicate
                ("q3.eco or q3.soc") read as code (UX round 2026-11-02). */}
            {field.reason ? (
              <span className="nb-field-why">
                {t('networkBuilder.whyAsked')} {field.reason}
              </span>
            ) : null}
          </label>
        )
      })}

      <div className="nb-panel-actions">
        {actions}
        {onRemove ? (
          <button type="button" className="btn btn-danger nb-remove" onClick={onRemove}>
            {removeLabel ?? t('networkBuilder.removeRow')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
