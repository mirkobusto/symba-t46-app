// HomePage — workspace overview.
//
// The landing page: three plain cards (what the tool is, what it does not
// do, who it is for), the hero CTA to start an assessment, and the
// PresetLoader with published cases. The KPI strip of saved cases, ILCD
// situations and "186 Phase 1 nodes" told a newcomer nothing about whether
// the tool fits them (UX round 2026-11-02).

import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import PresetLoader from '../components/PresetLoader'
import { usePreferenceStore } from '../store/preferenceStore'
import { startNewAssessment } from '../store/signOut'

const INTRO = ['what', 'not', 'who'] as const

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hash } = useLocation()
  // the questionnaire links here ("/#presets"); the router does not scroll to anchors
  useEffect(() => {
    if (hash === '#presets') document.getElementById('presets')?.scrollIntoView()
  }, [hash])
  const mode = usePreferenceStore((s) => s.mode)
  const setMode = usePreferenceStore((s) => s.setMode)
  const role = usePreferenceStore((s) => s.role)

  // it emptied the answers being worked on without asking (UX round 6, P1-09, P7-04)
  async function handleStart() {
    if (await startNewAssessment()) navigate('/questionnaire')
  }

  return (
    <div className="dd-page">
      <div className="dd-page-head">
        <div>
          <h1 className="dd-page-title">{t('home.title')}</h1>
          <p className="dd-page-sub">{t('home.tagline')}</p>
        </div>
      </div>

      {/* a citizen who picked "end user" found an analyst's questionnaire and no
          way to the report they had received (UX round 6, P5-05) */}
      {role && role !== 'analyst' ? (
        <div className="dd-card home-reader">
          <p>
            {t('home.reader.link')}{' '}
            <Link to="/r/open">{t('home.reader.open')} →</Link>
          </p>
        </div>
      ) : null}

      <div className="home-intro">
        {INTRO.map((k) => (
          <div key={k} className="dd-card home-intro-card">
            <h2 className="home-intro-title">{t(`home.intro.${k}.title`)}</h2>
            <p>{t(`home.intro.${k}.body`)}</p>
          </div>
        ))}
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
              onClick={() => void handleStart()}
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
      <div className="dd-card" id="presets">
        <div className="dd-card-head">
          <h3>{t('home.presetsTitle')}</h3>
          <span className="dd-card-meta">{t('home.presetsMeta')}</span>
        </div>
        <PresetLoader />
      </div>
    </div>
  )
}
