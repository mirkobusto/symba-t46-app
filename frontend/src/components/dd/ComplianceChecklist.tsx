// ComplianceChecklist — list of policy / methodology compliance
// signals with per-row status badge.
//
// Used by StakeholderReportPage (Local Authority tab primarily) and
// by the public reader shell.

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type ComplianceStatus = 'ok' | 'no' | 'pending' | 'na'

interface Item {
  key: string
  name: ReactNode
  desc?: ReactNode
  status: ComplianceStatus
  label?: ReactNode  // custom badge label; defaults per status
}

interface Props { items: Item[] }

export default function ComplianceChecklist({ items }: Props) {
  const { t } = useTranslation()
  // The badges were hardcoded English on a screen built for a local
  // authority, which is exactly the reader least likely to want it.
  const label: Record<ComplianceStatus, string> = {
    ok: t('compliance.status.ok'),
    no: t('compliance.status.no'),
    pending: t('compliance.status.pending'),
    na: t('compliance.status.na'),
  }
  return (
    <ul className="dd-check-list">
      {items.map((it) => (
        <li key={it.key} className="dd-check-item">
          <div className="dd-check-info">
            <div className="dd-check-name">{it.name}</div>
            {it.desc ? <div className="dd-check-desc">{it.desc}</div> : null}
          </div>
          <span className={`dd-badge dd-badge-${it.status}`}>
            {it.label ?? label[it.status]}
          </span>
        </li>
      ))}
    </ul>
  )
}
