// CdpCard — one Critical Decision Point surfaced by the engine.
//
// Amber-left-bordered card with an id (dd-mono), one-line title, a
// body explaining the tension, and a compact meta line (methods,
// severity). Multiple CdpCards live inside a wrapper card on
// ResultPage / StakeholderReportPage.

import type { ReactNode } from 'react'

interface Props {
  id: string
  title: ReactNode
  body: ReactNode
  methods?: string[]
  severity?: 'low' | 'medium' | 'high'
}

export default function CdpCard({ id, title, body, methods, severity }: Props) {
  const sev = severity ?? 'low'
  return (
    <div className={`dd-cdp dd-cdp-${sev}`}>
      <div className="dd-cdp-id dd-mono">{id}</div>
      <div className="dd-cdp-title">{title}</div>
      <div className="dd-cdp-body">{body}</div>
      {(methods?.length || severity) ? (
        <div className="dd-cdp-meta dd-mono">
          {methods?.length ? <>methods: [{methods.join(', ')}]</> : null}
          {methods?.length && severity ? ' · ' : null}
          {severity ? <>severity: {severity}</> : null}
        </div>
      ) : null}
    </div>
  )
}
