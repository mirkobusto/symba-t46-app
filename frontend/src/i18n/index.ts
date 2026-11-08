// i18next configuration. Detection order:
//   1. localStorage key 'symba-language'
//   2. browser navigator.language
//   3. 'en' fallback
//
// Resources are imported statically (5 small files); for an app with
// dozens of languages we'd switch to dynamic import per locale.

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import de from './locales/de'
import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'
import it from './locales/it'

export const SUPPORTED_LANGUAGES = ['en', 'it', 'fr', 'de', 'es'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Screen readers and hyphenation follow <html lang>; keep it in step with the
// language switcher. The listener goes on before init: with inline resources
// init detects the stored language synchronously, so a listener added after it
// missed the first change and <html lang> stayed "en" (UX round 6, P7-19).
function syncHtmlLang(lng: string | undefined) {
  if (lng && typeof document !== 'undefined') document.documentElement.lang = lng
}
i18n.on('languageChanged', syncHtmlLang)

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'symba-language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React handles XSS escaping
    },
    returnNull: false,
  })

syncHtmlLang(i18n.resolvedLanguage ?? i18n.language)

export default i18n
