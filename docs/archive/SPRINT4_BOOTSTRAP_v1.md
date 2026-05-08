# SYMBA T4.6 — Sprint 4 Implementation Bootstrap

**For**: new chat dedicated to Sprint 4 backend + frontend refactor implementation.
**From**: previous "architect chat" that closed the methodological / architectural design.
**Status**: design phase 100% complete, implementation phase 0%.
**Date of handover**: 8 May 2026.

---

## §1 Who I am and what I'm doing

I'm Mirko Busto, T4.6 lead at ENCO for SYMBA project. We're building a web application for Industrial Symbiosis methodological assessment — a tool that helps industrials, in-house LCA experts, and regional policy makers configure the right LCA / LCC / S-LCA combination for their specific IS case.

The previous architect chat (12 May 2026 → 8 May 2026, 2 weeks) closed the methodological design. We have:

- All 186 Phase 1 atomic decision nodes validated against deliverables D4.1 / D4.2 / D4.3
- 7 user-facing questions in IS-case language (not methodological language) — final and frozen
- 12 published IS case studies as validation ground truth
- Complete cross-method rule architecture (54 Kimi rules + 4 BLOCK cells)
- Three-layer rule lifecycle (L1 trigger / L2 config / L3 result) — prevents the v2 errors we had
- Field-level naming discipline — prevents another class of v2 errors
- JSON-exportable schema ready for backend ingestion

**This new chat is for SPRINT 4 IMPLEMENTATION** — actual coding of the backend (Python/FastAPI) and refactoring of the frontend (Sprint 3 → Sprint 4) to support the new question structure.

The previous architect chat is closed. Do not re-debate methodology. Take the methodology as given.

---

## §2 What documents to read first

Critical documents (read in this order, all in `/mnt/project/`):

1. **`PHASE1_NODE_MAPPING_v2.md`** — the **source-of-truth schema** for backend. 186 nodes + 54 cross-method rules + 4 [BLOCK] cells, all field-level tagged, lifecycle-tagged, ready for JSON ingestion. **READ THIS FIRST.**

2. **`SYMBA_T46_Validation_WorkingDoc_v1.md`** — the 12-paper validation ground truth. Contains the configuration matrix, Q1-Q7 compilation table, and best-feature-to-paper mapping. **The 12 papers are the regression test suite for the backend.**

3. **`PHASE4_5_INSPECTION.md`** — diagnoses the 3 errors of v2 JSON (PEF CFF in Q7, INV-04, RULE-04 duplicate of BLOCK-03) and tells you architecturally how to avoid them. **Read this to understand WHY we made certain architectural choices.**

4. **`MINIMAL_QUESTION_SET_PROPOSAL.md`** — full description of Q1-Q7 wording, options, examples, internal mapping logic.

Optional context (read if needed):

- `STRESS_TEST_6_CASI.md` and `STRESS_TEST_ADDENDUM_12_PAPERS.md` — show how the 7 questions were stress-tested against the 12 papers and the gaps that emerged (5 fixes applied to v3).
- `PHASE1_LCA_VALIDATION_REPORT.md`, `PHASE1_LCC_VALIDATION_REPORT.md`, `PHASE1_SLCA_VALIDATION_REPORT.md` — node-by-node validation against deliverables. Use only if you need to verify a specific node.
- `PHASE1_NODE_MAPPING_v1.md` — earlier draft, superseded by v2. Ignore.

Original Kimi deliverables (for reference if backend implementation has questions):

- `phase1_lca_atomic_nodes.md`, `phase1_lcc_atomic_nodes.md`, `phase1_slca_atomic_nodes.md` — original 186 nodes (already validated)
- `phase4_logic_table.md`, `phase4_traceability.md`, `phase4_mermaid_tree.md` — Kimi v1 phase 4 (note: the JSON schema in logic_table is **MISLEADING**, do NOT use it)
- `phase5_clash_table.md` — 39 cross-method clashes (mapped to the 54 rules)
- `IS_Decision_Engine_UNIFIED.md` — Kimi v1 unified engine (use Section 4.1 narrative for question semantics, NOT the JSON schema)
- `D4_1_LCA_Guidelines_WIP.docx`, `D4_2_LCC_Guidelines_V1.docx`, `D4_3_S-LCA_Guidelines_V1.docx` — source guidelines

---

## §3 The 7 user-facing questions (frozen design)

Three-layer architecture:

```
LAYER 1 — Always visible, IS-case language
   Q1 ─ Q2 ─ Q3 ─ Q4 ─ Q5 ─ Q6 ─ Q7

   ☐ Toggle A: "Show reasoning" (Sprint 4 day-1)
   ☐ Toggle B: "Expert mode — methodological language" (Sprint 5+ roadmap)

LAYER 2 — Decision trace (visible if Toggle A ON)
   Engine reasoning: activated nodes, rules, defaults applied

LAYER 3 — Advanced settings (collapsible, default closed)
   ~50 toggles for default override (e.g., LCIA method family,
   discount rate convention, S-LCA framework alternative, etc.)
```

The 7 questions:

| Q | Topic | Type | Notes |
|---|---|---|---|
| Q1 | What are you analyzing? | Single-select 5 options (A-E) | Drives ILCD situation, allocation, FU, boundary |
| Q2 | What phase is the system in? | Single-select 4 options (A-D) | D = baseline + N alternatives — STRUCTURAL data model impact |
| Q3 | Which sustainability dimensions? | Multi-checkbox 3 dims (ENV/ECO/SOC), 7 valid combinations | Activates/deactivates entire blocks (LCA/LCC/S-LCA) |
| Q4 | What is the report for? | Multi-select 5 options (A-E) | C → panel review, D → PEF CFF (CIR-05) |
| Q5 | Nature of each symbiotic flow? | Tabular per N flows, 5 options (a-e) | Iterative per-flow, only mandatory for Q1∈{A,B,D} |
| Q6 | Sector + TRL | 14 sectors + "Other" / 4 TRL bands | Sector overlay (Q6a) is separate layer on Phase 1 |
| Q7 | Geographic spread? | Conditional, 4 options (A-D) | Auto-inferred from site coordinates if available |

Full wording, options, and examples are in `MINIMAL_QUESTION_SET_PROPOSAL.md`.

---

## §4 What Sprint 4 needs to deliver

### 4.1 Backend (Python/FastAPI)

Scope:

1. **Data model** for `case` object supporting:
   - Q1-Q7 answers (with multi-select for Q3/Q4, per-flow tabular for Q5)
   - Q2-D structural support: `baseline_scenario` + N `alternative_scenarios`
   - Site list with geocoordinates (for Q7 auto-inference)
   - Flow list (for Q5 iteration)
   - Advanced overrides dictionary

2. **Decision engine** ingesting:
   - `phase1_nodes.json` (186 nodes per `PHASE1_NODE_MAPPING_v2.md` §9.1 schema)
   - `cross_method_rules.json` (4 blocks + 54 rules per §9.2 schema)
   - `sector_overlays.json` (Q6a-driven, separate file, scaffold-only initially)

3. **Decision engine logic**:
   - L1 [BLOCK] check after Q1-Q3 (and re-check after Q5)
   - Compute derived triggers (T1, TRIG-01, T-01, lcc_type)
   - Activate Phase 1 nodes based on Q1-Q7 answers
   - L2 rule validation (54 rules)
   - Generate `activation_trace` (for Toggle A "show reasoning")
   - Compute terminal pathway (IS-01..IS-05)
   - Pre-compute placeholder for L3 reporting rules (CDP-01..CDP-12)

4. **API endpoints** (FastAPI):
   - POST `/case` — create new case
   - PUT `/case/{id}/answer/{q}` — update one Q answer, recompute, return updated activation
   - GET `/case/{id}/state` — full case state including activated nodes, derived values, validation status
   - GET `/case/{id}/trace` — show-reasoning data for current state
   - GET `/case/{id}/pathway` — terminal IS-XX pathway with explanation
   - POST `/case/{id}/advanced/{node_id}` — apply expert override

5. **Tests**:
   - 12 paper regression test suite per `WorkingDoc §3.1`. Each paper is a fixture `(Q1, Q2, Q3, Q4, Q5_per_flow, Q6, Q7)` with expected `activated_nodes_set`, expected `pathway`, expected `validation_status`.
   - Unit tests for L1 [BLOCK] cells (each of the 4 must fire correctly with proper inputs)
   - Unit tests for each of the 54 rules (each rule's trigger and assertion separately)

Estimated effort: **2-3 weeks full-time**.

### 4.2 Frontend refactor

Current state: Sprint 3 frontend (React) has a basic question form structure but doesn't yet support the v3 design. Repo: `https://github.com/mirkobusto/symba-t46-app`.

Refactor scope:

1. **Q3 multi-checkbox UI** with 3 ENV/ECO/SOC checkboxes + recommended-combinations panel
2. **Q4 multi-select UI** with 5 options + sober warnings for C (panel review) and D (PEF activation)
3. **Q5 tabular UI** for N flows: each row = one flow, 5 options a-e + help-text for option (d) interdependent
4. **Q2-D conditional UI** for "baseline + N alternatives" — needs flow editor to add scenarios
5. **Q7 conditional rendering**: shown only if site coordinates are not loaded; otherwise auto-inferred and shown as info
6. **Toggle A "Show reasoning" panel**: side panel that appears when toggled, showing engine activation trace per question
7. **Advanced settings collapsible**: ~50 toggles grouped by method (LCA / LCC / S-LCA) and topic (allocation, LCIA, discount rate, etc.)
8. **"Show reasoning" trace UI**: nested tree showing which nodes activated, why (which Q triggered them), and current value

Setup notes (from previous chat):
- Mirko's setup: Ubuntu 24, Docker, VSCode
- Browser uses `192.168.1.146` not `localhost` (backend port 8001, frontend port 5174)
- Italian for methodology discussion, English for code/SPECs

Estimated effort: **1-2 weeks full-time**.

### 4.3 End-to-end validation reports (after backend + frontend done)

For each of the 12 papers in `WorkingDoc §3.1`:

1. Load Q1-Q7 from compilation table
2. Run case through full pipeline (backend → activated nodes → terminal pathway)
3. Generate validation report Word .docx (English, structure per `WorkingDoc §6`):
   - Section 1-3: paper bibliographic + methodological config (from WorkingDoc §2)
   - Section 4: Q1-Q7 compilation (from WorkingDoc §3.1 with rationale from §3.2)
   - Section 5: tool's derived configuration (from backend output)
   - Section 6: comparison paper vs tool (match / mismatch / overrides)
   - Section 7: validation verdict
   - Section 8: full node activation list

Output: 12 .docx files at `/deliverables/T46/validation_reports/T46_VR_<short_ref>.docx`.

Estimated effort: **1 week** (largely automated once backend is operational).

---

## §5 Architectural rules to follow

These are non-negotiable. Came from rigorous design work, breaking them = re-introducing v2 errors.

1. **Use Kimi's original rule names** (IR-XX, CIR-XX, FU-XX, B-XX, CDP-XX). Do NOT rename to INV-XX, RULE-XX, BLOCK-NN. Renaming causes drift.

2. **Three-layer lifecycle** (L1 trigger / L2 config / L3 result). A rule fires at exactly one layer. Same rule cannot appear in multiple layers.

3. **Field-level naming**: every rule references specific dotted-path fields (e.g., `lcc.physical_boundary`), not generic concepts (e.g., `lcc.boundary`). The `lcc.physical_boundary` field is **only populated when E-LCC is active**.

4. **Q3 multi-checkbox cascading is strict**: when Q3.ENV=false, ALL 59 LCA nodes deactivate; when Q3.ECO=false, ALL 61 LCC nodes deactivate; when Q3.SOC=false, ALL 66 S-LCA nodes deactivate. Cross-method invariants (IR-01, etc.) only fire when their relevant dimensions intersect.

5. **PEF CFF is CIR-05** (triggered by Q4=D), NOT a Q7 multifunctionality option. Multifunctionality is itself derived from Q1.

6. **Q5 is per-flow**, the only iterative question. Backend maintains `case.flows[*].q5` array. When Q5=e ("aggregated"), the engine treats the case as a single virtual flow.

7. **Q1=D + E-LCC = [BLOCK]**: enforced at L1 trigger validation, before any computation. User must change Q1 or LCC type.

8. **No single-score aggregation across LCSA**: enforced at L3 reporting (IR-04, IR-10). Public disclosure CANNOT show aggregated single score.

---

## §6 Working style notes

- Italian for methodology discussion, English for code/SPECs/comments/commit messages
- Mirko (T4.6 lead) has zero tolerance for superficiality; if Claude is unsure, ask, don't assume
- Concise responses preferred unless full SPEC needed
- Working through implementation iteratively: scaffold first, then test against 12-paper regression, then refine
- When in doubt about a node mapping, defer to `PHASE1_NODE_MAPPING_v2.md` §9 (JSON schema)
- When in doubt about a question semantic, defer to `MINIMAL_QUESTION_SET_PROPOSAL.md`
- When in doubt about a rule semantic, defer to Kimi `IS_Decision_Engine_UNIFIED.md` Section 2.4-2.5 narrative (NOT the misleading JSON schema in `phase4_logic_table.md`)

---

## §7 First moves for the new chat

When the new chat opens, expected first sequence:

1. New chat reads `PHASE1_NODE_MAPPING_v2.md` and `SYMBA_T46_Validation_WorkingDoc_v1.md` to load context
2. New chat acknowledges what it has understood and asks Mirko for the first concrete deliverable
3. Mirko picks: backend scaffold first, OR generate the JSON schema files first, OR something else
4. Implementation begins

Suggested first deliverable from new chat: **scaffold the backend project structure** (FastAPI app, models, services, JSON schema loader), and produce the **two JSON files** (`phase1_nodes.json` + `cross_method_rules.json`) as proper machine-readable artifacts, not just markdown tables. From there, implement the decision engine with progressive testing against the 12 papers.

Repo: `https://github.com/mirkobusto/symba-t46-app`. Work continues there.

---

## §8 Status realistico al passaggio di consegne

- **Methodology design**: 100% complete
- **Architectural design**: 100% complete  
- **Backend implementation**: 0%
- **Frontend refactor**: 0%
- **End-to-end validation reports**: 0%

The implementation phase is what comes next. Expected total: **4-6 weeks of focused work** to get from current state (working docs only) to operational tool with all 12 validation reports generated.

---

*End of bootstrap. New chat starts here.*
