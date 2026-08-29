# Cowork prompt — SYMBA T4.6 5-minute deck

Copy-paste the block below into cowork to generate the PPTX.

---

Create a **5-minute (~7-slide)** PowerPoint presentation about the **SYMBA T4.6** tool,
for the SYMBA consortium General Assembly (technical, international audience).

**Template & layout — mandatory:** use as the style/master/palette/layout base the existing file:
`G:\Il mio Drive\ENCO\SYMBA\SYMBA W4_GA_Freiburg.pptx`
Keep its fonts, colours (SYMBA identity: white/blue/green), slide master, and the
**mandatory EU footer** ("Funded by the European Union" emblem + GA 101135562) from the template.

**Slide language:** English.

**Source content** (synthesize from here — it is in Italian, translate to English):
`/Users/mirkobusto/Documents/Symba_VCS/symba-t46-app/docs/presentation/SYMBA_T46_teoria.md`

**Screenshots to embed** (folder):
`/Users/mirkobusto/Documents/Symba_VCS/symba-t46-app/docs/presentation/screenshots/`
— `01-home.png` · `02-questionnaire.png` · `03-result.png` · `04-cases.png` · `05-about.png`

**Suggested structure (7 slides, ~40-50s each):**
1. **Title** — SYMBA T4.6: an LCSA methodology engine for Industrial Symbiosis (one-line subtitle).
2. **The problem** — selecting an LCSA methodology means ~10⁶ possible choice-combinations
   (unbounded with per-flow choices). Too much for manual, reproducible work.
3. **The solution** — 7 "complexity-reducer" questions (Q1–Q7) → the engine deterministically
   derives one coherent, traceable methodological configuration.
4. **The theory — pathways** — the 5 IS pathways (IS-01…IS-05, γ matrix Q1×Q2) are only the
   *outer routing*. Full config = 5 ILCD situations × 4 LCC types × 2 S-LCA states × 186
   conditionally-activated nodes. Use the layering table from §3 of the MD.
5. **The pipeline + numbers** — L0→L1→pathway→activate→L2→L3 (diagram in §9); key figures:
   186 atomic nodes, 58 cross-method rules, 5 pathways. Schema-driven, validation PASS.
6. **The tool in action** — screenshots: Home + Questionnaire + Engine output (highlight:
   pathway IS-01, ILCD Situation A multi-actor, 154 activated nodes, L2 rule check).
7. **Status & next steps** — MVP complete; React 19 frontend in 5 languages; FastAPI backend;
   part of WP4 / Task 4.6. Open for next direction.

Keep it visual: one key message per slide, minimal text, use the tables/diagrams from the MD
as graphics where possible.
</content>
