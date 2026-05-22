# Style 03 — Data Dashboard

> "Stripe meets Horizon Europe."

A console-first, density-first layout: dark sidebar (Linear/Vercel/Plausible-style), sticky topbar with search + status, KPI strip everywhere, sparkline charts, monospace for IDs, slate body. Optimised for IS analysts who run **many** assessments and want everything in one screen.

## References
1. Linear's project view — dark sidebar with grouped sections + iconography
2. Vercel / Stripe Dashboard — KPI cards with sparklines and delta indicators
3. Plausible Analytics — light, monospace for data, clear hierarchy
4. Grafana — pillar pie chart + reasoning trace styling

## Why for SYMBA
The pragmatic option for the **Layer 1 audience** (IS analysts, reviewers) who already understand the methodology and want speed + density. The sidebar makes the L2 audience entry points discoverable (stakeholder, regional dashboard). Best fit if the tool is expected to be used daily by a consortium analyst.

## Mood
Functional, fast, "I am at work". Less inspirational than Style 02, less academic than Style 01. **Optimised for the daily user.**

## Palette
- Sidebar dark `#0b1726` (high-contrast working surface)
- Surface white `#fff` on background `#fafbfc` (subtle separation)
- Primary `#1F4E79` (SYMBA blue, used for headings + active states)
- Green `#2D8B43` (success / activated)
- Amber `#d97706` (CDP flags, pending CIRCE)
- Pink `#db2777` (S-LCA dimension)

## Signature elements
- Persistent dark sidebar with grouped menus + GA footer at bottom
- Sticky topbar with global search, backend health pill, user menu
- KPI cards with mini sparkline (CSS-only bars)
- Monospace IDs (JetBrains Mono) for case_id, node_id, run-numbers
- Verdict gradient card with embedded pillar breakdown
- "Reasoning trace" terminal-style block on result page
- Compact tables with hover row highlight

## Tradeoffs
- Pro: scales gracefully to many concurrent cases / users
- Pro: looks credible to a tech-savvy partner (CIRCE engineers, ICLEI digital team)
- Con: less "warm" — could feel cold for a community / end-user audience
- Con: requires a sidebar nav permanently visible — works less well on narrow tablets
