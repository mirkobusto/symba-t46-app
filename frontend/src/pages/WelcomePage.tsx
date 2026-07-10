// WelcomePage — first-visit onboarding wizard.
//
// Two steps: pick a role, pick a task. Persists to preferenceStore
// (localStorage). The App-level router redirects any non-authenticated
// visitor with `hasOnboarded === false` to /welcome unless they're
// already on /welcome, /login, or a public reader route.
//
// Users can revisit /welcome anytime to change their choice — the
// wizard reads the current values and pre-selects them.

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  recommendedRouteFor,
  usePreferenceStore,
  type UserRole,
  type UserTask,
} from '../store/preferenceStore'

const ROLES: { key: UserRole; emoji: string }[] = [
  { key: 'analyst', emoji: '🧪' },
  { key: 'industry', emoji: '🏭' },
  { key: 'authority', emoji: '🏛' },
  { key: 'community', emoji: '🌳' },
  { key: 'enduser', emoji: '👤' },
  { key: 'unknown', emoji: '❔' },
]

const TASKS: { key: UserTask; emoji: string }[] = [
  { key: 'assess', emoji: '📝' },
  { key: 'read', emoji: '📄' },
  { key: 'explore', emoji: '🗺' },
  { key: 'browse', emoji: '👀' },
]

export default function WelcomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    role: storedRole, task: storedTask, completeOnboarding,
  } = usePreferenceStore()

  const [step, setStep] = useState<1 | 2>(storedRole ? 2 : 1)
  const [role, setRole] = useState<UserRole | null>(storedRole)
  const [task, setTask] = useState<UserTask | null>(storedTask)

  function handleContinue() {
    if (step === 1 && role) {
      setStep(2)
      return
    }
    if (step === 2 && role && task) {
      completeOnboarding(role, task)
      navigate(recommendedRouteFor(role, task))
    }
  }

  function handleBack() {
    if (step === 2) setStep(1)
  }

  function handleSkip() {
    // Skip = default analyst + browse, so the router stops sending them
    // back to /welcome. They can revisit via Settings → Change role.
    completeOnboarding('analyst', 'browse')
    navigate('/')
  }

  return (
    <div className="dd-welcome">
      <div className="dd-welcome-card">
        <div className="dd-welcome-progress" aria-hidden="true">
          <span className={step === 1 ? 'active' : 'done'} />
          <span className={step === 2 ? 'active' : ''} />
        </div>

        <h1 className="dd-welcome-title">{t('welcome.title')}</h1>
        <p className="dd-welcome-lead">{t('welcome.lead')}</p>

        {step === 1 ? (
          <>
            <h2 className="dd-welcome-step">
              {t('welcome.step1.title')}
              <span className="dd-welcome-step-num">1 / 2</span>
            </h2>
            <div className="dd-welcome-grid" role="radiogroup" aria-label={t('welcome.step1.title')}>
              {ROLES.map(({ key, emoji }) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={role === key}
                  className={`dd-welcome-tile ${role === key ? 'selected' : ''}`}
                  onClick={() => setRole(key)}
                >
                  <div className="dd-welcome-emoji">{emoji}</div>
                  <div className="dd-welcome-tile-name">{t(`welcome.roles.${key}.name`)}</div>
                  <div className="dd-welcome-tile-desc">{t(`welcome.roles.${key}.desc`)}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="dd-welcome-step">
              {t('welcome.step2.title')}
              <span className="dd-welcome-step-num">2 / 2</span>
            </h2>
            <div className="dd-welcome-grid dd-welcome-grid-2col" role="radiogroup">
              {TASKS.map(({ key, emoji }) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={task === key}
                  className={`dd-welcome-tile ${task === key ? 'selected' : ''}`}
                  onClick={() => setTask(key)}
                >
                  <div className="dd-welcome-emoji">{emoji}</div>
                  <div className="dd-welcome-tile-name">{t(`welcome.tasks.${key}.name`)}</div>
                  <div className="dd-welcome-tile-desc">{t(`welcome.tasks.${key}.desc`)}</div>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="dd-welcome-actions">
          {step === 2 ? (
            <button
              type="button"
              className="dd-btn dd-btn-secondary"
              onClick={handleBack}
            >
              ← {t('welcome.back')}
            </button>
          ) : null}
          <button
            type="button"
            className="dd-btn dd-btn-primary"
            disabled={step === 1 ? !role : !task}
            onClick={handleContinue}
          >
            {step === 1 ? t('welcome.next') : t('welcome.finish')}
          </button>
          <button
            type="button"
            className="dd-btn dd-btn-ghost"
            onClick={handleSkip}
          >
            {t('welcome.skip')}
          </button>
        </div>
      </div>
    </div>
  )
}
