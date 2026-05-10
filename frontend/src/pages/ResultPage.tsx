import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import ReasoningPanel from '../components/ReasoningPanel'
import { useCaseStore } from '../store/caseStore'

export default function ResultPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const result = useCaseStore((s) => s.result)
  const error = useCaseStore((s) => s.error)
  const reset = useCaseStore((s) => s.reset)
  const [showReasoning, setShowReasoning] = useState(true)

  function handleStartFresh() {
    if (window.confirm(t('result.confirmStartFresh'))) {
      reset()
      navigate('/')
    }
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

      <dl className="result-summary">
        <dt>{t('result.summary.pathway')}</dt>
        <dd>
          {result.pathway_id ?? '—'}
          {result.is_01_extended ? ` ${t('result.summary.extended')}` : ''}
        </dd>

        <dt>{t('result.summary.ilcdSituation')}</dt>
        <dd>{result.ilcd_situation ?? '—'}</dd>

        <dt>{t('result.summary.lccType')}</dt>
        <dd>{result.lcc_type ?? '—'}</dd>

        <dt>{t('result.summary.slca')}</dt>
        <dd>{result.slca_activation_state ?? '—'}</dd>

        <dt>{t('result.summary.activatedNodes')}</dt>
        <dd>{result.activated_nodes?.length ?? 0}</dd>

        <dt>{t('result.summary.l1Blocks')}</dt>
        <dd>{blockedBy.length}</dd>

        <dt>{t('result.summary.l2Violations')}</dt>
        <dd>{result.rule_violations?.length ?? 0}</dd>

        <dt>{t('result.summary.l3Cdps')}</dt>
        <dd>{result.cdp_flags?.length ?? 0}</dd>
      </dl>

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
