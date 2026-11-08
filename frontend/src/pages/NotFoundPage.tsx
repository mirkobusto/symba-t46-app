// NotFoundPage — any address the app does not have.
//
// An unknown address went to the Home page (or to the welcome) without a
// word: a broken link looked like a working one that led somewhere else
// (UX round 6, P5-12, P7-14). Someone who was sent a shared report finds the
// way to open it.

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="dd-page">
      <h1 className="dd-page-title">{t('notFound.title')}</h1>
      <p className="dd-page-sub">{t('notFound.body')}</p>
      <div className="dd-page-actions">
        <Link to="/" className="btn btn-primary">{t('notFound.home')}</Link>
        <Link to="/cases" className="btn btn-secondary">{t('notFound.cases')}</Link>
      </div>
      <p className="dd-soft">
        {t('notFound.report')} <Link to="/r/open">{t('notFound.reportLink')}</Link>
      </p>
    </div>
  )
}
