// "Your configuration": what the answers decided, row by row (R5, 2026-10-18).
// Each row opens on the node text behind it, in English as traced on the
// deliverables (owner decision).

import { useTranslation } from 'react-i18next'

import { configurationRows } from '../pages/configurationRows'
import type { Case } from '../types/api'
import { usePreferenceStore } from '../store/preferenceStore'
import { withoutQCodes } from '../pages/configurationRows'

interface Props {
  kase: Case
  /** Only these rows, in this order (the audience views); all when omitted. */
  only?: string[]
  /** The engine text in English, for the analyst; off in the audience views. */
  showNodeText?: boolean
  title?: string
  /** The reasons cite the questions (Q10, Q7…): analyst register, off for the public. */
  showWhy?: boolean
  headingLevel?: 'h2' | 'h3' | 'h4'
  titleClassName?: string
  /** The audience view the rows are shown in (some rows speak to it in its words). */
  audience?: string
}

export default function ConfigurationSummary({
  kase, only, showNodeText = true, title, showWhy = true, headingLevel = 'h2', titleClassName, audience,
}: Props) {
  const { t } = useTranslation()
  // guided mode never shows the Q-codes, so "(Q9)" in a reason pointed nowhere (UX round 4)
  const guided = usePreferenceStore((s) => s.mode) === 'guided'
  // the result page speaks plainly in guided mode (UX round 6, P3-12); the
  // audience views keep their own rows
  const all = configurationRows(kase, (key, options) => t(key, options ?? {}) as string,
    { audience, guided: guided && !only })
  const rows = only ? only.map((k) => all.find((r) => r.key === k)).filter((r) => r !== undefined) : all
  if (rows.length === 0) return null
  const Heading = headingLevel
  return (
    <section className="result-config" aria-labelledby="result-config-title">
      <Heading id="result-config-title" className={titleClassName ?? 'result-config-title'}>
        {title ?? t('result.config.title')}
      </Heading>
      {only ? null : <p className="result-config-lead">{t('result.config.lead')}</p>}
      <dl className="result-config-list">
        {rows.map((row) => (
          <div key={row.key} className="result-config-row" data-row={row.key}>
            <dt>{row.label}</dt>
            <dd>
              <span className="result-config-value">{row.value}</span>
              {showWhy && row.why ? (
                <span className="result-config-why">
                  <span className="result-config-why-label">{t('result.config.why.label')}</span>{' '}
                  {guided ? withoutQCodes(row.why) : row.why}
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
