// ComplianceChecklist — list of policy / methodology compliance
// signals with per-row status badge.
//
// Used by StakeholderReportPage (Local Authority tab primarily) and
// by the public reader shell.

import type { ReactNode } from 'react'

export type ComplianceStatus = 'ok' | 'no' | 'pending' | 'na'

interface Item {
  key: string
  name: ReactNode
  desc?: ReactNode
  status: ComplianceStatus
  label?: ReactNode  // custom badge label; defaults per status
}

interface Props { items: Item[] }

const DEFAULT_LABEL: Record<ComplianceStatus, string> = {
  ok: '✓ yes',
  no: 'not declared',
  pending: '⏳ pending',
  na: 'not applicable',
}

export default function ComplianceChecklist({ items }: Props) {
  return (
    <ul className="dd-check-list">
      {items.map((it) => (
        <li key={it.key} className="dd-check-item">
          <div className="dd-check-info">
            <div className="dd-check-name">{it.name}</div>
            {it.desc ? <div className="dd-check-desc">{it.desc}</div> : null}
          </div>
          <span className={`dd-badge dd-badge-${it.status}`}>
            {it.label ?? DEFAULT_LABEL[it.status]}
          </span>
        </li>
      ))}
    </ul>
  )
}
