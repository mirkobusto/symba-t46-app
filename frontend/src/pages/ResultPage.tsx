// 4-D — structured result page with "Show reasoning" panel.
//
// Replaces the 4-A JSON dump with:
//   - Summary header (pathway + derived states + counts)
//   - Blocked-by warning banner (if any L1 BLOCK fired)
//   - Toggleable "Show reasoning" panel: activated nodes by pillar,
//     pillar configs, L2 violations, L3 CDPs
//   - Collapsible raw JSON (kept for debugging)

import { useState } from 'react'
import { Link } from 'react-router-dom'

import ReasoningPanel from '../components/ReasoningPanel'
import { useCaseStore } from '../store/caseStore'

export default function ResultPage() {
  const result = useCaseStore((s) => s.result)
  const error = useCaseStore((s) => s.error)
  const [showReasoning, setShowReasoning] = useState(true)

  if (error) {
    return (
      <div className="result">
        <h1>Pipeline error</h1>
        <p className="error-text">{error}</p>
        <Link to="/questionnaire" className="btn btn-secondary">
          Back to questionnaire
        </Link>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="result">
        <h1>No result yet</h1>
        <p className="muted">
          Submit a questionnaire to see the engine output here.
        </p>
        <Link to="/questionnaire" className="btn btn-primary">
          Open questionnaire
        </Link>
      </div>
    )
  }

  const blockedBy = result.blocked_by ?? []

  return (
    <div className="result">
      <h1>Engine output</h1>

      {/* Summary header */}
      <dl className="result-summary">
        <dt>Pathway</dt>
        <dd>
          {result.pathway_id ?? '—'}
          {result.is_01_extended ? ' (extended)' : ''}
        </dd>

        <dt>ILCD situation</dt>
        <dd>{result.ilcd_situation ?? '—'}</dd>

        <dt>LCC type</dt>
        <dd>{result.lcc_type ?? '—'}</dd>

        <dt>S-LCA</dt>
        <dd>{result.slca_activation_state ?? '—'}</dd>

        <dt>Activated nodes</dt>
        <dd>{result.activated_nodes?.length ?? 0}</dd>

        <dt>L1 blocks fired</dt>
        <dd>{blockedBy.length}</dd>

        <dt>L2 violations</dt>
        <dd>{result.rule_violations?.length ?? 0}</dd>

        <dt>L3 CDPs surfaced</dt>
        <dd>{result.cdp_flags?.length ?? 0}</dd>
      </dl>

      {/* L1 BLOCK banner — pipeline short-circuited */}
      {blockedBy.length > 0 ? (
        <div className="blocked-banner">
          <h3>Pipeline blocked at L1</h3>
          <p>
            The engine stopped at L1. No activation, L2 or L3 logic ran.
            Resolve the blocking constraint(s) below and re-run:
          </p>
          <ul>
            {blockedBy.map((id) => (
              <li key={id}>
                <code>{id}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Reasoning panel toggle */}
      <div className="reasoning-toggle">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowReasoning((v) => !v)}
        >
          {showReasoning ? 'Hide reasoning' : 'Show reasoning'}
        </button>
      </div>

      {showReasoning && blockedBy.length === 0 ? (
        <ReasoningPanel
          activatedNodes={result.activated_nodes ?? []}
          rule_violations={result.rule_violations ?? []}
          cdp_flags={result.cdp_flags ?? []}
          pillars={[
            { name: 'lca', data: result.lca ?? {} },
            { name: 'lcc', data: result.lcc ?? {} },
            { name: 'slca', data: result.slca ?? {} },
            { name: 'report', data: result.report ?? {} },
            { name: 'governance', data: result.governance ?? {} },
            { name: 'review', data: result.review ?? {} },
            { name: 'methodological_charter', data: result.methodological_charter ?? {} },
            { name: 'system', data: result.system ?? {} },
          ]}
        />
      ) : null}

      {/* Raw JSON (debug fallback) */}
      <details className="result-raw">
        <summary>Raw JSON response</summary>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </details>

      <div className="result-actions">
        <Link to="/questionnaire" className="btn btn-secondary">
          Adjust answers
        </Link>
        <Link to="/" className="btn btn-secondary">
          New case
        </Link>
      </div>
    </div>
  )
}
