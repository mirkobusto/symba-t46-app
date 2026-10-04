# Brand assets

Assets of the SYMBA project (Horizon Europe, GA 101135562) website,
https://www.symbaproject.eu/ , copied here so the tool, deployed on a
subdomain of that website, carries the same identity. They are served
from this folder (`/brand/...`); nothing is hotlinked from the live site.

Retrieved on 2026-10-04 with `curl -L`. File names are the original ones.

| File | Source URL | Size | Pixels | Used for |
|------|------------|-----:|--------|----------|
| `logo.png` | https://www.symbaproject.eu/wp-content/uploads/2024/01/logo.png | 18 301 B | 250 x 76 | site header, footer |
| `cropped-icona-32x32.png` | https://www.symbaproject.eu/wp-content/uploads/2024/03/cropped-icona-32x32.png | 1 511 B | 32 x 32 | favicon |
| `cropped-icona-192x192.png` | https://www.symbaproject.eu/wp-content/uploads/2024/03/cropped-icona-192x192.png | 11 403 B | 192 x 192 | favicon, sidebar mark |
| `cropped-icona-180x180.png` | https://www.symbaproject.eu/wp-content/uploads/2024/03/cropped-icona-180x180.png | 10 518 B | 180 x 180 | apple-touch-icon |
| `EN_FundedbytheEU_RGB_NEG.png` | https://www.symbaproject.eu/wp-content/uploads/2025/07/EN_FundedbytheEU_RGB_NEG.png | 59 694 B | 4125 x 919 | master copy (not rendered) |
| `EN_FundedbytheEU_RGB_NEG-1024x228.png` | https://www.symbaproject.eu/wp-content/uploads/2025/07/EN_FundedbytheEU_RGB_NEG-1024x228.png | 21 312 B | 1024 x 228 | footer |

## European Union emblem

`EN_FundedbytheEU_RGB_NEG*.png` is the "Funded by the European Union"
emblem, negative version: the lettering is white on a transparent
background, so it is only legible on a dark surface (the footer uses
`#1f242c`). Do not recolour, crop, distort or put it on a light
background.

The emblem must always be accompanied by the funding acknowledgement
("Funded by the European Union under G.A. 101135562. Views and opinions
expressed are however those of the author(s) only and ...") and used
according to the EU visual identity rules for beneficiaries of EU funding
(see the visibility obligations in the Grant Agreement, "Communication,
dissemination and visibility").
The footer component (`src/components/EuFooter.tsx`) renders both together;
keep it that way.

## Deliberately not copied

* The "sticky" header logo referenced by the site is a leftover of the
  WordPress theme demo (hosted on the theme vendor's demo site), not a
  SYMBA asset.
* The Zenodo and SlideShare badges in the site footer are third-party
  platform logos, not partner or funder logos.
* Fonts: the site uses Noto Sans and PT Sans. They are loaded from Google
  Fonts in `index.html`; no font file is stored in this repository.

## Reuse

The SYMBA logo and icon are project communication material. They are used
here by the project's own partners for a project deployment; do not reuse
them for unrelated products.
