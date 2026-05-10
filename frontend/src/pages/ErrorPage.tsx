import { useTranslation } from 'react-i18next'
import { Link, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const { t } = useTranslation()
  const err = useRouteError() as { statusText?: string; message?: string } | null
  const detail = err?.statusText ?? err?.message ?? t('error.fallback')
  return (
    <div className="error-page">
      <h1>{t('error.title')}</h1>
      <p className="error-text">{detail}</p>
      <Link to="/" className="btn btn-primary">
        {t('error.backHome')}
      </Link>
    </div>
  )
}
