# SYMBA T4.6 — Validation Working Document

**Industrial Symbiosis Methodological Assessment Tool**
Internal working document — not the final validation report
Date: 8 May 2026
Version: 1.0

---

## 1. Purpose and scope

This working document consolidates the empirical ground truth used to validate the SYMBA Task 4.6 Industrial Symbiosis (IS) Methodological Assessment Tool. It is an internal working artefact, not the final validation report. The final per-paper validation reports (one per case study, as Word .docx with full Sections 1-8 structure) will be produced after Sprint 4 backend is operational and the cases can be executed end-to-end through the tool.

This document captures information that exists today only in the working dialogue and risks being lost if not formalised. It serves three concrete purposes:

- Anchor the twelve case studies' methodological configuration as ground truth, so that subsequent backend testing has a fixed reference.
- Record how each of the seven user-facing questions (Q1-Q7) was compiled for each paper during the stress-test, with the rationale for each answer.
- Document the known sample limitations and the empirical mapping from each paper to one of the five terminal IS pathways (IS-01..IS-05).

This document does NOT contain: the per-paper full validation report (deferred to post-Sprint-4); numerical replication of paper results (out of scope by design); the decision engine source code or backend implementation (in repository).

### 1.1 Twelve case studies — provenance

The twelve papers were compiled by the SYMBA T4.6 lead from two technical synthesis documents (`Schede_Tecniche_LCA_LCC_Industrial_Symbiosis.md` and `Schede_LCC_TEA_SLCA_Industrial_Symbiosis.md`), prepared as replication-ready summaries of published peer-reviewed Industrial Symbiosis assessments. Six papers focus primarily on environmental assessment (LCA), six papers focus on economic and combined assessments (LCC, TEA, SLCA, full LCSA). The combined sample covers eleven distinct industrial sectors, eight countries, and the full range of methodological combinations relevant to Industrial Symbiosis assessment.

### 1.2 Validation philosophy

The tool is validated for **methodological configuration coherence, not numerical replication**. This means:

- For each paper, the tool's seven user-facing questions are filled in to reflect the case as published.
- The decision engine output (activated nodes, terminal IS pathway, applicable hard constraints, required methodological choices) is compared against the methodological configuration the authors actually applied.
- A match is declared when the tool's configuration is consistent with what the authors did, allowing for legitimate expert overrides where the authors made a methodologically sound but non-default choice.

Numerical replication of impact category results is explicitly out of scope. Reproducing the numerical outputs of twelve heterogeneous case studies would require recreating their foreground inventories, calibrating their background databases, and matching their LCIA implementations — an effort of months that would not strengthen the methodological validation argument.

---

## 2. Methodological configuration matrix — twelve case studies (Deliverable A)

This is the consolidated ground-truth matrix. Each row summarises one paper. Columns capture the methodological dimensions most relevant to the decision engine.

### 2.1 Papers 1-6 (primary LCA-focused batch)

| # | Reference | Country | Site / IS network | Primary method |
|---|---|---|---|---|
| 1 | Sokka et al. (2011) | FI | Kymenlaakso forest industry complex (UPM Kymi paper mill + cogen + CaCO₃ + ClO₂ + WWTP + Kouvola town) | LCA attributional, system expansion, black-box |
| 2 | Hashimoto et al. (2010) | JP | Kawasaki Eco-town, D.C. Cement (cement Portland 348k t/y) | LCCO₂ (LCA reduced to CO₂-only accounting) |
| 3 | Daddi et al. (2017) | IT | Santa Croce sull'Arno tannery cluster (240 km², 6 municipalities) | LCA attributional + system expansion (Mattila et al. 2012), ILCD method |
| 4 | Paulu et al. (2022) | CZ | Czech Republic industry-wide CCP & C&DW management | LCA sector-attributional, EF (PEF/OEF) normalised+weighted |
| 5 | Arce Bastias et al. (2023) | AR | Madera Plástica Mendoza (3 entities, plastic recycling) | LCA + new SPI indicator, three allocation methods tested |
| 6 | Wiktor & Johansson (2018) | SE | VA Syd Malmö sewage sludge (3 actors, 27,000 t/y) | LCA + LCC integrated, Ecoinvent 3.3, marginal electricity = coal |

### 2.2 Papers 1-6 — functional unit, boundary, allocation

| # | Functional unit | System boundary | Allocation method | LCIA method | # scenarios |
|---|---|---|---|---|---|
| 1 | Annual production of UPM Kymi complex | Cradle-to-gate IES, six actors | System expansion (substitution credits) | ReCiPe midpoint, Finland-adjusted CFs | 3 RS (RS1 NG, RS2 peat, RS3 improvement) |
| 2 | 348,000 t Portland cement/year | Cradle-to-gate cement plant, includes raw materials transport, calcination, combustion, waste transport, waste disposal | None (single-output) | Single-impact (CO₂ only) using JP government EFs | 4 (S1 baseline no-IS, S2 current IS, S3 cluster-improved IS, S4 regional-extended IS) |
| 3 | 1 m² finished bovine leather (cluster average), aligned with PCR EPD | Cradle-to-tannery-gate, includes farming, slaughterhouse, hide preservation, tanning, transport, WWT, waste treatment | System expansion (Mattila 2012 approach) | ILCD recommended methods | 4 (S1 current IS, S2 hypothetical no-IS, S3a/S3b future water reuse) |
| 4 | Annual national flows of CCP and C&DW (no specific tonnage) | National-scale aggregated, includes transport from generation to use/disposal sites | Sector-level attributional, no per-flow allocation | Environmental Footprint (EF, normalised+weighted PEF/OEF) | 2 (current state + symbiotic optimised) |
| 5 | Plastic waste managed by MPM network (specific tonnage not detailed) | Three-entity network, cradle-to-gate per entity | Three methods tested: full / partial (proposed SPI) / system expansion | CEENE (resources) + IPCC GWP100 | Symbiotic vs non-symbiotic per entity |
| 6 | LCA: management of 27,000 t/y sludge × 1 year. LCC: 30 years with discount rate 3.5% | Includes drying, incineration, P recovery (ASH DEC or EcoPhos), heat sources (district / waste heat from Norcarb), capacity (existing or expanded) | System expansion + entity-level cost allocation | Acidification + Eutrophication + GWP | 13 (S0 baseline + 12 combinations of 4 design choices) |

### 2.3 Papers 7-12 (LCC/TEA/SLCA/LCSA batch)

| # | Reference | Country | Site / focus | Primary method |
|---|---|---|---|---|
| 7 | Leiva et al. (2025) | ES + SE | Escombreras (Química del Estroncio KNO₃ optimisation) + Frövi (paper mill + 10 ha greenhouse) | MFCA (ISO 14051) + CBA + TEA, NO LCA |
| 8 | Danielsson et al. (2018) | DK | Kalundborg Symbiosis (8-member association since 1972) | LCA consequential black-box + LCC analytical |
| 9 | Kerdlap et al. (2024) | (urban fictional) | Fictional urban agri-food network (5 entities: soil farm, hydroponics, brewery, egg farm, fish farm) | UM³-LCE³-ISN matrix-based LCA+LCC unified model |
| 10 | Subramanian et al. (2021) | USA | The Plant, Chicago — multi-tenant building, on-site bread oven | Capital-based LCSA (8 capitals, alternative to TBL) |
| 11 | Zhu (2013) | NL (TU Delft) | Generic 2-firm IS exchange | LCA + simplified LCC, "Symbiosis Assessment Diagram" |
| 12 | Briassoulis et al. (2023) | EU multi-country | Bio-based polymers framework + post-consumer IS recovery | Full LCSA (LCA + S-LCA + LCC + TEA) |

### 2.4 Papers 7-12 — functional unit, boundary, allocation

| # | Functional unit | System boundary | Allocation method | Indicators / output | # scenarios |
|---|---|---|---|---|---|
| 7 | Escombreras: 1 hour KNO₃ production. Frövi: 10 ha greenhouse / 100,000 m² | Symbiotic exchange links only (not full LCA cycle of paper mill or greenhouse) | MFCA mass-based; CBA aggregates | OPEX, monetary efficiency, CAPEX, Sankey cost diagrams | Spain: 1+1 (baseline + post-IS); Sweden: 4 (A CCU / B Scrubber / C External / D Baseline NG) |
| 8 | Year of production (Baseline 2015) | Black-box, three resource layers (energy / materials / water), 8 members | System expansion (substitution-based displacement) | t CO₂, m³ water, MWh energy, t materials, M€ savings | 3 (Baseline 2015, 2018, 2019 + sensitivity scenarios) |
| 9 | Network output (illustrative) | Three-level (network / entity / specific resource flow), unified matrix | Matrix-based decomposition, demand and price vectors manipulated | NPV (LCC) per entity + per flow + per network; LCA impacts at all 3 levels | Open-loop and closed-loop variants |
| 10 | Bread baked in on-site oven (specific quantity not detailed) | Multi-tenant building, on-site oven + AD system | Capital flow allocation across 8 capital types | Stock and flow of 8 capital types (natural / human / social / financial / manufactured / intellectual / cultural / political-institutional) | 3 (S1 natural gas, S2 biogas symbiotic, S3 renewable electricity) |
| 11 | UF1: 1 t finished product B. UF2: 1 t waste managed from A | Cradle-to-gate or gate-to-gate (varies by scenario) | Tested across scenarios (system expansion, partial, etc.) | Total cost (LCC equation: raw materials + energy + transport + waste treatment + investment − waste sales − avoided procurement − avoided disposal); LCA impacts | 19 scenarios varying FU, transport distance, waste quality, prices, allocation |
| 12 | 1 t bio-polymer / post-consumer cycle | Bio-refinery + IS network, post-consumer recovery (mechanical recycling, composting, AD) | Multi-method depending on flow: mass / energy / economic / system expansion | LCA: carbon footprint, acidification, eutrophication, resource use. S-LCA: job creation, skill development, community wellbeing, worker H&S. LCC: CAPEX, OPEX, NPV, cost/FU. TEA: ROI, payback, sensitivity | Multi-scenario, framework propositional |

### 2.5 Cross-cutting observations on the configuration matrix

A few patterns emerge that are operationally relevant for the decision engine:

- **System expansion dominates** (10/12 papers use it as primary or one of the methods). The two exceptions are paper 2 (Hashimoto, single-output cement, no allocation needed) and paper 10 (Subramanian, capital-based framework that does not use traditional allocation). System expansion as default in the decision engine is empirically justified.
- **Eight of twelve papers run multi-scenario comparative analyses** with at least 3 scenarios. The Wiktor case alone runs 13 scenarios (1 baseline + 12 design combinations). The Zhu thesis runs 19 scenarios. This is the empirical justification for Q2-D (baseline + alternatives).
- **All 12 papers are explicitly comparative** against a reference scenario (no-IS baseline, alternative technology, hypothetical disaggregated network, conventional fossil pathway, etc.). The "comparative assessment logic" mandated by S-LCA HC-01 is in fact universal across LCA-LCC-S-LCA in IS practice, not just S-LCA.
- **Functional unit variety is striking**: per-product (papers 2, 3, 11, 12), per-time-period (papers 1, 6, 7), per-network-output (papers 5, 8, 9), per-stakeholder-unit (paper 10 partly). The decision engine's default "function-oriented FU" needs to flexibly handle all these forms — confirmed by D4.1 LCA HC-22 which permits this flexibility within IS.
- **Marginal vs average data distinction** appears in only 1/12 papers (Danielsson Kalundborg uses marginal coal electricity for consequential modelling). All other 11 use average mix (or single-impact like Hashimoto). The Q1-B → average default is empirically supported; consequential is a legitimate expert override for eco-park studies, not a primary path.

---

## 3. Q1-Q7 compilation table for the twelve papers (Deliverable B)

This consolidates the answers each paper would give to the seven user-facing questions, as derived in the two stress-test reports. The table feeds directly into the per-paper validation reports' Section 4 (compilation).

Note: the questions reflect the **final agreed set** (with all 7 fixes applied: Q1 unchanged with disambiguation, Q2-D added, Q3 multi-checkbox 3-dimension, Q4-E added with multi-select, Q5-e added with Q1-A/B/D gating, Q6 expanded sectors, Q7 with multi-scale option).

### 3.1 Compact compilation table

Legend: Q1 (A=specific exchange / B=eco-park / C=policy / D=corporate / E=monitoring); Q2 (A=existing / B=construction / C=design / D=baseline+alternatives); Q3 (ENV/ECO/SOC checkboxes); Q4 (A=internal / B=external no-claim / C=public claim / D=EU policy / E=academic); Q5 (a/b/c/d/e per flow, "mixed" = different flows have different categories); Q6a (sector); Q6b (TRL); Q7 (A=co-located / B=regional / C=wide-area / D=multi-scale).

| # | Paper | Q1 | Q2 | Q3 | Q4 | Q5 | Q6a sector | Q6b TRL | Q7 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Sokka 2011 | B | D | ENV | E | e (black-box) | Pulp & paper | 9 | B |
| 2 | Hashimoto 2010 | B (chosen, see note) | D | ENV | E | mixed (a/c) | Cement | 9 | B |
| 3 | Daddi 2017 | B | D | ENV | E | mixed (b/c) | Textile/leather | 9 | B |
| 4 | Paulu 2022 | C | D | ENV | D + E | e (industry-wide) | Waste valorization | 9 | D |
| 5 | Arce Bastias 2023 | B | A | ENV | E | mixed (b/c) | Plastics/packaging | 9 | A |
| 6 | Wiktor 2018 | B | D | ENV + ECO | E | mixed (a/c/c) | Wastewater/sludge | 7-8 (-EC scenarios) | B |
| 7 | Leiva 2025 | A (Esc.) / B (Frövi) | D | ECO | E | mixed (b/c) | Chemicals (Esc.) / Pulp & paper (Frövi) | 9 / 7-8 (CCU) | B |
| 8 | Danielsson 2018 | B | D | ENV + ECO | C | e (3 layers) | Energy/utilities (multi) | 9 | B |
| 9 | Kerdlap 2024 | B | C (fictional) | ENV + ECO | E | mixed (b/c) | Agri-food | 9 | A |
| 10 | Subramanian 2021 | B (chosen, see note) | D | ENV + ECO + SOC | E | mixed (b/c) | Multi-tenant urban | 9 | A |
| 11 | Zhu 2013 | A | C | ENV + ECO | E | varies per scenario | Generic | 9 | varies |
| 12 | Briassoulis 2023 | C | C (framework) | ENV + ECO + SOC | E | mixed (b/c) | Bio-based polymers | 9 | n/a |

### 3.2 Notes on cases requiring disambiguation

**Paper 2 — Hashimoto (B chosen)**: D.C. Cement is the central anchor of Kawasaki Eco-town, but the study analyses the entire network of exchanges (slag from JFE Steel, fly ash, plastics, pulp sludge from Corelex). The subject of the report is the network's CO₂ savings, not a corporate ESG report. Therefore B (eco-park) is correct, not D (corporate). This was the original ambiguity flagged in Stress-test 1 and resolved by the disambiguation rule "Who is the SUBJECT of the report?".

**Paper 4 — Paulu (Q4 = D + E)**: industry-wide policy assessment using PEF/EF method, published in Sustainable Production and Consumption journal. Both D (EU policy alignment, activates PEF Circular Footprint Formula) and E (academic peer-reviewed) apply simultaneously. The multi-select capability of Q4 (final spec) accommodates this. Engine applies the higher rigor: D-driven PEF activation + E-driven full SI disclosure.

**Paper 6 — Wiktor (Q2 = D, Q6b = 7-8 for -EC scenarios)**: VA Syd baseline operates as TRL 9, but the -EC (expanded capacity) scenarios require new mono-incineration boiler design, which is TRL 7-8. Q6b asks about the technology characterising the symbiotic intervention, which is the new infrastructure across the alternative scenarios. The Q2-D framework captures the "baseline + alternatives" structure cleanly; per-scenario TRL can be specified in case data.

**Paper 9 — Kerdlap (Q2 = C, fictional)**: the fictional 5-entity urban agri-food network is a methodological demonstration, not a real planned system. Q2-C ("design only") + an internal flag "academic methodological exploration" derived from Q4-E correctly characterises this. The fictional case still exercises the full IS-01 multi-actor pathway because the methodology applies regardless of whether the network is real.

**Paper 10 — Subramanian (B chosen, alt-S-LCA framework)**: The Plant is a multi-tenant building (qualifies as B "eco-park / multi-actor" rather than A "specific exchange"). Q3-SOC is selected because the study covers social capital and human capital, but the framework is **capital-based 8 capitals**, not UNEP/SETAC. The decision engine default is UNEP/SETAC + CIRCPACK (S-LCA HC-12). For this paper, an advanced-mode override "alternative S-LCA framework: capital-based" must be applied. This is not a tool gap — it is the legitimate role of expert mode.

**Paper 7 — Leiva (Q1 = A vs B)**: the paper presents two demos. Escombreras is a single-site process optimisation (Q1-A, specific exchange between QSr and neighbouring industries for HCl + H₂SO₄ + CO₂ + glycerine). Frövi is a multi-actor eco-park (Q1-B, paper mill + greenhouse + facilitator WA3RM). When validating the tool against this paper, both demos should be exercised separately, with different Q1 answers.

**Paper 5 — Arce Bastias (Q2 = A, advanced-mode allocation)**: the paper tests three allocation methods (full / partial / system expansion) to demonstrate the new SPI indicator. The decision engine applies system expansion as default, but expert-mode override allows testing the alternative allocations. This is a methodological exploration paper — the tool's role is to support comparison, not to dictate one method.

### 3.3 Q1 → IS pathway derivation table

The combination Q1 × Q2 generates the five terminal pathways IS-01..IS-05 deterministically:

| Q1 → Q2 → | Pathway | Description |
|---|---|---|
| A or B → A | IS-01 | Existing operational IS network (specific exchange or eco-park), ex-post analysis with primary data |
| A or B → D | IS-01 (extended) | Existing IS + alternative scenarios for improvement / expansion / technology variants |
| C → any | IS-02 | Policy or programme assessment, consequential modelling, long-term marginal mix |
| D → any | IS-03 | Corporate sustainability reporting (ESG, CSRD), allocation-based |
| C or any → C | IS-04 | Design/projection-only, ex-ante, scale-up frameworks active if TRL<7 |
| E or A/B → A (monitoring) | IS-05 | Time-series monitoring of operational IS network (Kalundborg-style annual reporting) |

Mapping the twelve papers to terminal pathway:

| # | Paper | Pathway | Notes |
|---|---|---|---|
| 1 | Sokka | IS-01 | Existing IES + RS3 hypothetical improvement (sub-mode IS-01 + Q2-D) |
| 2 | Hashimoto | IS-01 (extended) | Eco-park existing (S1+S2) + future scenarios (S3+S4) |
| 3 | Daddi | IS-01 (extended) | Cluster existing (S1+S2) + future water reuse (S3a/S3b) |
| 4 | Paulu | IS-02 | National policy assessment |
| 5 | Arce Bastias | IS-01 | Existing 3-entity network |
| 6 | Wiktor | IS-01 (extended) | VA Syd baseline + 12 alternative treatment scenarios |
| 7 | Leiva (Esc.) | IS-01 | Specific exchange between QSr and neighbours |
| 7 | Leiva (Frövi) | IS-01 (extended) | Eco-park existing (paper mill) + 4 CO₂ supply alternatives |
| 8 | Danielsson | IS-01 (with consequential override) | Eco-park existing, multi-baseline (2015/2018/2019), expert override to consequential |
| 9 | Kerdlap | IS-01 (fictional, methodological flag) | Urban network demonstrative |
| 10 | Subramanian | IS-01 (extended) | Multi-tenant building existing + 3 fuel scenarios for oven |
| 11 | Zhu | IS-04 (low-TRL not applicable) — IS-01 multi-scenario | Generic 2-firm exchange with 19 scenarios; could be considered IS-04 if TRL<7 in some scenarios |
| 12 | Briassoulis | IS-02 (multi-sector framework) | Industry-wide bio-polymer framework, propositional |

**Empirical confirmation**: 8/12 cases activate IS-01 (or IS-01 extended), 2/12 IS-02, 1/12 IS-04 (Zhu, depending on scenario), 0/12 IS-03 explicitly, 0/12 IS-05 explicitly. The structure of five terminal pathways holds, but IS-03 and IS-05 are under-sampled in the twelve papers (no pure corporate ESG report, no pure long-term monitoring). This is a sample limitation flagged in §4.

---

## 4. Sample limitations (Deliverable D)

This section documents the known limitations of the 12-paper sample, so that conclusions drawn from the validation are appropriately bounded.

### 4.1 Sample composition

- **Geography**: 8/12 papers are from EU countries (FI, IT, CZ, SE, ES, DK, NL); 1 USA (Subramanian); 1 Argentina (Arce Bastias); 1 Japan (Hashimoto); 1 multi-country EU framework (Briassoulis). Asian context (other than Japan) and developing-country contexts are absent.
- **Methodology**: 5/12 LCA-only; 4/12 LCA+LCC; 1/12 LCC/MFCA/CBA-only (Leiva); 2/12 full LCSA (Subramanian, Briassoulis). No paper uses S-LCA standalone; no paper uses ENV+SOC without ECO.
- **Time frame**: papers span 2010-2025. Pre-2010 IS-LCA practice is not represented. Recent (2024-2025) practice is represented by 2 papers (Kerdlap, Leiva).
- **Type**: 11/12 are academic peer-reviewed (10 journals, 2 master theses); 1/12 is an institutional report (Danielsson 2018, Kalundborg Symbiosis Center DK). No pure industrial / consultancy reports.
- **Scale**: ranges from 2-firm specific exchange (Zhu, Leiva Escombreras) to industry-wide national (Paulu) to long-running eco-industrial park (Danielsson Kalundborg). Continental / cross-border scale absent.

### 4.2 Sectors covered and absent

**Covered** (one or more papers): pulp & paper, cement & construction, leather/tanning, plastics & packaging, waste valorization (CCP, C&DW, plastics), wastewater & sludge, energy & utilities, chemicals & fertilizers, agri-food / bio-refineries, multi-tenant urban building, bio-based polymers.

**Absent** (no paper, validation gap): mining and geological materials, electronics and semiconductors, automotive (including EV battery EOL), aerospace, pharmaceutical (other than Briassoulis bio-pharma), heavy chemicals (e.g., petrochemicals), maritime / shipping, agricultural primary production (e.g., dairy, livestock).

### 4.3 Implications for tool validation scope

- The decision engine is **empirically validated for IS contexts in bio-based / circular economy / EU industrial settings**. Its applicability to mining, electronics, automotive, etc. is by analogy and methodological soundness, not by direct empirical test.
- **IS-03 (corporate sustainability reporting) and IS-05 (long-term monitoring) terminal pathways are under-sampled**. For these pathways, the decision engine relies on Phase 1 ground truth + methodological reasoning, not on empirical case match.
- **S-LCA validation** rests on 2/12 papers (Subramanian capital-based, Briassoulis UNEP/SETAC). Additional S-LCA cases would strengthen confidence, but the structural validation against 66 Phase 1 nodes from D4.3 already provides solid grounding.
- **Multi-scenario capability (Q2-D)** is the most heavily validated feature: 9/12 papers exercise it directly, with cases ranging from 2 alternatives (Daddi, Paulu) to 19 scenarios (Zhu). Confidence is high.
- **Single-impact studies** (Hashimoto LCCO₂) work in the tool but require the user to choose a reduced LCIA preset (LCA HC-19 mandates climate change as a frontier category, which is satisfied; the tool flags absence of other categories).

### 4.4 Mitigations for documented limitations

For each limitation, a mitigation strategy is recorded:

| Limitation | Mitigation |
|---|---|
| Geography skewed EU | Tool design language-agnostic, units SI-default. Sector-specific guidance from D4.1 Part 2 covers EU + non-EU contexts where available. |
| Few non-academic cases | Industrial users will be onboarded during pilot (Sprint 5+); their feedback closes the gap empirically. |
| IS-03 / IS-05 under-sampled | Reliance on Phase 1 D4.1/D4.2 ground truth; both pathways are activated by Q1=D / Q1=E, deterministic from Q1 alone, methodologically sound. |
| Missing sectors | Q6a "Other (specify)" + advanced sector-overlay neutral. Sector additions to lookup table are easy post-launch as new cases emerge. |
| S-LCA only 2 cases | 66 Phase 1 nodes from D4.3 fully validated structurally; quantitative S-LCA is intrinsically less precise than LCA/LCC, so the bar is appropriately lower. |

---

## 5. Special feature-to-paper mappings (Deliverable E)

This section records the "best match" cases — papers that cleanly exercised a specific tool capability and that should be cited in the corresponding feature validation in the per-paper reports.

### 5.1 Best-match table for tool features

| Tool feature | Best-match paper | Why this is the canonical match |
|---|---|---|
| Q1-B (eco-park multi-actor) | Paper 8 — Danielsson 2018 (Kalundborg) | Most iconic IS network in literature; 8 actors; 50+ years operational; canonical multi-actor case |
| Q1-C (policy / programme) | Paper 4 — Paulu 2022 (Czech industry-wide) | Pure policy assessment at national scale, drives consequential modelling |
| Q1-D (corporate report) | (under-sampled — placeholder for pilot) | No paper purely corporate; Hashimoto and Subramanian are closest but resolved as B |
| Q1-E (monitoring) | (under-sampled — placeholder for pilot) | Danielsson has multi-baseline tracking but is primarily B; pilot users expected |
| Q2-D (baseline + alternatives) | Paper 6 — Wiktor 2018 (Malmö, 13 scenarios) | Most extensive multi-scenario design (1 baseline + 12 alternatives across 4 design dimensions) |
| Q3 [ENV] only | Paper 1 — Sokka 2011 (Kymenlaakso) | Pure LCA, three reference scenarios, methodologically clean |
| Q3 [ECO] only | Paper 7 — Leiva 2025 (Escombreras) | Pure MFCA+CBA+TEA, no LCA. Validates the entire ECO-only branch including the LCC/MFCA/CBA/TEA sub-choice |
| Q3 [ENV + ECO] | Paper 6 — Wiktor 2018 | Most rigorous LCA+LCC integration, MFCA backbone, eco-efficiency calculation |
| Q3 [ENV + ECO + SOC] full LCSA | Paper 12 — Briassoulis 2023 | Full LCSA with TEA addition, framework-level approach |
| Q4-C (public superiority claim) | Paper 8 — Danielsson 2018 | Symbiosis Center DK report explicitly promotes Kalundborg as superior model |
| Q4-D (EU policy / PEF) | Paper 4 — Paulu 2022 | Uses PEF/EF method explicitly, normalised+weighted. The cleanest activation of CIR-05 (PEF CFF) in the validation set |
| Q5-e (aggregated, system expansion uniform) | Paper 1 — Sokka 2011 OR Paper 8 — Danielsson 2018 | Both are black-box approaches to multi-actor IES, paradigmatic cases for top-down aggregated analysis |
| Q5-d (interdependent flow) | Paper 7 — Leiva 2025 (Frövi CCU scenario) | Paper mill explicitly modified its CO₂ capture process to supply greenhouse — most realistic interdependent case in sample |
| Q6a multi-tenant urban | Paper 10 — Subramanian 2021 (The Plant) | Only paper with multi-tenant urban building configuration, validates this sector option |
| Q6b TRL 7-8 + scale-up | Paper 6 — Wiktor 2018 (-EC scenarios with new boiler) | Activates Six-Tenths Rule, Lang Factors, CEPCI scaling for incinerator capacity expansion |
| Q7-D multi-scale | Paper 4 — Paulu 2022 (Czech industry-wide) | National scale with variable site distances, GIS-coupled spatial modelling required |
| LCC-LCA matrix integration (UM³-LCE³-ISN) | Paper 9 — Kerdlap 2024 | The seminal paper on the methodology, cited in D4.2 §11.3 (L1261) as preferred integration approach |
| MFCA backbone (ISO 14051) | Paper 7 — Leiva 2025 | Most explicit MFCA application, including Sankey diagrams and Quantity Centres methodology |
| Three allocation methods comparison | Paper 5 — Arce Bastias 2023 | Tests full / partial / system expansion alongside SPI, validates expert-mode allocation override |
| Capital-based S-LCA framework | Paper 10 — Subramanian 2021 | Validates expert-mode S-LCA framework override, alternative to UNEP/SETAC default |
| 19-scenario multi-FU sensitivity | Paper 11 — Zhu 2013 | Validates capability to handle UF1 vs UF2 testing and dense scenario exploration |

### 5.2 Empirically validated default settings

These default settings are derived from the 12-paper sample and should be applied automatically by the decision engine, with expert-mode override available:

- **Allocation method**: System expansion (10/12 papers).
- **LCC-LCA integration**: Matrix-based UM³-LCE³-ISN when both ENV and ECO active (Kerdlap 2024 + D4.2 L1261 explicit recommendation).
- **MFCA backbone**: ISO 14051/14052 activated when ECO is selected (Leiva, Wiktor, Kerdlap, D4.2 L1417).
- **Marginal vs average mix**: Q1-A or Q1-B → average mix substitution (11/12 papers); Q1-C → marginal mix; Q1-B + advanced override → consequential (Danielsson).
- **LCC type combination for IS**: C-LCC at entity level + E-LCC at network level (D4.2 recommended IS-LCSA combination, supported by Wiktor and Kerdlap).
- **Reference scenario type**: Q1-A → most likely alternative disposal route + virgin material market price; Q1-B → hypothetical no-IS where partners operate independently; Q1-C → BAU national mix (Paulu pattern).
- **Background database**: Ecoinvent 3.10 (current at 2026) with attributional + system expansion preset; cut-off used by Wiktor (3.3) is acceptable as alternative for older datasets.
- **LCIA method default**: ReCiPe 2016 hierarchic midpoint (most common in IS literature 2010-2024); EF 3.1 backup activated automatically when Q4-D (EU policy alignment).
- **Single-impact LCA preset**: available as expert-mode option for cases like Hashimoto LCCO₂ where policy or stakeholder communication focuses on one metric (climate change). Tool flags absence of other categories.
- **Discount rate (LCC)**: 3.5% real (Wiktor; Riksbanken reference) as default for European studies; 4% social discount rate as alternative for policy-oriented studies (D4.2 L1663).

### 5.3 Caveats on default settings

- These defaults are for **non-expert users** who select "Auto" mode in the questionnaire. Expert users can override every default through advanced settings.
- The defaults are not normative claims about "the right way to do IS-LCA". They are empirically calibrated starting points reflecting current dominant practice in the validation sample.
- As the literature evolves and as pilot users provide feedback, these defaults should be revisited periodically. The decision engine architecture must support default-set updates without breaking saved cases.

---

## 6. Per-paper validation report — template structure (for post-Sprint-4 generation)

When Sprint 4 backend is operational, twelve formal validation reports will be produced as Word .docx documents in English. Each follows this canonical structure:

```
1. Bibliographic reference and IS context summary
2. Concise case study summary (1-2 paragraphs)
3. Methodological configuration adopted by the authors
   3.1 Method combination (LCA / LCC / S-LCA / TEA mix)
   3.2 Functional unit
   3.3 System boundary and scope
   3.4 Allocation method
   3.5 LCIA method (and/or economic indicators)
   3.6 Reference scenario(s)
   3.7 Key indicators reported
4. Compilation of the seven user-facing tool questions
   - One subsection per Q1-Q7, with the user's answer and rationale
   - "Show reasoning" trace of the decision engine's interpretation
5. Methodological configuration derived by the tool
   5.1 Activated nodes (DEFAULT / DERIVED / DOMINANT)
   5.2 Terminal IS pathway (IS-01 .. IS-05)
   5.3 Expert-mode overrides applied (if any)
6. Comparison: paper configuration vs tool configuration
   6.1 Match table (configuration dimensions where they agree)
   6.2 Mismatch table (where the tool diverges, with reasons)
   6.3 Recommended expert overrides for this case
7. Validation verdict
   7.1 Match / Partial match / Mismatch
   7.2 Methodological observations emerging from this case
   7.3 Suggested decision engine improvements (if any)
8. Appendix: full node activation list for this case
```

Sections 1-3 are populated from the matrix in §2 of this working document. Section 4 is populated from the table in §3.1 and the disambiguation notes in §3.2. Sections 5-7 require the operational tool to generate the engine output.

### 6.1 Estimated effort

Twelve reports × approximately 4-6 pages each = 50-70 pages total. Generation is largely automated once the tool produces the engine output for each case; estimated 2-3 days of focused work for a single technical author with the tool running.

### 6.2 Output location

Reports will be deposited in `/deliverables/T46/validation_reports/` in the project repository, with naming convention `T46_VR_<paper_short_ref>.docx` (e.g., `T46_VR_Sokka2011.docx`).

---

## 7. Working document maintenance

This document is a living artefact. It is updated when:

- A new paper is added to the validation sample (e.g., from pilot users or post-launch feedback).
- A modification to the seven user-facing questions is approved (re-run the compilation table in §3).
- An expert-mode feature is validated against a specific paper (update §5.1).
- A new sample limitation is identified (update §4).

The next anticipated update is after the Phase 4-5 inspection (verification that the v2 JSON errors PEF CFF in Q7, INV-04, RULE-04 are not reproduced in v3) and after the per-paper full validation reports are generated.

### 7.1 Open questions for the lead

The following are questions that remain unresolved at the time of writing and should be addressed before final per-paper reports are produced:

- (none currently — the document is closed for content as of v1.0; questions arising during Sprint 4 backend implementation will be appended here)

---

*End of working document v1.0.*
