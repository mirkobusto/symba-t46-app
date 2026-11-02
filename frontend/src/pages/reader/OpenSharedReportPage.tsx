// OpenSharedReportPage — /r/open
//
// Where "Read a shared report" lands. It used to land on "My cases", a list
// of somebody else's saved cases with Load and Delete buttons and no place
// to paste the link the reader had received (UX round 2026-11-02).

import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { sharedReportPath } from './sharedReportPath'

export default function OpenSharedReportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [invalid, setInvalid] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const path = sharedReportPath(value)
    if (!path) {
      setInvalid(true)
      return
    }
    navigate(path)
  }

  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">{t('reader.open.eyebrow')}</div>
      <h1>{t('reader.open.title')}</h1>
      <p>{t('reader.open.lead')}</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>{t('reader.open.label')}</span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setInvalid(false)
            }}
            placeholder={t('reader.open.placeholder')}
            aria-invalid={invalid}
            autoFocus
          />
        </label>
        {invalid ? <p className="error-text">{t('reader.open.invalid')}</p> : null}
        <button type="submit" className="btn btn-primary">
          {t('reader.open.submit')}
        </button>
      </form>

      <p className="dd-soft">
        {t('reader.open.noLink')}{' '}
        <Link to="/r/about">{t('reader.aboutLink')}</Link>
      </p>
    </article>
  )
}
