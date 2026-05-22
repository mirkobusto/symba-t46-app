// EU funding statement footer — mandatory on every page per Grant
// Agreement N. 101135562 (visual identity reference: SYMBA Deliverable
// Template V3, News Template).
//
// Rendered inside Layout below the main content so every route gets it
// automatically. The text + URL are the canonical project tagline.

import { useTranslation } from 'react-i18next'

export default function EuFooter() {
  const { t } = useTranslation()
  return (
    <div className="eu-footer" role="contentinfo">
      <div className="eu-footer-row eu-footer-funding">
        <span className="eu-footer-flag" aria-hidden="true">
          🇪🇺
        </span>
        <span>{t('eu.fundingStatement')}</span>
      </div>
      <div className="eu-footer-row eu-footer-meta">
        <a
          href="https://www.symbaproject.eu"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.symbaproject.eu
        </a>
        <span className="eu-footer-divider">·</span>
        <span>GA 101135562</span>
        <span className="eu-footer-divider">·</span>
        <span>HORIZON-CL6-2023-CIRCBIO-01</span>
      </div>
      <div className="eu-footer-disclaimer">{t('eu.disclaimer')}</div>
    </div>
  )
}
