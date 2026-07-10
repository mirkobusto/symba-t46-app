// PendingScoringPlaceholder — banner shown when CIRCE hasn't yet
// ingested the scoring payload for a case (typical MVP state).

import type { ReactNode } from 'react'

interface Props {
  caseId?: string
  lastCheckedIso?: string
  extra?: ReactNode
}

export default function PendingScoringPlaceholder({
  caseId, lastCheckedIso, extra,
}: Props) {
  return (
    <div className="dd-pending">
      <div className="dd-pending-head">⏳ Awaiting CIRCE delivery</div>
      <p className="dd-pending-body">
        The quantitative LCSA scoring for this case has not been
        ingested yet. Once CIRCE delivers the indicators (env / eco /
        soc), they will appear here.
      </p>
      {(caseId || lastCheckedIso) ? (
        <div className="dd-pending-meta dd-mono">
          {caseId ? <>PUT /api/scoring/{caseId.slice(0, 8)}…</> : null}
          {caseId && lastCheckedIso ? ' · ' : null}
          {lastCheckedIso ? <>last_checked: {lastCheckedIso}</> : null}
        </div>
      ) : null}
      {extra ? <div className="dd-pending-extra">{extra}</div> : null}
    </div>
  )
}
