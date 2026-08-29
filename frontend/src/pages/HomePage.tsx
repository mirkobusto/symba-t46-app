// HomePage — workspace overview.
//
// The default admin landing: hero CTA to start an assessment, a 4-KPI
// strip that surfaces workspace activity, quick links to the main
// downstream sections, and the PresetLoader (for demo / paper cases).
//
// Fetches the case list to derive KPI counts; if the backend is down
// or the response empty it falls back to zero values (no error state).

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import KpiCard from '../components/dd/KpiCard'
import PresetLoader from '../components/PresetLoader'
import { ApiError, listCases } from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type { CaseSummary } from '../types/api'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const reset = useCaseStore((s) => s.reset)
  const mode = usePreferenceStore((s) => s.mode)
  const setMode = usePreferenceStore((s) => s.setMode)

  const [cases, setCases] = useState<CaseSummary[]>([])

  useEffect(() => {
    let cancelled = false
    listCases()
      .then((rows) => { if (!cancelled) setCases(rows) })
      .catch((e: unknown) => {
        if (cancelled) return
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return
        // Silent: KPIs stay at 0 rather than blocking the page.
        console.warn('HomePage listCases failed', e)
      })
    return () => { cancelled = true }
  }, [])

  const total = cases.length
  const byPathway = cases.reduce<Record<string, number>>((acc, c) => {
    const k = c.pathway_id ?? 'unset'
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})
  const uniquePathways = Object.keys(byPathway).filter((k) => k !== 'unset').length
  const withPathway = total - (byPathway['unset'] ?? 0)

  function handleStart() {
    reset()
    navigate('/questionnaire')
  }

  return (
    <div className="dd-page">
      <div className="dd-page-head">
        <div>
          <h1 className="dd-page-title">{t('home.title')}</h1>
          <p className="dd-page-sub">{t('home.tagline')}</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="dd-kpi-strip">
        <KpiCard
          label={t('home.kpi.savedCases')}
          value={total}
          detail={t('home.kpi.savedCasesDetail')}
        />
        <KpiCard
          label={t('home.kpi.withPathway')}
          value={withPathway}
          detail={t('home.kpi.withPathwayDetail', { total })}
          tone="success"
        />
        <KpiCard
          label={t('home.kpi.uniquePathways')}
          value={uniquePathways}
          detail={t('home.kpi.uniquePathwaysDetail')}
        />
        <KpiCard
          label={t('home.kpi.language')}
          value="EN·IT·FR·DE·ES"
          detail={t('home.kpi.languageDetail')}
          tone="info"
        />
      </div>

      {/* Hero CTA */}
      <div className="dd-hero">
        <div className="dd-hero-copy">
          <h2 className="dd-hero-title">{t('home.hero.title')}</h2>
          <p className="dd-hero-desc">{t('home.description')}</p>
          <div className="dd-hero-actions">
            <button
              type="button"
              className="dd-btn dd-btn-primary"
              onClick={handleStart}
            >
              {t('home.startButton')} <ArrowRight size={16} />
            </button>
            <Link to="/cases" className="dd-btn dd-btn-ghost">
              {t('home.openCasesLink')} →
            </Link>
          </div>
        </div>
        <div className="dd-hero-mode">
          <div className="dd-hero-mode-label">{t('home.modeLabel')}</div>
          <div className="dd-hero-mode-toggle">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'expert'}
              className={mode === 'expert' ? 'active' : ''}
              onClick={() => setMode('expert')}
            >
              {t('home.modeExpert')}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'guided'}
              className={mode === 'guided' ? 'active' : ''}
              onClick={() => setMode('guided')}
            >
              {t('home.modeGuided')}
            </button>
          </div>
          <p className="dd-hero-mode-hint">{t(`home.modeHint.${mode}`)}</p>
        </div>
      </div>

      {/* Presets */}
      <div className="dd-card">
        <div className="dd-card-head">
          <h3>{t('home.presetsTitle')}</h3>
          <span className="dd-card-meta">{t('home.presetsMeta')}</span>
        </div>
        <PresetLoader />
      </div>
    </div>
  )
}
