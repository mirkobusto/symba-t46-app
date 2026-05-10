// 4-A foundation stub.
//
// A minimal hardcoded form (Q1, Q2, Q3.env) that exercises the full
// pipeline call end-to-end. Real per-question UI lands in 4-B.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCaseStore } from '../store/caseStore'
import type { Q1, Q2 } from '../types/api'

const Q1_OPTIONS: Q1[] = ['A', 'B', 'C', 'D', 'E']
const Q2_OPTIONS: Q2[] = ['A', 'B', 'C', 'D']

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const draft = useCaseStore((s) => s.draft)
  const patchDraft = useCaseStore((s) => s.patchDraft)
  const runDraft = useCaseStore((s) => s.runDraft)
  const loading = useCaseStore((s) => s.loading)
  const error = useCaseStore((s) => s.error)

  const [q1, setQ1] = useState<Q1>(draft.q1 ?? 'A')
  const [q2, setQ2] = useState<Q2>(draft.q2 ?? 'A')
  const [env, setEnv] = useState(draft.q3?.env ?? true)
  const [eco, setEco] = useState(draft.q3?.eco ?? false)
  const [soc, setSoc] = useState(draft.q3?.soc ?? false)

  async function handleRun() {
    patchDraft({
      q1,
      q2,
      q3: { env, eco, soc },
    })
    const result = await runDraft()
    if (result) navigate('/result')
  }

  return (
    <div className="questionnaire">
      <h1>Questionnaire (4-A foundation stub)</h1>
      <p className="muted">
        Minimum demo form: Q1, Q2, Q3 booleans. Full per-question UI
        arrives in commit 4-B.
      </p>

      <fieldset className="field">
        <legend>Q1 — IS scenario archetype</legend>
        {Q1_OPTIONS.map((v) => (
          <label key={v} className="radio">
            <input
              type="radio"
              name="q1"
              value={v}
              checked={q1 === v}
              onChange={() => setQ1(v)}
            />
            <span>{v}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="field">
        <legend>Q2 — Temporal stance</legend>
        {Q2_OPTIONS.map((v) => (
          <label key={v} className="radio">
            <input
              type="radio"
              name="q2"
              value={v}
              checked={q2 === v}
              onChange={() => setQ2(v)}
            />
            <span>{v}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="field">
        <legend>Q3 — Sustainability dimensions</legend>
        <label className="check">
          <input
            type="checkbox"
            checked={env}
            onChange={(e) => setEnv(e.target.checked)}
          />
          <span>Environmental (LCA)</span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={eco}
            onChange={(e) => setEco(e.target.checked)}
          />
          <span>Economic (LCC / MFCA / CBA / TEA)</span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={soc}
            onChange={(e) => setSoc(e.target.checked)}
          />
          <span>Social (S-LCA)</span>
        </label>
      </fieldset>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleRun}
        disabled={loading}
      >
        {loading ? 'Running…' : 'Run pipeline'}
      </button>

      {error ? <p className="error-text">{error}</p> : null}
    </div>
  )
}
