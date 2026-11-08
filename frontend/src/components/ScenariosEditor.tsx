// Alternative scenarios editor (open to every study, D4.1 §4.3.3).
//
// A scenario changes a few answers of the questionnaire and the engine runs
// it next to the case. Each change is picked as "question → new answer", with
// the questionnaire's own labels: writing JSON with the engine's keys was the
// only way until the agent UX round of 2026-11-02, and the analyst had to
// guess both the key and the format. The JSON stays, folded, for experts and
// for keys the form does not cover.

import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDcfDataStore } from '../store/dcfDataStore'
import type { AlternativeScenario, Case, Flow } from '../types/api'
import {
  CHANGES, Q5_KEYS, SPEC, type ChangeSpec, defaultValue, effectiveAnswers, isAsked, withFollowUps,
} from './scenarioChanges'

interface Props {
  scenarios: AlternativeScenario[]
  onChange: (next: AlternativeScenario[]) => void
  /** The answers of the case: a new change starts from them, and the flows
   * give the per-flow "who pays whom" change its rows. */
  baseline?: Partial<Case>
  /** The names of the scenarios whose JSON cannot be read: the questionnaire
   * does not run while there is one, since the scenario would run with its
   * previous changes as if they were the new ones (UX round 6, P7-05). */
  onInvalidChange?: (names: string[]) => void
}

function nextId(existing: AlternativeScenario[]): string {
  // nor the id of a deleted scenario whose network is kept: a new scenario
  // would silently take that network over (Fable review of #226-#228)
  const kept = Object.keys(useDcfDataStore.getState().data.networks_by_scenario ?? {})
  const used = new Set([...existing.map((s) => s.id), ...kept])
  let n = existing.length + 1
  while (used.has(`alt${n}`)) n += 1
  return `alt${n}`
}

/** Keys a scenario cannot change: the flows, the scenarios themselves and
 * what the engine writes. */
const NOT_OVERRIDABLE = new Set([
  'id', 'flows', 'sites', 'alternative_scenarios', 'activated_nodes', 'blocked_by',
  'rule_violations', 'applicable_rules', 'warnings', 'cdp_flags', 'sector_rules',
  'ilcd_situation', 'lcc_type', 'slca_activation_state', 'lca', 'lcc', 'slca', 'report',
  'governance', 'methodological_charter', 'review', 'system',
])


/** The changes in the order they are shown: a follow-up question right under
 * the question it follows, as in the questionnaire. */
function shownOrder(keys: string[]): string[] {
  const present = new Set(keys)
  const followsShown = (k: string) => !!SPEC[k]?.parent && present.has(SPEC[k].parent!)
  const out: string[] = []
  for (const key of keys) {
    if (followsShown(key)) continue
    out.push(key)
    for (const child of keys) if (SPEC[child]?.parent === key) out.push(child)
  }
  return out
}

export default function ScenariosEditor({ scenarios, onChange, baseline = {}, onInvalidChange }: Props) {
  const { t } = useTranslation()
  const flows: Flow[] = baseline.flows ?? []
  // raw JSON per scenario while it is being edited, so a half-typed object
  // is not lost; cleared whenever the form changes the overrides
  const [rawOverrides, setRawOverrides] = useState<Record<string, string>>({})
  const [parseErrors, setParseErrors] = useState<Record<string, boolean | 'notOverridable'>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // the questions a scenario can change: the per-flow change needs flows, and a
  // follow-up is offered only where the questionnaire would ask it on the
  // scenario's own answers
  function changesFor(s: AlternativeScenario): ChangeSpec[] {
    const answers = effectiveAnswers(baseline, s.overrides)
    return CHANGES.filter((c) => (c.kind !== 'flowQ5' || flows.length > 0) && isAsked(c, answers))
  }

  const invalidNames = scenarios.filter((s) => parseErrors[s.id]).map((s) => s.label || s.id)
  const invalidKey = invalidNames.join('\u0000')
  useEffect(() => {
    onInvalidChange?.(invalidKey ? invalidKey.split('\u0000') : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidKey])
  // the half-typed JSON lives here: once the editor is gone, nothing is pending
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => onInvalidChange?.([]), [])

  function addScenario() {
    const id = nextId(scenarios)
    onChange([...scenarios, { id, label: '', overrides: {} }])
    setExpanded({ ...expanded, [id]: true })
  }

  function removeScenario(id: string) {
    const errors = { ...parseErrors }
    delete errors[id]
    setParseErrors(errors)
    onChange(scenarios.filter((s) => s.id !== id))
  }

  function updateScenario(id: string, patch: Partial<AlternativeScenario>) {
    onChange(scenarios.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function setOverrides(s: AlternativeScenario, overrides: Record<string, unknown>, changedKey?: string) {
    const raw = { ...rawOverrides }
    delete raw[s.id]
    setRawOverrides(raw)
    // the form rewrites the JSON: a pending JSON error is gone with it
    if (parseErrors[s.id]) setParseErrors({ ...parseErrors, [s.id]: false })
    updateScenario(s.id, { overrides: withFollowUps(overrides, baseline, changedKey) })
  }

  function addChange(s: AlternativeScenario) {
    const spec = changesFor(s).find((c) => !(c.key in s.overrides))
    if (spec) setOverrides(s, { ...s.overrides, [spec.key]: defaultValue(spec, baseline) }, spec.key)
  }

  function replaceChange(s: AlternativeScenario, oldKey: string, newKey: string) {
    const next: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(s.overrides)) {
      if (k === oldKey) next[newKey] = defaultValue(SPEC[newKey], baseline)
      else next[k] = v
    }
    setOverrides(s, next, newKey)
  }

  function removeChange(s: AlternativeScenario, key: string) {
    const next = { ...s.overrides }
    delete next[key]
    setOverrides(s, next, key)
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
      // a scenario changes answers of the questionnaire, not the flows or the
      // engine output: such keys were accepted and the run failed silently (P7-11)
      if (Object.keys(parsed).some((k) => NOT_OVERRIDABLE.has(k))) {
        setParseErrors({ ...parseErrors, [id]: 'notOverridable' })
        return
      }
      setParseErrors({ ...parseErrors, [id]: false })
      updateScenario(id, { overrides: parsed as Record<string, unknown> })
    } catch {
      setParseErrors({ ...parseErrors, [id]: true })
    }
  }

  function renderAnswer(s: AlternativeScenario, spec: ChangeSpec) {
    const value = s.overrides[spec.key]
    const set = (v: unknown) => setOverrides(s, { ...s.overrides, [spec.key]: v }, spec.key)
    if (spec.kind === 'flowQ5') {
      const byFlow = (value ?? {}) as Record<string, string>
      return (
        <span className="scenario-change-flows">
          {flows.map((f) => (
            <label key={f.id} className="scenario-change-flow">
              <span>{f.name || f.id}</span>
              <select
                className="row-select" aria-label={`${t('scenarios.newAnswer')}: ${f.name || f.id}`}
                value={byFlow[f.id] ?? f.q5 ?? ''}
                onChange={(e) => set({ ...byFlow, [f.id]: e.target.value })}
              >
                {Q5_KEYS.map((k) => <option key={k} value={k}>{t(`flows.options.${k}`)}</option>)}
              </select>
            </label>
          ))}
        </span>
      )
    }
    if (spec.kind === 'number') {
      return (
        <input
          type="number" min={spec.min ?? 0} max={spec.max} className="row-input scenario-change-number"
          aria-label={t('scenarios.newAnswer')}
          placeholder={spec.key === 'operating_start_year' ? t('questionnaire.q8.start.yearPlaceholder') : undefined}
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => set(e.target.value === '' ? null : Number(e.target.value))}
        />
      )
    }
    if (spec.kind === 'text') {
      return (
        <input
          type="text" className="row-input" maxLength={120}
          aria-label={t('scenarios.newAnswer')}
          placeholder={t('questionnaire.q7.market.regionPlaceholder')}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => set(e.target.value)}
        />
      )
    }
    if (spec.kind === 'dims') {
      const dims = (value ?? {}) as Record<string, boolean>
      return (
        <span className="scenario-change-checks">
          {(['env', 'eco', 'soc'] as const).map((d) => (
            <label key={d}>
              <input type="checkbox" checked={!!dims[d]} onChange={() => set({ ...dims, [d]: !dims[d] })} />
              {' '}{t(`questionnaire.q3.${d}`)}
            </label>
          ))}
        </span>
      )
    }
    if (spec.kind === 'multi') {
      const chosen = new Set((value ?? []) as string[])
      return (
        <span className="scenario-change-checks">
          {spec.options!.map((o) => (
            <label key={String(o.value)}>
              <input
                type="checkbox" checked={chosen.has(o.value as string)}
                onChange={() => {
                  const next = new Set(chosen)
                  if (next.has(o.value as string)) next.delete(o.value as string)
                  else next.add(o.value as string)
                  set([...next])
                }}
              />
              {' '}{o.label(t)}
            </label>
          ))}
        </span>
      )
    }
    const index = spec.options!.findIndex((o) => o.value === (value ?? null))
    return (
      <select
        className="row-select" aria-label={t('scenarios.newAnswer')}
        value={index}
        onChange={(e) => set(spec.options![Number(e.target.value)].value)}
      >
        {spec.options!.map((o, i) => <option key={i} value={i}>{o.label(t)}</option>)}
      </select>
    )
  }

  return (
    <div className="scenarios-editor">
      <p className="muted">{t('scenarios.intro')}</p>

      {scenarios.length === 0 ? (
        <p className="muted">{t('scenarios.emptyHint')}</p>
      ) : (
        <div className="scenarios-list">
          {scenarios.map((s) => {
            const isOpen = expanded[s.id] ?? false
            const hasError = parseErrors[s.id] ?? false
            const offered = changesFor(s)
            const formKeys = shownOrder(Object.keys(s.overrides).filter((k) => k in SPEC))
            const otherKeys = Object.keys(s.overrides).filter((k) => !(k in SPEC))
            return (
              <div key={s.id} className="scenario-row">
                <div className="scenario-row-header">
                  <button
                    type="button"
                    className="scenario-toggle"
                    onClick={() => setExpanded({ ...expanded, [s.id]: !isOpen })}
                    aria-expanded={isOpen}
                    aria-label={s.label || s.id}
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <input
                    type="text"
                    className="row-input"
                    value={s.label}
                    placeholder={t('scenarios.labelPlaceholder')}
                    aria-label={t('scenarios.headers.label')}
                    onChange={(e) => updateScenario(s.id, { label: e.target.value })}
                  />
                  <span className="muted scenario-overrides-count">
                    {t('scenarios.changesCount', { count: Object.keys(s.overrides).length })}
                  </span>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeScenario(s.id)}
                    aria-label={t('scenarios.removeAria', { id: s.label || s.id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {isOpen ? (
                  <div className="scenario-overrides">
                    {formKeys.length === 0 ? (
                      <p className="muted">{t('scenarios.noChanges')}</p>
                    ) : (
                      <ul className="scenario-changes">
                        {formKeys.map((key) => (
                          <li key={key} className={`scenario-change${SPEC[key].parent ? ' scenario-change-followup' : ''}`}>
                            <select
                              className="row-select" aria-label={t('scenarios.pickQuestion')}
                              value={key}
                              onChange={(e) => replaceChange(s, key, e.target.value)}
                            >
                              {[SPEC[key], ...offered.filter((c) => c.key !== key && !(c.key in s.overrides))].map((c) => (
                                <option key={c.key} value={c.key}>{c.title(t)}</option>
                              ))}
                            </select>
                            <span aria-hidden="true">→</span>
                            {renderAnswer(s, SPEC[key])}
                            <button
                              type="button" className="icon-btn"
                              onClick={() => removeChange(s, key)}
                              aria-label={t('scenarios.removeChange')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {offered.some((c) => !(c.key in s.overrides)) ? (
                      <button type="button" className="btn btn-secondary" onClick={() => addChange(s)}>
                        <Plus size={14} /> {t('scenarios.addChange')}
                      </button>
                    ) : null}
                    {otherKeys.length > 0 ? (
                      <p className="muted">{t('scenarios.otherKeys', { count: otherKeys.length })}</p>
                    ) : null}
                    <details className="scenario-json">
                      <summary>{t('scenarios.jsonToggle')}</summary>
                      <textarea
                        className={`row-input scenario-overrides-input${hasError ? ' has-error' : ''}`}
                        value={getRaw(s)}
                        placeholder={t('scenariosResult.overridesPlaceholder')}
                        onChange={(e) => handleOverridesChange(s.id, e.target.value)}
                        rows={4}
                        spellCheck={false}
                        aria-invalid={hasError ? true : undefined}
                      />
                      {hasError ? (
                        <p className="opt-warn">
                          {hasError === 'notOverridable'
                            ? t('scenariosResult.overridesNotAllowed')
                            : t('scenariosResult.overridesParseError', { id: s.label || s.id })}
                        </p>
                      ) : null}
                    </details>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <button type="button" className="btn btn-secondary" onClick={addScenario}>
        <Plus size={16} /> {t('scenarios.addButton')}
      </button>
    </div>
  )
}
