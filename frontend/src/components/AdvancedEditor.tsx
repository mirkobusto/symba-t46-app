// Advanced overrides editor — Step 4-D.
//
// Edits case.advanced as a key/value dict. Pre-populates rows for the
// 7 known defensive keys that l1_blocks/activate/l2_validate read via
// getattr (asset_lifetime, transport_sensitive, network_nodes,
// interdependent_flows, frontier_categories_active,
// is_specific_capital_goods, multi_actor) plus
// slca_framework_override (the only L1 BLOCK 2 trigger).
//
// Values are stored as the raw string the user typed. The user is
// responsible for picking semantically meaningful values:
//   - booleans: type "true" / "false"
//   - numbers:  type the digits (we coerce to Number on submit)
//   - strings:  free text (e.g. "absolute" for slca_framework_override)
//
// On submit (handled by parent) the dict is shipped as-is; the engine
// reads via dict.get with sensible defaults.

import { Plus, Trash2 } from 'lucide-react'

interface KnownKey {
  key: string
  hint: string
  example: string
}

const KNOWN_KEYS: KnownKey[] = [
  { key: 'slca_framework_override', hint: "Set to 'absolute' to test L1 BLOCK 2 (with Q3.soc=true)", example: 'absolute' },
  { key: 'asset_lifetime', hint: 'Years; >15 activates lca_mc_21, lcc_hc_23, CIR-01', example: '20' },
  { key: 'transport_sensitive', hint: 'Boolean; true activates CIR-03', example: 'true' },
  { key: 'network_nodes', hint: 'Integer; ≥3 (with Q1=B + interdependent_flows) activates CIR-04', example: '5' },
  { key: 'interdependent_flows', hint: 'Boolean; true (with Q1=B + network_nodes≥3) activates CIR-04', example: 'true' },
  { key: 'frontier_categories_active', hint: 'Boolean; true activates CIR-06', example: 'true' },
  { key: 'is_specific_capital_goods', hint: 'Boolean; true activates IR-13 / B-06 / CIR-08', example: 'true' },
  { key: 'multi_actor', hint: 'Boolean; true (with Q1∈{B,C}) activates FU-02', example: 'true' },
]

interface Props {
  advanced: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}

export default function AdvancedEditor({ advanced, onChange }: Props) {
  const entries = Object.entries(advanced)
  const customEntries = entries.filter(
    ([k]) => !KNOWN_KEYS.some((kk) => kk.key === k),
  )

  function setKey(key: string, raw: string) {
    if (raw === '') {
      const next = { ...advanced }
      delete next[key]
      onChange(next)
      return
    }
    onChange({ ...advanced, [key]: coerce(raw) })
  }

  function removeKey(key: string) {
    const next = { ...advanced }
    delete next[key]
    onChange(next)
  }

  function addCustom() {
    const base = 'custom_'
    let i = 1
    while (advanced[`${base}${i}`] !== undefined) i += 1
    onChange({ ...advanced, [`${base}${i}`]: '' })
  }

  function valueOf(key: string): string {
    const v = advanced[key]
    if (v === undefined || v === null) return ''
    if (typeof v === 'object') return JSON.stringify(v)
    return String(v)
  }

  return (
    <div className="advanced-editor">
      <p className="muted">
        Expert-mode overrides. Each key is read by the engine via{' '}
        <code>dict.get</code>; missing keys mean &quot;use the default&quot;.
        Values are coerced to <code>true</code>/<code>false</code>/
        <code>number</code>/<code>string</code> as appropriate.
      </p>

      <table className="flows-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Hint</th>
            <th aria-label="actions"></th>
          </tr>
        </thead>
        <tbody>
          {KNOWN_KEYS.map((k) => (
            <tr key={k.key}>
              <td>
                <code>{k.key}</code>
              </td>
              <td>
                <input
                  type="text"
                  className="row-input"
                  value={valueOf(k.key)}
                  placeholder={`e.g. ${k.example}`}
                  onChange={(e) => setKey(k.key, e.target.value)}
                />
              </td>
              <td className="muted">{k.hint}</td>
              <td>
                {advanced[k.key] !== undefined ? (
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeKey(k.key)}
                    aria-label={`Clear ${k.key}`}
                  >
                    <Trash2 size={16} />
                  </button>
                ) : null}
              </td>
            </tr>
          ))}

          {customEntries.map(([k]) => (
            <tr key={k}>
              <td>
                <code>{k}</code>
              </td>
              <td>
                <input
                  type="text"
                  className="row-input"
                  value={valueOf(k)}
                  onChange={(e) => setKey(k, e.target.value)}
                />
              </td>
              <td className="muted">custom</td>
              <td>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removeKey(k)}
                  aria-label={`Remove ${k}`}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className="btn btn-secondary" onClick={addCustom}>
        <Plus size={16} />
        Add custom key
      </button>
    </div>
  )
}

function coerce(raw: string): unknown {
  const trimmed = raw.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed !== '' && !Number.isNaN(Number(trimmed))) return Number(trimmed)
  return raw
}
