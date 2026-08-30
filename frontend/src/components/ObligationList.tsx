// Everything the case has to document, in one list.
//
// Procedural mandates and triggered cross-method rules used to appear in
// two different places in two different formats — the DCF page listed the
// mandates as a table of node ids, the result page listed the rules as
// cards. They are the same job for the analyst, so they are one list
// here, grouped by category, with the origin kept visible because a
// reviewer checks a rule differently from a mandate.

import { useTranslation } from 'react-i18next'

import type { Case } from '../types/api'
import type { DcfObligation } from '../types/dcf'
import { answersFor } from '../pages/resultActions'

interface Props {
  obligations: DcfObligation[]
  /** The case, to resolve a rule's trigger against the actual answers. */
  sourceCase: Case
}

function groupByCategory(
  obligations: DcfObligation[],
): [string, DcfObligation[]][] {
  const groups = new Map<string, DcfObligation[]>()
  for (const item of obligations) {
    const bucket = groups.get(item.category)
    if (bucket) bucket.push(item)
    else groups.set(item.category, [item])
  }
  return [...groups.entries()]
}

export default function ObligationList({ obligations, sourceCase }: Props) {
  const { t } = useTranslation()

  if (obligations.length === 0) {
    return <p className="dcf-section-description">{t('obligations.empty')}</p>
  }

  const mandates = obligations.filter((o) => o.origin === 'mandate').length

  return (
    <div className="obl-wrap">
      <p className="obl-lead">
        {t('obligations.lead', {
          total: obligations.length,
          mandates,
          rules: obligations.length - mandates,
        })}
      </p>

      {groupByCategory(obligations).map(([category, items]) => (
        <section key={category} className="obl-group">
          <h4>
            {category.replace(/_/g, ' ')}
            <span className="dd-pill dd-pill-muted">{items.length}</span>
          </h4>

          <ul>
            {items.map((item) => {
              const answers = answersFor(item.trigger, sourceCase)
              return (
                <li key={`${item.origin}:${item.id}`} className="obl-item">
                  <p className="obl-statement">
                    {item.title ? <strong>{item.title} — </strong> : null}
                    {item.statement}
                  </p>
                  <p className="obl-meta">
                    <span className={`dd-pill dd-pill-${
                      item.origin === 'rule' ? 'brand' : 'muted'
                    }`}>
                      {t(`obligations.origin.${item.origin}`)}
                    </span>
                    <code>{item.id}</code>
                    <span className="obl-method">{item.method}</span>
                    {answers.length > 0 ? (
                      <span className="obl-why">
                        {t('obligations.because')}{' '}
                        {answers.map((a) => `${a.label} = ${a.value}`).join(', ')}
                      </span>
                    ) : null}
                  </p>
                  {item.fields.length > 0 ? (
                    <p className="obl-fields">
                      {item.fields.map((f) => (
                        <code key={f}>{f}</code>
                      ))}
                    </p>
                  ) : null}
                  {item.fields_not_applicable.length > 0 ? (
                    <p className="obl-na">
                      {t('obligations.notApplicable', {
                        fields: item.fields_not_applicable.join(', '),
                      })}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
