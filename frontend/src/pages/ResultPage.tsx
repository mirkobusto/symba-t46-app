import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import KpiCard from '../components/dd/KpiCard'
import ShareReportModal from '../components/dd/ShareReportModal'
import VerdictCard from '../components/dd/VerdictCard'
import ReasoningPanel from '../components/ReasoningPanel'
import { ApiError, createCase, fetchReportDocx } from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { useToastStore } from '../store/toastStore'

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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const result = useCaseStore((s) => s.result)
  const error = useCaseStore((s) => s.error)
  const reset = useCaseStore((s) => s.reset)
  const draft = useCaseStore((s) => s.draft)
  const runScenariosFromDraft = useCaseStore((s) => s.runScenariosFromDraft)
  const loading = useCaseStore((s) => s.loading)
  const pushToast = useToastStore((s) => s.push)
  const [showReasoning, setShowReasoning] = useState(true)
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [savingCase, setSavingCase] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)

  async function handleSaveCase() {
    const name = window.prompt(
      t('cases.saveDialog'),
      t('cases.namePlaceholder'),
    )
    if (!name) return
    setSavingCase(true)
    try {
      // Save the result Case (post-pipeline) so pathway_id + engine
      // output are persisted along with the inputs.
      const saved = await createCase(name, result ?? draft)
      if (saved.slug) setSavedSlug(saved.slug)
      pushToast({
        type: 'success',
        message: t('cases.saveSuccess', { name }),
      })
    } catch (e) {
      const msg = e instanceof ApiError ? e.detail : (e as Error).message
      pushToast({
        type: 'error',
        message: t('cases.saveError', { detail: msg }),
        durationMs: 8000,
      })
    } finally {
      setSavingCase(false)
    }
  }

  const hasScenarios =
    draft.q2 === 'D' && (draft.alternative_scenarios ?? []).length > 0

  async function handleRunScenarios() {
    const out = await runScenariosFromDraft()
    if (out) navigate('/scenarios-result')
  }

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

  function handleStartFresh() {
    if (window.confirm(t('result.confirmStartFresh'))) {
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
      const blob = await fetchReportDocx(draft)
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

  return (
    <div className="dd-page result">
      <VerdictCard
        eyebrow={t('result.title')}
        pathway={result.pathway_id ?? '—'}
        extended={!!result.is_01_extended}
        subtitle={[result.ilcd_situation, result.lcc_type].filter(Boolean).join(' · ')}
        tags={[
          result.q6a ? `Q6a: ${result.q6a}` : undefined,
          result.q7 ? `Q7: ${result.q7}` : undefined,
          result.slca_activation_state ? `S-LCA: ${result.slca_activation_state}` : undefined,
        ].filter(Boolean)}
      />

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
          label={t('result.summary.l2Violations')}
          value={result.rule_violations?.length ?? 0}
          tone={(result.rule_violations?.length ?? 0) > 0 ? 'warning' : 'neutral'}
        />
        <KpiCard
          label={t('result.summary.l3Cdps')}
          value={result.cdp_flags?.length ?? 0}
          tone={(result.cdp_flags?.length ?? 0) > 0 ? 'warning' : 'neutral'}
        />
      </div>

      {blockedBy.length > 0 ? (
        <div className="blocked-banner">
          <h3>{t('result.blocked.title')}</h3>
          <p>{t('result.blocked.desc')}</p>
          <ul>
            {blockedBy.map((id) => (
              <li key={id}>
                <code>{id}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
          rule_violations={result.rule_violations ?? []}
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
          to="/data-collection"
          className="btn btn-primary"
        >
          {t('dcf.openButton')}
        </Link>
        <Link
          to="/stakeholder-report"
          className="btn btn-secondary"
        >
          {t('stakeholder.openButton')}
        </Link>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSaveCase}
          disabled={savingCase}
        >
          {savingCase ? t('cases.saving') : t('cases.saveAsButton')}
        </button>
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
          caseId={result?.id ?? null}
          caseSlug={savedSlug}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </div>
  )
}
