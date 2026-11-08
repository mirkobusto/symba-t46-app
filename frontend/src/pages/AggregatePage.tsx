// AggregatePage — the dashboard of the saved cases, for the authority audience.
//
// Reads /api/cases/aggregate/breakdown and renders the totals + 4 breakdown
// tables (by ILCD situation / LCC structure / sector / scope), then the way to
// the public country pages (/api/public/countries) and to the guidance for
// funding bodies. Cases without a value are shown apart, never ranked (UX
// round 6, P3-08, P7-23, P3-15).

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import KpiCard from '../components/dd/KpiCard'
import { ApiError, fetchCasesAggregate, fetchPublicCountries } from '../services/api'
import type { PublicCountryCount } from '../types/reader'
import type { AggregateBreakdownEntry, CasesAggregate } from '../types/scoring'
import { countryName } from './reader/countryName'
import { type Axis, splitNone, useAxisLabel } from './aggregateLabels'

function BreakdownTable({
  title,
  hint,
  axis,
  entries: all,
}: {
  title: string
  hint: string
  axis: Axis
  entries: AggregateBreakdownEntry[]
}) {
  const label = useAxisLabel()
  const { t } = useTranslation()
  const { given: entries, none } = splitNone(all)
  return (
    <div className="aggregate-breakdown">
      <h3>{title}</h3>
      <p className="muted aggregate-hint">{hint}</p>
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
                <td>{label(axis, e.key)}</td>
                <td>{e.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {none > 0 ? (
        <p className="muted aggregate-none">{t('aggregate.noneLine', { count: none, label: label(axis, '(none)') })}</p>
      ) : null}
    </div>
  )
}

/** The way from the dashboard to the public country pages (P3-08): the
 * countries that list at least one shared case, and how a case gets there. */
function CountryPages() {
  const { t, i18n } = useTranslation()
  const [countries, setCountries] = useState<PublicCountryCount[] | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchPublicCountries()
      .then((c) => { if (!cancelled) setCountries(Array.isArray(c) ? c : []) })
      .catch(() => { if (!cancelled) setCountries([]) })
    return () => { cancelled = true }
  }, [])
  return (
    <section className="aggregate-breakdown aggregate-countries" aria-labelledby="aggregate-countries-title">
      <h3 id="aggregate-countries-title">{t('aggregate.countries.title')}</h3>
      <p className="muted aggregate-hint">{t('aggregate.countries.lead')}</p>
      {countries === null ? null : countries.length === 0 ? (
        <p className="muted">{t('aggregate.countries.empty')}</p>
      ) : (
        <ul className="aggregate-country-list">
          {countries.map((c) => (
            <li key={c.code}>
              <Link to={`/r/region/${c.code}`}>
                {t('aggregate.countries.link', {
                  country: `${countryName(c.code, i18n.language)} (${c.code})`,
                  count: c.count,
                })}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function AggregatePage() {
  const { t } = useTranslation()
  const label = useAxisLabel()
  // the cards counted categories (1, 1, 1), not cases: they now name the most
  // common value given; "not answered" won it on most databases (P7-23)
  const top = (axis: Axis, entries: AggregateBreakdownEntry[]) => {
    const { given } = splitNone(entries)
    return given.length > 0 ? label(axis, given[0].key) : '—'
  }
  const topDetail = (entries: AggregateBreakdownEntry[]) =>
    splitNone(entries).given.length > 0 ? t('aggregate.mostCommon') : t('aggregate.noneTop')
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
          label={t('aggregate.breakdownTitle.byIlcd')}
          value={<span className="aggregate-top">{top('ilcd', data.by_ilcd_situation)}</span>}
          detail={topDetail(data.by_ilcd_situation)}
        />
        <KpiCard
          label={t('aggregate.breakdownTitle.bySector')}
          value={<span className="aggregate-top">{top('sector', data.by_q6a_sector)}</span>}
          detail={topDetail(data.by_q6a_sector)}
        />
        <KpiCard
          label={t('aggregate.breakdownTitle.byScope')}
          value={<span className="aggregate-top">{top('scope', data.by_q7_geographic_scope)}</span>}
          detail={topDetail(data.by_q7_geographic_scope)}
        />
      </div>

      <div className="aggregate-breakdowns">
        <BreakdownTable
          title={t('aggregate.breakdownTitle.byIlcd')}
          hint={t('aggregate.hint.byIlcd')}
          axis="ilcd"
          entries={data.by_ilcd_situation}
        />
        <BreakdownTable
          title={t('aggregate.breakdownTitle.byLccType')}
          hint={t('aggregate.hint.byLccType')}
          axis="lcc"
          entries={data.by_lcc_type}
        />
        <BreakdownTable
          title={t('aggregate.breakdownTitle.bySector')}
          hint={t('aggregate.hint.bySector')}
          axis="sector"
          entries={data.by_q6a_sector}
        />
        <BreakdownTable
          title={t('aggregate.breakdownTitle.byScope')}
          hint={t('aggregate.hint.byScope')}
          axis="scope"
          entries={data.by_q7_geographic_scope}
        />
      </div>

      <div className="aggregate-breakdowns">
        <CountryPages />
        {/* where an authority lands from the welcome ("explore"): the way to the guidance for funders (P3-15) */}
        <section className="aggregate-breakdown aggregate-funders">
          <h3>{t('aggregate.fundersTitle')}</h3>
          <p className="muted aggregate-hint">
            {t('aggregate.fundersBody')} <Link to="/about#funders">{t('aggregate.fundersLink')}</Link>
          </p>
        </section>
      </div>

      <div className="aggregate-actions">
        <Link to="/cases" className="btn btn-secondary">
          {t('aggregate.backToCases')}
        </Link>
      </div>
    </div>
  )
}
