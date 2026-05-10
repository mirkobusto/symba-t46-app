// Generic wrapper for one question section in the questionnaire.
// Provides consistent layout: title, optional help text, content slot.

import type { ReactNode } from 'react'

interface Props {
  id: string
  title: string
  help?: string
  warning?: string
  children: ReactNode
}

export default function QuestionCard({ id, title, help, warning, children }: Props) {
  return (
    <section className="qcard" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="qcard-title">
        {title}
      </h2>
      {help ? <p className="qcard-help">{help}</p> : null}
      <div className="qcard-body">{children}</div>
      {warning ? <p className="qcard-warning">{warning}</p> : null}
    </section>
  )
}
