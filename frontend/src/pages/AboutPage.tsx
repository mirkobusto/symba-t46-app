// About — who made the tool, on what it rests, what it does not do, where
// it departs from the deliverables on purpose, and whom to write to. It used
// to read like release notes ("186 Phase 1 nodes", "are all live"), the
// place where a regional officer or a reviewer looks to decide how much to
// trust the tool (UX round 2026-11-02).

import { useTranslation } from 'react-i18next'

import { PUBLIC_DELIVERABLES_URL, SITE_URL } from '../components/brand/siteLinks'

const DIVERGENCES = ['situation', 'c2', 'uncertainty', 'policy', 'assets'] as const

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <div className="about">
      <h1>{t('about.title')}</h1>
      <p>{t('about.p1')}</p>

      <h2>{t('about.whoTitle')}</h2>
      <p>{t('about.whoBody')}</p>

      <h2>{t('about.sourcesTitle')}</h2>
      <p>
        {t('about.sourcesBody')}{' '}
        <a href={PUBLIC_DELIVERABLES_URL} target="_blank" rel="noopener noreferrer">
          {t('footer.publicDeliverables')}
        </a>
      </p>

      <h2>{t('about.notTitle')}</h2>
      <p>{t('about.notBody')}</p>

      <h2>{t('about.divergencesTitle')}</h2>
      <p>{t('about.divergencesLead')}</p>
      <ul>
        {DIVERGENCES.map((k) => <li key={k}>{t(`about.divergences.${k}`)}</li>)}
      </ul>

      <h2>{t('about.contactTitle')}</h2>
      <p>
        {t('about.contactBody')}{' '}
        <a href={`${SITE_URL}contact-us/`} target="_blank" rel="noopener noreferrer">
          {`${SITE_URL}contact-us/`}
        </a>
      </p>

      <details className="about-technical">
        <summary>{t('about.technicalTitle')}</summary>
        <p>{t('about.p2')}</p>
      </details>
    </div>
  )
}
