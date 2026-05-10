// Preset Case templates for the 13 paper fixtures.
//
// Mirrors backend/scripts/generate_validation_reports.py:PAPERS in
// terms of Q1-Q7 + flows. Used by PresetLoader on HomePage to seed
// the case draft with a known-good configuration so the user can
// inspect / tweak / run the pipeline against a real published case
// instead of starting from a blank form.
//
// Keep in sync with the backend script + test_12_papers_regression.

import type { Case } from '../types/api'

export interface Preset {
  id: string
  label: string
  short_ref: string
  citation: string
  description: string
  rationale: string
  case: Partial<Case>
}

const flows = (...qs: ('a' | 'b' | 'c' | 'd' | 'e')[]) =>
  qs.map((q, i) => ({ id: `f${i + 1}`, name: `flow${i + 1}`, q5: q }))

export const PRESETS: Preset[] = [
  {
    id: 'sokka_2011',
    short_ref: 'Sokka2011',
    label: '1. Sokka 2011 — Kymenlaakso (FI, pulp & paper)',
    citation: 'Sokka et al. (2011)',
    description: 'Six-actor IES, ENV-only LCA, RS3 improvement scenario.',
    rationale: 'Q1=B: six-actor IES (UPM Kymi + cogen + CaCO3 + ClO2 + WWTP + Kouvola town) is unambiguously a multi-actor network, not a single company. Q2=D: existing operations + RS3 \'improvement\' scenario fits the baseline+alternatives model. Q3=ENV-only because the paper is a pure LCA. Q4=E: peer-reviewed academic. Q5=e because the entire complex is modelled as a black-box (no per-flow detail in the published data). Q6a pulp_paper, Q6b TRL9 (operational), Q7=B regional cluster.',
    case: {
      q1: 'B', q2: 'D', q3: { env: true, eco: false, soc: false }, q4: ['E'],
      flows: flows('e'), q6a: 'pulp_paper', q6b: 'TRL9', q7: 'B',
    },
  },
  {
    id: 'hashimoto_2010',
    short_ref: 'Hashimoto2010',
    label: '2. Hashimoto 2010 — Kawasaki (JP, cement)',
    citation: 'Hashimoto et al. (2010)',
    description: 'Eco-park network with current + future scenarios.',
    rationale: 'Q1=B is non-obvious: D.C. Cement is the central anchor, but the SUBJECT of the report is the network\'s CO2 savings (slag from JFE Steel, fly ash, plastics, pulp sludge from Corelex), not D.C. Cement\'s ESG report. Disambiguation rule \'who is the SUBJECT?\' applies → B. Q2=D: S1+S2 baseline + S3 cluster-improved + S4 regional-extended = 4 scenarios. Q5 mixed: slag (a, A pays B) and by-products (c, B pays A).',
    case: {
      q1: 'B', q2: 'D', q3: { env: true, eco: false, soc: false }, q4: ['E'],
      flows: flows('a', 'c'), q6a: 'cement_construction', q6b: 'TRL9', q7: 'B',
    },
  },
  {
    id: 'daddi_2017',
    short_ref: 'Daddi2017',
    label: '3. Daddi 2017 — Santa Croce tannery (IT)',
    citation: 'Daddi et al. (2017)',
    description: 'Cluster of 6 municipalities + WWT, S3a/S3b water reuse.',
    rationale: 'Cluster of 6 municipalities + WWT facility = clear Q1=B (multi-actor cluster). Q2=D because the paper compares S1 (current IS) + S2 (hypothetical no-IS) + S3a/S3b (future water-reuse alternatives). Q5 mixed: tannery hide preservation (b free) + waste tannery sludge to cement (c B pays A).',
    case: {
      q1: 'B', q2: 'D', q3: { env: true, eco: false, soc: false }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'textile_leather', q6b: 'TRL9', q7: 'B',
    },
  },
  {
    id: 'paulu_2022',
    short_ref: 'Paulu2022',
    label: '4. Paulu 2022 — Czech industry-wide (CZ, policy)',
    citation: 'Paulu et al. (2022)',
    description: 'National policy assessment, EU PEF + academic publication.',
    rationale: 'Q1=C because this is a pure POLICY assessment at national scale (Czech Republic CCP & C&DW management), not a specific exchange or eco-park. Q4=D+E is the canonical multi-select case: EU PEF/EF method (D activates CIR-05 PEF Circular Footprint Formula) AND academic publication (E full SI). Q7=D multi-scale industry-wide with variable distances between generation and use sites.',
    case: {
      q1: 'C', q2: 'D', q3: { env: true, eco: false, soc: false },
      q4: ['D', 'E'],
      flows: flows('e'), q6a: 'waste_valorization', q6b: 'TRL9', q7: 'D',
    },
  },
  {
    id: 'arce_bastias_2023',
    short_ref: 'ArceBastias2023',
    label: '5. Arce Bastias 2023 — Mendoza (AR, plastics)',
    citation: 'Arce Bastias et al. (2023)',
    description: '3-entity network, ex-post, three allocation methods tested.',
    rationale: '3-entity network (Madera Plástica Mendoza) = Q1=B. Q2=A (operational) because the paper analyses an existing network ex-post. Methodological exploration paper (tests 3 allocation methods) — the tool applies system expansion as default per the empirical 10/12 dominance; the user can engage expert-mode to compare full / partial (SPI) / system expansion as the authors did.',
    case: {
      q1: 'B', q2: 'A', q3: { env: true, eco: false, soc: false }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'plastics_packaging', q6b: 'TRL9', q7: 'A',
    },
  },
  {
    id: 'wiktor_2018',
    short_ref: 'Wiktor2018',
    label: '6. Wiktor 2018 — VA Syd Malmö (SE, wastewater)',
    citation: 'Wiktor & Johansson (2018)',
    description: '13 scenarios (1 baseline + 12 design alternatives).',
    rationale: 'Most extensive multi-scenario design in the sample: S0 baseline + 12 alternatives (4 design dimensions × combinations) = strong Q2=D. Q6a wastewater_sludge_biofactories. Q6b is per-scenario: baseline = TRL9 but -EC scenarios require new mono-incineration boiler design at TRL 7-8. Q7=B (Malmö regional). LCC at 30 years discount 3.5% (Riksbanken) is the engine\'s default for European studies.',
    case: {
      q1: 'B', q2: 'D', q3: { env: true, eco: true, soc: false }, q4: ['E'],
      flows: flows('a', 'c', 'c'),
      q6a: 'wastewater_sludge_biofactories', q6b: 'TRL7-8', q7: 'B',
    },
  },
  {
    id: 'leiva_2025_escombreras',
    short_ref: 'Leiva2025_Escombreras',
    label: '7a. Leiva 2025 Escombreras — KNO3 optimisation (ES)',
    citation: 'Leiva et al. (2025)',
    description: 'Single-site exchange QSr + neighbours, ECO-only.',
    rationale: 'Single-site process optimisation between Quimica del Estroncio and 4 neighbouring industries (HCl, H2SO4, CO2, glycerine) = Q1=A specific exchange. Pure ECO Q3 (MFCA + CBA + TEA, NO LCA) — this paper validates the entire ECO-only branch including the LCC/MFCA/CBA/TEA sub-choice that the engine activates automatically when Q3=ECO-only.',
    case: {
      q1: 'A', q2: 'D', q3: { env: false, eco: true, soc: false }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'chemicals_fertilizers', q6b: 'TRL9', q7: 'B',
    },
  },
  {
    id: 'leiva_2025_frovi',
    short_ref: 'Leiva2025_Frovi',
    label: '7b. Leiva 2025 Frövi — paper mill + greenhouse (SE)',
    citation: 'Leiva et al. (2025)',
    description: 'Multi-actor eco-park with WA3RM facilitator, CCU at TRL 7-8.',
    rationale: 'Multi-actor eco-park (paper mill + 10 ha greenhouse + facilitator WA3RM) = Q1=B. Q6b TRL 7-8 for the CCU scenario (carbon-capture from paper mill flue gas to greenhouse fertilisation is pre-commercial). Same ECO-only Q3 as Escombreras.',
    case: {
      q1: 'B', q2: 'D', q3: { env: false, eco: true, soc: false }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'pulp_paper', q6b: 'TRL7-8', q7: 'B',
    },
  },
  {
    id: 'danielsson_2018',
    short_ref: 'Danielsson2018',
    label: '8. Danielsson 2018 — Kalundborg (DK, 8-member)',
    citation: 'Danielsson et al. (2018)',
    description: 'Iconic IS network, public-claim Q4=C (Symbiosis Center).',
    rationale: 'Kalundborg Symbiosis: 8-member association operational since 1972 — the iconic IS network in literature, canonical Q1=B. Q4=C is the public superiority claim: the Symbiosis Center DK report explicitly promotes Kalundborg as a superior model, which activates MANDATORY panel review of 3+ ISO-14044 experts (no weighting allowed). Q3=ENV+ECO (CO2, water, energy, materials, M EUR savings).',
    case: {
      q1: 'B', q2: 'D', q3: { env: true, eco: true, soc: false }, q4: ['C'],
      flows: flows('e'), q6a: 'energy_utilities', q6b: 'TRL9', q7: 'B',
    },
  },
  {
    id: 'kerdlap_2024',
    short_ref: 'Kerdlap2024',
    label: '9. Kerdlap 2024 — fictional urban agri-food',
    citation: 'Kerdlap et al. (2024)',
    description:
      'Demonstrative 5-entity network in design phase. NOTE: γ-matrix → IS-04.',
    rationale: 'Fictional urban 5-entity agri-food network (soil farm + hydroponics + brewery + egg farm + fish farm) = Q1=B multi-actor. Q2=C because it\'s a methodological demonstration in design phase, not a real planned system. NOTE: WorkingDoc §3.3 mapping table lists IS-01 for this paper but its own derivation rule \'Q2=C → IS-04 (any Q1)\' plus the γ matrix (ADR-005) both yield IS-04. Engine follows the rule, not the mapping table — this is a documented divergence.',
    case: {
      q1: 'B', q2: 'C', q3: { env: true, eco: true, soc: false }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'agriculture_agrifood_biorefineries', q6b: 'TRL9', q7: 'A',
    },
  },
  {
    id: 'subramanian_2021',
    short_ref: 'Subramanian2021',
    label: '10. Subramanian 2021 — The Plant Chicago (USA)',
    citation: 'Subramanian et al. (2021)',
    description: 'Multi-tenant building, full LCSA (ENV+ECO+SOC).',
    rationale: 'The Plant Chicago: multi-tenant building (qualifies as Q1=B \'eco-park\' rather than Q1=A specific exchange). Q3 full LCSA (ENV+ECO+SOC). NOTE: the paper uses a CAPITAL-BASED 8-capitals framework for the social dimension (alternative to UNEP/SETAC + CIRCPACK which is the engine default) — to faithfully model this case the user must engage the advanced override \'alternative S-LCA framework: capital-based\'. This is not a tool gap; it is the legitimate role of expert mode.',
    case: {
      q1: 'B', q2: 'D', q3: { env: true, eco: true, soc: true }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'multi_tenant_urban_building', q6b: 'TRL9', q7: 'A',
    },
  },
  {
    id: 'zhu_2013',
    short_ref: 'Zhu2013',
    label: '11. Zhu 2013 — generic 2-firm exchange (NL)',
    citation: 'Zhu (2013)',
    description: 'Design-phase, 19 scenarios. Engine maps Q1=A+Q2=C → IS-04.',
    rationale: 'Generic 2-firm exchange (TU Delft master thesis) in design phase = Q1=A, Q2=C. Most scenario-rich case in the sample (19 scenarios varying FU, transport distance, waste quality, prices, allocation). Engine maps Q1=A + Q2=C → IS-04 via the γ matrix (design-only override applies even though Q1 is A).',
    case: {
      q1: 'A', q2: 'C', q3: { env: true, eco: true, soc: false }, q4: ['E'],
      flows: flows('c'), q6a: 'multi_sector', q6b: 'TRL9', q7: 'A',
    },
  },
  {
    id: 'briassoulis_2023',
    short_ref: 'Briassoulis2023',
    label: '12. Briassoulis 2023 — bio-polymers framework (EU)',
    citation: 'Briassoulis et al. (2023)',
    description: 'Industry-wide propositional framework, full LCSA + TEA.',
    rationale: 'Industry-wide bio-polymer framework = Q1=C (sector-level). Propositional framework in design phase = Q2=C. The γ matrix prioritises Q1=C over Q2=C → IS-02. Full LCSA with TEA addition (CAPEX, OPEX, NPV, ROI, payback). Q7 not applicable (n/a in WorkingDoc — multi-country EU framework, no specific geography).',
    case: {
      q1: 'C', q2: 'C', q3: { env: true, eco: true, soc: true }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'biobased_polymers', q6b: 'TRL9', q7: null,
    },
  },
]
