import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

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

type Tone = 'primary' | 'success' | 'warning' | 'error'

interface MetricCardProps {
  label: string
  value: string | number
  subtitle?: string
  tone?: Tone
}

function MetricCard({ label, value, subtitle, tone }: MetricCardProps) {
  const cls = tone ? `metric-card metric-card-${tone}` : 'metric-card'
  return (
    <div className={cls}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {subtitle ? <div className="metric-subtitle">{subtitle}</div> : null}
    </div>
  )
}

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
  const [savingCase, setSavingCase] = useState(false)

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
      await createCase(name, result ?? draft)
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
    <div className="result">
      <h1>{t('result.title')}</h1>

      <div className="metric-grid">
        <MetricCard
          label={t('result.summary.pathway')}
          value={result.pathway_id ?? '—'}
          tone="primary"
          subtitle={result.is_01_extended ? t('result.summary.extended') : undefined}
        />
        <MetricCard
          label={t('result.summary.ilcdSituation')}
          value={result.ilcd_situation ?? '—'}
        />
        <MetricCard
          label={t('result.summary.lccType')}
          value={result.lcc_type ?? '—'}
        />
        <MetricCard
          label={t('result.summary.slca')}
          value={result.slca_activation_state ?? '—'}
        />
        <MetricCard
          label={t('result.summary.activatedNodes')}
          value={result.activated_nodes?.length ?? 0}
          tone="success"
        />
        <MetricCard
          label={t('result.summary.l1Blocks')}
          value={blockedBy.length}
          tone={blockedBy.length > 0 ? 'error' : undefined}
        />
        <MetricCard
          label={t('result.summary.l2Violations')}
          value={result.rule_violations?.length ?? 0}
          tone={(result.rule_violations?.length ?? 0) > 0 ? 'warning' : undefined}
        />
        <MetricCard
          label={t('result.summary.l3Cdps')}
          value={result.cdp_flags?.length ?? 0}
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
          onClick={handleStartFresh}
        >
          {t('result.actions.startFresh')}
        </button>
      </div>
    </div>
  )
}
