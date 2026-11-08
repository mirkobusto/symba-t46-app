// What a reader sees when a shared report cannot be shown: the case code is
// unknown, its owner stopped sharing it (the server answers the same for
// both, on purpose), or the link is longer than any report address
// (/r/<case>/<view>/<more>), which used to leave the public area for the
// app's Home (UX round 6, P7-14, P1-18).

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function ReportNotFound({ detail }: { detail?: string }) {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t('reader.notFoundTitle')}</h1>
      <p className="dd-soft">{detail || t('reader.notFoundBody')}</p>
      <div className="dd-page-actions">
        <Link to="/r/open" className="dd-btn dd-btn-primary">
          ← {t('reader.tryAnother')}
        </Link>
        <Link to="/r/about" className="dd-btn dd-btn-secondary">
          {t('reader.aboutLink')} →
        </Link>
      </div>
    </div>
  )
}
