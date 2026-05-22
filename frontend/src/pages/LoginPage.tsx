// Login page (Phase D).
//
// Two-tab UI: Sign in (existing user) vs Register (new user). On
// success, store the token in authStore and redirect to the route the
// user came from (default: /).

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { ApiError, authLogin, authRegister } from '../services/api'
import { useAuthStore } from '../store/authStore'

type Tab = 'login' | 'register'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const setSession = useAuthStore((s) => s.setSession)
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = location.state?.from || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const fn = tab === 'login' ? authLogin : authRegister
      const result = await fn({ email, password })
      setSession(result.access_token, result.user)
      navigate(redirectTo)
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <h1>{t('auth.title')}</h1>
      <p className="muted">{t('auth.subtitle')}</p>

      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'login'}
          className={`auth-tab ${tab === 'login' ? 'auth-tab-active' : ''}`}
          onClick={() => setTab('login')}
        >
          {t('auth.tabLogin')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'register'}
          className={`auth-tab ${tab === 'register' ? 'auth-tab-active' : ''}`}
          onClick={() => setTab('register')}
        >
          {t('auth.tabRegister')}
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>{t('auth.emailLabel')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            aria-required="true"
          />
        </label>
        <label className="auth-field">
          <span>{t('auth.passwordLabel')}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={tab === 'register' ? 8 : 1}
            aria-required="true"
          />
          {tab === 'register' ? (
            <small className="muted">{t('auth.passwordHelp')}</small>
          ) : null}
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting
            ? t('auth.submitting')
            : tab === 'login'
              ? t('auth.submitLogin')
              : t('auth.submitRegister')}
        </button>

        <p className="auth-skip">
          <Link to="/">{t('auth.skipLink')}</Link>
        </p>
      </form>
    </div>
  )
}
