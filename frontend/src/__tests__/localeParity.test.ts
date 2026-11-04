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

// The {{placeholders}} of each string, sorted, keyed by flat path.
function placeholders(node: unknown, prefix = ''): Record<string, string> {
  if (typeof node === 'string') {
    return { [prefix]: [...node.matchAll(/\{\{\s*(\w+)/g)].map((m) => m[1]).sort().join(',') }
  }
  if (node === null || typeof node !== 'object') return {}
  return Object.assign({}, ...Object.entries(node as Record<string, unknown>).map(([k, v]) =>
    placeholders(v, prefix ? `${prefix}.${k}` : k)))
}

describe('locale parity', () => {
  const reference = new Set(flatKeys(en))
  it.each([['it', itLocale], ['fr', fr], ['de', de], ['es', es]])('%s has the keys of en', (_, locale) => {
    const keys = new Set(flatKeys(locale))
    expect([...reference].filter((k) => !keys.has(k))).toEqual([])
    expect([...keys].filter((k) => !reference.has(k))).toEqual([])
  })

  // A string moved to the wrong key shows up as a placeholder the reference
  // string does not have (#219 put the region sentence, with {{code}}, in
  // result.guided.lead of fr/de/es; Kimi test 2026-11-04).
  // A singular plural form may spell out "one" instead of {{count}}.
  const referencePlaceholders = placeholders(en)
  const dropCount = (k: string, v: string) =>
    k.endsWith('_one') ? v.split(',').filter((p) => p !== 'count').join(',') : v
  it.each([['it', itLocale], ['fr', fr], ['de', de], ['es', es]])('%s uses the placeholders of en', (_, locale) => {
    const own = placeholders(locale)
    const differing = Object.entries(own)
      .filter(([k, v]) => k in referencePlaceholders
        && dropCount(k, referencePlaceholders[k]) !== dropCount(k, v))
      .map(([k, v]) => `${k}: en {${referencePlaceholders[k]}} vs {${v}}`)
    expect(differing).toEqual([])
  })
})
