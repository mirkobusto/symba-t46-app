// Advanced overrides editor — i18n.
//
// The three keys the engine reads (advancedKeys.ts), each checked as typed: a
// value it cannot read is said, and the questionnaire does not run until it
// is fixed or cleared. "Add custom key" made a key with no name and no effect,
// since the engine reads no other key (UX round 6, P7-13): it is gone. Keys of
// that kind in a case saved earlier are listed, to be removed.

import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { KNOWN_KEYS, validAdvancedValue } from './advancedKeys'

interface Props {
  advanced: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}

export default function AdvancedEditor({ advanced, onChange }: Props) {
  const { t } = useTranslation()
  const entries = Object.entries(advanced)
  const otherEntries = entries.filter(
    ([k]) => !KNOWN_KEYS.some((kk) => kk.key === k),
  )

  function setKey(key: string, raw: string) {
    if (raw.trim() === '') {
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
            <th aria-label={t('common.actions')}></th>
          </tr>
        </thead>
        <tbody>
          {KNOWN_KEYS.map((k) => {
            const value = valueOf(k.key)
            const invalid = value.trim() !== '' && !validAdvancedValue(k.kind, advanced[k.key])
            const errorId = `advanced-${k.key}-error`
            return (
              <tr key={k.key}>
                <td>
                  <code>{k.key}</code>
                </td>
                <td>
                  <input
                    type="text"
                    className="row-input"
                    value={value}
                    aria-label={`${t('advanced.headers.value')}: ${k.key}`}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? errorId : undefined}
                    placeholder={t('advanced.examplePlaceholder', { example: k.example })}
                    onChange={(e) => setKey(k.key, e.target.value)}
                  />
                  {invalid ? (
                    <div id={errorId} className="error-text">{t(`advanced.invalid.${k.kind}`)}</div>
                  ) : null}
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
            )
          })}

          {otherEntries.map(([k]) => (
            <tr key={k}>
              <td>
                <code>{k}</code>
              </td>
              <td>
                <span className="muted">{valueOf(k) || '—'}</span>
              </td>
              <td className="muted">{t('advanced.notRead')}</td>
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
