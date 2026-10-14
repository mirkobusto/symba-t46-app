// One thing the analyst has to act on.
//
// Three questions, always in the same order, because that is the order
// a reader asks them: what is it, why does it apply to me, what do I do.
// The rule code stays visible for the reviewer's traceability, but it is
// the smallest thing on the card, not the headline.

import { useTranslation } from 'react-i18next'

import type { ActionItem } from '../../pages/resultActions'
import { schemaTerm, type SchemaTermKind } from '../../i18n/schemaTerms'

// The wording of rules, decision points and blocks arrives from the
// engine in English. `schemaTerms` holds the five-language table; the
// code stays the reference, and for a reader not working in English the
// original English name is kept next to it, because that is the string
// the project's own rule table prints.
const TERM_KIND: Record<ActionItem['kind'], SchemaTermKind> = {
  block: 'block',
  obligation: 'rule',
  decision: 'cdp',
}

const TONE: Record<ActionItem['kind'], string> = {
  block: 'danger',
  // An obligation is not an error: it gets the neutral brand tone, not
  // the amber one, or the page cries wolf on every single case.
  obligation: 'brand',
  decision: 'amber',
}

export default function ActionItemCard({ item }: { item: ActionItem }) {
  const { t, i18n } = useTranslation()

  const kind = TERM_KIND[item.kind]
  const term = schemaTerm(i18n.language, kind, item.code)
  const english = schemaTerm('en', kind, item.code)
  // A block carries no name, only a message: it becomes the heading,
  // which is why the card used to show a bare `block_…` id and nothing
  // else when the pipeline stopped.
  const name = term?.name || item.title || null
  // The 10 CIR rules carry no statement of their own: the engine sends
  // "CIR-0x applies to this case", which would stay English here.
  const body = term
    ? term.body || t('result.action.appliesToCase')
    : item.detail || ''
  const reference =
    english?.name && english.name !== name ? english.name : null

  return (
    <article className={`dd-action dd-action-${item.kind}`}>
      <header className="dd-action-head">
        <span className={`dd-pill dd-pill-${TONE[item.kind]}`}>
          {t(`result.actionKind.${item.kind}`)}
        </span>
        <h3>{name ?? body ?? item.code}</h3>
        <code className="dd-action-code">{item.code}</code>
        {reference ? (
          <span className="dd-action-reference">{reference}</span>
        ) : null}
        {item.severity ? (
          <span className="dd-pill dd-pill-muted">
            {t(`result.severity.${item.severity}`, { defaultValue: item.severity })}
          </span>
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

      {term?.resolution || item.resolution ? (
        <div className="dd-action-todo">
          <span className="dd-action-label">{t('result.action.resolution')}</span>
          <p className="dd-action-resolution">
            {term?.resolution || item.resolution}
          </p>
        </div>
      ) : null}

      {body && name ? <p className="dd-action-detail">{body}</p> : null}
    </article>
  )
}
