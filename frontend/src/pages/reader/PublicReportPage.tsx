// PublicReportPage — /r/:caseId/:audience
//
// Read-only report for a shared case. Fetches via GET
// /api/public/report/:caseId (no auth). Renders:
//   - VerdictCard (reader variant, light)
//   - Audience framing block
//   - Configuration rows for the audience (ConfigurationSummary)
//   - Scoring grid (env/eco/soc) or pending placeholder
//   - Compliance checklist (only for `authority`)
//
// Falls back to a 404-style message when the case is missing.
//
// UX round 2026-11-02: readers arriving from a link never saw the welcome
// page, so the report must say itself that it is a plan with no results and
// no certification, name the exchanges, and speak in words, not Q-codes.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import ComplianceChecklist from '../../components/dd/ComplianceChecklist'
import PendingScoringPlaceholder from '../../components/dd/PendingScoringPlaceholder'
import ScoringIndicatorGrid from '../../components/dd/ScoringIndicatorGrid'
import VerdictCard from '../../components/dd/VerdictCard'
import { ApiError, fetchPublicReport } from '../../services/api'
import type { PublicReportResponse } from '../../types/reader'
import { verdictFor } from '../resultNarrative'
import { AUDIENCE_ROWS } from '../configurationRows'
import ConfigurationSummary from '../../components/ConfigurationSummary'
import { usePreferenceStore, type UserRole } from '../../store/preferenceStore'

type Audience = 'industry' | 'community' | 'authority' | 'enduser'

const AUDIENCE_SET: Audience[] = ['industry', 'community', 'authority', 'enduser']

// a link without a view opens on the reader's own role, when they gave one
const ROLE_AUDIENCE: Partial<Record<UserRole, Audience>> = {
  industry: 'industry', community: 'community', authority: 'authority', enduser: 'enduser',
}

export default function PublicReportPage() {
  const { t, i18n } = useTranslation()
  const role = usePreferenceStore((s) => s.role)
  const params = useParams<{ caseId: string; audience: string }>()
  const caseId = params.caseId ?? ''
  const audience = params.audience ?? (role ? ROLE_AUDIENCE[role] : undefined) ?? 'community'

  const [report, setReport] = useState<PublicReportResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPublicReport(caseId)
      .then((r) => { if (!cancelled) { setReport(r); setLoading(false) } })
      .catch((e: unknown) => {
        if (cancelled) return
        // a 404 is shown in the reader's language; the server's English detail
        // ("Case '…' not found") only for other failures (UX round 2026-11-03)
        if (e instanceof ApiError && e.status === 404) setError('')
        else setError(e instanceof ApiError ? e.detail : (e as Error).message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [caseId])

  const validAudience: Audience = AUDIENCE_SET.includes(audience as Audience)
    ? (audience as Audience)
    : 'community'

  if (loading) return <p className="dd-muted">{t('reader.loading')}</p>

  if (error !== null || !report) {
    return (
      <div>
        <h1>{t('reader.notFoundTitle')}</h1>
        <p className="dd-soft">{error || t('reader.notFoundBody')}</p>
        <div className="dd-page-actions">
          <Link to="/r/open" className="dd-btn dd-btn-primary">
            ← {t('reader.tryAnother')}
          </Link>
          <Link to="/r/about" className="dd-btn dd-btn-secondary">
            {t('reader.aboutLink')} →
          </Link>
        </div>
      </div>
    )
  }

  const { case: c, scoring } = report
  const verdict = verdictFor(c, (key, fallback) => t(key, { defaultValue: fallback ?? '' }))
  const scoringIndicators = (scoring?.indicators ?? []).map((i) => ({
    dim: i.dimension,
    label: i.label_en,
    value: i.value,
    unit: i.unit,
  }))

  const flows = c.flows ?? []
  const market = c.reference_market_region
    ? c.reference_market_scope
      ? `${c.reference_market_region} (${t(`questionnaire.q7.market.scope.${c.reference_market_scope}`).toLowerCase()})`
      : c.reference_market_region
    : null

  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">
        {t('reader.eyebrow', { name: report.name })}
      </div>

      <div className="dd-reader-what">
        <strong>{t('reader.whatTitle')}</strong>
        <p>{t('reader.whatBody')}</p>
      </div>

      <section className="dd-reader-case">
        <h2 className="dd-section-title">{t('reader.caseTitle')}</h2>
        {flows.length > 0 ? (
          <ul>
            {flows.map((f) => <li key={f.id}>{f.name}</li>)}
          </ul>
        ) : null}
        {c.q2 ? <p>{t(c.q2 === 'A' ? 'reader.running.yes' : 'reader.running.no')}</p> : null}
        {market ? <p>{t('reader.market', { market })}</p> : null}
        <p className="dd-soft">
          {t('reader.updated', { date: new Date(report.updated_at).toLocaleDateString(i18n.language) })}
        </p>
      </section>

      <VerdictCard
        variant="reader"
        eyebrow={t('reader.methodEyebrow')}
        headline={verdict?.title ?? c.ilcd_situation ?? '—'}
        codes={verdict?.codes}
        body={verdict?.body}
        tags={[
          c.q6a && c.q6a !== 'none'
            ? t('reader.sectorTag', { sector: t(`questionnaire.q6a.options.${c.q6a}`) })
            : undefined,
          c.q7
            ? t('reader.scaleTag', {
              scale: t(`questionnaire.q7.options.${c.q7}.description`).replace(/\.$/, ''),
            })
            : undefined,
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
        <p className="dd-framing-body">
          {t(`stakeholder.audience.${validAudience === 'enduser' ? 'end-user' : validAudience}.whatYouSee`)}
        </p>
      </div>

      {validAudience === 'enduser' ? (
        <p className="dd-reader-caveat">{t('stakeholder.audience.end-user.productCaveat')}</p>
      ) : null}

      {(c.blocked_by ?? []).length === 0 ? (
        <ConfigurationSummary
          kase={c}
          only={AUDIENCE_ROWS[validAudience === 'enduser' ? 'end-user' : validAudience]}
          showNodeText={false}
          showWhy={false}
          titleClassName="dd-section-title"
          title={t('reader.summaryTitle')}
        />
      ) : null}
      {!c.q3?.env ? <p className="dd-soft">{t('stakeholder.notAssessed.environmental')}</p> : null}
      {!c.q3?.eco ? <p className="dd-soft">{t('stakeholder.notAssessed.economic')}</p> : null}

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
                label: c.q4?.includes('E') ? undefined : t('reader.compliance.notPlanned'),
              },
              {
                key: 'pef',
                name: t('reader.compliance.pef.name'),
                // one company's accounts (C2) use allocation, not the CFF (D4.1 §7.2.3)
                desc: t(c.q4?.includes('D') && c.ilcd_situation === 'ILCD Situation C2'
                  ? 'reader.compliance.pef.descC2' : 'reader.compliance.pef.desc'),
                status: c.q4?.includes('D') && c.ilcd_situation !== 'ILCD Situation C2' ? 'ok' : 'no',
                label: c.q4?.includes('D') && c.ilcd_situation !== 'ILCD Situation C2'
                  ? undefined : t('reader.compliance.notPlanned'),
              },
              {
                key: 'public',
                name: t('reader.compliance.public.name'),
                desc: t('reader.compliance.public.desc'),
                status: c.q4?.includes('C') ? 'ok' : 'no',
                label: c.q4?.includes('C') ? undefined : t('reader.compliance.notPlanned'),
              },
              {
                key: 'dnsh',
                name: t('reader.compliance.dnsh.name'),
                desc: t('reader.compliance.dnsh.desc'),
                // the tool screens nothing for DNSH: "pending" promised a check
                status: 'na',
                label: t('reader.compliance.notAssessed'),
              },
            ]} />
          </div>
        </section>
      ) : null}

      <p className="dd-reader-note">{t('reader.note')}</p>
    </article>
  )
}
