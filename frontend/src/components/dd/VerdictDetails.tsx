// The "more info" panel behind the verdict.
//
// Two registers on purpose: a paraphrase, translated, for the reader who
// needs to understand the choice, and the deliverable's own words with a
// section reference for the reviewer who needs to check it. The citation
// is never translated — a citation in translation is not a citation.

import { useTranslation } from 'react-i18next'

import type { Verdict } from '../../pages/resultNarrative'

export default function VerdictDetails({ verdict }: { verdict: Verdict }) {
  const { t } = useTranslation()

  return (
    <details className="dd-verdict-more">
      <summary>{t('result.verdict.moreInfo')}</summary>

      {verdict.pathwayDetail ? (
        <section className="dd-verdict-more-item">
          <h4>{verdict.title}</h4>
          <p>{verdict.pathwayDetail}</p>
        </section>
      ) : null}

      {verdict.details.map((item) => (
        <section key={item.code} className="dd-verdict-more-item">
          <h4>
            {item.short}
            <code>{item.code}</code>
          </h4>
          <p>{item.detail}</p>
          {item.quote ? (
            <blockquote>
              <p>{item.quote}</p>
              <cite>{item.source}</cite>
            </blockquote>
          ) : null}
        </section>
      ))}
    </details>
  )
}
