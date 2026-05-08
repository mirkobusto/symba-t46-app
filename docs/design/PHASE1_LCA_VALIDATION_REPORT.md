# Phase 1 LCA Validation Report — 100% per-node check

**Method**: every Kimi node (T1 + HC-01..HC-22 + MC-01..MC-36 = 59 nodes) checked against D4.1 body text by literal content match. Line numbers refer to the markdown extraction of `D4_1_LCA_Guidelines_WIP.docx` (`/home/claude/work/D4_1.md`, 1879 lines, body starts L410).

**Headline**: **59/59 nodes VALID**. 1 minor structural framing note. 0 mis-citations of section numbers.

---

## Verdict table

### Trigger + Hard Constraints (23 nodes)

| Node | Kimi citation | Body anchor | Verdict |
|---|---|---|---|
| T1 — ILCD A/B/C | §2.3.4, §2.2.3, Table 1 | L487 + Table 1 L491–495 | VALID |
| HC-01 — G&S mandatory first phase ISO 14040/44 | §2 intro | L441 | VALID |
| HC-02 — ILCD classification mandatory | §2.3.4 | L487, L513 | VALID |
| HC-03 — Sit. A → Attr+Sub+AvgMix | §2.3.4 / Tbl1 / §5.3.1 | L491–495, L541, L759, L793, L1191 | VALID |
| HC-04 — Sit. B → Cons+LT-Marginal | §2.3.4 / Tbl1 / §5.3.1 | L491–495, L769 | VALID |
| HC-05 — C1 → Sub + AvgMix | §5.2.3, §5.3.1 | L781 | VALID |
| HC-06 — C2 → Allocation, no sub credits | §5.2.3, §5.3.1 | L783, L789 | VALID |
| HC-07 — ISO Step 1 Subdiv → 2 SysExp → 3 Alloc | §5 intro | L721, L723, L725, L727 | VALID |
| HC-08 — Public comparative → 3+ panel review | §2 intro, §13.3.4 | L449, L1499 | VALID |
| HC-09 — Weighting prohibited for public per ISO | §8.3.4 | L1107 (ends "Per ISO 14044, weighting shall not be used for comparative assertions disclosed to the public") | VALID |
| HC-10 — FG/BG timeframes aligned | §10 intro, §10.2.2 | L1217, L1259, L1293 | VALID |
| HC-11 — Spatial representativeness | §10 intro, §10.2.1 | L1215 | VALID |
| HC-12 — Uncertainty mandatory ISO 14044 | §11 intro | L1319 (completeness/sensitivity/consistency triple) | VALID |
| HC-13 — LCC discounts, LCA does not | §12.2.2 | L1403 | VALID |
| HC-14 — Pedigree + Monte Carlo complementary | §11.3.2 | L1363 ("Pedigree and Monte Carlo are complementary") | VALID |
| HC-15 — Each flow individually, no blanket | §6.3.1 | L869, L871 ("Do not apply a single, network-wide rule") | VALID |
| HC-16 — 4-step EVT/Interdep/Q-Sub/ZeroBurden | §6.3.1 Cons. tree | L909, L913, L915, L917, L919 (Steps 1–4) | VALID |
| HC-17 — Co-optimization disqualifies zero-burden | §6.2.4, §6.3.1 Step 2 | L863, L877, L915 | VALID |
| HC-18 — Capital goods amortized | §4.2.2, §4.3.3 | L711, L713 | VALID |
| HC-19 — Frontier categories must be reported | §8.3.5 | L1111, L1115 (marine litter), L1117 (biochar), L1119 (iLUC), L1121 (microplastic), L1123 ("non-reported … explicit known blind spot") | VALID |
| HC-20 — LCSA boundary consistency | §4.3.4, §12.1, §12.3.4 | L717, L1421 | VALID |
| HC-21 — Transport in foreground | §10.1, §10.3.1 | L653, L1223, L1551 | VALID |
| HC-22 — Function-oriented preferred | §3.2.1, §3.3.1 | L597 ("methodologically preferred") | VALID |

### Methodological Choices (36 nodes)

| Node | Kimi citation | Body anchor | Verdict |
|---|---|---|---|
| MC-01 — ILCD context choice | §2.3.4 | L487, L535 | VALID |
| MC-02 — Process / IO / Hybrid | §2.3.4 | L505 (Process), L507 (Hybrid), L683 (IO) | VALID |
| MC-03 — Tiered/Integrated/Path-exch/HPIMO | §4.3.2 | L683, L685, L687, L689 (all 4 named) | VALID |
| MC-04 — EXIOBASE / FIGARO / Eora / regional | §4.3.2 | L693, L695, L697 | VALID |
| MC-05 — 5 IS typologies | §2.3.2 | L519–527 (Analysis/Improvement/Expansion/Design/Restructuring) | VALID |
| MC-06 — Static / Scenario | §2.3.3 | L475 (static framing), L531 (scenario rec.) | VALID |
| MC-07 — Function / Flow FU | §3.2.1, §3.3.1 | L583, L597, L615 | VALID |
| MC-08 — Single FU / SoFU vector | §3.3.2 | L623, L625, fn^1 (L1768) "functional unit vector" | VALID |
| MC-09 — Process truncation / Hybrid | §4.3.2 | L673, L675, L677, L679 | VALID |
| MC-10 — Include/Exclude capital goods | §4.3.3 | L663, L711, L713 | VALID |
| MC-11 — System Expansion / Allocation | §5.3.1 | L787, L789 | VALID |
| MC-12 — Avg Mix / LT-Marginal | §5.3.1 | L759, L769, Table 1 | VALID |
| MC-13 — 4 Q-correction bases incl. PEF CFF | §5.3.2 | L803 (functional/perf), L805 (empirical), L807 (market-price), L809 (PEF CFF) | VALID — see §B below |
| MC-14 — Full sub / PEF CFF | §5.3.3 | L827, L829 | VALID — see §B below |
| MC-15 — EVT hierarchy / blanket | §6.3.1 | L869, L913 | VALID |
| MC-16 — Comprehensive / Phased | §7.3.1 | L971, L975 (Phase 1 Screening), L977 (Phase 2 Detailed) | VALID |
| MC-17 — Direct / Neutral data hub + NDA | §7.3.2 | L979, L981, L1535 | VALID |
| MC-18 — Primary FG / Secondary BG | §7.3.3 | L939, L951, L977, L983 | VALID |
| MC-19 — Direct LCI / MFA-precede | §7.3.4 | L993, L995 | VALID |
| MC-20 — 4 scale-up techniques | §7.3.5 | L1003 (stoichiometric), L1005 (step-mapping), L1007 (batch-cont.), L1009 (learning curves) | VALID |
| MC-21 — Current / Future-projected BG | §7.3.5, §9.3.2 | L1021, L1291, L1293 | VALID |
| MC-22 — Midpoint / Endpoint / Both | §8 intro | L1041 (weighting def.), L1107 (mandatory/optional split) | VALID |
| MC-23 — ReCiPe / EF / IMPACT World+ / LC-IMPACT | §8.3.2, §10.3.3 | L1303 (ReCiPe + EF), L1307, L1313 (IMPACT World+, LC-IMPACT) | VALID |
| MC-24 — Class+Char only / +Norm / +Weight | §8.3.4 | L1107 | VALID |
| MC-25 — Frontier report / blind spot | §8.3.5 | L1123 | VALID |
| MC-26 — HNSRS / CNSRS | §9.1 | L1133 (HNSRS), L1135 (CNSRS) | VALID |
| MC-27 — 4 HNSRS strategies | §9.2.2 | L1153, L1155, L1157, L1159 (all 4 named) | VALID |
| MC-28 — Single / Scenario+Sensitivity | §9.3.3 | L1201, L1207, L1209, L1367 (best/worst/most-likely) | VALID |
| MC-29 — Generic / Explicit foreground transport | §10.3.1 | L1275 (vehicle type & loading), L1223, L1233 | VALID |
| MC-30 — Global / Spatially-differentiated | §10.3.3 | L1097, L1295, L1297, L1313 | VALID |
| MC-31 — OAT / GSA / Both | §11.3.2, §11.3.3 | L1345, L1347, L1369, L1371 | VALID |
| MC-32 — Morris / Sobol / PAWN / delta-moment | §11.3.3 | L1371 (all 4 named) | VALID — minor framing note, see §C |
| MC-33 — E-LCC / MFCA / Parallel | §12.3.2, §12.3.3 | L1415, L1417 (MFCA + ISO 14051:2011) | VALID |
| MC-34 — Network-only / Network+Entity+Flow | §13.3.1 | L1469, L1471 ("three key levels (Network, Entity, and Flow)"), L1547 | VALID |
| MC-35 — Single / Layered (3 layers) | §13.3.3 | L1483, L1485 (all 3 layers explicit: Confidential Technical / Public / Internal Management) | VALID |
| MC-36 — No / Single / Panel review | §13.3.4 | L1499 | VALID |

---

## Key findings to surface to Mirko

### A. Section numbering: Kimi cites correctly against D4.1 body as-is

Every section number Kimi uses matches the D4.1 body. **0 mis-citations across 59 nodes.**

But D4.1 contains an **internal numbering inconsistency** that is independent of Kimi:
- Body uses §6.3.1 / §6.3.2 / §6.3.3 / §6.3.5 for the waste-vs-co-product hierarchy (L869–921).
- Step 4 paragraph (L919) cites "Section 5.7.5" which **does not exist** in the body.
- Footnotes c134, c135, c149 (L1838–1839) describe a **proposed renumbering** to §5.7.1 / §5.7.6 that has not yet been merged into body text.

**Implication**: Kimi nodes are correct against current D4.1. If Mirko closes the proposed §5 → §5.7 renumbering from his footnotes, the node citations need a one-pass refresh — but no substantive content changes. This is editorial debt already on Mirko's `deliverable_authoring_issues.md`.

### B. PEF CFF placement: bootstrap claim conflicts with D4.1 itself, not with Kimi

The bootstrap document §3.2 point 1 says: *"Q7 multifunctionality: include PEF CFF as third option parallel to system-expansion/allocation. Sbagliato: PEF CFF non c'entra con multifunctionality… c'entra con burden/credit sharing all'interfaccia tra attori IS — concetto ortogonale."*

D4.1 actually says:
- **§5.3.2** (`Apply Quality-Corrected Substitution Ratios`) lists 4 bases for the Q factor: functional/performance ratio, empirical, market-price ratio, **PEF CFF** (L803–809). PEF CFF here is *one method to compute Q within substitution*.
- **§5.3.3** (`Consider the PEF Circular Footprint Formula`) presents PEF CFF as *an alternative to robust substitution* when EU policy alignment is required (L827, L829). The CFF "partitions burdens and credits using four parameters — A (allocation between supplier and user)…"

So **D4.1 itself** places PEF CFF inside §5 Multifunctionality — both as a Q basis and as a top-level alternative to substitution. Kimi MC-13 / MC-14 are **faithful to the deliverable**. The bootstrap concern is therefore a critique of D4.1's organisation, not of Kimi's reading.

This becomes a **decision point** for the metodological re-do, not a validation failure:

> **Decision needed**: leave PEF CFF inside the multifunctionality dimension (as D4.1 currently does), or refactor D4.1 to make "interface burden/credit sharing" an orthogonal dimension and move PEF CFF there?

The substantive merit of the bootstrap critique — PEF CFF parameter A (supplier/user split) is conceptually about inter-actor burden sharing, not about resolving multi-output processes — is real. But acting on it requires changing D4.1, then propagating. If we keep D4.1 as-is, Kimi's structure stands. **Recommendation**: defer this until phase 3 dominant-variables analysis; can decide then with the full picture.

The previous chat's error was different: not just keeping PEF CFF in multifunctionality (which D4.1 does), but **mixing two distinct PEF CFF mentions** (Q basis vs. alternative method) into one ambiguous Q7 question. That's a question-design problem, not a node-content problem.

### C. MC-32 — minor structural framing note

D4.1 L1371 says GSA "broadly follows three tiers": (i) Morris, (ii) Sobol, (iii) PAWN **or** delta-moment as alternatives within the same tier. Kimi MC-32 lists 4 separate options. Substantively all 4 names are in D4.1; the structural relationship (3 tiers with PAWN/delta-moment as siblings in tier 3) is flattened by Kimi. For the decision engine this is immaterial — what matters is that all 4 are valid choices.

### D. Editorial issues found incidentally (already on Mirko's list, not new)

- L919 cross-reference to "Section 5.7.5" is broken (body has no §5.7.5).
- L999 says "three technical levers" but lists 4 (the count is off; what's listed is correct).
- §13 appears as a numbered TOC heading **twice** (L357 "Interpretation and Reporting", L377 "Cross-Cutting Good Practices") — duplicate §13 number is the broken cross-ref Mirko already flagged.

---

## What changes in the bootstrap picture

Before this validation: bootstrap §3.2 said "Validato 12-22%, dichiarato 'Phase 1 affidabile' senza prove". Now: **validated 100% of LCA nodes (59/59).** Phase 1 LCA is verified.

Re-reading bootstrap §3.2 point 1 (PEF CFF / multifunctionality / Q7) with this evidence:
- The previous chat was **not wrong about Q7 being broken** — it was wrong about **why**.
- Q7 wasn't broken because Kimi misplaced PEF CFF. Q7 was broken because the question conflated PEF CFF as Q-basis (MC-13 sub-option) with PEF CFF as alternative method (MC-14). Two different decision points were collapsed into one ambiguous user-facing question.
- The methodological re-do should **rebuild the questionnaire from MC-13 and MC-14 as separate decisions**, not "fix" PEF CFF placement in Kimi's nodes.

---

## Next turns

- **Turn 2**: validate Phase 1 LCC (40 HC + 20 MC = 60 nodes against D4.2)
- **Turn 3**: validate Phase 1 S-LCA (47 HC + 18 MC = 65 nodes against D4.3)
- **Turn 4**: cross-method clash check (Phase 2 file) and dominant-variables review

Total remaining: ~125 nodes. Same per-node literal-text protocol.
