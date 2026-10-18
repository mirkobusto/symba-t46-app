// "Your configuration": what the answers decided, row by row (R5, 2026-10-18).
// Each row opens on the node text behind it, in English as traced on the
// deliverables (owner decision).

import { useTranslation } from 'react-i18next'

import { configurationRows } from '../pages/configurationRows'
import type { Case } from '../types/api'

interface Props {
  kase: Case
  /** Only these rows, in this order (the audience views); all when omitted. */
  only?: string[]
  /** The engine text in English, for the analyst; off in the audience views. */
  showNodeText?: boolean
  title?: string
}

export default function ConfigurationSummary({ kase, only, showNodeText = true, title }: Props) {
  const { t } = useTranslation()
  const all = configurationRows(kase, (key, options) => t(key, options ?? {}) as string)
  const rows = only ? only.map((k) => all.find((r) => r.key === k)).filter((r) => r !== undefined) : all
  if (rows.length === 0) return null
  return (
    <section className="result-config" aria-labelledby="result-config-title">
      <h2 id="result-config-title" className="result-config-title">{title ?? t('result.config.title')}</h2>
      {only ? null : <p className="result-config-lead">{t('result.config.lead')}</p>}
      <dl className="result-config-list">
        {rows.map((row) => (
          <div key={row.key} className="result-config-row" data-row={row.key}>
            <dt>{row.label}</dt>
            <dd>
              <span className="result-config-value">{row.value}</span>
              {row.why ? (
                <span className="result-config-why">
                  <span className="result-config-why-label">{t('result.config.why.label')}</span> {row.why}
                </span>
              ) : null}
              {showNodeText && row.nodeText.length > 0 ? (
                <details className="result-config-node">
                  <summary>{t('result.config.nodeText')}</summary>
                  {row.nodeText.map((text, i) => (
                    <p key={i} lang="en">{text}</p>
                  ))}
                </details>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
