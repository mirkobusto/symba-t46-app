// Generic wrapper for one question section in the questionnaire.
// Provides consistent layout: title, optional help text, optional
// expandable details (examples + context), content slot, optional
// warning footer.

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  id: string
  title: string
  help?: string
  /** When provided, renders as a `<details>` toggle below the help
   *  text labelled "Examples & context" (i18n). Used to surface the
   *  longer-form per-question guidance without bloating the form. */
  details?: string
  warning?: string
  children: ReactNode
}

export default function QuestionCard({
  id, title, help, details, warning, children,
}: Props) {
  const { t } = useTranslation()
  return (
    <section className="qcard" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="qcard-title">
        {title}
      </h2>
      {help ? <p className="qcard-help">{help}</p> : null}
      {details ? (
        <details className="qcard-details">
          <summary>{t('common.examplesAndContext')}</summary>
          <p>{details}</p>
        </details>
      ) : null}
      <div className="qcard-body">{children}</div>
      {warning ? <p className="qcard-warning">{warning}</p> : null}
    </section>
  )
}
