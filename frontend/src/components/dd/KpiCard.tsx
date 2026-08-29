// KpiCard — one metric on the dashboard grid.
//
// Renders a labelled numeric metric with an optional detail line and a
// CSS-only sparkline (7 bars). Used on HomePage overview, ResultPage,
// StakeholderReportPage carry-over, and the RegionalDashboard.

import type { ReactNode } from 'react'

interface Props {
  label: string
  value: ReactNode
  detail?: ReactNode
  sparkline?: number[]  // values 0–100 (percentages of the bar height)
  tone?: 'neutral' | 'success' | 'warning' | 'info'
}

export default function KpiCard({
  label, value, detail, sparkline, tone = 'neutral',
}: Props) {
  return (
    <div className={`dd-kpi dd-kpi-${tone}`}>
      <div className="dd-kpi-label">{label}</div>
      <div className="dd-kpi-value dd-mono">{value}</div>
      {detail ? <div className="dd-kpi-detail">{detail}</div> : null}
      {sparkline?.length ? (
        <div className="dd-kpi-spark" aria-hidden="true">
          {sparkline.map((h, i) => (
            <div key={i} style={{ height: `${Math.min(100, Math.max(4, h))}%` }} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
