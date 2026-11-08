// PublicRegionPage — /r/region/:code, the page of a country
//
// Aggregate view of the shared IS cases with at least one partner in the
// country `code` (ISO 3166-1 alpha-2, from the actors of the drawn network),
// with the list of those cases and what is counted. It was called "Region"
// and showed the code only, listed no case and linked nowhere (UX round 6,
// P3-08, P7-23); the path keeps "region" so that links already sent work.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import KpiCard from '../../components/dd/KpiCard'
import { ApiError, fetchPublicRegion } from '../../services/api'
import type { PublicRegionEntry, PublicRegionResponse } from '../../types/reader'
import { type Axis, splitNone, useAxisLabel } from '../aggregateLabels'
import { countryName } from './countryName'
// isCountryCode, whether `code` names a country: a typo'd link ("XX") showed
// an empty but normal-looking dashboard, as if the country had no activity
// (Kimi test 2026-11-04, A6-02). Shared with the network editor (UX round 6, P7-09).
import { isCountryCode } from '../../components/countryCode'

/** One breakdown: the values given, ranked, and the cases without one apart. */
function Breakdown({ title, hint, axis, entries: all }: {
  title: string
  hint: string
  axis: Axis
  entries: PublicRegionEntry[]
}) {
  const { t } = useTranslation()
  const label = useAxisLabel()
  const { given, none } = splitNone(all)
  return (
    <section>
      <h2 className="dd-section-title">{title}</h2>
      <p className="dd-soft">{hint}</p>
      {given.length > 0 ? (
        <div className="dd-card" style={{ marginTop: 8 }}>
          <table className="dd-table">
            <thead><tr><th>{t('reader.region.tableKey')}</th><th>{t('reader.region.tableCount')}</th></tr></thead>
            <tbody>
              {given.map((e) => (
                <tr key={e.key}><td>{label(axis, e.key)}</td><td className="dd-mono">{e.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {/* never ranked among the values (P7-23) */}
      {none > 0 ? <p className="dd-soft">{t('aggregate.noneLine', { count: none, label: label(axis, '(none)') })}</p> : null}
    </section>
  )
}

export default function PublicRegionPage() {
  const { t, i18n } = useTranslation()
  const { code = 'global' } = useParams<{ code: string }>()
  const [data, setData] = useState<PublicRegionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const known = isCountryCode(code)

  useEffect(() => {
    if (!known) return
    let cancelled = false
    fetchPublicRegion(code)
      .then((r) => { if (!cancelled) { setData(r); setLoading(false) } })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof ApiError ? e.detail : (e as Error).message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [code, known])

  if (!known) {
    return (
      <div>
        <h1>{t('reader.region.unknownTitle')}</h1>
        <p className="dd-soft">{t('reader.region.unknownBody', { code })}</p>
      </div>
    )
  }

  if (loading) return <p className="dd-muted">{t('reader.loading')}</p>

  if (error || !data) {
    return (
      <div>
        <h1>{t('reader.region.errorTitle')}</h1>
        <p className="dd-soft">{error ?? t('reader.region.errorBody')}</p>
      </div>
    )
  }

  const country = countryName(data.region, i18n.language)
  const cases = data.cases ?? []
  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">
        {t('reader.region.eyebrow', { code: data.region })}
      </div>
      <h1>{t('reader.region.title', { country })}</h1>
      <p className="dd-soft">{t('reader.region.lead', { country })}</p>

      <div className="dd-kpi-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <KpiCard label={t('reader.region.total')} value={data.total} tone="info" />
        <KpiCard label={t('reader.region.situations')} value={splitNone(data.by_ilcd_situation).given.length} />
        <KpiCard label={t('reader.region.sectors')} value={splitNone(data.by_sector).given.length} />
      </div>

      {/* zero counters over two header-only tables read as broken (A6-03) */}
      {data.total === 0 ? <p className="dd-soft">{t('reader.region.empty', { country })}</p> : null}

      {cases.length > 0 ? (
        <section>
          <h2 className="dd-section-title">{t('reader.region.casesTitle')}</h2>
          <ul>
            {cases.map((c) => (
              <li key={c.key}>
                <Link to={`/r/${encodeURIComponent(c.key)}`}>{c.name}</Link>
                {c.shared_at ? (
                  <span className="dd-soft">
                    {' · '}
                    {t('reader.region.sharedOn', {
                      date: new Date(c.shared_at).toLocaleDateString(i18n.language, { dateStyle: 'long' }),
                    })}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.total === 0 ? null : (<>
        <Breakdown
          title={t('reader.region.bySituationTitle')}
          hint={t('aggregate.hint.byIlcd')}
          axis="ilcd"
          entries={data.by_ilcd_situation}
        />
        <Breakdown
          title={t('reader.region.bySectorTitle')}
          hint={t('aggregate.hint.bySector')}
          axis="sector"
          entries={data.by_sector}
        />
      </>)}

      <section>
        <h2 className="dd-section-title">{t('reader.region.howTitle')}</h2>
        <p className="dd-soft">{t('reader.region.how')}</p>
        <p><Link to="/aggregate">{t('reader.region.dashboardLink')}</Link></p>
      </section>
    </article>
  )
}
