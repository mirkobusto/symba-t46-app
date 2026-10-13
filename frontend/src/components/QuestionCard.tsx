// Generic wrapper for one question section in the questionnaire.
// Provides consistent layout: title, optional help text, optional
// plain-language explanation, optional expandable details
// (examples + context), content slot, optional warning footer.
//
// Two registers, not two densities. In `guided` mode the card shows
// `plain` — a short explanation written for someone who does not work
// with LCA every day — and leaves the analyst note collapsed. Guided
// mode used to open that note by default, which handed a newcomer more
// jargon rather than less (UX audit, 2026-10-13).

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { usePreferenceStore } from '../store/preferenceStore'

interface Props {
  id: string
  title: string
  help?: string
  /** Short, concrete, jargon-free. Shown only in `guided` mode, where it
   *  replaces the analyst note as the first thing the reader meets. */
  plain?: string
  /** When provided, renders as a `<details>` toggle below the help
   *  text. Holds the methodological wording taken from the
   *  deliverables; collapsed in both modes. */
  details?: string
  warning?: string
  children: ReactNode
}

export default function QuestionCard({
  id, title, help, plain, details, warning, children,
}: Props) {
  const { t } = useTranslation()
  const guided = usePreferenceStore((s) => s.mode) === 'guided'
  return (
    <section className="qcard" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="qcard-title">
        {title}
      </h2>
      {help ? <p className="qcard-help">{help}</p> : null}
      {guided && plain ? <p className="qcard-plain">{plain}</p> : null}
      {details ? (
        <details className="qcard-details">
          <summary>
            {guided ? t('common.methodologicalNote') : t('common.examplesAndContext')}
          </summary>
          <p>{details}</p>
        </details>
      ) : null}
      <div className="qcard-body">{children}</div>
      {warning ? <p className="qcard-warning">{warning}</p> : null}
    </section>
  )
}
