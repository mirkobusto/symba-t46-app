// PublicAboutPage — /r/about
//
// A short, layperson-friendly explanation of what SYMBA T4.6 is and
// why someone would land on the reader shell. Doubles as the landing
// page when a visitor clicks the brand logo in the reader header.

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function PublicAboutPage() {
  const { t } = useTranslation()
  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">{t('reader.about.eyebrow')}</div>
      <h1>{t('reader.about.title')}</h1>
      <p className="dd-soft">{t('reader.about.lead')}</p>

      <h2 className="dd-section-title">{t('reader.about.whoTitle')}</h2>
      <p>{t('reader.about.whoBody')}</p>

      <h2 className="dd-section-title">{t('reader.about.whatTitle')}</h2>
      <p>{t('reader.about.whatBody')}</p>

      <h2 className="dd-section-title">{t('reader.about.whereTitle')}</h2>
      <p>
        {t('reader.about.whereBody')}{' '}
        <a href="https://www.symbaproject.eu" target="_blank" rel="noopener noreferrer">
          www.symbaproject.eu
        </a>.
      </p>

      <Link to="/" className="dd-btn dd-btn-primary">
        {t('reader.about.enterTool')} →
      </Link>
    </article>
  )
}
