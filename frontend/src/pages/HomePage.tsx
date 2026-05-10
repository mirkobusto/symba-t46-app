import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import PresetLoader from '../components/PresetLoader'
import { useCaseStore } from '../store/caseStore'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const reset = useCaseStore((s) => s.reset)

  function handleStart() {
    reset()
    navigate('/questionnaire')
  }

  return (
    <div className="home">
      <h1>{t('home.title')}</h1>
      <p className="home-tagline">{t('home.tagline')}</p>
      <p className="home-description">{t('home.description')}</p>

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
