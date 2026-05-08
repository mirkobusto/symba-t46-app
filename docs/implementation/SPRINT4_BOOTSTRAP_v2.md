# SYMBA T4.6 — Sprint 4 Implementation Bootstrap (self-contained)

**This is the entry point for any Sprint 4 implementation work.**

This bootstrap is **self-contained**: it includes everything you need to start coding without reading any other file first. References to other documents are for deeper detail, not blockers.

---

## §0 Read this first

If you are an LLM picking up this work in a new chat:

1. **Do not re-debate methodology**. The methodological and architectural design is closed. Take what's described here as given.
2. **Do not ask me to load files into project knowledge before you can proceed**. This bootstrap is sufficient to start. If a deeper detail is needed, ask for that specific detail, not for "all the design files".
3. **Start by acknowledging what you understood from this bootstrap, then ask me ONE clarifying question (or none) and proceed**. Do not stall.

If something here is unclear, say what's unclear and ask. Do not invent.

---

## §1 Project context (90 seconds)

**Project**: SYMBA Horizon Europe (CL6, bio-based / circular economy). Task 4.6 = "Industrial Symbiosis Methodological Assessment Tool".

**What we're building**: a web app that helps industrial users, in-house LCA experts, and regional policy makers configure the right LCA / LCC / S-LCA methodology for a specific Industrial Symbiosis case. The user answers 7 simple questions in plain industrial language, and the engine derives the full methodological configuration (~186 atomic nodes activated/configured) from those answers.

**Who I am**: Mirko Busto, ENCO, T4.6 lead.

**Repo**: `https://github.com/mirkobusto/symba-t46-app` (already exists, scaffold in place).

**Working environment**: Ubuntu 24 + Docker + VSCode. Browser uses `192.168.1.146` (not localhost). Backend port 8001, frontend port 5174. Italian for methodology discussion in chat, English for code/docstrings/commits/SPECs.

**Current state of repo**: contains the OLD Sprint 1-3 scaffold (FastAPI backend + React frontend) which was built on a flawed v2 JSON decision engine. The v2 errors are documented and the new design replaces them. **The old engine is NOT to be reused as-is** — see §6 for what stays, what gets refactored, what gets dropped.

---

## §2 The history that matters

There were two phases of work before this point:

**Phase 1 (chat 1, Sprints 0-3)**: scaffold built, backend with DecisionEngine class, 51/51 tests passing, 12 REST endpoints, frontend with 4 pages + 9 components. **But** built on `lcsa_decision_engine.v2.json` which had three structural errors (PEF CFF wrongly placed as Q7 multifunctionality option, INV-04 invariant comparing semantically incompatible fields, RULE-04 duplicating BLOCK-03). This is the scaffold currently in repo.

**Phase 2 (chat 2, methodological re-do, May 2026)**: closed the methodological design rigorously. Outputs of chat 2 are:

- All 186 Phase 1 atomic decision nodes (LCA 59 + LCC 61 + S-LCA 66) validated against deliverables D4.1 / D4.2 / D4.3 line-by-line. Zero substantive errors. Zero rework needed on Kimi's Phase 1 work.
- **7 user-facing questions** in IS-case language (replacing the 10 methodological-language questions of v2)
- **5 terminal IS pathways** IS-01..IS-05 (replacing the 10 LCSA-P1..P10 of v2), generated deterministically by Q1×Q2
- **12-paper validation** ground truth (12 published IS case studies, manually compiled to Q1-Q7, verified the 7 questions cover them all)
- **Phase 1 Node Mapping v2**: every node assigned to one of three categories (DEFAULT / DERIVED) with explicit Q-trigger and field-level naming
- **54 cross-method rules** from Kimi's original architecture (IR-01..IR-20, CIR-01..CIR-10, FU-01..FU-05, B-01..B-07, CDP-01..CDP-12) preserved verbatim, mapped to Q1-Q7 triggers
- **4 [BLOCK] cells** identifying forbidden trigger combinations
- **Three-layer rule lifecycle** (L1 trigger validation / L2 configuration assertion / L3 result interpretation) — eliminates the v2 duplication errors structurally

**This bootstrap consolidates the essentials**. The full design documents exist in the repo at `docs/design/` and `docs/implementation/` but you don't need to read them to start. Refer to them only for specific deep-dive questions.

---

## §3 The 7 user-facing questions

These are FROZEN. Do not propose changes. They emerged from a stress test against 12 published cases and have already been refined.

### Q1 — "What are you analyzing?" (single-select, 5 options)

| Opt | Description | Drives to |
|---|---|---|
| A | A specific symbiotic exchange between existing companies | ILCD Situation A, attributional, IS-01 |
| B | An eco-industrial park or multi-actor symbiotic network | ILCD Situation A multi-actor, IS-01 |
| C | A policy / programme / strategic decision at regional/national scale | ILCD Situation B, consequential, IS-02 |
| D | The symbiotic contribution of a single company to its sustainability report | ILCD Situation C2, allocation, IS-03 |
| E | Time monitoring of an already operational symbiosis | ILCD Situation C1, monitoring frame, IS-05 |

Disambiguation hint for ambiguous cases: ask "Who is the SUBJECT of the report?" — if the company → D; if the network → B.

### Q2 — "What phase is the system in?" (single-select, 4 options)

| Opt | Description |
|---|---|
| A | Exists and has been operating for years (real operational data) |
| B | Under construction or recently commissioned |
| C | Only in design phase (no operational data) |
| **D** | **Existing as baseline + assessment of N future alternative scenarios** |

**Q2-D is structurally important**. It triggers a different data model: `baseline_scenario` + N `alternative_scenarios` objects. 9/12 papers in the validation sample exercise this option.

### Q3 — "Which sustainability dimensions to include?" (MULTI-checkbox, 3 dims, 7 valid combinations)

```
☐ Environmental (LCA)
☐ Economic (LCC, MFCA, CBA, TEA)
☐ Social (S-LCA)
```

Default: ENV + ECO (the standard IS-LCSA pattern, 8/12 papers). All 7 combinations of the 3 checkboxes are valid (only "all empty" is forbidden by `block_Q3_emptySelection`). When ECO is selected alone, an automatic sub-choice picks LCC / MFCA / CBA / TEA based on Q1+Q2 (or user can override).

### Q4 — "What is the report for?" (multi-select, 5 options)

| Opt | Description | Activates |
|---|---|---|
| A | Internal use (managerial, R&D, planning) | Standard rigor |
| B | External communication without comparative claims | Layer 1+3 reporting, no panel |
| C | Public claim of environmental superiority | **MANDATORY panel review of 3+ independent experts (ISO 14044)**, no weighting, 3-layer reporting |
| D | EU policy alignment (CSRD, ESPR, PEFCR) | **PEF Circular Footprint Formula activates** (CIR-05) |
| E | Academic peer-reviewed publication | Peer review of journal substitutes panel; full SI mandatory |

Multi-select because some cases combine D+E (e.g., a paper on EU PEF method).

### Q5 — "Nature of each symbiotic flow?" (TABULAR per N flows, 5 options each)

For each main symbiotic flow, the user picks one of:

| Opt | Description | Engine behavior |
|---|---|---|
| a | A pays B (gate fee, disposal) → waste | Step 4 zero-burden; HC-12 avoidability test |
| b | Free exchange (ambiguous) | EVT mandatory + sensitivity (HC-35) |
| c | B pays A (co-product sale) | Step 3 substitution + Q correction |
| d | A modified its process to produce flow for B (interdependent) | **NO zero-burden allowed**; integrated multifunctional remodel |
| e | Aggregated / black-box / no per-flow data | System expansion uniform |

Q5 is the only iterative-per-flow question. Mandatory for Q1 ∈ {A, B, D}. Default to (e) for Q1 ∈ {C, E}.

### Q6 — "Sector + TRL?"

**Q6a (sector)** — single-select among 14 sectors + "Other (specify)":

agriculture / agri-food / biorefineries; bio-based polymers; plastics & packaging; pulp & paper; chemicals / fertilizers; cement / construction; steel & metals; energy / utilities; wastewater / sludge / biofactories; textile / leather; waste valorization (CCP, C&DW, SRF, e-waste); food production; multi-tenant urban building; multi-sector; other.

**Q6b (TRL)** — 4 bands: TRL 9 / TRL 7-8 / TRL 5-6 / TRL <5. Drives scale-up framework activation (CIR-07).

### Q7 — "Geographic spread?" (CONDITIONAL, 4 options)

Shown only if site coordinates are NOT loaded in case data; otherwise auto-inferred and shown as info.

| Opt | Description |
|---|---|
| A | Co-located (eco-park, <5 km) |
| B | Regional (5-100 km) |
| C | Wide-area (>100 km, cross-region or cross-border) |
| D | Multi-scale (national/industry-wide, variable distances) |

---

## §4 Three-layer architecture (CRITICAL)

This is the architectural fix that prevents the v2 RULE-04/BLOCK-03 duplication problem. **Every rule fires at exactly one of three lifecycle layers.**

```
LAYER 1 — TRIGGER VALIDATION
   Fires: after Q1-Q7 collected, before any computation
   What: 4 [BLOCK] cells (forbidden trigger combinations)
   Action on violation: STOP — return error to user

LAYER 2 — CONFIGURATION ASSERTION
   Fires: after L1 passes, before computation begins
   What: 54 cross-method rules (IR-01..20, CIR-01..10, FU-01..05, B-01..07)
   Action on violation: WARN — flag inconsistency, suggest fix

LAYER 3 — RESULT INTERPRETATION
   Fires: during reporting (post-compute)
   What: 12 CDPs + IR-04 (parallel interpretation enforcement) + IR-10 (anti-aggregation)
   Action: enforce parallel reporting; reject single-score export
```

**Invariant**: a single rule appears at exactly one layer. No rule appears at multiple layers. This is the structural defense against duplication.

---

## §5 The four [BLOCK] cells (L1)

These fire BEFORE any computation. If any triggers, the analysis stops.

| Block ID | Trigger condition | User-facing message |
|---|---|---|
| `block_C2_plus_E-LCC` | `q1 == 'D'` AND `lcc_type` includes E-LCC | "Corporate accounting (Q1=D) requires allocation-based LCC. Combination with E-LCC is forbidden by ILCD framework. Either change Q1 to A/B/C/E, or drop E-LCC from your LCC type." |
| `block_anyQ1_plus_AbsoluteSLCA` | `q3.soc == true` AND user explicitly selected "Absolute" S-LCA in advanced | "S-LCA in IS context must be Comparative. Absolute mode disables IS-specific methodology." |
| `block_Q3_emptySelection` | `q3.env == false AND q3.eco == false AND q3.soc == false` | "Select at least one sustainability dimension." |
| `block_Q1A_plus_Q5e` | `q1 == 'A'` AND all flows have `q5 == 'e'` | "A specific exchange cannot be analyzed as fully aggregated. Specify the nature of each flow." |

---

## §6 Repo state and refactor scope

### What stays from existing scaffold

- FastAPI app structure, routers, dependency injection
- React / Vite frontend skeleton, react-router-dom v7, Zustand store
- Docker config, port mapping
- Test framework (pytest backend, vitest frontend)
- ~12 endpoints in concept (paths and HTTP methods can be reused with new payload shapes)

### What gets fully refactored

- The `DecisionEngine` class — completely replaced. Old logic was based on v2 JSON which is invalid.
- The questionnaire frontend — replaced. Old questions were the 10 methodological ones; new questions are Q1-Q7 in IS-case language.
- The case data model — extended for Q2-D `baseline + N alternatives`, Q3 multi-checkbox, Q4 multi-select, Q5 tabular per-flow.
- Test fixtures — the 51 existing tests are mostly obsolete because they tested the v2 logic. Replaced by 12-paper regression suite.

### What is dropped entirely

- `lcsa_decision_engine.v2.json` — the entire file is invalid. Do not reference it.
- The 10 LCSA-P1..P10 terminal pathways from v2 — replaced by 5 IS-01..IS-05.
- The `INV-XX` / `RULE-XX` / `BLOCK-NN` naming convention — these were renaming artifacts of chat 1, not Kimi's original. Use Kimi's verbatim names: IR-XX, CIR-XX, FU-XX, B-XX, CDP-XX, plus block IDs by trigger combination (e.g., `block_C2_plus_E-LCC`).

### Naming discipline (CRITICAL — prevents another v2-like error)

Every field referenced by a rule has a fully-qualified path. Examples:

```
lca.functional_unit
lca.system_boundary_physical
lcc.physical_boundary           # ONLY populated if E-LCC active
lcc.economic_boundary           # always populated when LCC active
lcc.lcc_type                    # 'C-LCC' | 'E-LCC' | 'C+E' | 'C+E+S' | 'S-LCC'
slca.shared_reference_unit      # = lca.functional_unit if Q3.ENV active
slca.territorial_dimension      # mandatory if Q3.SOC active
case.q1                         # 'A'..'E'
case.q3.env                     # boolean
case.flows[*].q5                # per-flow if Q1 ∈ {A, B, D}
case.q5_global                  # if Q1 ∈ {C, E}
```

**Never use generic field names like `boundary` or `cost`.** Generic names are how INV-04 happened — comparing apples to oranges because both were called "boundary".

---

## §7 First Sprint 4 deliverables

In order of priority:

### Step 1 — Generate the JSON schema files

Two files, machine-readable, ingestion-ready:

- `backend/schemas/phase1_nodes.json` — 186 nodes. Each entry: `{id, method, type, source_section, category, trigger_q, trigger_logic, field, default_value, override_path, lifecycle_layer}`.
- `backend/schemas/cross_method_rules.json` — 4 blocks + 54 rules. Each entry: `{id, name, lifecycle_layer, trigger_condition, assertion (or actions for CIR), fields, source_nodes, violation_message}`.

These are derived from the design document `docs/implementation/PHASE1_NODE_MAPPING_v2.md` Section 9 (which has the full content of all 186 nodes and 54 rules in markdown tables; converting to JSON is mechanical).

If `PHASE1_NODE_MAPPING_v2.md` is not in your project knowledge yet, ask Mirko to load it before this step. Do NOT invent the schema content.

### Step 2 — Backend scaffold

`backend/` structure:

```
backend/
├── app/
│   ├── main.py                          # FastAPI app
│   ├── api/
│   │   ├── routes_case.py               # POST /case, PUT /case/{id}/answer/{q}, etc.
│   │   ├── routes_engine.py             # GET /case/{id}/state, /trace, /pathway
│   │   └── routes_advanced.py           # POST /case/{id}/advanced/{node_id}
│   ├── domain/
│   │   ├── models.py                    # Case, Flow, Site, AlternativeScenario (Pydantic)
│   │   ├── enums.py                     # Q1..Q7 valid values, lcc_type values, etc.
│   │   └── case_state.py                # case lifecycle state machine
│   ├── engine/
│   │   ├── loader.py                    # loads phase1_nodes.json + cross_method_rules.json
│   │   ├── triggers.py                  # T1, TRIG-01, T-01, lcc_type derivation
│   │   ├── activation.py                # node activation logic per Q1-Q7
│   │   ├── l1_blocks.py                 # 4 BLOCK cells check
│   │   ├── l2_rules.py                  # 54 rule validation
│   │   ├── l3_reporting.py              # CDP + IR-04 + IR-10 enforcement
│   │   └── pathway.py                   # IS-01..IS-05 derivation
│   ├── schemas/
│   │   ├── phase1_nodes.json
│   │   ├── cross_method_rules.json
│   │   └── sector_overlays.json         # scaffold-only initially (Q6a)
│   └── tests/
│       ├── fixtures/
│       │   └── 12_papers/               # one .json per paper from validation set
│       ├── test_l1_blocks.py
│       ├── test_l2_rules.py             # one test per rule
│       ├── test_activation.py
│       ├── test_pathway.py
│       └── test_12_papers_regression.py # the 12-paper regression suite
└── pyproject.toml
```

### Step 3 — Decision engine implementation (progressive)

Order of implementation, each step tested before moving on:

1. JSON schema loader (validates structure on load)
2. `triggers.py` (T1/TRIG-01/T-01/lcc_type from Q1-Q3) — testable independently
3. `l1_blocks.py` (4 BLOCK checks) — testable with synthetic cases
4. `activation.py` (node activation from Q1-Q7) — testable with synthetic cases
5. `l2_rules.py` (54 rule validation) — testable with synthetic cases per rule
6. `pathway.py` (IS-01..IS-05 from Q1+Q2) — straightforward
7. `l3_reporting.py` — CDP + IR-04 + IR-10 — partial scaffold, full implementation when reporting layer arrives
8. End-to-end: 12-paper regression suite

### Step 4 — Frontend refactor

After backend is functional and 12-paper regression passes:

- Q3 multi-checkbox UI (3 checkboxes ENV/ECO/SOC)
- Q4 multi-select UI (5 options, sober warnings for C and D)
- Q5 tabular UI (one row per flow, 5 options a-e, help-text for option (d))
- Q2-D conditional UI (baseline + N alternatives editor)
- Q7 conditional rendering (auto-inferred from coordinates if available)
- Toggle A "Show reasoning" panel (side panel showing engine activation trace)
- Advanced settings collapsible (~50 toggles for default override)

### Step 5 — End-to-end validation reports

12 Word .docx files, one per paper, English, structure per `WorkingDoc §6`:
- Sections 1-3: paper bibliographic + methodological config (from WorkingDoc §2)
- Section 4: Q1-Q7 compilation (from WorkingDoc §3.1)
- Section 5: tool's derived configuration (from backend output)
- Section 6: comparison paper vs tool
- Section 7: validation verdict
- Section 8: full node activation list

Output at `/deliverables/T46/validation_reports/T46_VR_<short_ref>.docx`.

---

## §8 Quick reference card — the 12 papers (regression test fixtures)

Each is a backend test fixture with expected `(activated_nodes, pathway, validation_status)`.

| # | Paper | Q1 | Q2 | Q3 | Q4 | Q5 | Q6a | Q6b | Q7 | Pathway |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Sokka 2011 (Kymenlaakso FI) | B | D | ENV | E | e | Pulp & paper | 9 | B | IS-01 |
| 2 | Hashimoto 2010 (Kawasaki JP) | B | D | ENV | E | mixed (a/c) | Cement | 9 | B | IS-01 ext |
| 3 | Daddi 2017 (Santa Croce IT) | B | D | ENV | E | mixed (b/c) | Textile/leather | 9 | B | IS-01 ext |
| 4 | Paulu 2022 (Czech Rep.) | C | D | ENV | D + E | e | Waste valorization | 9 | D | IS-02 |
| 5 | Arce Bastias 2023 (Mendoza AR) | B | A | ENV | E | mixed (b/c) | Plastics/packaging | 9 | A | IS-01 |
| 6 | Wiktor 2018 (Malmö SE) | B | D | ENV+ECO | E | mixed (a/c/c) | Wastewater | 7-8 | B | IS-01 ext |
| 7 | Leiva 2025 (ES + SE) | A or B | D | ECO | E | mixed (b/c) | Chemicals/Pulp & paper | 9 / 7-8 | B | IS-01 |
| 8 | Danielsson 2018 (Kalundborg DK) | B | D | ENV+ECO | C | e | Energy/utilities | 9 | B | IS-01 |
| 9 | Kerdlap 2024 (urban fictional) | B | C | ENV+ECO | E | mixed (b/c) | Agri-food | 9 | A | IS-01 |
| 10 | Subramanian 2021 (Chicago US) | B | D | ENV+ECO+SOC | E | mixed (b/c) | Multi-tenant urban | 9 | A | IS-01 ext |
| 11 | Zhu 2013 (TU Delft NL) | A | C | ENV+ECO | E | varies | Generic | 9 | varies | IS-04 |
| 12 | Briassoulis 2023 (EU multi) | C | C | ENV+ECO+SOC | E | mixed (b/c) | Bio-based polymers | 9 | n/a | IS-02 |

For each paper, the expected configuration (activated nodes, derived values, applicable rules) is documented in `WorkingDoc §3` and `PHASE1_NODE_MAPPING_v2.md §3` of the design documents.

---

## §9 Documents available for deeper reference

If you need more detail than this bootstrap provides, ask Mirko to load these specific files into project knowledge. Don't ask for "all the design docs" — ask for the specific one you need.

| Document | Purpose | When to ask for it |
|---|---|---|
| `PHASE1_NODE_MAPPING_v2.md` | Source-of-truth schema for backend (full content of 186 nodes + 54 rules as markdown tables) | When generating phase1_nodes.json and cross_method_rules.json (Step 1) |
| `SYMBA_T46_Validation_WorkingDoc_v1.md` | 12-paper validation ground truth, full Q1-Q7 compilation with rationale, sample limitations, default settings | When building 12-paper regression suite |
| `PHASE4_5_INSPECTION.md` | Forensic of v2 errors and architectural fix rationale | When uncertain about why we made a specific architectural choice |
| `MINIMAL_QUESTION_SET_PROPOSAL.md` | Full Q1-Q7 wording, options, examples, internal logic | When implementing the questionnaire frontend |
| Phase 1 validation reports (3 files: LCA/LCC/SLCA) | Node-by-node validation against deliverables | When verifying a specific node's source attribution |
| Stress test reports (2 files) | Empirical evidence for the 7-question structure | When questioned about why a specific question option exists |

Original Kimi deliverables are in repo at `phase1_*_atomic_nodes.md`, `phase4_*.md`, `phase5_clash_table.md`, `IS_Decision_Engine_UNIFIED.md`. Use only as last-resort verification — the design has already extracted what's needed.

---

## §10 Working style

- I work in Italian for methodology discussion in chat. Code, comments, commits, SPECs are English.
- Be concise. Long responses with elaborate framing waste tokens; I prefer short answers and direct action.
- Don't propose 5 options when 1 is clearly right. Pick the best one and explain your reasoning briefly.
- Use TODO comments and `# fixme:` markers liberally during scaffolding — better to mark unfinished bits explicitly than to fake completeness.
- Test as you go. Don't write 500 lines without running anything.
- Iterative commits, not one giant PR. Each commit should be a working state of one logical chunk.

---

## §11 First message expectation

Your first response in this chat should:

1. Acknowledge what you understood from this bootstrap (1 paragraph max)
2. State whether you have all you need to start Step 1 (generate the two JSON schema files), OR identify the ONE specific document you need loaded into project knowledge to proceed
3. If you can proceed, ask which approach I prefer for Step 1: (a) write a Python parser that extracts the JSON from the markdown design doc, or (b) hand-write the JSON files entry by entry
4. Stop. Wait for my answer. Do not start coding speculatively.

If something in this bootstrap is contradictory or unclear, say what's unclear in one specific question. Do not invent.

---

*End of bootstrap. Implementation starts here.*
