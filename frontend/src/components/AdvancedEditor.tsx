// Advanced overrides editor — i18n.

import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const KNOWN_KEYS = [
  { key: 'slca_framework_override', example: 'absolute' },
  { key: 'asset_lifetime', example: '20' },
  { key: 'transport_sensitive', example: 'true' },
  { key: 'network_nodes', example: '5' },
  { key: 'interdependent_flows', example: 'true' },
  { key: 'frontier_categories_active', example: 'true' },
  { key: 'is_specific_capital_goods', example: 'true' },
  { key: 'multi_actor', example: 'true' },
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
