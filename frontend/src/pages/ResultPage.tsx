// 4-A foundation stub.
//
// Displays the engine output as a summary header + JSON dump. A
// proper styled result panel (per-pillar config, activated nodes
// grouped, CDP cards, violation banners) lands in 4-D.

import { Link } from 'react-router-dom'

import { useCaseStore } from '../store/caseStore'

export default function ResultPage() {
  const result = useCaseStore((s) => s.result)
  const error = useCaseStore((s) => s.error)

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

  return (
    <div className="result">
      <h1>Engine output</h1>

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
        <dd>{result.blocked_by?.length ?? 0}</dd>

        <dt>L2 violations</dt>
        <dd>{result.rule_violations?.length ?? 0}</dd>

        <dt>L3 CDPs surfaced</dt>
        <dd>{result.cdp_flags?.length ?? 0}</dd>
      </dl>

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
