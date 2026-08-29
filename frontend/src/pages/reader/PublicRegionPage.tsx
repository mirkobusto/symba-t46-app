// PublicRegionPage — /r/region/:code
//
// Aggregate view of IS cases for a given region. Uses the public
// aggregate endpoint (returns global counts today; region filtering
// will land in Phase 8 with the slug/region column).

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import KpiCard from '../../components/dd/KpiCard'
import { ApiError, fetchPublicRegion } from '../../services/api'
import type { PublicRegionResponse } from '../../types/reader'

export default function PublicRegionPage() {
  const { t } = useTranslation()
  const { code = 'global' } = useParams<{ code: string }>()
  const [data, setData] = useState<PublicRegionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPublicRegion(code)
      .then((r) => { if (!cancelled) { setData(r); setLoading(false) } })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof ApiError ? e.detail : (e as Error).message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [code])

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
      <p className="dd-soft">{t('reader.region.lead')}</p>

      <div className="dd-kpi-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <KpiCard label={t('reader.region.total')} value={data.total} tone="info" />
        <KpiCard label={t('reader.region.pathways')} value={data.by_pathway.length} />
        <KpiCard label={t('reader.region.sectors')} value={data.by_sector.length} />
      </div>

      <section>
        <h2 className="dd-section-title">{t('reader.region.byPathwayTitle')}</h2>
        <div className="dd-card" style={{ marginTop: 8 }}>
          <table className="dd-table">
            <thead><tr><th>{t('reader.region.tableKey')}</th><th>{t('reader.region.tableCount')}</th></tr></thead>
            <tbody>
              {data.by_pathway.map((e) => (
                <tr key={e.key}><td>{e.key}</td><td className="dd-mono">{e.count}</td></tr>
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
                <tr key={e.key}><td>{e.key}</td><td className="dd-mono">{e.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  )
}
