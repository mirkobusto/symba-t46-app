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

export default i18n
