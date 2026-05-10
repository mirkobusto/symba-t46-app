// Per-flow Q5 editor (Step 4-C).
//
// Dynamic table: one row per Flow. Each row carries id (auto), name,
// q5 (a..e). Add/remove rows. Per-flow Q5 supersedes the legacy
// case.q5 single-value field; downstream engine activation walks
// case.flows for per_flow nodes (lcc_hc_12/13, lca_mc_17, etc.).

import { Plus, Trash2 } from 'lucide-react'

import type { Flow, Q5 } from '../types/api'

const Q5_OPTIONS: { value: Q5; label: string }[] = [
  { value: 'a', label: 'a — A pays B (waste)' },
  { value: 'b', label: 'b — Free (ambiguous)' },
  { value: 'c', label: 'c — B pays A (co-product)' },
  { value: 'd', label: 'd — Interdependent' },
  { value: 'e', label: 'e — Aggregated / black-box' },
]

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
  function addFlow() {
    onChange([
      ...flows,
      { id: nextId(flows), name: '', q5: 'c' },
    ])
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
        <p className="muted">
          No flows yet. Add at least one to characterise per-flow Q5.
        </p>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Q5</th>
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
                    placeholder="e.g. heat, CO2"
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
                    {Q5_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeFlow(f.id)}
                    aria-label={`Remove ${f.id}`}
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
        Add flow
      </button>
    </div>
  )
}
