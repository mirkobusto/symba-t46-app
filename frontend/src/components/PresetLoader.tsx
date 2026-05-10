// Preset loader — load one of the 13 paper fixtures into the case
// draft and jump to the questionnaire.

import { FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { PRESETS } from '../presets/papers'
import { useCaseStore } from '../store/caseStore'

export default function PresetLoader() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setDraft = useCaseStore((s) => s.setDraft)
  const [presetId, setPresetId] = useState<string>(PRESETS[0]?.id ?? '')

  function handleLoad() {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setDraft({
      q3: { env: false, eco: false, soc: false },
      q4: [],
      flows: [],
      sites: [],
      alternative_scenarios: [],
      advanced: {},
      ...preset.case,
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
        <p className="preset-desc muted">
          <em>{selected.citation}</em> — {selected.description}
        </p>
      ) : null}
    </div>
  )
}
