// TypeScript types mirroring the Pydantic v2 Case model in
// backend/app/domain/models.py (Sprint 4 Step 3).
//
// Source-of-truth is the Python side. These types are kept in sync
// manually for now; a codegen step (e.g. via openapi-typescript) is
// deferred until the API surface stabilises.

export type Q1 = 'A' | 'B' | 'C' | 'D' | 'E'
export type Q2 = 'A' | 'B' | 'C' | 'D'
export type Q4 = 'A' | 'B' | 'C' | 'D' | 'E'
export type Q5 = 'a' | 'b' | 'c' | 'd' | 'e'
export type Q6a =
  // Special placeholders
  | 'none'
  | 'other'
  // 14 canonical sectors (mirror app/schemas/sector_overlays.json)
  | 'agriculture_agrifood_biorefineries'
  | 'biobased_polymers'
  | 'plastics_packaging'
  | 'pulp_paper'
  | 'chemicals_fertilizers'
  | 'cement_construction'
  | 'steel_metals'
  | 'energy_utilities'
  | 'wastewater_sludge_biofactories'
  | 'textile_leather'
  | 'waste_valorization'
  | 'food_production'
  | 'multi_tenant_urban_building'
  | 'multi_sector'
  // Legacy aliases (backwards-compat for stored cases / older fixtures)
  | 'wastewater_biofactories'
  | 'agri_food'
  | 'process_industry'
export type Q6b = 'TRL9' | 'TRL7-8' | 'TRL5-6' | 'TRL<5'
export type Q7 = 'A' | 'B' | 'C' | 'D'

export type PathwayId = 'IS-01' | 'IS-02' | 'IS-03' | 'IS-04' | 'IS-05'

export type IlcdSituation =
  | 'ILCD Situation A'
  | 'ILCD Situation A multi-actor'
  | 'ILCD Situation B'
  | 'ILCD Situation C1'
  | 'ILCD Situation C2'

export type LccType = 'deactivated' | 'C+E' | 'C+E+S' | 'C-LCC'
export type SlcaActivationState = 'active' | 'deactivated'
export type StudyPhase = 'screening' | 'detailed'

export interface Q3 {
  env: boolean
  eco: boolean
  soc: boolean
}

export interface Flow {
  id: string
  name: string
  q5: Q5
  physical_quantity?: number | null
  physical_unit?: string | null
  notes?: string | null
}

export interface Site {
  id: string
  name: string
  latitude?: number | null
  longitude?: number | null
  country_iso2?: string | null
}

export interface AlternativeScenario {
  id: string
  label: string
  overrides: Record<string, unknown>
}

// ----- /api/pipeline/run-scenarios payloads -----

export interface ScenarioInput {
  id: string
  label: string
  overrides: Record<string, unknown>
}

export interface ScenarioResult {
  id: string
  label: string
  result: Case
}

export interface ScenariosResponse {
  baseline: Case
  scenarios: ScenarioResult[]
}

// ----- /api/cases payloads (Feature D) -----

export interface CaseSummary {
  id: string
  name: string
  slug?: string | null
  pathway_id: string | null
  created_at: string
  updated_at: string
}

export interface CaseDetail {
  id: string
  name: string
  slug?: string | null
  pathway_id: string | null
  created_at: string
  updated_at: string
  case: Case
}

export interface RuleViolation {
  rule_id: string
  message: string
}

export interface CdpFlag {
  cdp_id: string
  name: string | null
  tension: string | null
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | null
  methods: string[]
  resolution_at_l3: string | null
}

// The full Case object — input AND output of POST /api/pipeline/run.
// Every field is optional on the request side (Pydantic defaults fill
// in); on the response side derived state is populated by the engine.
export interface Case {
  id?: string
  study_phase?: StudyPhase

  // User answers
  q1?: Q1 | null
  q2?: Q2 | null
  q3?: Q3
  q4?: Q4[]
  q5?: Q5 | null
  q6a?: Q6a | null
  q6b?: Q6b | null
  q7?: Q7 | null

  flows?: Flow[]
  sites?: Site[]
  alternative_scenarios?: AlternativeScenario[]

  // Derived state (set by engine)
  ilcd_situation?: IlcdSituation | null
  lcc_type?: LccType | null
  slca_activation_state?: SlcaActivationState | null
  pathway_id?: PathwayId | null
  is_01_extended?: boolean

  // Engine-written pillar configs (free-form dicts keyed by dotted-path tail)
  lca?: Record<string, unknown>
  lcc?: Record<string, unknown>
  slca?: Record<string, unknown>
  report?: Record<string, unknown>
  governance?: Record<string, unknown>
  methodological_charter?: Record<string, unknown>
  review?: Record<string, unknown>
  system?: Record<string, unknown>

  // Advanced overrides
  advanced?: Record<string, unknown>

  // Engine output traces
  activated_nodes?: string[]
  blocked_by?: string[]
  rule_violations?: RuleViolation[]
  cdp_flags?: CdpFlag[]
}
