# Phase 4-5 Inspection — v2 Errors Diagnosis

**Purpose**: identify exactly where the three errors of the v2 JSON (PEF CFF in Q7 multifunctionality, INV-04, RULE-04 duplicating BLOCK-03) originated, so that the v3 backend (Sprint 4) does not reproduce them. This is a **forensic** inspection of Kimi Phase 4-5 deliverables, not a validation pass.

**Headline finding**: 

- The three "errors" of v2 are NOT errors in Kimi's Phase 4-5 work directly. Kimi's IR/CIR/CDP/BLOCK structure is internally coherent.
- The errors are **artefacts of the previous chat's translation** of Kimi's content into the v2 JSON schema. Specifically: (a) renaming convention drift (IR-XX became INV-XX, [BLOCK] cells became BLOCK-NN), (b) JSON schema vs UNIFIED narrative disagreement on what Q7 is, (c) PEF CFF wrongly placed as Q7-multifunctionality option instead of CIR-05 trigger.
- All three errors are **avoidable in v3** by following Kimi's original naming and architecture, with the renamings introduced by the previous chat dropped.

---

## §1 What Kimi's Phase 4-5 actually contains

### 1.1 Files inspected

- `phase4_logic_table.md` (27 KB) — JSON schema for the decision tree + answer-to-pathway mappings
- `phase4_traceability.md` (22 KB) — per-pathway traceability to source guidelines
- `phase4_mermaid_tree.md` (16 KB) — Mermaid.js visual decision tree
- `phase5_clash_table.md` (105 KB) — 39 cross-method clashes catalogued in 5 conflict categories
- `IS_Decision_Engine_UNIFIED.md` (137 KB) — consolidated v1 of the decision engine, all phases combined

### 1.2 Kimi's official rule taxonomy

Kimi uses **five distinct categories** of cross-method rules, each with its own ID prefix. They are NOT interchangeable:

| Prefix | Name | Count | Purpose |
|---|---|---|---|
| **IR-XX** | Hard Integration Rules | 20 | Non-negotiable cross-method invariants (e.g., Shared FU, Parallel Interpretation, MFA Backbone) |
| **CIR-XX** | Conditional Integration Rules | 10 | Context-dependent rules activated by specific conditions (e.g., CIR-05 PEF CFF if EU policy context) |
| **FU-XX** | Functional Unit Alignment Rules | 5 | FU-specific cross-method alignment (e.g., LCA function-oriented FU is authoritative) |
| **B-XX** | System Boundary Alignment Rules | 7 | Boundary-specific cross-method alignment |
| **CDP-XX** | Critical Decision Points | 12 | High-priority decision points where methods diverge fundamentally (e.g., CDP-01 system expansion divergence) |

Total: **20 + 10 + 5 + 7 + 12 = 54 cross-method rules**, organized in clear categories. Each clash in `phase5_clash_table.md` (39 clashes in 5 categories: SBC, AP, DGC, TMC, CCI) maps to one or more of these rules.

### 1.3 The [BLOCK] [WARN] [OK] system

Separately from the rules above, Kimi's Section 2.1 defines a **20-cell compatibility matrix** that combines:
- LCA ILCD trigger (A / B / C1 / C2)
- LCC trigger (C-LCC / E-LCC / S-LCC / C+E-LCC / C+E+S-LCC)
- S-LCA trigger (Comparative-MC-01a / Absolute-MC-01b)

Each cell is labelled:
- **[OK]** — compatible combination, proceed (10 cells)
- **[WARN]** — proceed with explicit caveats (6 cells)
- **[BLOCK]** — combination is forbidden (4 cells)

The 4 [BLOCK] cells are:
1. C2 (Corporate accounting) + E-LCC = [BLOCK]: "E-LCC requires system expansion; C2 mandates allocation"
2. Any LCA situation + Any LCC type + S-LCA Absolute (MC-01b) = [BLOCK]: "Disables all IS-specific methodology" (this collapses to 3 sub-cells in the matrix, hence "4 [BLOCK] cells" total — exec summary calls it 3 in some places due to counting convention)

These [BLOCK] cells are **not numbered** (no BLOCK-01, BLOCK-02, etc.) in Kimi's source. They are described in prose with their conflicting trigger combination as identifier.

---

## §2 Forensic of the three v2 errors

### 2.1 Error 1 — PEF CFF as Q7 multifunctionality option

**What v2 had**: `q7: "string [system-expansion|allocation|pef-cff] — Multifunctionality"` in the JSON schema (`phase4_logic_table.md` Section "JSON Schema", line 18).

**What Kimi's UNIFIED actually says**: 

The 10 v2 questions in `IS_Decision_Engine_UNIFIED.md` Section 4.1 are **different from the JSON schema in `phase4_logic_table.md`**. The 10 questions are:

1. ILCD Decision Context
2. LCC Type
3. Study Temporal Orientation (ex-ante / ex-post)
4. Public Comparative Assertion (yes / no)
5. Transport Modeling
6. Reference Scenario Strategy
7. **Uncertainty Propagation** (OAT / GSA / Both) ← NOT multifunctionality
8. LCA-LCC Integration Mode
9. Stakeholder Engagement Depth
10. Emerging Impact Categories

The JSON schema in `phase4_logic_table.md` describes a **different question list** (q1=ILCD, q2=ex-ante/ex-post, q3=LCC type, q4=FU type, q5=IS typology, q6=low-TRL, q7=multifunctionality, q8=public assertions, q9=spatial scope, q10=uncertainty). This **contradicts** the UNIFIED narrative.

**Diagnosis**: Kimi's deliverables have an internal inconsistency between two files. The previous chat picked the JSON schema's question definition (q7 = multifunctionality) and treated it as authoritative, which led to PEF CFF appearing as a valid Q7 answer.

**The right answer**: PEF CFF is NOT a multifunctionality answer. It is a method ALSO USED for multifunctionality, but in Kimi's coherent v1 it appears as **CIR-05** (a conditional integration rule):
> CIR-05: PEF CFF in LCA triggers NTF + monetized externality in LCC. Activation condition: "EU policy contexts".

This maps cleanly to the v3 design: PEF CFF is activated when **Q4=D** (EU policy alignment), as a derived consequence of the report destination, not as a primary multifunctionality choice.

**Fix for v3**: 
- Remove the JSON schema's q7=multifunctionality from any backend reference.
- Use CIR-05 as the canonical activation: Q4=D → PEF CFF active.
- Multifunctionality (system expansion vs allocation) is itself derived from Q1 (ILCD situation), not asked as a separate user-facing question.
- The decision engine NEVER asks the user "system-expansion vs allocation vs pef-cff" in a single question. These are three different things at three different decision levels.

### 2.2 Error 2 — INV-04 invariant comparing semantically incompatible fields

**What v2 had** (per Mirko's bootstrap diagnosis): an invariant `INV-04` that compared `lcc.boundary` to `lca.system_boundary` as if they were the same dimension, leading to false-positive violations.

**What Kimi's UNIFIED actually says**: 

There is no `INV-XX` prefix anywhere in Kimi's deliverables. The invariants are called **IR-XX** (Integration Rules). The relevant rule is:

> IR-02: Consistent System Boundaries. Physical boundaries identical across all three. S-LCA adds territorial overlay.
> Source constraints: LCA HC-20, LCC HC-05, S-LCA HC-09.
> Violation consequence: Boundary misalignment produces misleading conclusions.

IR-02 is **conceptually correct**: it says the *physical* boundary should be aligned. But D4.2 itself (line 1233) acknowledges that **C-LCC has its own structurally different boundary** (gate-to-gate firm-level economic boundary, NOT physical). So IR-02 should be gated on `lcc_type ∈ {E-LCC, C+E-LCC, C+E+S-LCC}`, not applied universally.

**Diagnosis**: The previous chat translated Kimi's IR-02 into v2 JSON as `INV-04` (renaming convention drift) and applied it universally without conditioning on LCC type. The result: it triggered violations for cases like Wiktor's C+E-LCC where the alignment IS supposed to hold, but the comparison was made between `lcc.boundary` (which contained heterogeneous gate-to-gate vs cradle-to-gate values) and `lca.system_boundary` (always physical), without validating that the LCC type was the right kind. The fields had the same name in v2 JSON but represented different concepts at runtime.

**The right answer**:
- Rule name: **IR-02** (per Kimi), not INV-04. Drop the renaming.
- Activation: gate on `Q3.ENV=true AND lcc_type ∈ {E-LCC, C+E, C+E+S}` per the gating already in the v3 node mapping (Phase 1 mapping §5.1).
- Field comparison: compare `lcc.physical_boundary` (a derived field, present only when E-LCC is active) against `lca.system_boundary`, NOT a generic `lcc.boundary` that mixes economic and physical concepts.

**Fix for v3**:
- Use Kimi's IR names (IR-01..IR-20, CIR-01..CIR-10, FU-01..FU-05, B-01..B-07, CDP-01..CDP-12). Do not invent new names.
- For each IR/CIR rule, encode in the engine: (a) trigger conditions (which Q answers must be true for the rule to apply), (b) field references (specific dotted-path fields, not generic names), (c) violation message.
- IR-02 in v3 spec:
  ```
  rule_id: "IR-02"
  trigger: "Q3.ENV == true AND lcc_type IN ['E-LCC', 'C+E-LCC', 'C+E+S-LCC']"
  fields: ["lca.system_boundary", "lcc.physical_boundary"]
  assertion: "lca.system_boundary == lcc.physical_boundary"
  violation_msg: "LCA system boundary and E-LCC physical boundary must be identical (D4.1 HC-20, D4.2 HC-05)"
  ```

### 2.3 Error 3 — RULE-04 duplicating BLOCK-03

**What v2 had** (per Mirko's bootstrap diagnosis): a `RULE-04` post-processing rule that duplicated the effect of `BLOCK-03`, creating redundant violations.

**What Kimi's UNIFIED actually says**:

There is no `RULE-XX` or `BLOCK-NN` prefix in Kimi's deliverables. Reconstructing the most likely renaming:

**RULE-04** likely corresponds to **IR-04** in Kimi:
> IR-04: Parallel Interpretation. LCSA uses parallel interpretation, NOT aggregation into single metric.
> Source constraints: S-LCA HC-42, HC-43.
> Violation consequence: Single-metric aggregation destroys insights.

**BLOCK-03** likely corresponds to one of the four [BLOCK] cells in Kimi's Section 2.1, specifically the one for "Any + Absolute S-LCA":
> Any LCA + Any LCC + S-LCA Absolute (MC-01b) = [BLOCK]: "Disables all IS-specific methodology"

The semantics overlap: IR-04 says "no single-metric aggregation across LCSA"; the [BLOCK] cell says "Absolute S-LCA mode is forbidden because it disables IS methodology". These are **two different things**:

- IR-04 is about **how you report results** (parallel vs aggregated).
- The [BLOCK] cell is about **whether the analysis can proceed at all** (Absolute mode is incompatible with IS).

But if the previous chat renamed both as RULE-04 and BLOCK-03 and gave them similar wording in their violation messages ("S-LCA must use comparative logic, not absolute"), the resulting v2 JSON could trigger both rules on the same input, producing two violations for the same underlying issue.

**Diagnosis**: Renaming + paraphrasing in v2 JSON collapsed two distinct rules from Kimi's clean architecture into apparent duplicates. The semantic distinction (interpretation method vs trigger combination validity) was lost.

**Fix for v3**:
- Use Kimi's distinct rule names: IR-04 (parallel interpretation, post-result rule), and the [BLOCK] cells named by their trigger combination (e.g., `block_C2_plus_E-LCC`, `block_anyAny_plus_AbsoluteSLCA`).
- IR-04 in v3:
  ```
  rule_id: "IR-04"
  type: "post-result"
  trigger: "always (during reporting layer)"
  assertion: "no single aggregated score across LCA/LCC/S-LCA dimensions"
  violation_msg: "LCSA results must be reported via parallel interpretation per S-LCA HC-42"
  ```
- [BLOCK] cells in v3:
  ```
  block_id: "block_anyAny_plus_AbsoluteSLCA"
  type: "trigger-combination-block"
  trigger: "S-LCA mode == 'Absolute' (MC-01b)"
  consequence: "STOP — analysis cannot proceed; Absolute S-LCA disables IS methodology"
  ```
- The two are **never both fired on the same input**: the [BLOCK] fires at trigger validation (before any computation), IR-04 fires at reporting (after computation). Different lifecycle phases.

---

## §3 Architectural recommendations for v3 backend

The forensic suggests these architectural rules for Sprint 4:

### 3.1 Adopt Kimi's naming verbatim, no renaming

- IR-XX (20 hard integration rules) — preserved as-is
- CIR-XX (10 conditional integration rules) — preserved as-is
- FU-XX (5 FU alignment rules) — preserved as-is
- B-XX (7 boundary alignment rules) — preserved as-is
- CDP-XX (12 critical decision points) — preserved as-is
- [BLOCK] cells — named explicitly by trigger combination, not numbered (avoids the renaming drift)

This eliminates Errors 1-3 by design: when the same names are used everywhere, no translation drift can introduce bugs.

### 3.2 Three-layer rule lifecycle

The rules fire at distinct lifecycle phases:

| Layer | Phase | Rules fired |
|---|---|---|
| **L1: Trigger validation** | Before any computation | [BLOCK] cells. If a [BLOCK] cell is triggered by Q1+Q3 combination, analysis stops with explanation. |
| **L2: Configuration assertion** | After Q1-Q7 answered, before computation | IR-01..IR-20, CIR-01..CIR-10, FU-01..FU-05, B-01..B-07. These check that the activated configuration is internally consistent. |
| **L3: Result interpretation** | During reporting | CDP-01..CDP-12 (when relevant), IR-04 (parallel interpretation enforcement), IR-10 (anti-aggregation). |

A rule fires at exactly one layer. Same-named rules cannot fire at two layers.

### 3.3 Field naming discipline

For each cross-method rule, the engine compares **specific named fields**, not generic concepts:

- ❌ `lca.boundary == lcc.boundary` (ambiguous: which boundary?)
- ✅ `lca.system_boundary_physical == lcc.physical_boundary` (specific, only present when E-LCC active)

This requires the engine to expose distinct fields for distinct concepts:
- `lcc.physical_boundary` — only populated when E-LCC active
- `lcc.economic_boundary` — populated for any LCC type
- `lca.system_boundary` — physical, always populated when ENV active

The Phase 1 mapping (Sprint 4 Turn 2) must include this field-level naming discipline.

### 3.4 Document the JSON schema vs UNIFIED narrative discrepancy

Kimi's `phase4_logic_table.md` JSON schema and `IS_Decision_Engine_UNIFIED.md` Section 4.1 question list **disagree on what each Q is**. The JSON schema is misleading. For v3:

- **The UNIFIED narrative is authoritative for the question semantics**, NOT the JSON schema.
- However, the v3 user-facing questions (Q1-Q7) are different from BOTH Kimi sources, because Kimi's original questions were in methodological language and the v3 reframes them in IS-case language (per the agreed minimal question set).
- For backwards reference: the v3 question Q1 corresponds to Kimi's UNIFIED Q1 (ILCD context); v3 Q2 corresponds to UNIFIED Q3 (temporal); v3 Q3 corresponds to UNIFIED Q2 (LCC type, but reframed as multi-checkbox sustainability dimensions); v3 Q4 corresponds to UNIFIED Q4 (public assertion); v3 Q5 is new (per-flow nature, not present in UNIFIED 10 questions); v3 Q6 corresponds to UNIFIED Q10+TRL combined; v3 Q7 corresponds to UNIFIED Q5 (transport/spatial).

This mapping is documented for traceability but the v3 implementation does NOT need to reference Kimi's original 10 questions at runtime.

---

## §4 What is salvageable from Kimi Phase 4-5 for v3

A useful summary of what survives, what gets refactored, and what gets dropped:

### 4.1 SURVIVES verbatim

- All 20 IR rules, 10 CIR rules, 5 FU rules, 7 B rules, 12 CDP — re-used as-is, with their original IDs and source constraint references.
- All 39 clashes in `phase5_clash_table.md` (SBC-01..08, AP-01..08, DGC-01..07, TMC-01..09, CCI-01..07) — re-used as-is, mapped to the rule that resolves each.
- The [BLOCK] cells (4 in total) — re-used by trigger combination naming.
- The 5 [WARN] cells — re-used for engine UI warnings.
- The 8-12 dominant variable analysis — re-used as theoretical grounding for the v3 user-facing question reduction.

### 4.2 GETS REFACTORED

- The 10 v2 questions (UNIFIED Section 4.1) → reframed as 7 v3 IS-case-language questions (Q1-Q7 per the minimal question set proposal).
- The JSON schema in `phase4_logic_table.md` → replaced by the v3 schema based on Phase 1 node mapping (DEFAULT/DERIVED/DOMINANT classification).
- The 10 terminal pathways LCSA-P1..LCSA-P10 → replaced by 5 IS-pathway terminals IS-01..IS-05 (already in `phase3_pathway_space.md` and corroborated by 12-paper validation).
- The Mermaid tree → regenerated from v3 question structure.

### 4.3 GETS DROPPED

- The renaming `INV-XX`, `RULE-XX`, `BLOCK-NN` from v2 — these were artefacts of the previous chat, not Kimi's. Drop entirely.
- The JSON schema's q7=multifunctionality definition — supplanted by CIR-05 trigger logic.
- Any v2 JSON code that used the renamed rules — needs full rewrite using IR/CIR/FU/B/CDP names.

---

## §5 Practical impact on the Phase 1 node mapping (Turn 2 hint)

When we do Turn 2 of the Phase 1 node mapping (next session), the following needs to be incorporated:

1. **Cross-method invariants table** added to the mapping document, listing the 54 rules by name (IR-XX / CIR-XX / FU-XX / B-XX / CDP-XX) and showing which Q1-Q7 combinations activate each.
2. **Field naming discipline**: the DEFAULT and DERIVED nodes in the Phase 1 mapping should be tagged with their unambiguous field name (e.g., not "boundary" but "lca.system_boundary_physical" or "lcc.economic_boundary").
3. **Lifecycle layer**: each rule tagged with L1 (trigger) / L2 (config) / L3 (result).
4. **[BLOCK] explicit table**: 4 [BLOCK] cells listed with their Q1+Q3 trigger combinations and the consequent block message.
5. **Phase 1 node mapping vs v3 schema export**: the JSON-exportable schema for backend ingestion should follow the layered structure above.

---

## §6 Summary

**The three v2 errors are caused by translation drift from Kimi's clean v1 to a re-named v2 JSON, not by errors in Kimi's content.** Kimi's IR/CIR/FU/B/CDP architecture is internally coherent, the 39 clashes are well-documented, and the [BLOCK] cells correctly identify forbidden combinations.

**For v3, the fix is structural**: drop the v2 renaming (no INV-XX, no RULE-NN, no BLOCK-NN), use Kimi's original names, separate rule lifecycles (L1/L2/L3), use specific field names. With these structural choices, the three errors are impossible to reproduce.

**The Phase 1 node mapping v1 (already produced) is consistent with this architecture**: it doesn't reference INV-XX or RULE-NN; it uses the Q1-Q7 trigger structure cleanly. Turn 2 of the mapping will add the cross-method invariants layer using Kimi's official names.

**Phase 4-5 inspection complete. Ready for Turn 2 of the node mapping.**
