// PublicRegionPage — /r/region/:code
//
// Aggregate view of the shared IS cases with at least one partner in the
// country `code` (ISO 3166-1 alpha-2, from the actors of the drawn network).

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import KpiCard from '../../components/dd/KpiCard'
import { ApiError, fetchPublicRegion } from '../../services/api'
import type { PublicRegionResponse } from '../../types/reader'
import { useAxisLabel } from '../aggregateLabels'

/** Whether `code` names a country: a typo'd link ("XX") showed an empty but
 * normal-looking dashboard, as if the country had no activity (Kimi test
 * 2026-11-04, A6-02). */
function isCountryCode(code: string): boolean {
  if (!/^[A-Za-z]{2}$/.test(code)) return false
  try {
    return new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' }).of(code.toUpperCase()) !== undefined
  } catch {
    return true   // no Intl support: let the server answer
  }
}

export default function PublicRegionPage() {
  const { t } = useTranslation()
  const label = useAxisLabel()
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

  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">
        {t('reader.region.eyebrow', { code: data.region })}
      </div>
      <h1>{t('reader.region.title')}</h1>
      <p className="dd-soft">{t('reader.region.lead', { code: data.region })}</p>

      <div className="dd-kpi-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <KpiCard label={t('reader.region.total')} value={data.total} tone="info" />
        <KpiCard label={t('reader.region.situations')} value={data.by_ilcd_situation.length} />
        <KpiCard label={t('reader.region.sectors')} value={data.by_sector.length} />
      </div>

      {/* zero counters over two header-only tables read as broken (A6-03) */}
      {data.total === 0 ? <p className="dd-soft">{t('reader.region.empty', { code: data.region })}</p> : null}

      {data.total === 0 ? null : (<>
      <section>
        <h2 className="dd-section-title">{t('reader.region.bySituationTitle')}</h2>
        <div className="dd-card" style={{ marginTop: 8 }}>
          <table className="dd-table">
            <thead><tr><th>{t('reader.region.tableKey')}</th><th>{t('reader.region.tableCount')}</th></tr></thead>
            <tbody>
              {data.by_ilcd_situation.map((e) => (
                <tr key={e.key}><td>{label('ilcd', e.key)}</td><td className="dd-mono">{e.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="dd-section-title">{t('reader.region.bySectorTitle')}</h2>
        <div className="dd-card" style={{ marginTop: 8 }}>
          <table className="dd-table">
            <thead><tr><th>{t('reader.region.tableKey')}</th><th>{t('reader.region.tableCount')}</th></tr></thead>
            <tbody>
              {data.by_sector.map((e) => (
                <tr key={e.key}><td>{label('sector', e.key)}</td><td className="dd-mono">{e.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </>)}
    </article>
  )
}
