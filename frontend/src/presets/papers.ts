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
    case: {
      q1: 'C', q2: 'C', q3: { env: true, eco: true, soc: true }, q4: ['E'],
      flows: flows('b', 'c'), q6a: 'biobased_polymers', q6b: 'TRL9', q7: null,
    },
  },
]
