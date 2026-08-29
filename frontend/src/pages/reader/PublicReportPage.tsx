// PublicReportPage — /r/:caseId/:audience
//
// Read-only report for a shared case. Fetches via GET
// /api/public/report/:caseId (no auth). Renders:
//   - VerdictCard (reader variant, light)
//   - Audience framing block
//   - Pathway summary (dl)
//   - Scoring grid (env/eco/soc) or pending placeholder
//   - Compliance checklist (only for `authority`)
//
// Falls back to a 404-style message when the case is missing.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import ComplianceChecklist from '../../components/dd/ComplianceChecklist'
import PendingScoringPlaceholder from '../../components/dd/PendingScoringPlaceholder'
import ScoringIndicatorGrid from '../../components/dd/ScoringIndicatorGrid'
import VerdictCard from '../../components/dd/VerdictCard'
import { ApiError, fetchPublicReport } from '../../services/api'
import type { PublicReportResponse } from '../../types/reader'

type Audience = 'industry' | 'community' | 'authority' | 'enduser'

const AUDIENCE_SET: Audience[] = ['industry', 'community', 'authority', 'enduser']

export default function PublicReportPage() {
  const { t } = useTranslation()
  const { caseId = '', audience = 'community' } = useParams<{ caseId: string; audience: string }>()

  const [report, setReport] = useState<PublicReportResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPublicReport(caseId)
      .then((r) => { if (!cancelled) { setReport(r); setLoading(false) } })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof ApiError ? e.detail : (e as Error).message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [caseId])

  const validAudience: Audience = AUDIENCE_SET.includes(audience as Audience)
    ? (audience as Audience)
    : 'community'

  if (loading) return <p className="dd-muted">{t('reader.loading')}</p>

  if (error || !report) {
    return (
      <div>
        <h1>{t('reader.notFoundTitle')}</h1>
        <p className="dd-soft">{error ?? t('reader.notFoundBody')}</p>
        <Link to="/r/about" className="dd-btn dd-btn-secondary">
          {t('reader.aboutLink')} →
        </Link>
      </div>
    )
  }

  const { case: c, scoring } = report
  const scoringIndicators = (scoring?.indicators ?? []).map((i) => ({
    dim: i.dimension,
    label: i.label_en,
    value: i.value,
    unit: i.unit,
  }))

  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">
        {t('reader.eyebrow', { name: report.name })}
      </div>

      <VerdictCard
        variant="reader"
        pathway={c.pathway_id ?? '—'}
        extended={!!c.is_01_extended}
        subtitle={[c.ilcd_situation, c.lcc_type].filter(Boolean).join(' · ')}
        tags={[
          c.q6a ? `Q6a: ${c.q6a}` : undefined,
          c.q7 ? `Q7: ${c.q7}` : undefined,
        ].filter(Boolean)}
      />

      {/* Audience selector — anyone can flip the framing without needing
          to know the URL structure. */}
      <div className="dd-reader-audience" role="tablist">
        {AUDIENCE_SET.map((a) => (
          <Link
            key={a}
            to={`/r/${caseId}/${a}`}
            role="tab"
            aria-selected={a === validAudience}
            className={`dd-tab ${a === validAudience ? 'dd-tab-active' : ''}`}
          >
            {t(`reader.audience.${a}.short`)}
          </Link>
        ))}
      </div>

      <div className="dd-framing">
        <div className="dd-framing-label">
          {t('reader.audience.showingFor', { name: t(`reader.audience.${validAudience}.name`) })}
        </div>
        <div className="dd-framing-title">{t(`reader.audience.${validAudience}.title`)}</div>
        <p className="dd-framing-body">{t(`reader.audience.${validAudience}.body`)}</p>
      </div>

      <section>
        <h2 className="dd-section-title">{t('reader.summaryTitle')}</h2>
        <div className="dd-card" style={{ marginTop: 8 }}>
          <dl className="dd-dl">
            <dt>{t('reader.summary.pathway')}</dt>
            <dd>{c.pathway_id ?? '—'} {c.is_01_extended ? <em>· extended</em> : null}</dd>
            <dt>{t('reader.summary.ilcd')}</dt>
            <dd>{c.ilcd_situation ?? '—'}</dd>
            <dt>{t('reader.summary.lcc')}</dt>
            <dd>{c.lcc_type ?? '—'}</dd>
            <dt>{t('reader.summary.slca')}</dt>
            <dd>{c.slca_activation_state ?? '—'}</dd>
            <dt>{t('reader.summary.sector')}</dt>
            <dd>{c.q6a ?? '—'}</dd>
            <dt>{t('reader.summary.scope')}</dt>
            <dd>{c.q7 ? `Q7 = ${c.q7}` : '—'}</dd>
          </dl>
        </div>
      </section>

      <section>
        <h2 className="dd-section-title">{t('reader.scoringTitle')}</h2>
        <div className="dd-card" style={{ marginTop: 8 }}>
          {scoring ? (
            <ScoringIndicatorGrid indicators={scoringIndicators} />
          ) : (
            <PendingScoringPlaceholder caseId={report.id} />
          )}
        </div>
      </section>

      {validAudience === 'authority' ? (
        <section>
          <h2 className="dd-section-title">{t('reader.complianceTitle')}</h2>
          <div className="dd-card" style={{ marginTop: 8 }}>
            <ComplianceChecklist items={[
              {
                key: 'peer',
                name: t('reader.compliance.peer.name'),
                desc: t('reader.compliance.peer.desc'),
                status: c.q4?.includes('E') ? 'ok' : 'no',
              },
              {
                key: 'pef',
                name: t('reader.compliance.pef.name'),
                desc: t('reader.compliance.pef.desc'),
                status: c.q4?.includes('D') ? 'ok' : 'no',
              },
              {
                key: 'public',
                name: t('reader.compliance.public.name'),
                desc: t('reader.compliance.public.desc'),
                status: c.q4?.includes('C') ? 'ok' : 'no',
              },
              {
                key: 'dnsh',
                name: t('reader.compliance.dnsh.name'),
                desc: t('reader.compliance.dnsh.desc'),
                status: 'pending',
              },
            ]} />
          </div>
        </section>
      ) : null}

      <p className="dd-reader-note">{t('reader.note')}</p>
    </article>
  )
}
