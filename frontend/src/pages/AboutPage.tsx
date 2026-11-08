// About — who made the tool, on what it rests, what it does not do, where
// it departs from the deliverables on purpose, and whom to write to. It used
// to read like release notes ("186 Phase 1 nodes", "are all live"), the
// place where a regional officer or a reviewer looks to decide how much to
// trust the tool (UX round 2026-11-02).

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { PUBLIC_DELIVERABLES_URL, SITE_URL } from '../components/brand/siteLinks'

const DIVERGENCES = ['situation', 'c2', 'uncertainty', 'policy', 'assets', 'interdependent', 'lccB'] as const

export default function AboutPage() {
  const { t } = useTranslation()
  const { hash } = useLocation()
  // the dashboard links to the guidance for funders ("/about#funders");
  // the router does not scroll to anchors
  useEffect(() => {
    if (hash === '#funders') document.getElementById('funders')?.scrollIntoView?.()
  }, [hash])
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

      {/* for reviewers: a wall of codes for anyone else, so it starts folded (UX round 4) */}
      <details className="about-divergences">
        <summary><h2 style={{ display: 'inline' }}>{t('about.divergencesTitle')}</h2></summary>
        <p>{t('about.divergencesLead')}</p>
        <ul>
          {DIVERGENCES.map((k) => <li key={k}>{t(`about.divergences.${k}`)}</li>)}
        </ul>
      </details>

      {/* a region that wants applicants to use the tool found no word on what to
          ask them for, or how long the tool stays online (UX round 6, P3-15) */}
      <section id="funders" aria-labelledby="funders-title">
        <h2 id="funders-title">{t('about.funders.title')}</h2>
        <p>{t('about.funders.lead')}</p>
        <ul>
          <li>{t('about.funders.askLink')}</li>
          <li>{t('about.funders.askWord')}</li>
          <li>{t('about.funders.askDcf')}</li>
        </ul>
        <h3>{t('about.funders.notTitle')}</h3>
        <p>{t('about.funders.notBody')}</p>
        <p>
          {t('about.funders.accountBody')} <Link to="/privacy">{t('about.funders.privacyLink')}</Link>
        </p>
        <h3>{t('about.funders.onlineTitle')}</h3>
        <p>{t('about.funders.onlineBody')}</p>
      </section>

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
