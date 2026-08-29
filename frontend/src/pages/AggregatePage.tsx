// AggregatePage — region/sector dashboard for the authority audience.
//
// Reads /api/cases/aggregate/breakdown and renders the totals + 4 breakdown
// tables (by pathway / sector / scope / ILCD). MVP: no charts, just
// counts. Future: regional heatmap, time-series.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import KpiCard from '../components/dd/KpiCard'
import { ApiError, fetchCasesAggregate } from '../services/api'
import type { AggregateBreakdownEntry, CasesAggregate } from '../types/scoring'

function BreakdownTable({
  title,
  entries,
}: {
  title: string
  entries: AggregateBreakdownEntry[]
}) {
  const { t } = useTranslation()
  return (
    <div className="aggregate-breakdown">
      <h3>{title}</h3>
      {entries.length === 0 ? (
        <p className="muted">{t('aggregate.noData')}</p>
      ) : (
        <table className="dcf-table">
          <thead>
            <tr>
              <th>{t('aggregate.tableKey')}</th>
              <th>{t('aggregate.tableCount')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.key}>
                <td>{e.key}</td>
                <td>{e.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function AggregatePage() {
  const { t } = useTranslation()
  const [data, setData] = useState<CasesAggregate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchCasesAggregate()
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const msg =
          e instanceof ApiError
            ? `${e.status}: ${e.detail}`
            : e instanceof Error
              ? e.message
              : 'unknown'
        setError(msg)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="aggregate-page">
        <p>{t('aggregate.loading')}</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="aggregate-page">
        <h1>{t('aggregate.errorTitle')}</h1>
        <p className="error-text">{error ?? t('aggregate.errorNoData')}</p>
        <Link to="/cases" className="btn btn-secondary">
          {t('aggregate.backToCases')}
        </Link>
      </div>
    )
  }

  return (
    <div className="dd-page aggregate-page">
      <div className="dd-page-head">
        <div>
          <h1 className="dd-page-title">{t('aggregate.title')}</h1>
          <p className="dd-page-sub">{t('aggregate.subtitle')}</p>
        </div>
      </div>

      <div className="dd-kpi-strip">
        <KpiCard
          label={t('aggregate.totalLabel')}
          value={data.total}
          tone="info"
        />
        <KpiCard
          label={t('aggregate.breakdownTitle.byPathway')}
          value={data.by_pathway.length}
        />
        <KpiCard
          label={t('aggregate.breakdownTitle.bySector')}
          value={data.by_q6a_sector.length}
        />
        <KpiCard
          label={t('aggregate.breakdownTitle.byScope')}
          value={data.by_q7_geographic_scope.length}
        />
      </div>

      <div className="aggregate-breakdowns">
        <BreakdownTable
          title={t('aggregate.breakdownTitle.byPathway')}
          entries={data.by_pathway}
        />
        <BreakdownTable
          title={t('aggregate.breakdownTitle.bySector')}
          entries={data.by_q6a_sector}
        />
        <BreakdownTable
          title={t('aggregate.breakdownTitle.byScope')}
          entries={data.by_q7_geographic_scope}
        />
        <BreakdownTable
          title={t('aggregate.breakdownTitle.byIlcd')}
          entries={data.by_ilcd_situation}
        />
      </div>

      <div className="aggregate-actions">
        <Link to="/cases" className="btn btn-secondary">
          {t('aggregate.backToCases')}
        </Link>
      </div>
    </div>
  )
}
