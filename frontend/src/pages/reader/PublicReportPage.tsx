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
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'

import ComplianceChecklist from '../../components/dd/ComplianceChecklist'
import PendingScoringPlaceholder from '../../components/dd/PendingScoringPlaceholder'
import ScoringIndicatorGrid from '../../components/dd/ScoringIndicatorGrid'
import VerdictCard from '../../components/dd/VerdictCard'
import { ApiError, fetchPublicReport } from '../../services/api'
import type { PublicReportResponse } from '../../types/reader'
import { plainVerdict, verdictFor } from '../resultNarrative'
import { AUDIENCE_ROWS } from '../configurationRows'
import ConfigurationSummary from '../../components/ConfigurationSummary'
import { usePreferenceStore, type UserRole } from '../../store/preferenceStore'
import ReportNotFound from '../../components/reader/ReportNotFound'
import { complianceSignals } from '../complianceSignals'
import { countryName } from './countryName'
import { VIEWS, viewOf, type View } from './sharedReportPath'

type Audience = View

// a link without a view opens on the reader's own role, when they gave one
const ROLE_AUDIENCE: Partial<Record<UserRole, Audience>> = {
  industry: 'industry', community: 'community', authority: 'authority', enduser: 'enduser',
}

export default function PublicReportPage() {
  const { t, i18n } = useTranslation()
  const role = usePreferenceStore((s) => s.role)
  const location = useLocation()
  const params = useParams<{ caseId: string; audience: string }>()
  const caseId = params.caseId ?? ''
  // a code copied in capitals from a label (UX round 6, P5-11); slugs are lower case
  const caseKey = caseId.toLowerCase()
  // a view the link names, also as "end-user" or in capitals; an unknown one
  // opened the Community view in silence (P5-01): it now goes to the bare link
  const named = viewOf(params.audience)
  // without a view and a role the link's origin is unknown (the share dialog
  // hands out one link per view, the End-user one for labels): the End-user
  // view claims the least and carries the product caveat, so a wrong guess
  // costs least; the four tabs sit right under "What this page is" (UX round 6,
  // P4-04, P2-13, decided by Fable)
  const audience: Audience = named ?? (role ? ROLE_AUDIENCE[role] : undefined) ?? 'enduser'
  const canonical = named ? `/r/${caseKey}/${named}` : `/r/${caseKey}`
  const needsRedirect = canonical !== `/r/${caseId}${params.audience !== undefined ? `/${params.audience}` : ''}`

  const [report, setReport] = useState<PublicReportResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (needsRedirect) return
    let cancelled = false
    fetchPublicReport(caseKey)
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
  }, [caseKey, needsRedirect])

  const validAudience: Audience = audience

  if (needsRedirect) return <Navigate to={canonical} replace />

  if (loading) return <p className="dd-muted">{t('reader.loading')}</p>

  if (error !== null || !report) return <ReportNotFound detail={error ?? undefined} />

  const { case: c, scoring } = report
  const tr = (key: string, fallback?: string) => t(key, { defaultValue: fallback ?? '' })
  const verdict = verdictFor(c, tr)
  const plain = verdict ? plainVerdict(c, verdict, tr) : null
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
  // where the plants are, in the reader's language (UX round 6, P4-08, decided by Fable)
  const countries = (report.countries ?? []).map((code) => countryName(code, i18n.language))
  const contactLink = report.case_contact ? (
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(report.case_contact.trim()) ? (
      <a href={`mailto:${report.case_contact.trim()}?subject=${encodeURIComponent(report.name)}`}>
        {report.case_contact}
      </a>
    ) : report.case_contact
  ) : null

  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">
        {t('reader.eyebrow', { name: report.name })}
      </div>

      <div className="dd-reader-what">
        <strong>{t('reader.whatTitle')}</strong>
        <p>{t('reader.whatBody')}</p>
        <p>{t('reader.labelLine')}</p>
        <p>{t('reader.thisCaseOnly')}</p>
        {/* the page saying the tool belongs to none of the companies was reachable
            only from the logo (UX round 6, P4-13) */}
        <p>
          <Link to="/r/about" state={{ from: location.pathname }}>{t('reader.whoIsBehind')} →</Link>
        </p>
      </div>

      {/* Audience selector, right under what the page is: the tabs sat about
          1.5 phone screens down, and a citizen sent the bare link never knew
          there was a view for the community (UX round 6, P4-04, P2-13) */}
      <p className="dd-reader-audience-lead" id="reader-audience-lead">{t('reader.audience.choose')}</p>
      <div className="dd-reader-audience" role="tablist" aria-labelledby="reader-audience-lead">
        {VIEWS.map((a) => (
          <Link
            key={a}
            to={`/r/${caseKey}/${a}`}
            role="tab"
            aria-selected={a === validAudience}
            className={`dd-tab ${a === validAudience ? 'dd-tab-active' : ''}`}
          >
            {t(`reader.audience.${a}.short`)}
          </Link>
        ))}
      </div>

      <section className="dd-reader-case">
        <h2 className="dd-section-title">{t('reader.caseTitle')}</h2>
        {countries.length > 0 ? (
          <p>{t('reader.countries', { countries: countries.join(', ') })}</p>
        ) : null}
        {flows.length > 0 ? (
          <>
            {/* the names are the author's, in the author's language (UX round 6, P5-03) */}
            <p>{t('reader.flowsAsNamed')}</p>
            <ul>
              {flows.map((f) => (
                <li key={f.id}>
                  {f.name}
                  {f.sector && f.sector !== 'none'
                    ? ` (${t(`questionnaire.q6a.options.${f.sector}`)})`
                    : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {c.q2 ? <p>{t(c.q2 === 'A' ? 'reader.running.yes' : 'reader.running.no')}</p> : null}
        {market ? <p>{t('reader.market', { market })}</p> : null}
        {/* who prepared the case and whom to ask: written by the owner when sharing
            (UX round 2026-11-03, decided by Fable) */}
        {report.prepared_by ? <p>{t('reader.preparedBy', { name: report.prepared_by })}</p> : null}
        <p>{contactLink ? (
          <>
            {t('reader.contact', { contact: '' })}
            {contactLink}
          </>
        ) : t('reader.noContact')}</p>
        <p className="dd-soft">
          {t('reader.updated', {
            // "11/3/2026" read as 11 March to a European (UX round 3-4)
            date: new Date(report.updated_at).toLocaleDateString(i18n.language, { dateStyle: 'long' }),
          })}
        </p>
      </section>

      <VerdictCard
        variant="reader"
        eyebrow={t('reader.methodEyebrow')}
        headline={plain?.title ?? c.ilcd_situation ?? '—'}
        // the ILCD / LCC badges are for the industry and authority readers (UX round 4)
        codes={validAudience === 'industry' || validAudience === 'authority' ? verdict?.codes : undefined}
        body={plain?.body}
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
          audience={validAudience === 'enduser' ? 'end-user' : validAudience}
          titleClassName="dd-section-title"
          title={t('reader.summaryTitle')}
        />
      ) : null}
      {validAudience === 'industry' ? (
        // a company sent this link did not learn what it would be asked for, nor
        // that the request arrives as an Excel workbook (UX round 5, P2-11, P6-10)
        <section className="dd-reader-todo">
          <h2 className="dd-section-title">{t('reader.dataRequestTitle')}</h2>
          <p>{report.case_contact
            ? t('reader.dataRequest', { contact: report.case_contact })
            : t('reader.dataRequestNoContact')}</p>
          <p><Link to="/r/fill-in">{t('reader.fillIn.howLink')} →</Link></p>
        </section>
      ) : null}
      {validAudience === 'community' || validAudience === 'enduser' ? (
        // residents asked what they could do next (UX round 4, B3, decided by Fable);
        // the end user had no such box (UX round 6, P5-02)
        <section className="dd-reader-todo">
          <h2 className="dd-section-title">{t('reader.whatYouCanDoTitle')}</h2>
          <p>{report.case_contact
            ? t(validAudience === 'community' ? 'reader.whatYouCanDo' : 'reader.whatYouCanDoEndUser',
              { contact: report.case_contact })
            : t('reader.noContact')}</p>
        </section>
      ) : null}
      {/* the end user reads it in its own row (UX round 6, P5-02) */}
      {!c.q3?.env && validAudience !== 'enduser'
        ? <p className="dd-soft">{t('stakeholder.notAssessed.environmental')}</p> : null}
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
            {/* one source with the in-app Authority tab (UX round 6, P3-07) */}
            <ComplianceChecklist items={complianceSignals(c, (key, options) => t(key, options ?? {}) as string)} />
          </div>
        </section>
      ) : null}

      <p className="dd-reader-note">{t('reader.note')}</p>
    </article>
  )
}
