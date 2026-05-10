// Q2-D scenarios editor — i18n + per-scenario JSON overrides editor
// (Follow-up E completing Feature C).
//
// Each scenario row exposes a textarea where the user pastes a JSON
// dict of Case-shaped overrides. Live validation: invalid JSON shows
// a red border + an error chip; valid JSON updates scenario.overrides
// on the parent immediately.

import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
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
  // Track per-scenario raw textarea content + parse error so the user
  // can edit invalid JSON without losing keystrokes.
  const [rawOverrides, setRawOverrides] = useState<Record<string, string>>({})
  const [parseErrors, setParseErrors] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

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

  function getRaw(s: AlternativeScenario): string {
    if (rawOverrides[s.id] !== undefined) return rawOverrides[s.id]
    if (Object.keys(s.overrides).length === 0) return ''
    return JSON.stringify(s.overrides, null, 2)
  }

  function handleOverridesChange(id: string, raw: string) {
    setRawOverrides({ ...rawOverrides, [id]: raw })
    if (raw.trim() === '') {
      setParseErrors({ ...parseErrors, [id]: false })
      updateScenario(id, { overrides: {} })
      return
    }
    try {
      const parsed = JSON.parse(raw) as unknown
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Overrides must be a JSON object')
      }
      setParseErrors({ ...parseErrors, [id]: false })
      updateScenario(id, { overrides: parsed as Record<string, unknown> })
    } catch {
      setParseErrors({ ...parseErrors, [id]: true })
    }
  }

  function toggleExpanded(id: string) {
    setExpanded({ ...expanded, [id]: !expanded[id] })
  }

  return (
    <div className="scenarios-editor">
      <p className="muted">{t('scenarios.intro')}</p>
      <p className="muted">{t('scenariosResult.overrideHelp')}</p>

      {scenarios.length === 0 ? (
        <p className="muted">{t('scenarios.emptyHint')}</p>
      ) : (
        <div className="scenarios-list">
          {scenarios.map((s) => {
            const isOpen = expanded[s.id] ?? false
            const hasError = parseErrors[s.id] ?? false
            const overrideKeys = Object.keys(s.overrides).length
            return (
              <div key={s.id} className="scenario-row">
                <div className="scenario-row-header">
                  <button
                    type="button"
                    className="scenario-toggle"
                    onClick={() => toggleExpanded(s.id)}
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <code>{s.id}</code>
                  <input
                    type="text"
                    className="row-input"
                    value={s.label}
                    placeholder={t('scenarios.labelPlaceholder')}
                    onChange={(e) =>
                      updateScenario(s.id, { label: e.target.value })
                    }
                  />
                  <span className="muted scenario-overrides-count">
                    {overrideKeys === 0
                      ? '—'
                      : `${overrideKeys} override${overrideKeys === 1 ? '' : 's'}`}
                  </span>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeScenario(s.id)}
                    aria-label={t('scenarios.removeAria', { id: s.id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {isOpen ? (
                  <div className="scenario-overrides">
                    <textarea
                      className={`row-input scenario-overrides-input${hasError ? ' has-error' : ''}`}
                      value={getRaw(s)}
                      placeholder={t('scenariosResult.overridesPlaceholder')}
                      onChange={(e) => handleOverridesChange(s.id, e.target.value)}
                      rows={4}
                      spellCheck={false}
                    />
                    {hasError ? (
                      <p className="opt-warn">
                        {t('scenariosResult.overridesParseError', { id: s.id })}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
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
