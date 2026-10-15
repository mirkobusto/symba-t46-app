// Advanced overrides editor — i18n.

import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Only the keys the engine actually reads from `case.advanced`:
// `asset_lifetime` and `future_background_threshold_years`
// (engine/activate.py) and `slca_framework_override` (engine/l1_blocks.py). The other six — transport_sensitive,
// network_nodes, interdependent_flows, frontier_categories_active,
// is_specific_capital_goods, multi_actor — were listed here with hints
// promising "true activates CIR-03" and so on, but l2_validate reads
// them with getattr() on the Case, which is extra='forbid', so nothing
// written here ever reached a rule (CLAUDE.md, I-17). Offering a lever
// that is not connected is worse than not offering it; typing the key
// by hand still works for whoever is testing the open item.
const KNOWN_KEYS = [
  { key: 'slca_framework_override', example: 'absolute' },
  { key: 'asset_lifetime', example: '20' },
  { key: 'future_background_threshold_years', example: '15' },
] as const

interface Props {
  advanced: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}

export default function AdvancedEditor({ advanced, onChange }: Props) {
  const { t } = useTranslation()
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
      <p className="muted">{t('advanced.intro')}</p>

      <table className="flows-table">
        <thead>
          <tr>
            <th>{t('advanced.headers.key')}</th>
            <th>{t('advanced.headers.value')}</th>
            <th>{t('advanced.headers.hint')}</th>
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
              <td className="muted">{t(`advanced.hints.${k.key}`)}</td>
              <td>
                {advanced[k.key] !== undefined ? (
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeKey(k.key)}
                    aria-label={t('advanced.clearAria', { key: k.key })}
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
              <td className="muted">{t('advanced.headers.custom')}</td>
              <td>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removeKey(k)}
                  aria-label={t('advanced.removeAria', { key: k })}
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
        {t('advanced.addCustom')}
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
