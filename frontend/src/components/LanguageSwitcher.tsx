// Language switcher dropdown. Persists to localStorage via the i18next
// LanguageDetector caches: ['localStorage'] config (see src/i18n/index.ts).

import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'en') as SupportedLanguage

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    void i18n.changeLanguage(e.target.value)
  }

  return (
    <label className="lang-switcher">
      <span className="visually-hidden">{t('language.label')}</span>
      <select value={current} onChange={handleChange} aria-label={t('language.label')}>
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {t(`language.${code}`)}
          </option>
        ))}
      </select>
    </label>
  )
}
