// Guards the WCAG AA contrast (>= 4.5:1) of the text/background pairs the
// SYMBA website palette is built from. The site's own lime (#b0d129) is
// 1.75:1 on white, so the tokens split it into a surface colour (with ink
// text on it) and a darker green for text; this test fails if someone
// "fixes" a token back towards the raw lime.

/// <reference types="node" />
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

// Read from disk: vitest runs with `css: false`, which empties `?raw`
// CSS imports too. `npm test` runs from frontend/, so the path is relative
// to it (jsdom's URL class cannot build a file: URL from import.meta.url).
const css = readFileSync('src/App.css', 'utf8')

/** Declarations of the first :root block, comments stripped. */
function rootTokens(source: string): Record<string, string> {
  const start = source.indexOf(':root')
  const open = source.indexOf('{', start)
  const close = source.indexOf('\n}', open)
  const block = source.slice(open + 1, close).replace(/\/\*[\s\S]*?\*\//g, '')
  const tokens: Record<string, string> = {}
  for (const m of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    tokens[m[1]] = m[2].trim()
  }
  return tokens
}

const TOKENS = rootTokens(css)

/** Resolves a token (or literal #hex) to an opaque [r, g, b], blending rgba over white. */
function rgb(ref: string): [number, number, number] {
  const value = ref.startsWith('--') ? TOKENS[ref] : ref
  if (value === undefined) throw new Error(`token ${ref} is not defined in :root`)
  const hex = /^#([0-9a-f]{6})$/i.exec(value)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/.exec(value)
  if (rgba) {
    const a = Number(rgba[4])
    return [1, 2, 3].map((i) => Math.round(255 + (Number(rgba[i]) - 255) * a)) as [
      number,
      number,
      number,
    ]
  }
  throw new Error(`cannot resolve ${ref} = ${value}`)
}

function luminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(rgb(fg)), luminance(rgb(bg))].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

const PAIRS: [fg: string, bg: string][] = [
  // body copy on the page and card surfaces
  ['--dd-text', '--dd-surface'],
  ['--dd-text', '--dd-bg'],
  ['--dd-text-soft', '--dd-surface'],
  ['--dd-text-soft', '--dd-bg'],
  ['--dd-text-muted', '--dd-surface'],
  ['--dd-text-muted', '--dd-bg'],
  ['--dd-text-muted', '--dd-surface-muted'],
  ['--dd-text-muted', '--dd-brand-bg'],
  ['--dd-navy', '--dd-surface'],
  // blue: links, active tabs, white-on-blue fills and the hero gradient
  ['--dd-brand', '--dd-surface'],
  ['--dd-brand', '--dd-bg'],
  ['--dd-brand', '--dd-brand-bg'],
  ['#ffffff', '--dd-brand'],
  ['#ffffff', '--dd-navy'],
  // AA-safe green for text and white-text fills
  ['--dd-accent', '--dd-surface'],
  ['--dd-accent', '--dd-bg'],
  ['--dd-accent', '--dd-accent-bg'],
  ['#ffffff', '--dd-accent'],
  ['#ffffff', '--dd-accent-hover'],
  // website lime: always with ink text on it
  ['--dd-ink', '--dd-accent-vivid'],
  ['--dd-ink', '--dd-accent-vivid-hover'],
  ['#ffffff', '--dd-ink'],
  // dark sidebar (lime is allowed as text there: it is 8.9:1 on ink)
  ['--dd-sidebar-text', '--dd-sidebar'],
  ['--dd-sidebar-muted', '--dd-sidebar'],
  ['--dd-sidebar-text', '--dd-sidebar-active'],
  ['--dd-sidebar-text-strong', '--dd-sidebar-active'],
  ['--dd-sidebar-muted', '--dd-sidebar-active'],
  ['--dd-accent-vivid', '--dd-sidebar'],
  ['--dd-accent-vivid', '--dd-sidebar-active'],
  // footer (the negative EU emblem needs this dark background)
  ['--dd-footer-text', '--dd-footer-bg'],
  ['--dd-footer-muted', '--dd-footer-bg'],
  ['--dd-accent-vivid', '--dd-footer-bg'],
  ['#ffffff', '--dd-footer-bg'],
]

describe('SYMBA website palette — WCAG AA', () => {
  it.each(PAIRS)('%s on %s is at least 4.5:1', (fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps the raw website lime away from light backgrounds', () => {
    // The lime is only usable on ink; if this ever passes 4.5 the palette
    // changed and the split between --dd-accent and --dd-accent-vivid can
    // be revisited.
    expect(contrast('--dd-accent-vivid', '--dd-surface')).toBeLessThan(3)
  })
})
