// One thing the analyst has to act on.
//
// Three questions, always in the same order, because that is the order
// a reader asks them: what is it, why does it apply to me, what do I do.
// The rule code stays visible for the reviewer's traceability, but it is
// the smallest thing on the card, not the headline.

import { useTranslation } from 'react-i18next'

import type { ActionItem } from '../../pages/resultActions'

const TONE: Record<ActionItem['kind'], string> = {
  block: 'danger',
  // An obligation is not an error: it gets the neutral brand tone, not
  // the amber one, or the page cries wolf on every single case.
  obligation: 'brand',
  decision: 'amber',
}

export default function ActionItemCard({ item }: { item: ActionItem }) {
  const { t } = useTranslation()

  return (
    <article className={`dd-action dd-action-${item.kind}`}>
      <header className="dd-action-head">
        <span className={`dd-pill dd-pill-${TONE[item.kind]}`}>
          {t(`result.actionKind.${item.kind}`)}
        </span>
        <h3>{item.title ?? item.detail ?? item.code}</h3>
        <code className="dd-action-code">{item.code}</code>
        {item.severity ? (
          <span className="dd-pill dd-pill-muted">{item.severity}</span>
        ) : null}
      </header>

      {item.answers.length > 0 ? (
        <div className="dd-action-why">
          <span className="dd-action-label">{t('result.action.why')}</span>
          <span className="dd-action-answers">
            {item.answers.map((a) => (
              <span key={a.label} className="dd-pill dd-pill-muted">
                {a.label} = {a.value}
              </span>
            ))}
          </span>
          {item.trigger ? (
            <span className="dd-action-trigger">{item.trigger}</span>
          ) : null}
        </div>
      ) : null}

      {item.fields.length > 0 ? (
        <div className="dd-action-todo">
          <span className="dd-action-label">{t('result.action.todo')}</span>
          <ul>
            {item.fields.map((f) => (
              <li key={f}>
                <code>{f}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {item.detail && item.title ? (
        <p className="dd-action-detail">{item.detail}</p>
      ) : null}
    </article>
  )
}
