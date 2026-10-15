// Per-flow Q5 editor — i18n.

import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Flow, Q5, Q6a } from '../types/api'

const Q5_KEYS: Q5[] = ['a', 'b', 'c', 'd', 'e']

// Sectors that have a chapter in D4.1 Part 2 (§4-§8); the engine names it in
// a note. Labels are the Q6a ones.
const PART2_SECTORS: Q6a[] = [
  'agriculture_agrifood_biorefineries',
  'food_production',
  'plastics_packaging',
  'biobased_polymers',
  'wastewater_sludge_biofactories',
  'textile_leather',
  'waste_valorization',
]

function sellableValue(f: Flow): string {
  if (f.sellable_elsewhere == null) return ''
  return f.sellable_elsewhere ? 'yes' : 'no'
}

interface Props {
  flows: Flow[]
  onChange: (next: Flow[]) => void
}

function nextId(existing: Flow[]): string {
  const used = new Set(existing.map((f) => f.id))
  let n = existing.length + 1
  while (used.has(`f${n}`)) n += 1
  return `f${n}`
}

export default function FlowsEditor({ flows, onChange }: Props) {
  const { t } = useTranslation()

  function addFlow() {
    onChange([...flows, { id: nextId(flows), name: '', q5: 'c' }])
  }

  function removeFlow(id: string) {
    onChange(flows.filter((f) => f.id !== id))
  }

  function updateFlow(id: string, patch: Partial<Flow>) {
    onChange(flows.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  return (
    <div className="flows-editor">
      {/* Q5 asks for a valuation direction, which an analyst often only
          settles *during* the study. Saying it is a revisable starting
          assumption stops it reading as a question you must already know
          the answer to. */}
      <p className="flows-q5-note">{t('flows.q5Note')}</p>
      {flows.length === 0 ? (
        <p className="muted">{t('flows.emptyHint')}</p>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>{t('flows.headers.id')}</th>
              <th>{t('flows.headers.name')}</th>
              <th>{t('flows.headers.q5')}</th>
              <th title={t('flows.sellableHint')}>{t('flows.headers.sellable')}</th>
              <th title={t('flows.sectorHint')}>{t('flows.headers.sector')}</th>
              <th aria-label="actions"></th>
            </tr>
          </thead>
          <tbody>
            {flows.map((f) => (
              <tr key={f.id}>
                <td>
                  <code>{f.id}</code>
                </td>
                <td>
                  <input
                    type="text"
                    className="row-input"
                    value={f.name}
                    placeholder={t('flows.namePlaceholder')}
                    onChange={(e) => updateFlow(f.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <select
                    className="row-select"
                    value={f.q5}
                    onChange={(e) =>
                      updateFlow(f.id, { q5: e.target.value as Q5 })
                    }
                  >
                    {Q5_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {t(`flows.options.${k}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="row-select"
                    aria-label={t('flows.headers.sellable')}
                    value={sellableValue(f)}
                    onChange={(e) =>
                      updateFlow(f.id, {
                        sellable_elsewhere:
                          e.target.value === '' ? null : e.target.value === 'yes',
                      })
                    }
                  >
                    <option value="">{t('flows.sellable.unset')}</option>
                    <option value="yes">{t('flows.sellable.yes')}</option>
                    <option value="no">{t('flows.sellable.no')}</option>
                  </select>
                </td>
                <td>
                  <select
                    className="row-select"
                    aria-label={t('flows.headers.sector')}
                    value={f.sector ?? ''}
                    onChange={(e) =>
                      updateFlow(f.id, {
                        sector: e.target.value === '' ? null : (e.target.value as Q6a),
                      })
                    }
                  >
                    <option value="">{t('flows.sectorNone')}</option>
                    {PART2_SECTORS.map((k) => (
                      <option key={k} value={k}>
                        {t(`questionnaire.q6a.options.${k}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeFlow(f.id)}
                    aria-label={t('flows.removeAria', { id: f.id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button type="button" className="btn btn-secondary" onClick={addFlow}>
        <Plus size={16} />
        {t('flows.addButton')}
      </button>
    </div>
  )
}
