// PendingScoringPlaceholder — banner shown when CIRCE hasn't yet
// ingested the scoring payload for a case (typical MVP state).
//
// The copy used to be hardcoded English, so an Italian or Spanish
// reader of a shared report got an English paragraph; and it printed
// `PUT /api/scoring/<id>` — an API route — to whoever opened the link.
// A reader does not act on an endpoint: what they need is whether the
// numbers are there and what happens when they arrive.

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  caseId?: string
  lastCheckedIso?: string
  extra?: ReactNode
}

export default function PendingScoringPlaceholder({
  lastCheckedIso, extra,
}: Props) {
  const { t } = useTranslation()
  return (
    <div className="dd-pending">
      <div className="dd-pending-head">{t('scoringPending.title')}</div>
      <p className="dd-pending-body">{t('scoringPending.body')}</p>
      {lastCheckedIso ? (
        <div className="dd-pending-meta">
          {t('scoringPending.lastChecked', { date: lastCheckedIso })}
        </div>
      ) : null}
      {extra ? <div className="dd-pending-extra">{extra}</div> : null}
    </div>
  )
}
