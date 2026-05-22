// StakeholderReportPage — Phase B of the T4.6 roadmap.
//
// Wraps StakeholderView with the 4 stakeholder type tabs. The current
// case is read from caseStore.result (or .draft as fallback); the
// scoring payload, if any, is fetched from /api/scoring/{caseId}.
// A 404 from the scoring endpoint means CIRCE has not yet ingested
// the numbers, and the page renders the placeholder banner.
//
// In v1 the case_id used for scoring lookup is read from
// caseStore.result.id (set after running the pipeline). For unsaved
// drafts there is no server-side case_id, so scoring is automatically
// "not yet available".

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import StakeholderView, {
  type StakeholderType,
} from '../components/StakeholderView'
import { ApiError, fetchScoring } from '../services/api'
import { useCaseStore } from '../store/caseStore'
import type { ScoringPayload } from '../types/scoring'

const STAKEHOLDERS: StakeholderType[] = [
  'industry',
  'community',
  'authority',
  'end-user',
]

export default function StakeholderReportPage() {
  const { t } = useTranslation()
  const result = useCaseStore((s) => s.result)
  const draft = useCaseStore((s) => s.draft)
  const sourceCase = result ?? draft

  const [active, setActive] = useState<StakeholderType>('industry')
  const [scoring, setScoring] = useState<ScoringPayload | null>(null)
  const [loadingScoring, setLoadingScoring] = useState(true)

  const caseId = sourceCase.id

  useEffect(() => {
    // Avoid synchronous setState at effect start (eslint
    // react-hooks/set-state-in-effect). For !caseId we defer the
    // null/false transition to a microtask.
    let cancelled = false
    if (!caseId) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setScoring(null)
          setLoadingScoring(false)
        }
      })
      return () => {
        cancelled = true
      }
    }
    fetchScoring(caseId)
      .then((s) => {
        if (!cancelled) {
          setScoring(s)
          setLoadingScoring(false)
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return
        if (e instanceof ApiError && e.status === 404) {
          setScoring(null)
        } else {
          setScoring(null)
          console.warn('fetchScoring failed', e)
        }
        setLoadingScoring(false)
      })
    return () => {
      cancelled = true
    }
  }, [caseId])

  return (
    <div className="stakeholder-page">
      <div className="stakeholder-header">
        <h1>{t('stakeholder.title')}</h1>
        <p className="stakeholder-subtitle">{t('stakeholder.subtitle')}</p>
      </div>

      <div className="stakeholder-tabs" role="tablist">
        {STAKEHOLDERS.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={active === s}
            className={`stakeholder-tab ${active === s ? 'stakeholder-tab-active' : ''}`}
            onClick={() => setActive(s)}
          >
            {t(`stakeholder.tabs.${s}`)}
          </button>
        ))}
      </div>

      {loadingScoring ? (
        <p className="muted">{t('stakeholder.loadingScoring')}</p>
      ) : (
        <StakeholderView
          stakeholderType={active}
          caseData={sourceCase}
          scoring={scoring}
        />
      )}

      <div className="stakeholder-actions">
        <Link to="/result" className="btn btn-secondary">
          {t('stakeholder.backToResult')}
        </Link>
        <Link to="/data-collection" className="btn btn-secondary">
          {t('stakeholder.openDcf')}
        </Link>
      </div>
    </div>
  )
}
