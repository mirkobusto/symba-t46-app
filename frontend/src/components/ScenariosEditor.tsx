// Q2-D baseline + alternative scenarios editor (Step 4-C).
//
// Visible only when Q2='D'. Edits case.alternative_scenarios: a list
// of {id, label, overrides}. For 4-C MVP each scenario is just id +
// label; the per-scenario overrides dict (Q-answer overrides vs
// baseline) is left empty and will be exposed via the advanced editor
// in 4-D.

import { Plus, Trash2 } from 'lucide-react'

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
      <p className="muted">
        Add one row per alternative scenario you want to compare against
        the baseline. The overrides dict (Q-answer deltas vs baseline)
        is configured in the advanced editor (Step 4-D); for now each
        scenario carries an empty overrides map.
      </p>

      {scenarios.length === 0 ? (
        <p className="muted">No alternative scenarios yet.</p>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
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
                    placeholder="e.g. Future expansion / TRL9 ramp-up"
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
                    aria-label={`Remove ${s.id}`}
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
        Add scenario
      </button>
    </div>
  )
}
