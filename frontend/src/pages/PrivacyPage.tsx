// Privacy and data storage of THIS tool (the project website has its own policy).
//
// A DRAFT: the facts come from what the code does (accounts, saved cases, logs, browser
// storage); everything only the controller of the deployment knows is a [PLACEHOLDER].
// It needs a legal review before it is the notice of record.

import { useTranslation } from 'react-i18next'

interface Section {
  id: string
  title: string
  paragraphs: string[]
  items: string[]
}

export default function PrivacyPage() {
  const { t } = useTranslation()
  const sections = t('privacy.sections', { returnObjects: true }) as unknown as Section[]
  return (
    <div className="about privacy">
      <h1>{t('privacy.title')}</h1>
      <p className="privacy-draft" role="note">
        {t('privacy.draft')}
      </p>
      {sections.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
          <h2 id={`${s.id}-title`}>{s.title}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.items.length > 0 ? (
            <ul>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      <p className="muted">{t('privacy.updated')}</p>
    </div>
  )
}
