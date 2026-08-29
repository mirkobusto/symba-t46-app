# Cowork script — SYMBA T4.6 GA deck (corrected, code-verified)

**Instruction to cowork:** Use the existing branded template `SYMBA_T46_GA_v9.pptx`
(keep its blue chevron banner, SYMBA logo, yellow rule and EU funding footer on every
slide). Replace the content of the 6 slides with the text below — verbatim. Language:
English. Tone: dry, scientific, no marketing adjectives. One idea per slide.
Screenshots are in the `screenshots/` folder next to this file.

All figures are verified against the engine schemas (validation PASS) and the tool's
UI strings. Do not alter numbers.

---

## SLIDE 1 — "The problem: the methodology must be fixed first"

**Lead line (bold):**
An LCSA of an industrial-symbiosis case (LCA + LCC + S-LCA) requires fixing the exact
methodological pathway *before* any calculation.

**Bullets:**
- **Hundreds of interdependent choices** — system boundary, allocation, zero-burden,
  futurisation, review level, pillar aggregation.
- **No single correct set-up** — the choices constrain one another.
- **Expert-dependent and non-reproducible** — two analysts reach two different set-ups
  for the same case.

**Green example box (right):**
*e.g.* A single fork can invert the result: the same residue treated as zero-burden
**waste** (Q5=a) vs. as an economically-allocated **co-product** (Q5=c) — opposite impact
attribution, opposite conclusion.

**Bottom banner (blue):**
Results that cannot be reproduced are not comparable — and not defensible.

**Speaker notes:**
The hard part of an LCSA of an industrial-symbiosis case is not the computation — it is
fixing the methodology before any number is produced. That set-up involves hundreds of
interdependent decisions, none independent of the others, and there is no single correct
answer. Today it depends on the individual analyst, so two competent experts set up the
same case differently. The example is the cleanest illustration: classify a residue as
waste and you apply zero-burden; classify the same residue as a co-product and you apply
economic allocation — the conclusion flips. A study you cannot reproduce is neither
comparable nor defensible.

---

## SLIDE 2 — "Method: case-level elicitation"

**Lead line (bold):**
Seven case-level questions; each answer deterministically constrains a block of
methodological choices.

**Question list (left column — use exact UI wording):**
- **Q1 — What are you analyzing?** *(required)* — specific exchange · eco-park/network ·
  policy/programme · corporate report (ESG/CSRD) · monitoring
- **Q2 — What phase is the system in?** — operational · under construction · design phase ·
  baseline + N alternative scenarios
- **Q3 — Which sustainability dimensions?** *(required)* — ENV = LCA · ECO = LCC/MFCA/CBA/TEA ·
  SOC = S-LCA
- **Q4 — What is the report for?** — internal · external no-claim · public superiority claim ·
  EU policy/PEF · academic
- **Q5 — Nature of each symbiotic flow** *(per flow)* — waste · free · co-product ·
  interdependent · aggregated/black-box
- **Q6 — Sector + Technology Readiness Level (TRL)** — 14 canonical sectors + Other · TRL bands
- **Q7 — Geographic spread** — co-located · regional · wide-area · multi-scale

**Green example box (right):**
*e.g.*
- Q1 = Eco-park / network → ILCD Situation A (multi-actor)
- Q5 = waste (A pays B) → waste-paradigm / zero-burden rules
- Q5 = co-product (B pays A) → economic allocation + PEF Circular Footprint Formula

**Bottom banner (blue):**
An open, branching choice set → one deterministic, reproducible configuration.

**Speaker notes:**
The method inverts the problem. Instead of mastering the full decision space, the analyst
answers seven case-level questions — the exact wording is on screen. Each answer is a
complexity reducer: it fixes a whole block of downstream choices. Q1 sets the ILCD decision
context; Q2 the temporal treatment; Q3 gates the three pillars (ECO can be LCC, MFCA, CBA or
TEA); Q4 the review/disclosure regime; Q5 is answered per flow and sets the allocation
paradigm; Q6 sector and technology readiness; Q7 transport. Worked example: 'eco-park /
network' fixes ILCD Situation A multi-actor on its own; and the same physical flow routes to
opposite allocation rules depending on whether it is declared waste or co-product in Q5 —
the fork from slide 1, now resolved deterministically.

---

## SLIDE 3 — "Engine: schema-driven derivation"

**Lead line (bold):**
Logic encoded in 5 validated, version-controlled schema files — not hard-coded.

**Process chevrons (one row, 6 arrows):**
`L0 derive base states → L1 block forbidden combinations → Pathway assign routing
(IS-01…IS-05) → Activate switch on provisions → L2 validate consistency → L3 surface
decision points`

**Three stat cards (below chevrons):**
| **186** | **58** | **PASS** |
| atomic nodes | cross-method rules | validation |
| LCA 59 · LCC 61 · S-LCA 66 | 4 blocks · 20 IR · 10 CIR · 5 FU · 7 B · 12 CDP | 204 automated tests · 0 critical |

**Footer line (grey, centred):**
Knowledge base derived from SYMBA deliverables D4.1 (LCA), D4.2 (LCC), D4.3 (S-LCA);
auditable and updatable.

**Speaker notes:**
Behind the seven questions is a schema-driven engine: the methodology lives in five
validated, version-controlled schema files, not in code, so a methodologist can audit and
update the logic without touching the software. A run is a deterministic six-stage pipeline:
L0 derives each pillar's base state; L1 blocks forbidden combinations and stops if one fires;
the pathway stage assigns the terminal IS routing; activate switches on the applicable
provisions; L2 validates cross-pillar consistency; L3 surfaces the critical decision points.
The base carries 186 atomic nodes and 58 cross-method rules, and passes 204 automated tests
with zero critical findings.

---

## SLIDE 4 — "Output: configuration + consistency checks"

**Lead line (bold):**
Per case: a full methodological configuration with provenance, plus automated checks.

**Left:** insert screenshot `screenshots/03-result.png` (the Engine-output screen).

**Right bullets:**
- **Assigned pathway** + per-pillar configuration (ILCD situation, LCC type, S-LCA state).
- **All activated provisions** — each traceable to the triggering answer.
- **Blocks and cross-method warnings** — forbidden combinations, inter-pillar
  inconsistencies, critical decision points.

**Green example box (right, below bullets):**
*e.g.* Sokka et al. (2011) — six-actor eco-park, **ENV-only**: pathway IS-01 (extended) ·
ILCD Situation A (multi-actor) · 154/186 provisions activated · 0 blocks · 1 warning —
B-05: geographic spread requires explicit transport in the LCA inventory and in LCC.

**Speaker notes:**
What the analyst receives is not a score but a complete, justified methodological
configuration. The screenshot is a live run. Left: the assigned pathway and the per-pillar
configuration, plus the full list of activated provisions — each traceable to the answer
that triggered it, so no silent assumptions. The engine also runs the checks: blocks for
forbidden combinations, warnings for inter-pillar inconsistencies. The example is Sokka
2011, a six-actor eco-park run environment-only: pathway IS-01 extended, ILCD Situation A
multi-actor, 154 of 186 provisions activated, no blocks, and one warning that, because the
actors are geographically spread, transport must be modelled explicitly in both the LCA
inventory and the LCC. Decision, justification, checks and documentation in a single pass.

---

## SLIDE 5 — "Status & outlook"

**Left column — Contribution:**
- **Standardised set-up** across partners
- **Full provenance** of every methodological choice
- **Lower expertise barrier** for sound studies

**Right column — Status:**
- **MVP complete** — engine validated (204 tests)
- **Web application** — 5 languages (EN · IT · FR · DE · ES)
- **Aligned with D4.1–D4.3** — editable rule files
- **Next** — application to SYMBA case studies

**Bottom banner (blue):**
Methodology selection: from expert-dependent and non-reproducible → deterministic,
traceable, auditable.
*WP4 · Task 4.6 (ENCO) · SYMBA · Grant Agreement 101135562*

**Speaker notes:**
To close: the contribution is to turn methodology selection from an expert-dependent,
non-reproducible step into a standardised one, with full provenance for every choice and a
lower expertise barrier. Status: the MVP is complete and validated by 204 tests; it is a web
application in five languages; the rule files are aligned with deliverables D4.1 to D4.3 and
remain editable. Next step: apply it to the consortium's real case studies. Thank you.

---

## SLIDE 6 — "Backup (Q&A): pathways vs. configuration"

**Lead line (bold):**
Five IS pathways are the outer routing layer — not the size of the methodological space.

**Table:**
| Layer | What it fixes | Cardinality |
|---|---|---|
| Routing | IS pathway (Q1 × Q2) | 5 (IS-01…IS-05) |
| Pillar states | ILCD situation × LCC type × S-LCA state | 5 × 4 × 2 |
| Node activation | which of 186 nodes switch on + field values | not enumerable |
| Per-flow | valuation type per exchanged flow | 5 ^ (n flows) |

**Green box (below table):**
The configuration is a high-dimensional vector assembled node by node — which is why the
engine is schema-driven, not a lookup table. Each study resolves 150+ provisions
deterministically.

**Speaker notes:**
Backup for the predictable challenge: 'only five pathways?'. The five IS pathways are merely
the outer routing decision. The full configuration is layered: routing (5) on top of pillar
states (5 ILCD × 4 LCC × 2 S-LCA) on top of the activation pattern of 186 nodes with their
field values, on top of a per-flow valuation choice. The result is a high-dimensional vector
assembled node by node — not tabulable, which is why the engine is schema-driven, not a
lookup table. Honest sizing: the input space runs into the thousands even before per-flow
choices, which make it effectively unbounded — but the operative point is that each study
resolves 150-plus provisions deterministically.

---

### Numbers — quick reference (do not alter)
7 questions · 5 IS pathways · 5 ILCD situations · 4 LCC types · 2 S-LCA states ·
186 atomic nodes (LCA 59 / LCC 61 / S-LCA 66) · 58 cross-method rules (4+20+10+5+7+12) ·
204 automated tests · MVP in 5 languages.
</content>
