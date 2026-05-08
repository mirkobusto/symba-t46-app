# Phase 1 S-LCA Validation Report — 100% per-node check

**Method**: every Kimi node (T-01 + HC-01..HC-47 + MC-01..MC-18 = 66 nodes) checked against D4.3 body text by literal content match. Line numbers refer to the markdown extraction of `D4_3_S-LCA_Guidelines_V1.docx` (`/home/claude/work/D4_3.md`, 730 lines, body starts L241). D4.3 uses real markdown headers, so paragraph indexing is cleaner than D4.1 / D4.2.

**Headline**: **66/66 nodes VALID**. 0 mis-citations of section numbers. 1 systemic editorial finding affecting all 47 HCs (registry mismatch, not content) — **already on Mirko's `deliverable_authoring_issues.md` list**.

> Kimi's intro line (file header) says "27 Hard Constraints + 18 Methodological Choices" — this is stale; the actual table goes to HC-47. **48 normative claims total (1 + 47) + 18 choices = 66 nodes.**

---

## Verdict table

### Trigger + Hard Constraints (48 nodes)

| Node | Kimi citation | Body anchor | Verdict |
|---|---|---|---|
| T-01 — G&S: Comparative S-LCA for IS | §2 opening | L271 (verbatim Kimi quote), L263 | VALID |
| HC-01 — Comparative logic (relative not absolute) | §2.1 | L281 ("relative changes... not… absolute social impacts"), L671 (Tenet) | VALID |
| HC-02 — Stakeholder-oriented approach | §2.1 | L283 (verbatim "groups affected by the system") | VALID |
| HC-03 — System-level perspective (network of actors) | §2.1 | L285 (verbatim "networks of interacting actors") | VALID |
| HC-04 — Both scenarios shared FU + boundaries + temporal/geographical | §2.2 | L297 (verbatim) | VALID |
| HC-05 — System encompasses generation/transformation/transport/use/EoL | §2.2 | L299 (verbatim 5-element list) | VALID |
| HC-06 — FU from LCA/LCC retained as common reference | §3.1 | L311 (verbatim) | VALID |
| HC-07 — Stakeholder-based unit (per worker/site/organization) | §3.1 | L309 (heading), L315 (verbatim 3 examples) | VALID |
| HC-08 — Disaggregated interpretation, stakeholder link preserved | §3.2 | L323 (verbatim) | VALID |
| HC-09 — Boundaries aligned with LCA/LCC | §4.1 | L335 (verbatim) | VALID |
| HC-10 — Boundaries: organizational AND territorial | §4.1 | L339 (verbatim both dimensions) | VALID |
| HC-11 — Inclusions/exclusions documented | §4.1 | L341 (verbatim) | VALID |
| HC-12 — Stakeholder classification follows UNEP/SETAC | §5.1 | L361 (verbatim) | VALID |
| HC-13 — Mapping connects stakeholders/subcategories/indicators | §5.1 | L363 (verbatim) | VALID |
| HC-14 — Multi-role actors: no overlooking, no double-counting | §5.2 | L371 (verbatim) | VALID |
| HC-15 — Materiality assessment for priority subcategories | §6.2 | L395 (verbatim "most relevant for the specific Industrial Symbiosis (IS) configuration") | VALID |
| HC-16 — 4 materiality criteria | §6.2 | L401 (relevance), L403 (magnitude), L405 (capacity to influence), L407 (feasibility) — all 4 explicit | VALID |
| HC-17 — Indicator 4 conditions (a..d) | §6.3 | L421 (linked to stakeholder+subcategory), L423 (measurable/observable), L425 (realistically obtainable), L427 (suitable for comparative) — all 4 explicit | VALID |
| HC-18 — S-LCI: combination of primary and secondary | §7.1 | L443 (verbatim) | VALID |
| HC-19 — Structured instruments (questionnaires/interviews/surveys) | §7.1 | L449 (verbatim 3 instruments) | VALID |
| HC-20 — Tailored approaches for non-organizational stakeholders | §7.1 | L451 (verbatim, consumers + local communities) | VALID |
| HC-21 — Sources/assumptions/limitations documented | §7.2/§7.3 | L465 (verbatim) | VALID |
| HC-22 — Data point linked to indicator and stakeholder group | §7.3 | L471 (verbatim, "ensuring traceability") | VALID |
| HC-23 — Proxy assumptions documented | §7.3 | L473 (verbatim "All assumptions associated with proxy use are explicitly documented") | VALID |
| HC-24 — Inventory completeness/consistency check before assessment | §7.3 | L477 (verbatim) | VALID |
| HC-25 — Comparative evaluation between scenarios | §8.1 | L489 (verbatim) | VALID |
| HC-26 — Five-level scale +2/+1/0/−1/−2 | §8.2 | L505 (+2), L507 (+1), L509 (0), L511 (−1), L513 (−2) — all 5 explicit | VALID |
| HC-27 — Scoring relative to reference scenario | §8.2 | L515 (verbatim) | VALID |
| HC-28 — Conservative under uncertainty (no positive without evidence) | §8.2 | L515 (second sentence verbatim) | VALID |
| HC-29 — Scoring criteria transparent and harmonized | §8.2 | L517 (verbatim) | VALID |
| HC-30 — Indicator results preserve link to stakeholder/data | §8.3 | L523 (verbatim) | VALID |
| HC-31 — 3 levels: indicator/stakeholder/system | §9.1 | L541 (indicator level), L543 (stakeholder level), L545 (system level) — all 3 explicit | VALID |
| HC-32 — Trade-offs between stakeholders identified and analysed | §9.2 | L551 (verbatim "must be explicitly identified and analysed" — note: actual D4.3 normative usage here) | VALID |
| HC-33 — No aggregation into single metric without consideration | §9.2 | L553 (verbatim) | VALID |
| HC-34 — Distribution of impacts as key aspect | §9.2 | L555 (verbatim "key aspect of interpretation") | VALID |
| HC-35 — No single aggregated score; disaggregated and transparent | §9.3 | L563 (verbatim) | VALID |
| HC-36 — Identify social hotspots and improvement opportunities | §9.3 | L565 (verbatim hotspots), L651 (verbatim improvement opportunities) | VALID |
| HC-37 — Reference scenario consistent with symbiotic | §10.1 | L583 (verbatim) | VALID |
| HC-38 — Reference scenario assumptions documented | §10.1/§10.2 | L585, L597 (verbatim) | VALID |
| HC-39 — Conservative under uncertainty (no overestimation) | §11.1 | L613 (verbatim) | VALID |
| HC-40 — Assumptions/limitations/uncertainty reported | §11.1 | L613 (verbatim) | VALID |
| HC-41 — LCSA: shared FU + consistent boundaries + scenario-based | §12.1 | L625 (verbatim) | VALID |
| HC-42 — Parallel interpretation NOT aggregation | §12.1 | L627 (verbatim) | VALID |
| HC-43 — Each dimension retains methodology + units | §12.1 | L627 (verbatim) | VALID |
| HC-44 — Multi-level reporting (indicator/stakeholder/system) | §13.1 | L643 (verbatim) | VALID |
| HC-45 — Scores accompanied by qualitative explanations | §13.1 | L645 (verbatim) | VALID |
| HC-46 — Confidentiality measures for sensitive data | §13.1 | L647 (verbatim, anonymization/aggregation/qualitative descriptions) | VALID |
| HC-47 — Results framed as comparative outcomes, NOT absolute | §13.1 | L649 (verbatim) | VALID |

### Methodological Choices (18 nodes)

| Node | Kimi citation | Body anchor | Verdict |
|---|---|---|---|
| MC-01 — Comparative vs Absolute orientation | §2.1 | L267, L281 (default = comparative, mandatory for IS) | VALID |
| MC-02 — Stakeholder-based vs FU-only normalization | §3.1 | L315 (complementary stakeholder-based, default) | VALID |
| MC-03 — Reference units (per worker/site/organization/FU/mixed) | §3.2 | L315 ("e.g. per worker, per site or per organization, rather than exclusively per functional unit") | VALID |
| MC-04 — Boundary scope (cradle-to-grave / gate-to-gate / case-specific) | §4.1 | L341, L347 (case-specific by contribution to comparative) | VALID |
| MC-05 — Engagement level (analytical/consulted/participatory) | §5.1 | L365 ("where appropriate, supported by engagement"), L661 | VALID |
| MC-06 — Mapping detail (granularity) | §5.2 | L373 ("level of detail … adapted to the scope of the study and the availability of data") | VALID |
| MC-07 — Subcategory source (UNEP/SETAC + CIRCPACK / fully case-specific) | §6.1 | L385 (UNEP/SETAC + CIRCPACK), L389 (adapted to specific characteristics) | VALID |
| MC-08 — Materiality support (analytical / + stakeholder input) | §6.2 | L409 ("Where appropriate, the process may be supported by stakeholder input") | VALID |
| MC-09 — Indicator types (qual/semi/quant/mixed) | §6.3 | L417 (verbatim), L287 (semi-quantitative approach combining 3 types) | VALID |
| MC-10 — Primary-secondary ratio | §7.1 | L443 (combination, default) | VALID |
| MC-11 — Data collection instruments | §7.1 | L449 (questionnaires/interviews/surveys) | VALID |
| MC-12 — Proxy use rule | §7.3 | L473 (when direct measurements not available + documented assumptions) | VALID |
| MC-13 — Multi-source consolidation | §7.3 | L471 ("consolidated following predefined criteria") | VALID |
| MC-14 — Quantitative scoring criteria (threshold-based) | §8.2 | L513 (verbatim "threshold-based comparisons (e.g. percentage changes)") | VALID |
| MC-15 — Qualitative scoring criteria (predefined conditions) | §8.2 | L513 (verbatim "predefined conditions, such as the presence or absence of practices") | VALID |
| MC-16 — Reference scenario selection (representativeness/relevance) | §10.1 | L585 (verbatim "selected based on representativeness and relevance") | VALID |
| MC-17 — Uncertainty (qualitative context-sensitive) | §11.1 | L607 (verbatim), L609 | VALID |
| MC-18 — Participatory across all stages | §14.1 | L661 (verbatim "integrated across different stages") | VALID |

---

## Key findings

### A. Section numbering: clean

D4.3 uses native markdown headers (`#`, `##`) for body sections, mapping cleanly to its TOC numbering (§1..§14). **0 mis-citations across 66 nodes.** D4.3 is the most internally consistent of the three deliverables in this respect.

### B. Descriptive → normative translation (systemic, ALREADY on Mirko's list)

`deliverable_authoring_issues.md` flags D4.3 with: *"D4.3: 1 🟠 (descriptive register vs normative)"*. This validation confirms the issue empirically and quantifies its scope.

**D4.3 body uses indicative-descriptive register**: *"the assessment **adopts** a stakeholder-oriented approach"* (L283), *"results **are interpreted** in a disaggregated manner"* (L323), *"system boundaries **are defined** in alignment"* (L335), *"the reference scenario **is defined** consistently"* (L583), etc. Almost every paragraph reads as a description of what the framework *does*, not as a directive about what assessors *must* do.

**Kimi has translated this to normative "shall" / "must" language** in all 47 HCs: *"The assessment **shall** adopt"*, *"Both scenarios **shall** be defined consistently"*, *"System boundaries **shall** be defined in alignment"*, etc.

**Two exceptions where D4.3 itself does use normative language**:
- L551 ("these situations **must** be explicitly identified and analysed" — HC-32)
- L553 ("**should not** be aggregated into a single metric" — HC-33)
- L515 ("scoring **is always** performed relative to the reference scenario" — strong indicative, almost normative)

Everywhere else, the prescriptive force in Kimi's HC formulation is **overlaid** by Kimi, not anchored in D4.3 wording.

**This is what Mirko has already flagged for refactoring**: the descriptive register weakens the deliverable's prescriptive force compared to D4.1 (which mostly uses *"must / shall / mandatory"*). For S-LCA to operate as a normative methodology in the IS context, the wording needs to be lifted to normative register. Until that refactor lands, **the substance of the 47 HCs is correct, the prescriptive strength is Kimi's amplification.**

For the decision engine v3: **the HCs are still usable as constraints**, since the underlying methodological substance is anchored. But documentation should flag that S-LCA constraints inherit D4.3's softer register, not the firm "shall" of LCA/LCC. Or — and this is the cleaner path — the v3 work coincides with a D4.3 register-lift pass and the two are reconciled in one go.

### C. No structural ambiguities like LCA's PEF CFF or LCC's HC-04

S-LCA validation surfaced no equivalent of:
- LCA's PEF CFF placement debate (D4.1 §5.3.2/§5.3.3)
- LCC's universal "must be identical" wording where rule is operationally E-LCC-only (D4.2 HC-04/HC-05/HC-27)

D4.3 is structurally simpler — one comparative methodology, applied uniformly. The trade-off: it has less internal differentiation (e.g., no S-LCA equivalent of "C-LCC vs E-LCC vs S-LCC type-driven branching"), so the decision engine S-LCA layer will likely be flatter than LCA or LCC layers.

### D. Strong cross-method touchpoints (continued from LCC report)

D4.3 reinforces the same harmonization invariants identified from D4.2:
- **Shared FU (LCA FU = LCC FE = S-LCA FU)**: D4.3 L311 ("functional unit defined in LCA and LCC is retained as a common reference") + L625 (LCSA alignment).
- **Aligned system boundaries**: D4.3 L335 ("alignment with those established for LCA and LCC") + L625.
- **Common scenario-based comparison**: D4.3 L625 ("common scenario-based approach"). This is symmetric with LCC HC-11 (reference scenario for avoided cost) and LCA MC-26/MC-27 (HNSRS/CNSRS).
- **Parallel interpretation, NOT single-metric aggregation**: D4.3 L627 ("integration is based on a parallel interpretation of results, rather than on their aggregation into a single metric"). This is an LCSA-level invariant — matches Mirko's bootstrap concern about not collapsing dimensions.
- **No weighting / no single-score**: D4.3 HC-35/HC-42 echo LCA HC-09 (no weighting for public assertions) and LCC HC-29 (no single-score reporting).

These are now triple-anchored across D4.1/D4.2/D4.3 → **strong invariant candidates for v3**:
1. `shared_functional_unit` across LCA/LCC/S-LCA
2. `aligned_system_boundaries` (with the E-LCC-only conditional flagged in LCC layer)
3. `common_reference_scenario` definition
4. `no_single_metric_aggregation` across LCSA dimensions
5. `methodological_charter_signed_before_modeling` (LCC) ↔ same anchor in D4.1 L1421

### E. Minor framing observations (not editorial flags)

- D4.3 §11.1 (Uncertainty) is intentionally **qualitative-only** (MC-17 default = qualitative context-sensitive). This is a deliberate methodological stance ("reflecting the nature of social data"), not an oversight. LCA mandates uncertainty analysis at HC-12 with full Pedigree+Monte Carlo (HC-14); LCC mandates Monte Carlo ≥10,000 iterations (HC-24). **S-LCA is structurally different** here. The decision engine should not propagate LCA/LCC uncertainty rigor onto S-LCA — that would over-constrain.
- D4.3 has no equivalent of LCA's frontier impact categories (HC-19) or LCC's failure-mode catalogue (HC-30). The S-LCA hotspot identification (HC-36) is the closest analog but is more abstract.

---

## Cumulative status across LCA + LCC + S-LCA

| Method | Kimi nodes | Validated | Verdict |
|---|---|---|---|
| LCA (Phase 1) | 59 (1 + 22 HC + 36 MC) | 59/59 | ALL VALID |
| LCC (Phase 1) | 61 (1 + 40 HC + 20 MC) | 61/61 | ALL VALID |
| S-LCA (Phase 1) | 66 (1 + 47 HC + 18 MC) | 66/66 | ALL VALID |
| **Total** | **186** | **186/186** | **100%** |

Substantive editorial issues on Mirko's list, now empirically confirmed:
1. **D4.1**: §6.3.x ↔ §5.7.x renumbering half-merged (LCA report §A)
2. **D4.1**: Step 4 cross-ref to "Section 5.7.5" broken (LCA report §A)
3. **D4.2**: FU/boundary "identical" universal phrasing where rule is operationally E-LCC-only (LCC report §B)
4. **D4.2**: TOC missing chapter-level §10 entry (LCC report §A)
5. **D4.3**: descriptive register vs normative — Kimi correctly translates substance, Kimi's *"shall"* is overlay (S-LCA report §B)

Structural-framing minor notes:
1. LCA MC-32: 3 tiers vs 4 options framing (immaterial for engine)
2. LCA MC-13/MC-14: PEF CFF dual placement in §5.3.2 (Q-basis) and §5.3.3 (alt method) — Kimi faithful to D4.1; methodological refactor is **D4.1's call**, not Kimi's
3. S-LCA: deliberate qualitative-only uncertainty stance; should not be over-constrained by LCA/LCC rigor in v3

**Critical observation**: across 186 nodes, **Kimi makes zero substantive errors and zero mis-citations**. Every issue surfaced is either (a) inherited from a deliverable editorial state Mirko already flagged, or (b) a structural-framing nuance immaterial for engine logic.

---

## What this means for the bootstrap §5 decisions

Bootstrap §5 Decision 1 was: *"A. Ripartire da zero / B. Validare e correggere Kimi (con guardrail) / C. Re-prompting Kimi"*. My initial recommendation in turn 1 was **B with a 30%-rework abort threshold** that would trigger A.

After 186 nodes validated: **rework rate is 0%**. Phase 1 (atomic nodes) is solid. Decision **B is the right call**, and we don't trigger the A escalation.

**Phase 1 atomic nodes are now ground truth.** The work that follows (Phase 2 compatibility matrix, Phase 3 dominant variables, Phase 4 pathways, Phase 5 clashes) builds on top of these 186 nodes. The errors in the v2 JSON Mirko diagnosed (PEF CFF Q7, INV-04, RULE-04 ridondante) all live at Phase 4+ level — they're errors of *aggregation/structure* on top of Phase 1, not errors *in* Phase 1.

---

## Next turn

**Phase 2 — cross-method compatibility matrix review** against the now-validated atomic nodes. Phase 2 is `phase2_compatibility_matrix.md` (~40KB, 19 Integration Rules + 12 Cross-Domain Problems + [OK]/[WARN]/[BLOCK] markers).

The validation question for Phase 2 is different from Phase 1:
- Phase 1: "is each Kimi claim anchored in the source deliverable?" → 186/186 yes
- Phase 2: "do the IR-01..IR-19 and CDP-01..CDP-12 correctly characterize cross-method interactions between the validated nodes?"

This is where the v2 JSON errors likely originated. Specifically:
- The INV-04 invariant (`lcc.boundary` vs `lca.system_boundary`) was probably pulled from a Phase 2 IR rule that conflated dimensions.
- The RULE-04 vs BLOCK-03 duplication was probably a Phase 2 → Phase 4 propagation glitch.

So Phase 2 review is the natural next layer to inspect.

After Phase 2: a quick Phase 3 dominant-variables sanity check (does the cardinality argument 10^12 → 10^9 hold up?) and we're ready to design v3 from clean ground.
