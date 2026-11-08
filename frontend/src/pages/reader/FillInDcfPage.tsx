// FillInDcfPage — /r/fill-in
//
// For whoever received a Data Collection File to fill in: a company asked
// for its data had no task on the welcome page and no page saying what to do
// with the workbook (UX round 6, P2-15). In the reader shell, without login:
// the recipient is not a user of the tool. The steps say what the workbook's
// own cover and instructions say (dcf_terms.json cover.ask_value,
// ins.return_body, ins.grey_body, ins.unknown_body, ins.conf_values).
// Designed by Fable.

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const STEPS = ['cover', 'rows', 'grey', 'unknown', 'confidential', 'send'] as const

export default function FillInDcfPage() {
  const { t } = useTranslation()
  return (
    <article className="dd-reader-article">
      <div className="dd-reader-eyebrow">{t('reader.fillIn.eyebrow')}</div>
      <h1>{t('reader.fillIn.title')}</h1>
      <p>{t('reader.fillIn.lead')}</p>

      <ol className="dd-reader-steps">
        {STEPS.map((s) => <li key={s}>{t(`reader.fillIn.steps.${s}`)}</li>)}
      </ol>

      <p>
        {t('reader.fillIn.reportLine')}{' '}
        <Link to="/r/open">{t('reader.fillIn.reportLink')} →</Link>
      </p>
      <p className="dd-soft">
        <Link to="/r/about">{t('reader.whoIsBehind')} →</Link>
      </p>
    </article>
  )
}
