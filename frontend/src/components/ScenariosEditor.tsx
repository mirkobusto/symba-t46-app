// Q2-D scenarios editor — i18n.

import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { AlternativeScenario } from '../types/api'

interface Props {
  scenarios: AlternativeScenario[]
  onChange: (next: AlternativeScenario[]) => void
}

function nextId(existing: AlternativeScenario[]): string {
  const used = new Set(existing.map((s) => s.id))
  let n = existing.length + 1
  while (used.has(`alt${n}`)) n += 1
  return `alt${n}`
}

export default function ScenariosEditor({ scenarios, onChange }: Props) {
  const { t } = useTranslation()

  function addScenario() {
    onChange([
      ...scenarios,
      { id: nextId(scenarios), label: '', overrides: {} },
    ])
  }

  function removeScenario(id: string) {
    onChange(scenarios.filter((s) => s.id !== id))
  }

  function updateScenario(id: string, patch: Partial<AlternativeScenario>) {
    onChange(scenarios.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  return (
    <div className="scenarios-editor">
      <p className="muted">{t('scenarios.intro')}</p>

      {scenarios.length === 0 ? (
        <p className="muted">{t('scenarios.emptyHint')}</p>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>{t('scenarios.headers.id')}</th>
              <th>{t('scenarios.headers.label')}</th>
              <th aria-label="actions"></th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.id}>
                <td>
                  <code>{s.id}</code>
                </td>
                <td>
                  <input
                    type="text"
                    className="row-input"
                    value={s.label}
                    placeholder={t('scenarios.labelPlaceholder')}
                    onChange={(e) =>
                      updateScenario(s.id, { label: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeScenario(s.id)}
                    aria-label={t('scenarios.removeAria', { id: s.id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={addScenario}
      >
        <Plus size={16} />
        {t('scenarios.addButton')}
      </button>
    </div>
  )
}
