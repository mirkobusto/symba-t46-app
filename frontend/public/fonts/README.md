# Self-hosted web fonts

The same families as https://www.symbaproject.eu/ (PT Sans for body text, Noto Sans for headings, menu and
buttons) plus JetBrains Mono for identifiers, served from this origin so that no visitor's IP address is sent
to Google. These are **assets, not a code dependency**: five `woff2` files of the `latin` subset (it covers
the five interface languages: en, it, fr, de, es) and three licence texts.

| File | Family, style, weight | Bytes | SHA-256 |
|---|---|---:|---|
| `noto-sans-latin-wght-400-700.woff2` | Noto Sans, normal, variable 400-700 | 35,820 | `51ca196f49a33e79e7870ff88ebd2829a3f627a51e7d690986618f0e7ad2b52d` |
| `jetbrains-mono-latin-wght-400-500.woff2` | JetBrains Mono, normal, variable 400-500 | 31,432 | `83c005d49d8a6a50474c73a5a36ac0468076e9c4a29da7bdb14995d80560a5be` |
| `pt-sans-latin-400.woff2` | PT Sans, normal, 400 | 45,532 | `2dea6190c113af617923c6b71f7f10ffbdf72074556f79963610254fe40e49be` |
| `pt-sans-latin-700.woff2` | PT Sans, normal, 700 | 47,180 | `05ea99a48ece3c624fd9df15f5cf4e1d94703bde9ed2b384495900f55e28befe` |
| `pt-sans-latin-400-italic.woff2` | PT Sans, italic, 400 | 42,612 | `1f275d522571c81eb7d02d47015bf4eb1c60ab7520477bd40ba39425c1df49f2` |

Total 202,576 bytes (the font stylesheet of Google Fonts pointed to the same files).

## How they were obtained (2026-10-04)

Google Fonts CSS API with a Chrome user-agent, taking the blocks labelled `latin`:

```
curl -sL -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' \
  'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400..700&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400..500&display=swap'
```

The files come from `fonts.gstatic.com` (`notosans/v42`, `jetbrainsmono/v24`, `ptsans/v18`). The `@font-face`
rules in `src/index.css` use the `unicode-range` of that stylesheet, `font-display: swap`, and the weight range
actually served (variable files cover 400-700 and 400-500). `latin-ext` is not included: none of the five
languages needs it.

## Licences

All three families are under the SIL Open Font License 1.1: `OFL-NotoSans.txt`, `OFL-PTSans.txt`,
`OFL-JetBrainsMono.txt` (from https://github.com/google/fonts, `ofl/`). Note for whoever reviews licences: the
files are the subsets served by Google Fonts, i.e. converted and subset versions of the originals. PT Sans carries
a Reserved Font Name ("PT Sans", ParaType); subsetting and conversion to woff2 is the same practice as Fontsource and
Google Fonts themselves, but it is a modified version in the sense of the OFL.
