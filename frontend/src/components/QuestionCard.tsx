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

// "Q9 — What is the study for…": the step number on screen follows the order of
// the page (a CSS counter, so hidden cards take no number); the code stays as a
// small reference, since notes and rules cite it (R5, 2026-10-18).
const CODED_TITLE = /^(Q\d+[ab]?)\s+—\s+(.+)$/

export default function QuestionCard({
  id, title, help, plain, details, warning, children,
}: Props) {
  const { t } = useTranslation()
  const guided = usePreferenceStore((s) => s.mode) === 'guided'
  const coded = CODED_TITLE.exec(title)
  return (
    // the id is the target of the run bar's "still to answer" links
    <section id={id} className={`qcard${coded ? ' qcard-numbered' : ''}`} aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="qcard-title">
        {coded ? (
          <>
            <span className="qcard-step" aria-hidden="true" />
            {coded[2]} <code className="qcard-code">{coded[1]}</code>
          </>
        ) : title}
      </h3>
      {/* In guided mode the plain explanation comes first and alone: the
          analyst line above it ("Q1 ∈ {A, B, D}", "D4.1 Part 1") made a
          newcomer read the same thing twice, the hard way first (UX round
          2026-11-02). It moves into the methodological note. */}
      {help && !(guided && plain) ? <p className="qcard-help">{help}</p> : null}
      {guided && plain ? <p className="qcard-plain">{plain}</p> : null}
      {details || (guided && plain && help) ? (
        <details className="qcard-details">
          <summary>
            {guided ? t('common.methodologicalNote') : t('common.examplesAndContext')}
          </summary>
          {guided && plain && help ? <p>{help}</p> : null}
          {details ? <p>{details}</p> : null}
        </details>
      ) : null}
      <div className="qcard-body">{children}</div>
      {warning ? <p className="qcard-warning">{warning}</p> : null}
    </section>
  )
}
