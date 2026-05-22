# SYMBA T4.6 — Design exploration

Five stylistic alternatives for the SYMBA T4.6 web app, each rendered as a
set of standalone HTML mockups (no React, no build step — just open in a
browser).

Open `index.html` for a side-by-side index, or jump directly into one
of the five style directories.

## Why this exists

The current frontend (`feature-phase-c-wizard-deploy` branch) is
functionally complete but graphically uninspired. Before investing
implementation time on a "real" SYMBA visual identity, this directory
explores **five distinct directions** so the consortium can pick one
(or borrow elements from several).

## Directory layout

```
design/mockups/
├── README.md                      (this file)
├── index.html                     (master browser — open this first)
├── 01-editorial-scientific/       Magazine-grade, serif headlines, double rules
│   ├── home.html
│   ├── questionnaire.html
│   ├── result.html
│   ├── stakeholder.html
│   └── concept.md
├── 02-geometric-horizon/          PPTX-derived, hex SVG, yellow accents
├── 03-data-dashboard/             Linear/Stripe-style, dark sidebar
├── 04-civic-policy/               gov.uk-grade public-service design
└── 05-fresh-circular/             Sustainable-startup, soft pastel, friendly
```

Every style covers the same four canonical pages (Home, Questionnaire,
Result, Stakeholder report) using the same mockup data (Wiktor 2018
Malmö case, IS-01 extended pathway).

## How to evaluate

1. Open `index.html` in your browser.
2. Click through all 5 home pages first — quick gut check.
3. Read the 5 `concept.md` files for mood, references and tradeoffs.
4. Then drill into the questionnaire / result / stakeholder pages of
   the 1-2 styles you want to compare seriously.
5. Notice especially:
   - Hero treatment on the Home page (where the project introduces
     itself).
   - "Verdict" presentation on Result (the dramatic moment when the
     pathway is revealed).
   - Compliance signals on Stakeholder (the policy/authority audience).
   - The mandatory EU funding footer (must appear on every page —
     check each style handles it gracefully).

## Mandatory visual identity constraints

All five styles respect:

- **EU funding statement** verbatim on every page:
  > "This project has received funding from the European Union's
  > Horizon Europe Research and Innovation Programme under Grant
  > Agreement N. 101135562."
- **EU disclaimer** on Home and major report pages.
- **`www.symbaproject.eu`** + GA reference visible in the footer.
- **`#1F4E79` blue** as the primary brand color anchor (matches the
  xlsx headers produced by the backend).
- **`#2D8B43` green** as the circular-economy accent.
- White background, slate body text, full accessibility (large click
  targets, visible focus states, semantic HTML).

## What's NOT in scope here

- Frontend implementation (React port of the chosen style is a
  follow-up task, ~1-2 weeks).
- Login / register pages (omitted from the 4-page set for brevity;
  the login flow is straightforward to derive from each style).
- Data Collection File interactive viewer + NetworkDiagram component
  (would be added once a direction is chosen).
- Aggregate / regional dashboard page (idem).

## Reference templates used

The five styles were produced after reading the SYMBA project
templates from the consortium Drive:

- `SYMBA_Deliverable_Template_V3.docx`
- `SYMBA WP_template (3).pptx`
- `SYMBA_News Template.docx`
- `D4.1_Part1_LCA_Guidelines_FINAL.docx`
- `D4.2_LCC_Guidelines_Full.docx`

---

🇪🇺 This project has received funding from the European Union's Horizon
Europe Research and Innovation Programme under Grant Agreement N.
101135562 — [www.symbaproject.eu](https://www.symbaproject.eu).
