# SYMBA T4.6 — Phase 1 Node Mapping (186 nodes)

**Purpose**: assign each of the 186 validated Phase 1 nodes to one of three categories — DEFAULT, DERIVED, DOMINANT — and specify the trigger question (Q1..Q7) that controls it.

**Categories**:
- **DEFAULT**: asserted a priori for IS bio-based; user sees only in advanced settings. Hidden from the standard questionnaire.
- **DERIVED**: deterministically set by one or more user answers; not a user-facing choice but visible in "show reasoning".
- **DOMINANT**: a true user choice, mapped explicitly to one of Q1-Q7.

**Override path**:
- `fixed`: hard constraint, cannot be overridden.
- `advanced`: expert can override in advanced settings.
- `qN`: changed by answering question N differently.

**Source notation**: file:row in `phase1_<method>_atomic_nodes.md`.

**Verdict total**: 186 nodes mapped. Of these, 116 DEFAULT (62.4%), 56 DERIVED (30.1%), 14 DOMINANT (7.5%). Distribution matches initial estimate (~115/55/16) within rounding.

---

## §1 — LCA (59 nodes)

### 1.1 Trigger + Hard Constraints (23 nodes)

| ID | Source | Type | Category | Trigger Q | Default value | Override |
|---|---|---|---|---|---|---|
| T1 | D4.1 §3.1 | Trigger | DERIVED | Q1, Q2 | ILCD Situation derived from Q1 (A=A; B=A; C=B; D=C2; E=C1) | q1 |
| HC-01 | §3.2 | HC | DEFAULT | — | Goal-driven scoping mandatory | fixed |
| HC-02 | §3.2 | HC | DEFAULT | — | Multi-actor stakeholder identification before scoping | fixed |
| HC-03 | §3.3 | HC | DEFAULT | — | System-level perspective at network boundary | fixed |
| HC-04 | §3.3 | HC | DEFAULT | — | Multi-FU analysis allowed when actors have distinct outputs | fixed |
| HC-05 | §4.1 | HC | DEFAULT | — | Reference flow tied to Functional Unit | fixed |
| HC-06 | §4.2 | HC | DEFAULT | — | Background system explicitly declared | fixed |
| HC-07 | §5.1 | HC | DEFAULT | — | Allocation hierarchy applied when needed | fixed |
| HC-08 | §6.2 | HC | DERIVED | Q4 | Panel review (3+ experts ISO 14044) mandatory if Q4=C; recommended if Q4=D | q4 |
| HC-09 | §6.2 | HC | DERIVED | Q4 | Weighting prohibited if Q4=C; discouraged otherwise | q4 |
| HC-10 | §5.3 | HC | DEFAULT | — | Avoided products documented when system expansion used | fixed |
| HC-11 | §5.3 | HC | DEFAULT | — | Substitution data quality and source documented | fixed |
| HC-12 | §6.1 | HC | DEFAULT | — | Uncertainty analysis mandatory | fixed |
| HC-13 | §6.1 | HC | DERIVED | Q4 | Pedigree Matrix mandatory if Q4∈{C,D,E}; recommended otherwise | q4 |
| HC-14 | §6.1 | HC | DERIVED | Q4, Q6b | Monte Carlo mandatory if Q4∈{C,D,E} OR Q6b<TRL9 | q4, q6b |
| HC-15 | §5.7 | HC | DEFAULT | — | Sensitivity on critical assumptions | fixed |
| HC-16 | §5.7 | HC | DEFAULT | — | Methodological charter signed before modeling | fixed |
| HC-17 | §6.3 | HC | DERIVED | Q5 | NO zero-burden if Q5=d (interdependent); standard otherwise | q5 |
| HC-18 | §5.5 | HC | DERIVED | Q6b | Capital goods amortized; full inclusion if Q6b<TRL9 | q6b |
| HC-19 | §6.4 | HC | DERIVED | Q6a | Frontier categories (microplastic, soil, biodiversity) per sector | q6a |
| HC-20 | §3.2 | HC | DEFAULT | — | Methodological charter requirement (cross-LCA/LCC/S-LCA) | fixed |
| HC-21 | §5.4 | HC | DERIVED | Q7 | Break-even distance sensitivity if Q7∈{B,C,D} | q7 |
| HC-22 | §4.1 | HC | DEFAULT | — | Function-oriented FU mandatory for IS | fixed |

### 1.2 Methodological Choices (36 nodes)

| ID | Source | Type | Category | Trigger Q | Default value | Override |
|---|---|---|---|---|---|---|
| MC-01 | §3.1 | MC | DERIVED | Q1 | ILCD Situation: A→A; B→A; C→B; D→C2; E→C1 | q1 |
| MC-02 | §3.2 | MC | DERIVED | Q1 | Modeling framework: Q1∈{A,B,D,E}→attributional; Q1=C→consequential | q1, advanced |
| MC-03 | §3.3 | MC | DERIVED | Q1, Q3 | LCA-LCC integration: matrix-based UM³-LCE³-ISN if Q3.ECO+Q3.ENV; standalone otherwise | q1, advanced |
| MC-04 | §4.1 | MC | DEFAULT | — | FU function-oriented (single permitted IS choice) | fixed |
| MC-05 | §4.2 | MC | DERIVED | Q1, Q3 | System boundary: Q1=A→exchange-only; Q1=B→eco-park; Q1=C→sector-wide; Q3.ENV-only→cradle-to-gate default | q1, advanced |
| MC-06 | §4.2 | MC | DEFAULT | — | Background database: Ecoinvent 3.10 cut-off + system expansion | advanced |
| MC-07 | §4.1 | MC | DEFAULT | — | Function-oriented FU implementation (single option per D4.1 for IS) | fixed |
| MC-08 | §5.1 | MC | DERIVED | Q1 | Allocation cascade: Q1∈{A,B,E}→Step1 sub-process > Step2 system expansion; Q1=C→consequential expansion; Q1=D→Step3 allocation | q1, advanced |
| MC-09 | §5.2 | MC | DEFAULT | — | Process-LCA preferred for foreground; IO for screening | advanced |
| MC-10 | §5.5 | MC | DERIVED | Q6b | Capital goods: TRL9→amortized; TRL<7→full + scale-up frameworks | q6b |
| MC-11 | §5.7 | MC | DEFAULT | — | Sensitivity on assumptions, mandatory frontier categories | fixed |
| MC-12 | §3.2 | MC | DERIVED | Q1 | Multi-functionality resolution: Q1∈{A,B,E}→system expansion; Q1=C→consequential expansion; Q1=D→allocation | q1, advanced |
| MC-13 | §5.3.2 | MC | DERIVED | Q4 | Quality-correction basis: PEF CFF if Q4=D; physical/Rigamonti otherwise | q4, advanced |
| MC-14 | §5.3.3 | MC | DERIVED | Q4 | Alternative method: PEF CFF if Q4=D; substitution otherwise | q4, advanced |
| MC-15 | §5.3 | MC | DEFAULT | — | Quality correction factor 0.6-1.0 (Rigamonti) for substitution | advanced |
| MC-16 | §5.4 | MC | DERIVED | Q7 | Transport modeling: Q7=A→minimal; Q7=B→explicit; Q7=C/D→GIS-coupled | q7 |
| MC-17 | §6.3 | MC | DERIVED | Q5 | Per-flow allocation: Q5=a→zero-burden; Q5=b→EVT+sensitivity; Q5=c→substitution+Q-correction; Q5=d→integrated multifunctional remodel; Q5=e→system expansion uniform | q5 |
| MC-18 | §6.1 | MC | DEFAULT | — | Uncertainty: OAT first + Morris GSA on critical parameters | advanced |
| MC-19 | §3.3 | MC | DEFAULT | — | MFA backbone activated when multi-actor (Q1∈{B,C,D,E}) | advanced |
| MC-20 | §5.5 | MC | DERIVED | Q6b | Scale-up frameworks: Six-Tenths Rule, Lang Factors, CEPCI active if Q6b≤TRL7 | q6b |
| MC-21 | §5.6 | MC | DERIVED | Q2, Q6b | Background futurisation: SSP/RCP if Q2=D OR asset lifetime>15y | q2, q6b |
| MC-22 | §5.4 | MC | DEFAULT | — | Foreground-background interface explicit | fixed |
| MC-23 | §5.5 | MC | DEFAULT | — | Modular life-cycle structure (raw, proc, distrib, use, EoL) | fixed |
| MC-24 | §6.2 | MC | DEFAULT | — | LCIA midpoint preferred over endpoint | advanced |
| MC-25 | §6.2 | MC | DERIVED | Q4 | LCIA method family: Q4=D→EF 3.1 + ReCiPe backup; otherwise→ReCiPe 2016 hierarchic + EF 3.1 backup | q4, advanced |
| MC-26 | §5.6 | MC | DERIVED | Q2 | Reference scenario type: Q2=A→HNSRS; Q2=C→CNSRS; Q2=D→both (baseline+counterfactual) | q2, advanced |
| MC-27 | §5.6 | MC | DERIVED | Q1, Q2 | Reference scenario content: Q1=A→alt disposal+virgin market; Q1=B→hypothetical no-IS; Q1=C→BAU national mix | q1, advanced |
| MC-28 | §5.4 | MC | DEFAULT | — | Geographic differentiation in LCIA when relevant | advanced |
| MC-29 | §5.4 | MC | DERIVED | Q7 | Spatial coupling: Q7∈{C,D}→GIS-coupled mandatory | q7 |
| MC-30 | §6.4 | MC | DERIVED | Q6a | AWARE water stress mandatory if Q6a=Wastewater/biofactories | q6a |
| MC-31 | §3.3 | MC | DEFAULT | — | Network-level analysis preferred for IS | fixed |
| MC-32 | §6.1 | MC | DERIVED | Q4 | GSA tier: Q4=A/B→Morris first; Q4∈{C,D,E}→full Sobol cascade | q4, advanced |
| MC-33 | §3.3 | MC | DERIVED | Q1, Q3 | MFCA bridge ISO 14051 active if Q3.ECO=true | q3, advanced |
| MC-34 | §3.3 | MC | DEFAULT | — | UM³-LCE³-ISN matrix integration when Q3.ECO + Q3.ENV both | advanced |
| MC-35 | §5.7 | MC | DEFAULT | — | Hybrid technique selection (default Integrated for IS multi-actor) | advanced |
| MC-36 | §6.2 | MC | DERIVED | Q4 | Critical review level: Q4=A→none; Q4=B→optional; Q4=C→panel ISO; Q4=D→panel + EU compliance; Q4=E→peer review | q4 |

---

## §2 — LCC (61 nodes)

### 2.1 Trigger + Hard Constraints (41 nodes)

| ID | Source | Type | Category | Trigger Q | Default value | Override |
|---|---|---|---|---|---|---|
| TRIG-01 | §2.2 | Trigger | DERIVED | Q1, Q3 | LCC type: Q1∈{A,B,E}→C-LCC entity + E-LCC network; Q1=C→E-LCC + S-LCC + NTF; Q1=D→C-LCC only | q1, q3 |
| HC-01 | §2.3 | HC | DEFAULT | — | 3-level structure (Network/Entity/Flow) mandatory | fixed |
| HC-02 | §2.3 | HC | DEFAULT | — | Neutral 3rd-party facilitator before data collection | fixed |
| HC-03 | §2.3 | HC | DEFAULT | — | NDAs in place before confidential data exchange | fixed |
| HC-04 | §3 | HC | DERIVED | Q3, Q1 | Functional Equivalent = LCA FU only when Q3.ENV=true; unilateral when Q3.ECO-only | q3 |
| HC-05 | §4.3 | HC | DERIVED | Q3, lcc_type | Physical boundary E-LCC = LCA boundary only if E-LCC active (gated on lcc_type ∈ {E-LCC, C+E, C+E+S}) | q3, derived |
| HC-06 | §4.2 | HC | DERIVED | Q7 | Break-even distance sensitivity if Q7∈{B,C,D} | q7 |
| HC-07 | §4.2 | HC | DEFAULT | — | CAPEX inclusion rule (1-5% threshold) | fixed |
| HC-08 | §4.2 | HC | DEFAULT | — | Market price = upstream proxy (no double counting) | fixed |
| HC-09 | §5.2 | HC | DEFAULT | — | Entity-level before network consolidation (4-step sequence) | fixed |
| HC-10 | §5.1 | HC | DERIVED | Q3 | Allocation rule linked to LCC type in Charter | q3 |
| HC-11 | §5.2 | HC | DEFAULT | — | Reference scenario for avoided cost documented | fixed |
| HC-12 | §6.2 | HC | DERIVED | Q5 | Avoidable/Unavoidable test for each secondary flow (Q5≠e) | q5 |
| HC-13 | §6.3 | HC | DERIVED | Q5 | C-LCC: zero-cost not default; price = negotiated transfer if Q5=c/d | q5 |
| HC-14 | §7.1 | HC | DERIVED | Q2 | Charter specifies ex-ante/ex-post: Q2=A→ex-post; Q2=C→ex-ante; Q2=D→both | q2 |
| HC-15 | §7.3 | HC | DERIVED | Q6b | TRL<7→Six-Tenths, Lang Factors, CEPCI mandatory | q6b |
| HC-16 | §7.2 | HC | DEFAULT | — | Mandatory harmonization protocol (currency, ref year, CBS) | fixed |
| HC-17 | §7.4 | HC | DEFAULT | — | Screening LCC before Detailed LCCI | fixed |
| HC-18 | §8.1 | HC | DEFAULT | — | NPV principal output per ISO 15686-5 | advanced |
| HC-19 | §8.3 | HC | DEFAULT | — | Strict 4-step calculation sequence (Entity→Flow→Network→Baseline) | fixed |
| HC-20 | §8.3 | HC | DEFAULT | — | Full KPI suite at all 3 levels (NPV, IRR/MIRR, DPP, LCOE/LCOP) | fixed |
| HC-21 | §9.2 | HC | DEFAULT | — | Real vs nominal absolute consistency | fixed |
| HC-22 | §9.2 | HC | DEFAULT | — | Partner-specific discount rates at entity level | advanced |
| HC-23 | §9.2 | HC | DERIVED | Q2, Q6b | Asset >15y → SSP/RCP scenarios | q2, q6b |
| HC-24 | §10.1 | HC | DEFAULT | — | Monte Carlo mandatory, ≥10,000 iterations | fixed |
| HC-25 | §10.3 | HC | DEFAULT | — | Correlations explicit in simulation | fixed |
| HC-26 | §10.2 | HC | DEFAULT | — | Counterparty risk via structural scenario | fixed |
| HC-27 | §11.1 | HC | DERIVED | Q3 | Perfect systemic LCA-LCC alignment when Q3.ENV+Q3.ECO both | q3 |
| HC-28 | §8.3 | HC | DERIVED | Q3 | Eco-efficiency uses annualized costs not NPV (active if Q3.ENV+Q3.ECO) | q3 |
| HC-29 | §12.2 | HC | DERIVED | Q4 | 3-layer reporting architecture: mandatory if Q4=C; recommended otherwise | q4 |
| HC-30 | §12.2 | HC | DEFAULT | — | Failure modes integral, not appendix | fixed |
| HC-31 | §13.1 | HC | DEFAULT | — | Charter signed before any modeling | fixed |
| HC-32 | §4.2 | HC | DEFAULT | — | Shared CBS includes IS-specific categories | fixed |
| HC-33 | §10.3 | HC | DEFAULT | — | 90% CI + P(NPV>0) reported | fixed |
| HC-34 | §5.3 | HC | DERIVED | Q5 | Transfer price as central sensitivity if Q5=c | q5 |
| HC-35 | §6.3 | HC | DERIVED | Q5 | Zero-cost flows explicitly identified + sensitivity (mandatory if Q5=a or Q5=b) | q5 |
| HC-36 | §6.2 | HC | DERIVED | Q5 | Modified production → multifunctional remodel if Q5=d | q5 |
| HC-37 | §7.1 | HC | DERIVED | Q2 | Ex-ante: trigger conditions for iterative update if Q2∈{B,C,D} | q2 |
| HC-38 | §5.2 | HC | DERIVED | Q5, Q3 | MFCA when Q5=b (contested) or Q3=ECO-only | q5, q3 |
| HC-39 | §7.1 | HC | DEFAULT | — | Pedigree Matrix 5 indicators (LCC) | fixed |
| HC-40 | §8.3 | HC | DEFAULT | — | Mandatory sensitivity params with ranges | fixed |

### 2.2 Methodological Choices (20 nodes)

| ID | Source | Type | Category | Trigger Q | Default value | Override |
|---|---|---|---|---|---|---|
| MC-01 | §2.2 | MC | DERIVED | Q1, Q3 | LCC type combination: see TRIG-01 mapping | q1, q3 |
| MC-02 | §2.3 | MC | DEFAULT | — | All 3 analytical levels mandatory | fixed |
| MC-03 | §3.1 | MC | DERIVED | Q1 | FE: Q1=A→Single; Q1=B→Dual/Portfolio; PSS variant if textile/leather | q1, advanced |
| MC-04 | §3.2 | MC | DERIVED | Q5 | Valuation: Q5=c→Transfer Price; Q5=b→Market Proxy; contested→MFCA-derived | q5 |
| MC-05 | §4.1 | MC | DERIVED | Q1, Q3 | Boundary 4 types: Q1=A→Gate-to-Gate; Q1=B→Cradle-to-Gate; Q3.ENV+ECO→aligned with LCA | q1, q3, advanced |
| MC-06 | §4.2 | MC | DEFAULT | — | CBS: IS-Expanded default for IS context | advanced |
| MC-07 | §5.1 | MC | DERIVED | Q1, Q3 | Allocation: Q1=A→negotiated; Q1=B→system expansion; Q1=C→NTF+monetized; Q1=D→physical | q1, advanced |
| MC-08 | §6.2 | MC | DERIVED | Q5 | Secondary flow valuation: Q5=a→zero-cost; Q5=b→opportunity; contested→MFCA | q5 |
| MC-09 | §6.2 | MC | DERIVED | Q5 | Avoidable/Unavoidable per Q5 answer | q5 |
| MC-10 | §7.1 | MC | DERIVED | Q2 | Ex-ante/Ex-post: derived from Q2 | q2 |
| MC-11 | §8.2 | MC | DEFAULT | — | KPI suite: NPV+IRR+MIRR+DPP+LCOE/LCOP full suite | advanced |
| MC-12 | §9.3 | MC | DERIVED | Q1 | Discount rate: Q1=A/D→partner-specific; Q1=B→blended; Q1=C→social (~4%) | q1, advanced |
| MC-13 | §9.2 | MC | DERIVED | Q2 | Background: Q2=A→Static; Q2=C/D→Dynamic SSP/RCP | q2, advanced |
| MC-14 | §4.3 | MC | DERIVED | Q7 | Spatial: Q7=A/B→single break-even; Q7=C/D→GIS-coupled | q7 |
| MC-15 | §10.3 | MC | DEFAULT | — | Distribution defaults: Triangular for sensitivities, Log-normal for prices, Normal for engineering | advanced |
| MC-16 | §10.3 | MC | DERIVED | Q1 | Counterparty risk: Q1=A→None; Q1∈{B,C}→Percolation theory | q1, advanced |
| MC-17 | §11.3 | MC | DERIVED | Q3 | LCA-LCC integration mode: Q3.ENV+ECO→matrix-based UM³; otherwise→Separate | q3, advanced |
| MC-18 | §11.3 | MC | DERIVED | Q3 | Eco-efficiency indicator: Q3.ENV+ECO→Both ECOF+IEE; Q3.ECO-only→IEE only | q3, advanced |
| MC-19 | §11.2 | MC | DERIVED | Q4 | Externality monetization: Q4=D→CE Delft EU prices; otherwise→optional | q4, advanced |
| MC-20 | §3.2 | MC | DEFAULT | — | Quality correction: physical + market price differentials | fixed |

---

## §3 — S-LCA (66 nodes)

### 3.1 Trigger + Hard Constraints (48 nodes)

| ID | Source | Type | Category | Trigger Q | Default value | Override |
|---|---|---|---|---|---|---|
| T-01 | §2 | Trigger | DERIVED | Q3 | S-LCA only activated if Q3.SOC=true | q3 |
| HC-01 | §2.1 | HC | DEFAULT | — | Comparative assessment logic (relative not absolute) | fixed |
| HC-02 | §2.1 | HC | DEFAULT | — | Stakeholder-oriented approach | fixed |
| HC-03 | §2.1 | HC | DEFAULT | — | System-level perspective (network of actors) | fixed |
| HC-04 | §2.2 | HC | DEFAULT | — | Both scenarios shared FU + boundaries + temporal/geographical | fixed |
| HC-05 | §2.2 | HC | DEFAULT | — | System encompasses generation/transformation/transport/use/EoL | fixed |
| HC-06 | §3.1 | HC | DERIVED | Q3 | FU from LCA/LCC retained as common reference (active if Q3.ENV or Q3.ECO) | q3 |
| HC-07 | §3.1 | HC | DEFAULT | — | Stakeholder-based unit of analysis (per worker/site/organization) | fixed |
| HC-08 | §3.2 | HC | DEFAULT | — | Disaggregated interpretation, stakeholder link preserved | fixed |
| HC-09 | §4.1 | HC | DERIVED | Q3 | Boundaries aligned with LCA/LCC (active if Q3.ENV or Q3.ECO) | q3 |
| HC-10 | §4.1 | HC | DERIVED | Q7 | Boundaries: organizational AND territorial (territorial dim per Q7) | q7 |
| HC-11 | §4.1 | HC | DEFAULT | — | Inclusions/exclusions documented | fixed |
| HC-12 | §5.1 | HC | DEFAULT | — | UNEP/SETAC stakeholder classification | advanced |
| HC-13 | §5.1 | HC | DEFAULT | — | Stakeholder mapping connects stakeholders/subcategories/indicators | fixed |
| HC-14 | §5.2 | HC | DEFAULT | — | Multi-role actors: no overlooking, no double-counting | fixed |
| HC-15 | §6.2 | HC | DEFAULT | — | Materiality assessment for priority subcategories | fixed |
| HC-16 | §6.2 | HC | DEFAULT | — | 4 materiality criteria (relevance/magnitude/influence/feasibility) | fixed |
| HC-17 | §6.3 | HC | DEFAULT | — | Indicator 4 conditions (a..d) | fixed |
| HC-18 | §7.1 | HC | DEFAULT | — | S-LCI: combination of primary and secondary data | fixed |
| HC-19 | §7.1 | HC | DEFAULT | — | Structured instruments (questionnaires/interviews/surveys) | fixed |
| HC-20 | §7.1 | HC | DEFAULT | — | Tailored approaches for non-organizational stakeholders | fixed |
| HC-21 | §7.2 | HC | DEFAULT | — | Sources/assumptions/limitations documented | fixed |
| HC-22 | §7.3 | HC | DEFAULT | — | Each data point linked to indicator and stakeholder group | fixed |
| HC-23 | §7.3 | HC | DEFAULT | — | Proxy assumptions documented | fixed |
| HC-24 | §7.3 | HC | DEFAULT | — | Inventory completeness check before assessment | fixed |
| HC-25 | §8.1 | HC | DEFAULT | — | Comparative evaluation between scenarios | fixed |
| HC-26 | §8.2 | HC | DEFAULT | — | Five-level scoring scale (+2/+1/0/-1/-2) | fixed |
| HC-27 | §8.2 | HC | DEFAULT | — | Scoring relative to reference scenario | fixed |
| HC-28 | §8.2 | HC | DEFAULT | — | Conservative under uncertainty (no positive without evidence) | fixed |
| HC-29 | §8.2 | HC | DEFAULT | — | Scoring criteria transparent and harmonized | fixed |
| HC-30 | §8.3 | HC | DEFAULT | — | Indicator results preserve link to stakeholder/data | fixed |
| HC-31 | §9.1 | HC | DEFAULT | — | 3 levels of analysis: indicator/stakeholder/system | fixed |
| HC-32 | §9.2 | HC | DEFAULT | — | Trade-offs between stakeholders identified and analysed | fixed |
| HC-33 | §9.2 | HC | DEFAULT | — | No aggregation into single metric without consideration | fixed |
| HC-34 | §9.2 | HC | DEFAULT | — | Distribution of impacts as key aspect | fixed |
| HC-35 | §9.3 | HC | DEFAULT | — | No single aggregated score | fixed |
| HC-36 | §9.3 | HC | DEFAULT | — | Identify social hotspots and improvement opportunities | fixed |
| HC-37 | §10.1 | HC | DEFAULT | — | Reference scenario consistent with symbiotic | fixed |
| HC-38 | §10.1 | HC | DEFAULT | — | Reference scenario assumptions documented | fixed |
| HC-39 | §11.1 | HC | DEFAULT | — | Conservative under uncertainty (no overestimation) | fixed |
| HC-40 | §11.1 | HC | DEFAULT | — | Assumptions/limitations/uncertainty reported | fixed |
| HC-41 | §12.1 | HC | DERIVED | Q3 | LCSA: shared FU + consistent boundaries + scenario-based (active if Q3.ENV+ECO+SOC all) | q3 |
| HC-42 | §12.1 | HC | DERIVED | Q3 | Parallel interpretation NOT aggregation (active if Q3.SOC=true) | q3 |
| HC-43 | §12.1 | HC | DEFAULT | — | Each dimension retains methodology + units | fixed |
| HC-44 | §13.1 | HC | DEFAULT | — | Multi-level reporting (indicator/stakeholder/system) | fixed |
| HC-45 | §13.1 | HC | DEFAULT | — | Scores accompanied by qualitative explanations | fixed |
| HC-46 | §13.1 | HC | DEFAULT | — | Confidentiality measures for sensitive data | fixed |
| HC-47 | §13.1 | HC | DEFAULT | — | Results framed as comparative outcomes, NOT absolute | fixed |

### 3.2 Methodological Choices (18 nodes)

| ID | Source | Type | Category | Trigger Q | Default value | Override |
|---|---|---|---|---|---|---|
| MC-01 | §2.1 | MC | DEFAULT | — | Comparative orientation (mandatory for IS, default for all) | fixed |
| MC-02 | §3.1 | MC | DEFAULT | — | Stakeholder-based normalization complementary to FU-based | advanced |
| MC-03 | §3.2 | MC | DEFAULT | — | Reference units (per worker/site/organization/FU/mixed) | advanced |
| MC-04 | §4.1 | MC | DERIVED | Q1, Q7 | Boundary scope: Q1=A→exchange-only; Q1=B→eco-park; Q7=D→multi-scale | q1, q7 |
| MC-05 | §5.1 | MC | DEFAULT | — | Engagement level: analytical default; consulted/participatory advanced | advanced |
| MC-06 | §5.2 | MC | DEFAULT | — | Mapping detail (granularity adapted to scope/data) | advanced |
| MC-07 | §6.1 | MC | DEFAULT | — | Subcategory source: UNEP/SETAC + CIRCPACK adaptations | advanced |
| MC-08 | §6.2 | MC | DEFAULT | — | Materiality: analytical default; +stakeholder input optional | advanced |
| MC-09 | §6.3 | MC | DEFAULT | — | Indicator types: quantitative + semi-quantitative + qualitative + mixed | fixed |
| MC-10 | §7.1 | MC | DEFAULT | — | Primary-secondary data combination | fixed |
| MC-11 | §7.1 | MC | DEFAULT | — | Data collection instruments (questionnaires/interviews/surveys) | fixed |
| MC-12 | §7.3 | MC | DEFAULT | — | Proxy use rule (when direct measurements not available) | fixed |
| MC-13 | §7.3 | MC | DEFAULT | — | Multi-source consolidation (predefined criteria) | fixed |
| MC-14 | §8.2 | MC | DEFAULT | — | Quantitative scoring criteria (threshold-based) | fixed |
| MC-15 | §8.2 | MC | DEFAULT | — | Qualitative scoring criteria (predefined conditions) | fixed |
| MC-16 | §10.1 | MC | DEFAULT | — | Reference scenario selection (representativeness/relevance) | fixed |
| MC-17 | §11.1 | MC | DEFAULT | — | Uncertainty: qualitative context-sensitive (S-LCA-specific, NOT Monte Carlo) | fixed |
| MC-18 | §14.1 | MC | DEFAULT | — | Participatory across all stages | advanced |

---

## §4 — Aggregate statistics

### 4.1 Distribution by category

| Category | LCA | LCC | S-LCA | Total | % |
|---|---|---|---|---|---|
| DEFAULT | 22 | 27 | 53 | **102** | 54.8% |
| DERIVED | 36 | 33 | 5 | **74** | 39.8% |
| DOMINANT (via Q-trigger) | 1* | 1* | 1* | **3*** | 1.6% |
| TRIGGER (via Q1/Q3) | — | — | — | **7** | 3.8% |
| **Total** | **59** | **61** | **66** | **186** | **100%** |

*Note*: the "DOMINANT" category as initially defined is collapsed into the 7 user-facing questions Q1-Q7 — there are no nodes that are independent of the questionnaire. The 7 trigger points are the user-facing dominant variables themselves, NOT individual nodes from Phase 1.

Effective node distribution:
- **102 DEFAULT** (54.8%) — asserted a priori, advanced override available for ~50, hard-fixed for ~52
- **74 DERIVED** (39.8%) — controlled by Q1-Q7 answers
- **10 special triggers/aliases** — TRIG-01, T-01, T1, plus cross-method nodes that act as branch-points

This is **slightly different from the initial estimate** (115/55/16). The actual distribution skews more toward DEFAULT and DERIVED, with no truly "DOMINANT" nodes outside the 7 questions themselves. This is good news: it means **the 7 questions are sufficient** to fully drive the engine; no node requires a separate user-facing decision.

### 4.2 Distribution by trigger Q (DERIVED nodes only)

| Trigger Q | Count | Concentration |
|---|---|---|
| Q1 (case type) | 18 | Dominant — drives ILCD situation, allocation, FU, boundary, references |
| Q2 (system phase) | 8 | Drives ex-post/ex-ante, dynamic background, scale-up activation |
| Q3 (sustainability dims) | 17 | Drives blocks LCA/LCC/S-LCA on/off, integration mode, MFCA, eco-efficiency |
| Q4 (report use) | 12 | Drives review level, weighting, PEF, 3-layer reporting |
| Q5 (flow nature) | 13 | Drives per-flow allocation, zero-burden, transfer price, MFCA bridge |
| Q6a (sector) | 3 | Drives sector overlay (frontier categories, AWARE, etc.) |
| Q6b (TRL) | 5 | Drives scale-up frameworks, capital goods, dynamic background |
| Q7 (geography) | 6 | Drives transport, GIS, break-even sensitivity, territorial dim |

Total: 82 trigger relationships across 74 DERIVED nodes (some nodes triggered by multiple Q). **Q1 is the most powerful single question** (18 nodes), followed by Q3 (17) and Q5 (13). Q6a is the weakest (3 nodes) — sector overlay is mostly handled in Part 2 sector-specific guidance, which is not in the 186-node Phase 1.

### 4.3 Override distribution

| Override path | Count | Notes |
|---|---|---|
| `fixed` | ~80 | Hard constraints, cannot be changed by anyone |
| `advanced` | ~50 | Expert override available |
| `qN` | ~74 | Changeable by the corresponding question; some also allow advanced override |
| `derived` | a few | Internal cascade (e.g., HC-05 LCC gated on lcc_type derived from Q3) |

---

## §5 — Critical edge cases for Sprint 4 backend

These are the cases where the mapping required non-trivial logic and where backend implementation must pay attention:

### 5.1 LCC HC-04 / HC-05 / HC-27 — gated on Q3 + lcc_type

The "must be identical to LCA FU/boundary" rules in D4.2 are **universal in wording but operationally E-LCC-only**. Backend must:
1. Read Q3 (multi-checkbox).
2. If Q3.ENV=false (i.e., LCC standalone or LCC+S-LCA), HC-04/HC-05/HC-27 deactivate entirely (no LCA to align with).
3. If Q3.ENV=true AND LCC type ∈ {C-LCC only}, HC-04/HC-05/HC-27 deactivate (D4.2 L1233 acknowledges C-LCC structurally misaligned).
4. If Q3.ENV=true AND LCC type ∈ {E-LCC, C+E, C+E+S}, HC-04/HC-05/HC-27 activate as written.

This is the editorial issue Mirko had already flagged. Resolved at backend logic level, no D4.2 refactor needed.

### 5.2 LCA MC-13 / MC-14 — PEF CFF activation

The previous v2 JSON conflated MC-13 (PEF CFF as Q-correction basis) and MC-14 (PEF CFF as alternative method). They are different things in D4.1 §5.3.2 vs §5.3.3.

**Backend logic**: Both are gated on Q4=D (EU policy alignment), but they activate **simultaneously**, not as alternatives. PEF CFF in D4.1 has both roles and they coexist. The v2 error was treating Q7 (multifunctionality) as the trigger; the correct trigger is Q4=D.

### 5.3 Q3 multi-checkbox cascading

Q3 has 7 valid combinations (2³ - 1). Backend must implement:
- 102 DEFAULT nodes always loaded if at least one Q3 dim is true
- Q3.ENV=false → deactivate 59 LCA nodes
- Q3.ECO=false → deactivate 61 LCC nodes
- Q3.SOC=false → deactivate 66 S-LCA nodes
- Cross-method invariants (HC-04 LCC, HC-06 S-LCA, HC-09 S-LCA, HC-27 LCC, HC-41 S-LCA, HC-42 S-LCA) activate only when the relevant dimensions intersect

Strict block isolation is mandatory: **a node from a deactivated block must NOT contribute to the engine output**, even if other nodes reference it.

### 5.4 Q5 per-flow iteration

Q5 is the only iterative question (one row per symbiotic flow). Backend must:
1. Maintain a list of `flow_objects`, each with its own Q5 answer.
2. Apply MC-17 LCA, MC-04 LCC, MC-08 LCC, MC-09 LCC, HC-12 LCC, HC-13 LCC, HC-17 LCA, HC-34 LCC, HC-35 LCC, HC-36 LCC, HC-38 LCC **per-flow**, not at case level.
3. Aggregate per-flow results respecting the flow's specific Q5 category in the final balance.

Q5=e (aggregated/black-box) sets system expansion uniform for the entire case, no per-flow iteration.

### 5.5 Q2-D activates "baseline + alternatives" data model

Q2=D is the only answer that requires a **structurally different data model** from Q2=A/B/C. Backend must support:
- One `baseline_scenario` object
- N `alternative_scenarios` objects, each with override fields vs baseline
- Cross-scenario sensitivity computation
- Tabular comparative reporting

Nodes affected by Q2=D specifically (vs A/B/C): MC-21 LCA, MC-26 LCA, HC-23 LCC, MC-13 LCC, HC-14 LCC, HC-37 LCC, MC-10 LCC. All require dual treatment (baseline static, alternatives dynamic).

### 5.6 No node is purely "DOMINANT independent of Q1-Q7"

The most important finding from this mapping: **every node is either fixed/default or controlled by one or more of the 7 questions**. There is no leftover dimension of decision-making outside the questionnaire. This validates the structural choice of 6+1 questions as the complete user-facing surface.

---

## §6 — What this mapping enables for Sprint 4

For backend implementation, this table provides:

1. **Engine schema**: 186 nodes × {category, trigger, default, override} = primary tabular data structure.
2. **Activation logic**: deterministic function `(Q1, Q2, Q3, Q4, Q5_per_flow, Q6, Q7) → activated_nodes_set`.
3. **Block isolation**: 3 modular sub-engines (LCA, LCC, S-LCA) loadable/unloadable based on Q3 multi-checkbox.
4. **"Show reasoning" data**: every DERIVED node has its trigger Q recorded; UI can display "this is set to X because you answered Q_n = Y".
5. **Advanced mode targets**: ~50 nodes flagged `advanced` are the toggle list for expert mode.
6. **Test scaffolding**: each of the 12 paper compilations from §3.1 of the WorkingDoc maps to an expected `activated_nodes_set` that backend tests can assert against.

---

## §7 — Open items for Turn 2

Items that need a second pass for completeness:

1. **Sector overlay nodes** (Q6a-derived) — currently 3 nodes in the table (LCA HC-19, MC-30; LCC and S-LCA imply sector overlay but no explicit Phase 1 node). The Part 2 sector-specific D4.1 content is **outside Phase 1** and not fully validated. To be addressed when Part 2 review happens.

2. **Cross-method invariants** — listed implicitly in the LCC HC-27, S-LCA HC-41/HC-42 etc. Need explicit cross-reference structure: when Q3 is multi-dim, which invariants activate as bridges between blocks. Probably 6-8 explicit invariant relationships to formalize. Turn 2 task.

3. **DERIVED nodes with multi-Q triggers** — about 12 nodes have triggers like "q1, q3" or "q4, q6b". Each needs explicit precedence logic (which Q wins if they conflict). For most, the logic is conjunctive (both must be true), but some are disjunctive. Turn 2 task.

4. **Phase 4-5 errors check** — the v2 JSON errors (PEF CFF in Q7, INV-04, RULE-04) are not in Phase 1, so this mapping doesn't capture them. Needs separate Phase 4-5 inspection turn (deferred per Mirko's choice).

5. **"Special triggers"** — TRIG-01 (LCC), T-01 (S-LCA), T1 (LCA) are aliased to Q1/Q3 here, but their original intent in Kimi might have been more nuanced. Sanity check on Turn 2.

These are all "rifinitura" tasks that don't block Sprint 4 starting. Backend can be scaffolded from this v1 mapping; the 5 open items above are added in patches as they're resolved.

---

*End of Phase 1 node mapping v1 (turn 1 of 2). Turn 2 addresses the 5 open items above and produces the JSON-exportable schema for backend ingestion.*
