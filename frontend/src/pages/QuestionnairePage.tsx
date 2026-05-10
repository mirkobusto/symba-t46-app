// 4-B — full per-question UI for Q1-Q7.
//
// Out of scope (deferred to 4-C):
//   - Q5 per-flow tabular UI (this commit uses the legacy single-value
//     `q5` field; the per-flow `flows[]` editor lands in 4-C)
//   - Q2-D baseline + alternative scenarios editor (Q2-D is selectable
//     but the secondary scenarios editor is in 4-C)
//
// Out of scope (deferred to 4-D):
//   - "Show reasoning" panel
//   - case.advanced editor

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import QuestionCard from '../components/QuestionCard'
import { useCaseStore } from '../store/caseStore'
import type { Q1, Q2, Q4, Q5, Q6a, Q6b, Q7 } from '../types/api'

// ---- Option metadata (labels + descriptions) ----

const Q1_OPTIONS: { value: Q1; label: string; description: string }[] = [
  { value: 'A', label: 'A. Specific exchange', description: 'A symbiotic exchange between two existing companies.' },
  { value: 'B', label: 'B. Eco-park / network', description: 'An eco-industrial park or multi-actor symbiotic network.' },
  { value: 'C', label: 'C. Policy / programme', description: 'A policy or programme decision at regional or national scale.' },
  { value: 'D', label: 'D. Corporate report', description: "A single company's symbiotic contribution for ESG/CSRD reporting." },
  { value: 'E', label: 'E. Monitoring', description: 'Time-series monitoring of an already operational symbiosis.' },
]

const Q2_OPTIONS: { value: Q2; label: string; description: string }[] = [
  { value: 'A', label: 'A. Operational', description: 'Exists and has been operating for years (real operational data).' },
  { value: 'B', label: 'B. Under construction', description: 'Under construction or recently commissioned.' },
  { value: 'C', label: 'C. Design phase', description: 'Only in design phase (no operational data).' },
  { value: 'D', label: 'D. Baseline + alternatives', description: 'Existing baseline + N alternative future scenarios. (Editor in 4-C.)' },
]

const Q4_OPTIONS: { value: Q4; label: string; description: string; warn?: string }[] = [
  { value: 'A', label: 'A. Internal', description: 'Internal use (managerial, R&D, planning).' },
  { value: 'B', label: 'B. External (no claim)', description: 'External communication without comparative claims.' },
  { value: 'C', label: 'C. Public superiority claim', description: 'Public claim of environmental superiority.', warn: 'Activates MANDATORY panel review of 3+ independent experts (ISO 14044), no weighting allowed.' },
  { value: 'D', label: 'D. EU policy alignment', description: 'EU policy alignment (CSRD, ESPR, PEFCR).', warn: 'Activates PEF Circular Footprint Formula (CIR-05).' },
  { value: 'E', label: 'E. Academic publication', description: 'Academic peer-reviewed publication.' },
]

const Q5_OPTIONS: { value: Q5; label: string; description: string }[] = [
  { value: 'a', label: 'a. Waste (A pays B)', description: 'A pays B for disposal — gate fee → waste/zero-burden.' },
  { value: 'b', label: 'b. Free exchange (ambiguous)', description: 'Free exchange — EVT mandatory + sensitivity (HC-35).' },
  { value: 'c', label: 'c. Co-product (B pays A)', description: 'B pays A for the co-product → substitution + Q correction.' },
  { value: 'd', label: 'd. Interdependent', description: 'A modified its process to produce flow for B — NO zero-burden allowed.' },
  { value: 'e', label: 'e. Aggregated / black-box', description: 'No per-flow data — system expansion uniform.' },
]

const Q6A_OPTIONS: { value: Q6a; label: string }[] = [
  { value: 'none', label: '(none)' },
  { value: 'wastewater_biofactories', label: 'Wastewater / sludge / biofactories' },
  { value: 'agri_food', label: 'Agri-food / biorefineries' },
  { value: 'process_industry', label: 'Process industry (chemicals, cement, steel, etc.)' },
  { value: 'other', label: 'Other (specify)' },
]

const Q6B_OPTIONS: { value: Q6b; label: string }[] = [
  { value: 'TRL9', label: 'TRL 9 — fully operational' },
  { value: 'TRL7-8', label: 'TRL 7-8 — pilot / pre-commercial' },
  { value: 'TRL5-6', label: 'TRL 5-6 — prototype' },
  { value: 'TRL<5', label: 'TRL <5 — early R&D' },
]

const Q7_OPTIONS: { value: Q7; label: string; description: string }[] = [
  { value: 'A', label: 'A. Co-located', description: 'Eco-park, <5 km between actors.' },
  { value: 'B', label: 'B. Regional', description: '5-100 km, same region.' },
  { value: 'C', label: 'C. Wide-area', description: '>100 km, cross-region or cross-border.' },
  { value: 'D', label: 'D. Multi-scale', description: 'National / industry-wide, variable distances.' },
]

// ---- Component ----

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const draft = useCaseStore((s) => s.draft)
  const patchDraft = useCaseStore((s) => s.patchDraft)
  const runDraft = useCaseStore((s) => s.runDraft)
  const loading = useCaseStore((s) => s.loading)
  const error = useCaseStore((s) => s.error)

  const [q1, setQ1] = useState<Q1 | undefined>(draft.q1 ?? undefined)
  const [q2, setQ2] = useState<Q2 | undefined>(draft.q2 ?? undefined)
  const [env, setEnv] = useState(draft.q3?.env ?? true)
  const [eco, setEco] = useState(draft.q3?.eco ?? false)
  const [soc, setSoc] = useState(draft.q3?.soc ?? false)
  const [q4, setQ4] = useState<Set<Q4>>(new Set(draft.q4 ?? []))
  const [q5, setQ5] = useState<Q5 | undefined>(draft.q5 ?? undefined)
  const [q6a, setQ6a] = useState<Q6a | undefined>(draft.q6a ?? undefined)
  const [q6b, setQ6b] = useState<Q6b | undefined>(draft.q6b ?? undefined)
  const [q7, setQ7] = useState<Q7 | undefined>(draft.q7 ?? undefined)

  function toggleQ4(value: Q4) {
    const next = new Set(q4)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setQ4(next)
  }

  const q3Empty = !env && !eco && !soc
  const canRun = !!q1 && !q3Empty && !loading

  async function handleRun() {
    patchDraft({
      q1,
      q2,
      q3: { env, eco, soc },
      q4: Array.from(q4),
      q5,
      q6a,
      q6b,
      q7,
    })
    const result = await runDraft()
    if (result) navigate('/result')
  }

  return (
    <div className="questionnaire">
      <h1>Questionnaire</h1>
      <p className="muted">
        Seven questions about your industrial-symbiosis case. Q1 and at
        least one Q3 dimension are required; the rest is optional but
        improves the engine output.
      </p>

      {/* Q1 — IS scenario archetype */}
      <QuestionCard
        id="q1"
        title="Q1 — What are you analyzing?"
        help="Pick the closest match. If ambiguous, ask: who is the SUBJECT of the report?"
      >
        {Q1_OPTIONS.map((opt) => (
          <label key={opt.value} className="opt">
            <input
              type="radio"
              name="q1"
              value={opt.value}
              checked={q1 === opt.value}
              onChange={() => setQ1(opt.value)}
            />
            <span className="opt-label">{opt.label}</span>
            <span className="opt-desc">{opt.description}</span>
          </label>
        ))}
      </QuestionCard>

      {/* Q2 — Temporal stance */}
      <QuestionCard id="q2" title="Q2 — What phase is the system in?">
        {Q2_OPTIONS.map((opt) => (
          <label key={opt.value} className="opt">
            <input
              type="radio"
              name="q2"
              value={opt.value}
              checked={q2 === opt.value}
              onChange={() => setQ2(opt.value)}
            />
            <span className="opt-label">{opt.label}</span>
            <span className="opt-desc">{opt.description}</span>
          </label>
        ))}
      </QuestionCard>

      {/* Q3 — Sustainability dimensions */}
      <QuestionCard
        id="q3"
        title="Q3 — Which sustainability dimensions to include?"
        help="At least one is required. Default: ENV + ECO."
        warning={q3Empty ? 'Select at least one dimension to proceed.' : undefined}
      >
        <label className="opt">
          <input type="checkbox" checked={env} onChange={(e) => setEnv(e.target.checked)} />
          <span className="opt-label">Environmental (LCA)</span>
        </label>
        <label className="opt">
          <input type="checkbox" checked={eco} onChange={(e) => setEco(e.target.checked)} />
          <span className="opt-label">Economic (LCC / MFCA / CBA / TEA)</span>
        </label>
        <label className="opt">
          <input type="checkbox" checked={soc} onChange={(e) => setSoc(e.target.checked)} />
          <span className="opt-label">Social (S-LCA)</span>
        </label>
      </QuestionCard>

      {/* Q4 — Use of results */}
      <QuestionCard
        id="q4"
        title="Q4 — What is the report for?"
        help="Multi-select. Some uses combine (e.g. D + E for an EU PEF paper)."
      >
        {Q4_OPTIONS.map((opt) => (
          <label key={opt.value} className="opt">
            <input
              type="checkbox"
              checked={q4.has(opt.value)}
              onChange={() => toggleQ4(opt.value)}
            />
            <span className="opt-label">{opt.label}</span>
            <span className="opt-desc">{opt.description}</span>
            {opt.warn && q4.has(opt.value) ? (
              <span className="opt-warn">⚠ {opt.warn}</span>
            ) : null}
          </label>
        ))}
      </QuestionCard>

      {/* Q5 — Single-value placeholder; per-flow table arrives in 4-C */}
      <QuestionCard
        id="q5"
        title="Q5 — Nature of the symbiotic flow"
        help="Single-value selector for now. The per-flow table arrives in 4-C."
      >
        <label className="opt">
          <input
            type="radio"
            name="q5"
            value=""
            checked={q5 === undefined}
            onChange={() => setQ5(undefined)}
          />
          <span className="opt-label">(skip)</span>
        </label>
        {Q5_OPTIONS.map((opt) => (
          <label key={opt.value} className="opt">
            <input
              type="radio"
              name="q5"
              value={opt.value}
              checked={q5 === opt.value}
              onChange={() => setQ5(opt.value)}
            />
            <span className="opt-label">{opt.label}</span>
            <span className="opt-desc">{opt.description}</span>
          </label>
        ))}
      </QuestionCard>

      {/* Q6a — Sector */}
      <QuestionCard
        id="q6a"
        title="Q6a — Sector"
        help="Currently 5 placeholder values; full 14 sectors arrive when sector_overlays.json wiring lands."
      >
        <select
          value={q6a ?? ''}
          onChange={(e) => setQ6a((e.target.value || undefined) as Q6a | undefined)}
          className="select"
        >
          <option value="">(not set)</option>
          {Q6A_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </QuestionCard>

      {/* Q6b — TRL */}
      <QuestionCard id="q6b" title="Q6b — Technology Readiness Level (TRL)">
        <select
          value={q6b ?? ''}
          onChange={(e) => setQ6b((e.target.value || undefined) as Q6b | undefined)}
          className="select"
        >
          <option value="">(not set)</option>
          {Q6B_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </QuestionCard>

      {/* Q7 — Geographic spread */}
      <QuestionCard
        id="q7"
        title="Q7 — Geographic spread"
        help="If actor coordinates are loaded later, this can be auto-inferred and shown as info."
      >
        {Q7_OPTIONS.map((opt) => (
          <label key={opt.value} className="opt">
            <input
              type="radio"
              name="q7"
              value={opt.value}
              checked={q7 === opt.value}
              onChange={() => setQ7(opt.value)}
            />
            <span className="opt-label">{opt.label}</span>
            <span className="opt-desc">{opt.description}</span>
          </label>
        ))}
      </QuestionCard>

      <div className="run-bar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRun}
          disabled={!canRun}
        >
          {loading ? 'Running…' : 'Run pipeline'}
        </button>
        {!q1 ? <span className="muted">Q1 is required.</span> : null}
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </div>
  )
}
