import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import ActionItemCard from '../components/dd/ActionItemCard'
import VerdictDetails from '../components/dd/VerdictDetails'
import KpiCard from '../components/dd/KpiCard'
import ShareReportModal from '../components/dd/ShareReportModal'
import VerdictCard from '../components/dd/VerdictCard'
import ReasoningPanel from '../components/ReasoningPanel'
import { actionItems } from './resultActions'
import { plainVerdict, verdictFor } from './resultNarrative'
import { usePreferenceStore } from '../store/preferenceStore'
import { configurationRows, obligationGroups, withoutQCodes } from './configurationRows'
import ConfigurationSummary from '../components/ConfigurationSummary'
import { useHealth } from '../hooks/useHealth'
import { ApiError, createCase, fetchDcfData, fetchReportDocx, getCase, updateCase } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { useToastStore } from '../store/toastStore'
import type { SectorRule } from '../types/api'
import { chapterName, translateNote } from '../i18n/engineNotes'
import { sectorNote, sectorStatement } from '../i18n/sectorTerms'
import { askConfirm, askText } from '../store/dialogStore'

function isTextInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  )
}

// Legacy MetricCard component was replaced by dd/KpiCard in Phase 5.

export default function ResultPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { then?: string } }
  const result = useCaseStore((s) => s.result)
  const error = useCaseStore((s) => s.error)
  const reset = useCaseStore((s) => s.reset)
  const draft = useCaseStore((s) => s.draft)
  const setServerCase = useCaseStore((s) => s.setServerCase)
  const serverCaseName = useCaseStore((s) => s.serverCaseName)
  const serverCaseId = useCaseStore((s) => s.serverCaseId)
  const savedDiverged = useCaseStore((s) => s.savedDiverged)
  const runScenariosFromDraft = useCaseStore((s) => s.runScenariosFromDraft)
  const loading = useCaseStore((s) => s.loading)
  const pushToast = useToastStore((s) => s.push)
  const signedIn = useAuthStore((s) => s.token !== null)
  const { anonymousSave } = useHealth()
  const mode = usePreferenceStore((s) => s.mode)
  const [showReasoning, setShowReasoning] = useState(true)
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [savingCase, setSavingCase] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)

  function needsSignIn(): boolean {
    // saving needs an account unless the server allows anonymous saves; say
    // so before asking for a name rather than after a 401
    if (!signedIn && anonymousSave === false) {
      pushToast({ type: 'info', message: t('cases.signInToSave'), durationMs: 8000 })
      // come back here after signing in, so the case can be saved at once (UX round 2026-11-03)
      navigate('/login', { state: { from: '/result', then: 'save' } })
      return true
    }
    return false
  }

  function saveErrorToast(e: unknown) {
    // the token was refused (and forgotten by the API client): sign in again
    // and come back to save, instead of a bare error (Kimi test 2026-11-04, A8-08)
    if (e instanceof ApiError && e.status === 401) {
      pushToast({ type: 'info', message: t('auth.sessionExpired'), durationMs: 10000 })
      navigate('/login', { state: { from: '/result', then: 'save' } })
      return
    }
    const msg = e instanceof ApiError ? e.detail : (e as Error).message
    pushToast({
      type: 'error',
      message: t('cases.saveError', { detail: msg }),
      durationMs: 8000,
    })
  }

  /** The network drawn for the case being left, from the editor when it is
   * bound to that case, otherwise from the server; null when none was ever
   * stored (404). Any other failure is thrown, so it can be reported. */
  async function networkOf(caseId: string) {
    const dcf = useDcfDataStore.getState()
    if (dcf.caseId === caseId) return dcf.data
    try {
      return (await fetchDcfData(caseId)).data
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null
      throw e
    }
  }

  async function handleSaveCase() {
    if (needsSignIn()) return
    const previousId = serverCaseId
    const prompt = previousId
      ? t('cases.saveAsDialog', { name: serverCaseName ?? '' })
      : t('cases.saveDialog')
    const name = await askText(prompt, '', t('common.save'))
    if (!name) return
    setSavingCase(true)
    try {
      // Save the result Case (post-pipeline) so the derived state + engine
      // output are persisted along with the inputs.
      const saved = await createCase(name, result ?? draft)
      // "Save as new" started the new case with an empty network: the
      // actors, arrows and values drawn for the previous one were lost
      // without a word (UX round 5, P7-02). They come along now.
      let network = null
      let copyFailed = false
      try {
        network = previousId ? await networkOf(previousId) : null
      } catch {
        copyFailed = true
      }
      setServerCase(saved.id, saved.name)
      if (saved.slug) setSavedSlug(saved.slug)
      if (network && Object.values(network.rows_by_section).some((rows) => rows.length > 0)) {
        const dcf = useDcfDataStore.getState()
        dcf.carryTo(saved.id, network)
        if (!(await dcf.saveToServer())) copyFailed = true
      }
      if (copyFailed) {
        pushToast({ type: 'error', message: t('cases.networkNotCopied'), durationMs: 8000 })
      }
      pushToast({
        type: 'success',
        message: t('cases.saveSuccess', { name }),
      })
    } catch (e) {
      saveErrorToast(e)
    } finally {
      setSavingCase(false)
    }
  }

  async function handleSaveChanges() {
    // there was no way to update a saved case: only "Save as new" (UX round 5, D3)
    if (!serverCaseId || needsSignIn()) return
    // a draft bound to a case without its name (older browser state) would
    // have saved the case with an empty name (Fable review of #202)
    let name = serverCaseName
    if (!name) {
      try {
        name = (await getCase(serverCaseId)).name
      } catch (e) {
        saveErrorToast(e)
        return
      }
    }
    if (!(await askConfirm(t('cases.saveChangesConfirm', { name })))) return
    setSavingCase(true)
    try {
      const saved = await updateCase(serverCaseId, name, result ?? draft)
      setServerCase(saved.id, saved.name)
      pushToast({ type: 'success', message: t('cases.saveChangesSuccess', { name }) })
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        pushToast({ type: 'error', message: t('cases.saveChangesForbidden'), durationMs: 8000 })
      } else {
        saveErrorToast(e)
      }
    } finally {
      setSavingCase(false)
    }
  }

  const saveButtons = (secondaryClass: string) => (
    <>
      {serverCaseId ? (
        <button
          type="button"
          className={savedDiverged ? 'btn btn-primary' : secondaryClass}
          onClick={handleSaveChanges}
          disabled={savingCase}
        >
          {savingCase ? t('cases.saving') : t('cases.saveChanges')}
        </button>
      ) : null}
      <button
        type="button"
        className={secondaryClass}
        onClick={handleSaveCase}
        disabled={savingCase}
      >
        {savingCase && !serverCaseId
          ? t('cases.saving')
          : t(serverCaseId ? 'cases.saveAsButton' : 'cases.saveFirstButton')}
      </button>
    </>
  )

  const hasScenarios = (draft.alternative_scenarios ?? []).length > 0

  async function handleRunScenarios() {
    const out = await runScenariosFromDraft()
    if (out) navigate('/scenarios-result')
  }

  // Back from signing in to save the case: open the save dialog at once
  // instead of leaving the user to find the button again (UX round 5, P4-12).
  const resumeSave = location.state?.then === 'save'
  useEffect(() => {
    if (!resumeSave || !signedIn || !result) return
    const id = window.setTimeout(() => {
      // drop the intent first, so a reload does not ask again
      navigate('/result', { replace: true, state: null })
      void (serverCaseId ? handleSaveChanges() : handleSaveCase())
    }, 0)
    return () => window.clearTimeout(id)
    // runs once, on the way back from the sign-in page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeSave, signedIn])

  // Keyboard shortcuts on the Result page:
  //   R -> toggle reasoning panel
  //   P -> trigger browser print
  // Suppressed when focus is on a text input (so typing 'r' in a
  // form field doesn't toggle the panel).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (isTextInputTarget(e.target)) return
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        setShowReasoning((v) => !v)
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        window.print()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  async function handleStartFresh() {
    if (await askConfirm(t('result.confirmStartFresh'))) {
      reset()
      navigate('/')
    }
  }

  function handleDownloadJson() {
    // Export the result Case (mutated) — the engine output is the
    // most useful payload for re-importing or sharing. Falls back to
    // draft if for some reason result is missing.
    const payload = result ?? draft
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    triggerDownload(blob, 'symba-case.json')
  }

  async function handleDownloadReport() {
    setDownloadingReport(true)
    try {
      // the rows the page shows, so the document carries the same configuration
      const rows = result
        ? configurationRows(result, (key, options) => t(key, options ?? {}) as string)
            .map(({ label, value, why }) => ({ label, value, why }))
        : []
      const blob = await fetchReportDocx(draft, rows)
      triggerDownload(blob, 'symba-case-report.docx')
    } catch (e) {
      const detail =
        e instanceof ApiError
          ? `${e.status}: ${e.detail}`
          : e instanceof Error
            ? e.message
            : 'unknown'
      pushToast({
        type: 'error',
        message: `${t('result.actions.reportError')} — ${detail}`,
        durationMs: 8000,
      })
    } finally {
      setDownloadingReport(false)
    }
  }

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className="result">
        <h1>{t('result.error.title')}</h1>
        <p className="error-text">{error}</p>
        <Link to="/questionnaire" className="btn btn-secondary">
          {t('result.error.back')}
        </Link>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="result">
        <h1>{t('result.noResult.title')}</h1>
        <p className="muted">{t('result.noResult.desc')}</p>
        <Link to="/questionnaire" className="btn btn-primary">
          {t('result.noResult.cta')}
        </Link>
      </div>
    )
  }

  const blockedBy = result.blocked_by ?? []

  const allItems = actionItems(result)
  // Methodological obligations live in the Data Collection File — that is
  // where documenting them happens, and 30 cards would bury the two or
  // three things that actually need a decision here.
  const todo = allItems.filter((item) => item.kind !== 'obligation')
  const obligationCount = allItems.length - todo.length
  // the sector chapters are a row of the configuration: the per-flow note would repeat it
  const notes = (result.warnings ?? []).filter((w) => !(blockedBy.length === 0 && w.code === 'flow_part2_chapter'))
  const verdict = verdictFor(result, (key, fallback) =>
    t(key, { defaultValue: fallback ?? '' }),
  )
  // guided mode speaks to a plant manager or a newcomer: the verdict in words,
  // what to do with the result, and the methodological tensions folded away
  // for the analyst (UX round 2026-11-03: P3-01, P3-05, P7-02)
  const guided = mode === 'guided'
  const headline = verdict && guided
    ? plainVerdict(result, verdict, (key, fallback) => t(key, { defaultValue: fallback ?? '' }))
    : verdict
  const scenarioCount = (draft.alternative_scenarios ?? []).length

  return (
    <div className="dd-page result">
      <VerdictCard
        eyebrow={serverCaseName ?? t('result.title')}
        headline={headline?.title ?? result.ilcd_situation ?? '—'}
        // the ILCD and LCC badges meant nothing to a plant manager (UX round 4)
        codes={guided ? undefined : verdict?.codes}
        body={headline?.body}
        // the situation is the first choice of the configuration and had no reason
        subtitle={(() => {
          const why = result.decision_context
            ? t('result.verdictWhy', { answer: t(`questionnaire.q9.options.${result.decision_context}`) })
            : t('result.verdictWhyQ1')
          return guided ? withoutQCodes(why) : why
        })()}
      />

      {guided && blockedBy.length === 0 ? (
        <section className="result-guided" aria-labelledby="result-guided-title">
          <h2 id="result-guided-title">{t('result.guided.title')}</h2>
          <p>{t('result.guided.lead')}</p>
          <ol>
            <li>{serverCaseId
              ? t('result.guided.step1Saved', { name: serverCaseName ?? '' })
              : signedIn
                ? t('result.guided.step1SignedIn')
                : t('result.guided.step1')}</li>
            <li>{t('result.guided.step2')}</li>
            <li>{t('result.guided.step3')}</li>
          </ol>
          <div className="result-guided-actions">
            {saveButtons('btn btn-secondary')}
            <Link to="/data-collection" className="btn btn-primary">{t('dcf.openButton')}</Link>
          </div>
        </section>
      ) : null}

      {scenarioCount > 0 && blockedBy.length === 0 ? (
        // the scenarios were behind one of eight buttons at the bottom (P2-15)
        <p className="result-scenarios-box">
          {t('result.scenariosBox', { count: scenarioCount })}{' '}
          <button type="button" className="btn btn-secondary" onClick={handleRunScenarios} disabled={loading}>
            {loading ? t('result.actions.runningScenarios') : t('result.actions.runScenarios')}
          </button>
        </p>
      ) : null}

      {verdict ? <VerdictDetails verdict={verdict} /> : null}

      {blockedBy.length === 0 ? <ConfigurationSummary kase={result} /> : null}

      {notes.length > 0 ? (
        <section className="result-notes" aria-labelledby="result-notes-title">
          <h2 id="result-notes-title" className="result-notes-title">
            {t('result.notes.title')}
          </h2>
          <ul>
            {notes.map((w, i) => (
              <li key={`${w.code}-${i}`}>{translateNote(t, w, guided)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="result-next">
        <h2 className="result-next-title">
          {t('result.next.title')}
          {/* the count read as a stray "11" after the heading (Kimi test
              2026-11-04, A1-07): a screen reader now hears "11 items" */}
          <span className="dd-pill dd-pill-muted">
            {todo.length}
            <span className="visually-hidden"> {t('result.next.countUnit', { count: todo.length })}</span>
          </span>
        </h2>

        {blockedBy.length > 0 ? (
          <p className="result-next-lead result-next-blocked">
            {t('result.blocked.desc')}
          </p>
        ) : todo.length === 0 ? (
          // "no obligation" stood above "9 obligations to document" when only
          // the critical decision points were empty
          <p className="result-next-lead">
            {obligationCount > 0 ? t('result.next.noTensions') : t('result.next.allClear')}
          </p>
        ) : (
          <p className="result-next-lead">{t('result.next.lead')}</p>
        )}
        {/* one name per kind of item across result, report and DCF (P2-14) */}
        {blockedBy.length === 0 ? <p className="result-next-glossary">{t('result.next.glossary')}</p> : null}

        {guided && todo.length > 0 ? (
          <details className="result-next-analyst">
            <summary>{t('result.guided.analystTitle', { count: todo.length })}</summary>
            <div className="result-next-list">
              {todo.map((item) => (
                <ActionItemCard key={item.key} item={item} />
              ))}
            </div>
          </details>
        ) : (
          <div className="result-next-list">
            {todo.map((item) => (
              <ActionItemCard key={item.key} item={item} />
            ))}
          </div>
        )}

        {todo.length > 0 && !i18n.language.startsWith('en') ? (
          <p className="result-next-provenance">{t('result.next.provenance')}</p>
        ) : null}

        {obligationCount > 0 ? (
          <p className="result-next-obligations">
            {t('result.next.obligations', {
              count: obligationCount,
              groups: obligationGroups(result.applicable_rules ?? [])
                .map((g) => t(`result.next.families.${g.family}`, { count: g.count }))
                .join(' · '),
            })}
          </p>
        ) : null}

        <div className="result-next-cta">
          <Link to="/data-collection" className="btn btn-primary">
            {t('dcf.openButton')}
          </Link>
          <span className="result-next-cta-hint">{t('result.next.ctaHint')}</span>
        </div>
      </section>

      {(result.sector_rules?.length ?? 0) > 0 ? (
        <SectorRules rules={result.sector_rules!} />
      ) : null}

      <details className="result-technical">
        <summary>{t('result.technical.title')}</summary>
        <p className="result-technical-lead">{t('result.technical.lead')}</p>

        <div className="dd-kpi-strip">
          <KpiCard
            label={t('result.summary.activatedNodes')}
            value={<>{result.activated_nodes?.length ?? 0}<span className="dd-muted"> / 186</span></>}
            tone="success"
          />
          <KpiCard
            label={t('result.summary.l1Blocks')}
            value={blockedBy.length}
            tone={blockedBy.length > 0 ? 'warning' : 'success'}
          />
          <KpiCard
            label={t('result.summary.obligations')}
            value={result.applicable_rules?.length ?? 0}
            tone="neutral"
          />
          <KpiCard
            label={t('result.summary.l3Cdps')}
            value={result.cdp_flags?.length ?? 0}
            tone={(result.cdp_flags?.length ?? 0) > 0 ? 'warning' : 'neutral'}
          />
        </div>

        <div className="reasoning-toggle">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowReasoning((v) => !v)}
          >
            {showReasoning ? t('result.toggleHide') : t('result.toggleShow')}
          </button>
        </div>

        {showReasoning && blockedBy.length === 0 ? (
          <ReasoningPanel
            activatedNodes={result.activated_nodes ?? []}
            cdp_flags={result.cdp_flags ?? []}
            pillars={[
              { name: 'lca', data: result.lca ?? {} },
              { name: 'lcc', data: result.lcc ?? {} },
              { name: 'slca', data: result.slca ?? {} },
              { name: 'report', data: result.report ?? {} },
              { name: 'governance', data: result.governance ?? {} },
              { name: 'review', data: result.review ?? {} },
              { name: 'methodological_charter', data: result.methodological_charter ?? {} },
              { name: 'system', data: result.system ?? {} },
            ]}
          />
        ) : null}

        <details className="result-raw">
          <summary>{t('result.rawJson')}</summary>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </details>
      </details>

      <div className="result-actions">
        <Link to="/questionnaire" className="btn btn-secondary">
          {t('result.actions.adjust')}
        </Link>
        {hasScenarios ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunScenarios}
            disabled={loading}
          >
            {loading
              ? t('result.actions.runningScenarios')
              : t('result.actions.runScenarios')}
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownloadJson}
        >
          {t('result.actions.downloadJson')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownloadReport}
          disabled={downloadingReport}
        >
          {downloadingReport
            ? t('result.actions.downloadingReport')
            : t('result.actions.downloadReport')}
        </button>
        <Link
          to="/stakeholder-report"
          className="btn btn-secondary"
        >
          {t('stakeholder.openButton')}
        </Link>
        {saveButtons('btn btn-secondary')}
        {!signedIn && anonymousSave === false ? (
          <span className="result-save-hint">{t('result.saveHint')}</span>
        ) : null}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShareOpen(true)}
        >
          {t('share.buttonLabel')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleStartFresh}
        >
          {t('result.actions.startFresh')}
        </button>
      </div>
      {shareOpen ? (
        <ShareReportModal
          // only a case saved on the server has a public report: the pipeline id
          // gave links that ended on "Report not found" (UX round 2026-11-03)
          caseId={serverCaseId}
          caseSlug={savedSlug}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </div>
  )
}


/** D4.1 Part 2 rules of the chapters the case touches, grouped by chapter. */
function SectorRules({ rules }: { rules: SectorRule[] }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const chapters = rules.reduce<Record<string, SectorRule[]>>((acc, r) => {
    ;(acc[r.chapter] ??= []).push(r)
    return acc
  }, {})
  return (
    <section className="result-sector-rules" aria-labelledby="result-sector-rules-title">
      <h2 id="result-sector-rules-title" className="result-notes-title">
        {t('result.sectorRules.title')}
      </h2>
      <p>{t('result.sectorRules.lead')}</p>
      {Object.entries(chapters).map(([chapter, list]) => (
        <details key={chapter}>
          <summary>
            <strong>{chapterName(t, chapter)}</strong> · {t('result.sectorRules.count', { count: list.length })}
          </summary>
          <p className="result-sector-reason">
            {t('result.sectorRules.activatedBy', {
              reasons: list[0].activated_by
                .map((a) => (a.kind === 'flow'
                  ? t('result.sectorRules.byFlow', { name: a.name })
                  : t('result.sectorRules.byCaseSector')))
                .join(', '),
            })}
          </p>
          <ul>
            {list.map((r) => (
              <li key={r.id}>
                <span className={`dd-pill ${r.strength === 'must' ? 'dd-pill-amber' : 'dd-pill-muted'}`}>
                  {t(`result.sectorRules.strength.${r.strength}`)}
                </span>{' '}
                {sectorStatement(t, lang, r)}
                {' '}
                <span className="result-sector-source">({r.source}, {r.lines})</span>
                {r.note ? <div className="result-sector-source">{sectorNote(t, lang, r)}</div> : null}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  )
}

