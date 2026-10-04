import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Visitors' IP addresses must not go to Google just to load a font: the fonts are served from
// public/fonts (see its README) and nothing may point back at the Google Fonts hosts.
describe('self-hosted fonts', () => {
  const html = readFileSync('index.html', 'utf8')
  const css = readFileSync('src/index.css', 'utf8')

  it('does not load anything from Google Fonts', () => {
    for (const source of [html, css, readFileSync('src/App.css', 'utf8')]) {
      expect(source).not.toMatch(/fonts\.(googleapis|gstatic)\.com/)
    }
  })

  it('declares every font file it points to, and the file exists', () => {
    const urls = [...css.matchAll(/url\('\/fonts\/([^']+)'\)/g)].map((m) => m[1])
    expect(urls.length).toBe(5)
    for (const file of urls) expect(existsSync(`public/fonts/${file}`)).toBe(true)
  })

  it('ships the licence text of every family', () => {
    for (const f of ['OFL-NotoSans.txt', 'OFL-PTSans.txt', 'OFL-JetBrainsMono.txt']) {
      expect(readFileSync(`public/fonts/${f}`, 'utf8')).toContain('SIL OPEN FONT LICENSE')
    }
  })
})
