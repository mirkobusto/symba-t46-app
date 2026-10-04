// Site-style footer with the mandatory EU funding statement — rendered on
// every page per Grant Agreement N. 101135562 (visual identity reference:
// SYMBA Deliverable Template V3, News Template).
//
// The layout follows the footer of https://www.symbaproject.eu/ (ink
// background, logo + social links, EU emblem with the funding
// acknowledgement, project information, copyright and legal links). The
// EU emblem is the NEGATIVE variant (white lettering on transparent), which
// is why the footer is dark in every theme. The emblem must always be shown
// together with the acknowledgement text and must not be altered — see
// public/brand/README.md.

import { useTranslation } from 'react-i18next'

import {
  PUBLIC_DELIVERABLES_URL,
  SITE_URL,
  SOCIAL_LINKS,
} from './brand/siteLinks'

export default function EuFooter() {
  const { t } = useTranslation()
  return (
    <footer className="eu-footer">
      <div className="eu-footer-inner">
        <div className="eu-footer-col">
          <a href={SITE_URL} className="eu-footer-logo" title={t('footer.logoTitle')}>
            <img
              src="/brand/logo.png"
              alt={t('footer.logoAlt')}
              width={148}
              height={45}
            />
          </a>
          <p className="eu-footer-tool">{t('footer.toolLine')}</p>
          <h2 className="eu-footer-title">{t('footer.followUs')}</h2>
          <ul className="eu-footer-links eu-footer-social">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.key}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="eu-footer-col eu-footer-funding">
          <img
            className="eu-footer-emblem"
            src="/brand/EN_FundedbytheEU_RGB_NEG-1024x228.png"
            alt={t('eu.emblemAlt')}
            width={300}
            height={67}
          />
          <p className="eu-footer-statement">{t('eu.fundingStatement')}</p>
          <p className="eu-footer-disclaimer">{t('eu.disclaimer')}</p>
        </div>

        <div className="eu-footer-col">
          <h2 className="eu-footer-title">{t('footer.projectInfo')}</h2>
          <p className="eu-footer-ids">
            <span>GA 101135562</span>
            <span>HORIZON-CL6-2023-CIRCBIO-01</span>
          </p>
          <ul className="eu-footer-links">
            <li>
              <a href={SITE_URL}>{t('footer.projectWebsite')}</a>
            </li>
            <li>
              <a href={PUBLIC_DELIVERABLES_URL}>{t('footer.publicDeliverables')}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="eu-footer-bottom">
        <div className="eu-footer-bottom-inner">
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          <ul className="eu-footer-legal">
            <li>
              <a href="/privacy">{t('footer.privacy')}</a>
            </li>
            <li>
              <a href="/privacy#data">{t('footer.cookies')}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
