import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import PresetLoader from '../components/PresetLoader'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const reset = useCaseStore((s) => s.reset)
  const mode = usePreferenceStore((s) => s.mode)
  const setMode = usePreferenceStore((s) => s.setMode)

  function handleStart() {
    reset()
    navigate('/questionnaire')
  }

  return (
    <div className="home">
      <h1>{t('home.title')}</h1>
      <p className="home-tagline">{t('home.tagline')}</p>
      <p className="home-description">{t('home.description')}</p>

      <div className="home-mode-switch" role="radiogroup" aria-label={t('home.modeLabel')}>
        <span className="home-mode-label">{t('home.modeLabel')}</span>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'expert'}
          className={`home-mode-btn ${mode === 'expert' ? 'home-mode-btn-active' : ''}`}
          onClick={() => setMode('expert')}
        >
          {t('home.modeExpert')}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'guided'}
          className={`home-mode-btn ${mode === 'guided' ? 'home-mode-btn-active' : ''}`}
          onClick={() => setMode('guided')}
        >
          {t('home.modeGuided')}
        </button>
      </div>

      <p className="home-mode-hint">{t(`home.modeHint.${mode}`)}</p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleStart}
      >
        {t('home.startButton')}
        <ArrowRight size={18} />
      </button>

      <hr className="home-divider" />

      <PresetLoader />
    </div>
  )
}
