# Style 04 — Civic Policy

> "What it would look like if the UK Government Digital Service ran SYMBA."

The most accessible direction: gov.uk / EUR-Lex / EU portals lineage. High-contrast palette, large click targets (28px radios), `text-decoration: underline` on every link, yellow focus ring, `Public Sans` (the actual US/UK government font), clear breadcrumbs, "beta" phase banner, footer with the consortium and the funding details laid out like an institutional service.

## References
1. gov.uk — the gold standard for public-service design system
2. EUR-Lex / europa.eu — EU institutional pages, blue/yellow palette + breadcrumbs
3. design-system.service.gov.uk — components library (phase banner, summary list, inset text, notification)
4. US Web Design System — large radio tiles + accessibility patterns

## Why for SYMBA
The deliverable D4.6 is **PU (Public)** — the European citizen / local authority can hit the URL. This style says, on sight, *"this is a public service, not a startup app"*. Maximum trust, maximum accessibility. The right call if the principal audience after delivery will be municipalities, EU bodies, or non-technical stakeholders.

## Mood
Trustworthy, civic, accessible. Less stylish than Styles 02 / 03, more credible to an EU policy reviewer.

## Palette
- Gov-blue `#1F4E79` (header)
- Gov-blue-dark `#0E2A4A` (nav)
- Green `#00703c` (CTAs — gov.uk green)
- Yellow `#ffdd00` (focus ring + EU stripe accent)
- Link blue `#1d70b8` (gov.uk hyperlink color)
- Light grey `#f3f2f1` (gov.uk surface-muted)

## Signature elements
- **EU stripe** at the very top (`#003399` blue + yellow stars feel)
- **Phase banner** ("Beta · This is a new service")
- **Summary list** (key/value rows with optional "Change" action) — gov.uk pattern
- **Notification panel** (left border + colored heading) — gov.uk pattern
- **Big radio tiles** (28px input, full-row click target, yellow focus)
- **Breadcrumbs** as `<ol>` with → separators
- **Service-footer** with consortium grid + accessibility/cookies links + EU funding statement

## Accessibility commitments built in
- WCAG AA contrast everywhere (`#1F4E79` on white passes for body+ text)
- Visible focus state on every interactive element (`:focus { background: yellow }`)
- Underlines on links never removed
- `<fieldset>` + `<legend>` for question groups
- Skip-to-content (would be added in production)
- Reading order = source order
- 17 px base font size (larger than typical SaaS)

## Tradeoffs
- Pro: high credibility for EU reviewers and policy audience
- Pro: most accessible by far
- Pro: future-proof — gov.uk doesn't go out of fashion
- Con: looks "boring" to a startup eye — could feel underwhelming for the consortium dissemination
- Con: less expressive than Style 02 — fewer chances to show the SYMBA palette personality
