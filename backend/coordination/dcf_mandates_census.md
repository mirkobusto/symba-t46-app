# DCF Section 5.5 — Procedural Mandate census

**Generated:** 2026-05-22 — first pass for DCF spec v1, §5.5.
**Source:** `backend/app/schemas/phase1_nodes.json` (90 nodes with `field_status=procedural_mandate`).
**Method:** keyword match on `default_value` (statement).

**Status:** DRAFT — review by Mirko required to finalize boundaries between categories. See `dcf_mandates_census.json` for full machine-readable data including overlapping categories.

## Distribution

| Category | Count |
|---|---:|
| `data_sources_quality` | 15 |
| `allocation_substitution` | 4 |
| `reference_scenario` | 8 |
| `goal_scope_boundary` | 16 |
| `stakeholder_materiality` | 17 |
| `uncertainty_sensitivity` | 13 |
| `reporting_disclosure` | 5 |
| `lcc_method_specific` | 7 |
| `lcsa_integration` | 5 |
| **TOTAL** | **90** |

## § data_sources_quality (15)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lca_hc_11` | LCA | L2 | — | Substitution data quality and source documented |
| `lca_mc_22` | LCA | L2 | — | Foreground-background interface explicit |
| `lcc_hc_39` | LCC | L2 | — | Pedigree Matrix 5 indicators (LCC) |
| `slca_hc_18` | SLCA | L2 | — | S-LCI: combination of primary and secondary data |
| `slca_hc_19` | SLCA | L2 | — | Structured instruments (questionnaires/interviews/surveys) |
| `slca_hc_22` | SLCA | L2 | — | Each data point linked to indicator and stakeholder group |
| `slca_hc_24` | SLCA | L2 | — | Inventory completeness check before assessment |
| `slca_hc_29` | SLCA | L2 | — | Scoring criteria transparent and harmonized |
| `slca_hc_46` | SLCA | L2 | — | Confidentiality measures for sensitive data |
| `slca_mc_10` | SLCA | L2 | — | Primary-secondary data combination |
| `slca_mc_11` | SLCA | L2 | — | Data collection instruments (questionnaires/interviews/surveys) |
| `slca_mc_12` | SLCA | L2 | — | Proxy use rule (when direct measurements not available) |
| `slca_mc_13` | SLCA | L2 | — | Multi-source consolidation (predefined criteria) |
| `slca_mc_14` | SLCA | L2 | — | Quantitative scoring criteria (threshold-based) |
| `slca_mc_15` | SLCA | L2 | — | Qualitative scoring criteria (predefined conditions) |

## § allocation_substitution (4)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lca_hc_07` | LCA | L2 | — | Allocation hierarchy applied when needed |
| `lca_hc_10` | LCA | L2 | — | Avoided products documented when system expansion used |
| `lca_hc_17` | LCA | L2 | q5 | NO zero-burden allowed (interdependent) \| Standard zero-burden test |
| `lcc_mc_09` | LCC | L2 | q5 | zero-burden \| EVT \| substitution \| interdependent multifunctional \| uniform |

## § reference_scenario (8)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lca_hc_05` | LCA | L2 | — | Reference flow tied to Functional Unit |
| `lcc_hc_11` | LCC | L2 | — | Reference scenario for avoided cost documented |
| `slca_hc_25` | SLCA | L2 | — | Comparative evaluation between scenarios |
| `slca_hc_27` | SLCA | L2 | — | Scoring relative to reference scenario |
| `slca_hc_37` | SLCA | L2 | — | Reference scenario consistent with symbiotic |
| `slca_hc_38` | SLCA | L2 | — | Reference scenario assumptions documented |
| `slca_mc_01` | SLCA | L2 | — | Comparative orientation (mandatory for IS, default for all) |
| `slca_mc_16` | SLCA | L2 | — | Reference scenario selection (representativeness/relevance) |

## § goal_scope_boundary (16)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lca_hc_01` | LCA | L2 | — | Goal-driven scoping mandatory |
| `lca_hc_02` | LCA | L2 | — | Multi-actor stakeholder identification before scoping |
| `lca_hc_03` | LCA | L2 | — | System-level perspective at network boundary |
| `lca_hc_04` | LCA | L2 | — | Multi-FU analysis allowed when actors have distinct outputs |
| `lca_hc_06` | LCA | L2 | — | Background system explicitly declared |
| `lca_hc_19` | LCA | L2 | q6a | Frontier categories (microplastic, soil, biodiversity) per sector overlay |
| `lca_mc_11` | LCA | L2 | — | Sensitivity on assumptions, mandatory frontier categories |
| `lca_mc_23` | LCA | L2 | — | Modular life-cycle structure (raw, proc, distrib, use, EoL) |
| `lca_mc_28` | LCA | L2 | — | Geographic differentiation in LCIA when relevant |
| `lca_mc_31` | LCA | L2 | — | Network-level analysis preferred for IS |
| `lcc_hc_01` | LCC | L2 | — | 3-level structure (Network/Entity/Flow) mandatory |
| `lcc_mc_02` | LCC | L2 | — | All 3 analytical levels mandatory |
| `slca_hc_03` | SLCA | L2 | — | System-level perspective (network of actors) |
| `slca_hc_04` | SLCA | L2 | — | Both scenarios shared FU + boundaries + temporal/geographical |
| `slca_hc_05` | SLCA | L2 | — | System encompasses generation/transformation/transport/use/EoL |
| `slca_hc_41` | SLCA | L2 | q3 | LCSA: shared FU + consistent boundaries + scenario-based |

## § stakeholder_materiality (17)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `slca_hc_02` | SLCA | L2 | — | Stakeholder-oriented approach |
| `slca_hc_08` | SLCA | L2 | — | Disaggregated interpretation, stakeholder link preserved |
| `slca_hc_13` | SLCA | L2 | — | Stakeholder mapping connects stakeholders/subcategories/indicators |
| `slca_hc_14` | SLCA | L2 | — | Multi-role actors: no overlooking, no double-counting |
| `slca_hc_15` | SLCA | L2 | — | Materiality assessment for priority subcategories |
| `slca_hc_16` | SLCA | L2 | — | 4 materiality criteria (relevance/magnitude/influence/feasibility) |
| `slca_hc_17` | SLCA | L2 | — | Indicator 4 conditions (a..d) |
| `slca_hc_20` | SLCA | L2 | — | Tailored approaches for non-organizational stakeholders |
| `slca_hc_30` | SLCA | L2 | — | Indicator results preserve link to stakeholder/data |
| `slca_hc_31` | SLCA | L2 | — | 3 levels of analysis: indicator/stakeholder/system |
| `slca_hc_32` | SLCA | L2 | — | Trade-offs between stakeholders identified and analysed |
| `slca_hc_34` | SLCA | L2 | — | Distribution of impacts as key aspect |
| `slca_hc_36` | SLCA | L2 | — | Identify social hotspots and improvement opportunities |
| `slca_hc_44` | SLCA | L2 | — | Multi-level reporting (indicator/stakeholder/system) |
| `slca_mc_02` | SLCA | L2 | — | Stakeholder-based normalization complementary to FU-based |
| `slca_mc_06` | SLCA | L2 | — | Mapping detail (granularity adapted to scope/data) |
| `slca_mc_08` | SLCA | L2 | — | Materiality: analytical default; +stakeholder input optional |

## § uncertainty_sensitivity (13)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lca_hc_12` | LCA | L2 | — | Uncertainty analysis mandatory |
| `lca_hc_14` | LCA | L2 | q4, q6b | Monte Carlo mandatory if Q4 in {C,D,E} OR Q6b<TRL9 |
| `lca_hc_15` | LCA | L2 | — | Sensitivity on critical assumptions |
| `lca_hc_21` | LCA | L2 | q7 | Break-even distance sensitivity if Q7 in {B,C,D} |
| `lcc_hc_24` | LCC | L2 | — | Monte Carlo mandatory, >=10,000 iterations |
| `lcc_hc_25` | LCC | L2 | — | Correlations explicit in simulation |
| `lcc_hc_26` | LCC | L2 | — | Counterparty risk via structural scenario |
| `lcc_hc_34` | LCC | L2 | q5 | Transfer price as central sensitivity if Q5=c |
| `lcc_hc_35` | LCC | L2 | q5 | Zero-cost flows explicitly identified + sensitivity (mandatory if Q5 in {a,b}) |
| `lcc_hc_40` | LCC | L2 | — | Mandatory sensitivity params with ranges |
| `slca_hc_28` | SLCA | L2 | — | Conservative under uncertainty (no positive without evidence) |
| `slca_hc_39` | SLCA | L2 | — | Conservative under uncertainty (no overestimation) |
| `slca_hc_40` | SLCA | L2 | — | Assumptions/limitations/uncertainty reported |

## § reporting_disclosure (5)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lcc_hc_33` | LCC | L2 | — | 90% CI + P(NPV>0) reported |
| `slca_hc_21` | SLCA | L2 | — | Sources/assumptions/limitations documented |
| `slca_hc_23` | SLCA | L2 | — | Proxy assumptions documented |
| `slca_hc_45` | SLCA | L2 | — | Scores accompanied by qualitative explanations |
| `slca_hc_47` | SLCA | L2 | — | Results framed as comparative outcomes, NOT absolute |

## § lcc_method_specific (7)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lcc_hc_08` | LCC | L2 | — | Market price = upstream proxy (no double counting) |
| `lcc_hc_09` | LCC | L2 | — | Entity-level before network consolidation (4-step sequence) |
| `lcc_hc_16` | LCC | L2 | — | Mandatory harmonization protocol (currency, ref year, CBS) |
| `lcc_hc_17` | LCC | L2 | — | Screening LCC before Detailed LCCI |
| `lcc_hc_19` | LCC | L2 | — | Strict 4-step calculation sequence (Entity->Flow->Network->Baseline) |
| `lcc_hc_36` | LCC | L2 | q5 | Modified production -> multifunctional remodel if Q5=d |
| `lcc_hc_38` | LCC | L2 | q5, q3 | MFCA when Q5=b (contested) or Q3=ECO-only |

## § lcsa_integration (5)

| ID | Method | Layer | Trigger | Statement |
|---|---|---|---|---|
| `lca_hc_20` | LCA | L2 | — | Methodological charter requirement (cross-LCA/LCC/S-LCA) |
| `lca_mc_34` | LCA | L2 | — | UM³-LCE³-ISN matrix integration when Q3.ECO + Q3.ENV both |
| `lcc_hc_27` | LCC | L2 | q3 | Perfect systemic LCA-LCC alignment when Q3.ENV+Q3.ECO both |
| `slca_hc_42` | SLCA | L2 | q3 | Parallel interpretation NOT aggregation |
| `slca_hc_43` | SLCA | L2 | — | Each dimension retains methodology + units |
