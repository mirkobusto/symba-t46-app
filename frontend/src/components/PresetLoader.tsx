// Preset loader — load one of the 13 paper fixtures into the case
// draft and jump to the questionnaire so the user can inspect, tweak,
// or run the pipeline against a known-good case.

import { FileText } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PRESETS } from '../presets/papers'
import { useCaseStore } from '../store/caseStore'

export default function PresetLoader() {
  const navigate = useNavigate()
  const setDraft = useCaseStore((s) => s.setDraft)
  const [presetId, setPresetId] = useState<string>(PRESETS[0]?.id ?? '')

  function handleLoad() {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    // Populate draft with the preset's Case fields. Initialise empty
    // dicts/arrays the engine expects so the form doesn't have to
    // null-check.
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
      <h2 className="preset-loader-title">Load a published case as preset</h2>
      <p className="muted">
        13 fixtures from the validation sample (12 papers + Leiva
        Escombreras / Frövi). Loads the Q1-Q7 + per-flow Q5 into the
        questionnaire so you can inspect and run the engine end-to-end.
      </p>
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
          Load preset
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
