import { describe, expect, it } from 'vitest'

import en from '../i18n/locales/en'
import de from '../i18n/locales/de'
import es from '../i18n/locales/es'
import fr from '../i18n/locales/fr'
import itLocale from '../i18n/locales/it'

// Every locale carries every key of en.ts and nothing else (checked on
// 2026-11-03; CLAUDE.md used to say de/es lagged ~50 keys).
function flatKeys(node: unknown, prefix = ''): string[] {
  if (node === null || typeof node !== 'object') return [prefix]
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
    flatKeys(v, prefix ? `${prefix}.${k}` : k))
}

describe('locale parity', () => {
  const reference = new Set(flatKeys(en))
  it.each([['it', itLocale], ['fr', fr], ['de', de], ['es', es]])('%s has the keys of en', (_, locale) => {
    const keys = new Set(flatKeys(locale))
    expect([...reference].filter((k) => !keys.has(k))).toEqual([])
    expect([...keys].filter((k) => !reference.has(k))).toEqual([])
  })
})
