// Per-flow Q5 editor — i18n.

import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Flow, Q5 } from '../types/api'

const Q5_KEYS: Q5[] = ['a', 'b', 'c', 'd', 'e']

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
      {flows.length === 0 ? (
        <p className="muted">{t('flows.emptyHint')}</p>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>{t('flows.headers.id')}</th>
              <th>{t('flows.headers.name')}</th>
              <th>{t('flows.headers.q5')}</th>
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
