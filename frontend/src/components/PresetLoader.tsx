// Preset loader — load one of the 13 paper fixtures into the case
// draft and jump to the questionnaire.

import { FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { PRESETS } from '../presets/papers'
import { useCaseStore } from '../store/caseStore'
import { useToastStore } from '../store/toastStore'

export default function PresetLoader() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setDraft = useCaseStore((s) => s.setDraft)
  const draft = useCaseStore((s) => s.draft)
  const [presetId, setPresetId] = useState<string>(PRESETS[0]?.id ?? '')

  function handleLoad() {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    // loading replaced a case being built, silently (UX round 2026-11-02)
    const hasWork = !!draft.q1 || !!draft.decision_context || (draft.flows?.length ?? 0) > 0
    if (hasWork && !window.confirm(t('preset.replaceConfirm'))) return
    setDraft({
      q3: { env: false, eco: false, soc: false },
      q4: [],
      flows: [],
      sites: [],
      alternative_scenarios: [],
      advanced: {},
      ...preset.case,
    })
    useToastStore.getState().push({
      type: 'info',
      message: t('preset.loaded', { name: preset.citation }),
    })
    navigate('/questionnaire')
  }

  const selected = PRESETS.find((p) => p.id === presetId)

  return (
    <div className="preset-loader">
      <h2 className="preset-loader-title">{t('preset.title')}</h2>
      <p className="muted">{t('preset.help')}</p>
      <div className="preset-row">
        <select
          className="select"
          value={presetId}
          onChange={(e) => setPresetId(e.target.value)}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleLoad}
        >
          <FileText size={16} />
          {t('preset.loadButton')}
        </button>
      </div>
      {selected ? (
        <div className="preset-details">
          <p className="preset-desc muted">
            <em>{selected.citation}</em> — {selected.description}
          </p>
          <details className="preset-rationale">
            <summary>{t('preset.rationaleToggle')}</summary>
            <p>{selected.rationale}</p>
          </details>
        </div>
      ) : null}
    </div>
  )
}
