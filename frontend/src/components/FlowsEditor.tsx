// Per-flow Q5 editor — i18n.

import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { configurationsFor } from '../presets/part2Configurations'
import type { Flow, Q5, Q6a } from '../types/api'
import { usePreferenceStore } from '../store/preferenceStore'

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

/**
 * An id never used before in this case. Reusing the id of a deleted flow
 * ("f3" again) silently gave the new flow the old one's row in the Data
 * Collection File — quantities, unit, arrow — now that name and payment class
 * follow the questionnaire (Fable review of #203).
 */
function nextId(existing: Flow[], now = Date.now()): string {
  const used = new Set(existing.map((f) => f.id))
  let id = `f${now.toString(36)}`
  while (used.has(id)) id += 'x'
  return id
}

export default function FlowsEditor({ flows, onChange }: Props) {
  const { t } = useTranslation()
  // guided mode: who pays whom in words, headers without "Part 2", and a
  // sector hint that says when to leave it empty (UX round 2026-11-03: the
  // table was where a newcomer gave up, P3-04, P7-03)
  const guided = usePreferenceStore((s) => s.mode) === 'guided'
  const header = (k: 'q5' | 'sector' | 'configuration') =>
    guided ? t(`flows.plainHeaders.${k}`) : t(`flows.headers.${k}`)

  function addFlow() {
    onChange([...flows, { id: nextId(flows), name: '' }])
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
        <p className="muted">{t(guided ? 'flows.plainEmpty' : 'flows.emptyHint')}</p>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>{t('flows.headers.id')}</th>
              <th>{t('flows.headers.name')}</th>
              <th>{header('q5')}</th>
              <th title={t('flows.sellableHint')}>{t('flows.headers.sellable')}</th>
              <th title={t('flows.sectorHint')}>{header('sector')}</th>
              <th title={t('flows.configurationHint')}>{header('configuration')}</th>
              <th aria-label={t('common.actions')}></th>
            </tr>
          </thead>
          <tbody>
            {flows.map((f, i) => (
              <tr key={f.id}>
                {/* a row number: the generated id ("fmw27vk3f") meant nothing on
                    screen (Kimi test 2026-11-04, A7-05); it stays on hover for the
                    scenarios' JSON */}
                <td title={f.id}>{i + 1}</td>
                <td>
                  <input
                    type="text"
                    className="row-input"
                    value={f.name}
                    aria-label={t('flows.headers.name')}
                    placeholder={t('flows.namePlaceholder')}
                    onChange={(e) => updateFlow(f.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <select
                    className="row-select"
                    aria-label={t('flows.headers.q5')}
                    aria-invalid={!f.q5}
                    value={f.q5 ?? ''}
                    onChange={(e) =>
                      updateFlow(f.id, { q5: (e.target.value || undefined) as Q5 | undefined })
                    }
                  >
                    <option value="" disabled>{t('flows.q5Unset')}</option>
                    {Q5_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {t(guided ? `flows.plainOptions.${k}` : `flows.options.${k}`)}
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
                    onChange={(e) => {
                      const sector = e.target.value === '' ? null : (e.target.value as Q6a)
                      // a configuration belongs to one chapter: drop it if the sector moves away
                      const keep = f.configuration && configurationsFor(sector).includes(f.configuration)
                      updateFlow(f.id, { sector, configuration: keep ? f.configuration : null })
                    }}
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
                  <select
                    className="row-select"
                    aria-label={t('flows.headers.configuration')}
                    value={f.configuration ?? ''}
                    disabled={configurationsFor(f.sector).length === 0}
                    onChange={(e) =>
                      updateFlow(f.id, { configuration: e.target.value === '' ? null : e.target.value })
                    }
                  >
                    <option value="">{t('flows.configurationNone')}</option>
                    {configurationsFor(f.sector).map((k) => (
                      <option key={k} value={k}>
                        {t(`flows.configurations.${k}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeFlow(f.id)}
                    aria-label={t('flows.removeAria', { id: f.name || i + 1 })}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {flows.length > 0 ? (
        <p className="flows-q5-note">{t(guided ? 'flows.plainSectorHint' : 'flows.sectorHint')}</p>
      ) : null}
      {/* the table has no "from whom to whom" (UX round 6, P1-12) */}
      {guided ? <p className="flows-q5-note">{t('flows.plainNameHint')}</p> : null}

      <button type="button" className="btn btn-secondary" onClick={addFlow}>
        <Plus size={16} />
        {t('flows.addButton')}
      </button>
    </div>
  )
}
