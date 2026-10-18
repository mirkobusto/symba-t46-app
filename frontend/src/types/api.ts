// TypeScript types mirroring the Pydantic v2 Case model in
// backend/app/domain/models.py (Sprint 4 Step 3).
//
// Source-of-truth is the Python side. These types are kept in sync
// manually for now; a codegen step (e.g. via openapi-typescript) is
// deferred until the API surface stabilises.

export type Q1 = 'A' | 'B' | 'C' | 'D' | 'E'
// Q2: do the exchanges the study measures already take place? A yes (ex-post),
// B not yet (ex-ante). The former C and D load as B (2026-10-18).
export type Q2 = 'A' | 'B'
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
// Q7: how concentrated the key interactions are (one site / regional / across
// regions). The former D loads as C (2026-10-18).
export type Q7 = 'A' | 'B' | 'C'
// Q7b: scope of the market the reference (displaced) products come from (D4.1 §11.3.1)
export type ReferenceMarketScope = 'national' | 'sub_national' | 'continental'
// Q0: purpose of the study, D4.1 §4.3.2 typology (Mattila et al. 2012); derives nothing
export type StudyPurpose = 'analysis' | 'improvement' | 'expansion' | 'design' | 'restructuring'

export type IlcdSituation =
  | 'ILCD Situation A'
  | 'ILCD Situation B'
  | 'ILCD Situation C1'
  | 'ILCD Situation C2'

export type LccType = 'deactivated' | 'C+E' | 'C+E+S' | 'C-LCC' | 'C+N' | 'C+N+S'
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
  /** Freedom-to-Act (D4.1 §8.3.3): would a third party pay for it? Unset = not answered. */
  sellable_elsewhere?: boolean | null
  /** One of the D4.1 Part 2 sectors (Q6a ids); names the sector chapter in a note. */
  sector?: Q6a | null
  /** D4.1 Part 2 typical configuration (§4.1-§8.1) within the sector's chapter. */
  configuration?: string | null
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
  ilcd_situation: string | null
  created_at: string
  updated_at: string
}

export interface CaseDetail {
  id: string
  name: string
  slug?: string | null
  ilcd_situation: string | null
  created_at: string
  updated_at: string
  case: Case
}

export interface RuleViolation {
  rule_id: string
  message: string
  /** Rule title, e.g. "Geographic Spread Transport Coupling". */
  name?: string | null
  /** Human-readable trigger, e.g. "Q7 ∈ {B, C, D}" — why it fired here. */
  trigger?: string | null
  /** Field paths the rule requires to be set — what to fill in. */
  fields?: string[]
  source_nodes?: string[]
}

/**
 * A rule whose trigger fired: a methodological practice this case has to
 * document. Not an error — see backend/app/engine/l2_validate.py on why
 * the assertions cannot verify choices made outside the tool.
 */
export interface ApplicableRule {
  rule_id: string
  name?: string | null
  statement: string
  trigger?: string | null
  fields?: string[]
  source_nodes?: string[]
}

export type DecisionContext = 'micro' | 'structural' | 'none' | 'corporate_report'
/** Q11 — what the study compares (D4.1 Part 2 §4.3, §6.3, §8.3). */
export type ComparisonGoal = 'waste_treatment' | 'product_substitution' | 'co_primary'

/** A note on the user's answers; informational, never blocks the run. */
/** A D4.1 Part 2 sector rule for a chapter the case touches (engine/sector_rules). */
export interface SectorRule {
  chapter_key: string
  chapter: string
  activated_by: { kind: 'flow' | 'case_sector'; name?: string }[]
  id: string
  group: string
  strength: 'must' | 'should' | 'descriptive'
  applies_when: string | null
  statement: string
  source: string
  lines: string
  note?: string | null
  /** configuration lines only: structured, so the client can translate the line */
  configuration_id?: string
  flow_name?: string
  substitutes?: string
}

export interface CaseWarning {
  code: string
  message: string
  /** flow, chapter (§4…§8), declared, configuration, variant: for the translated text */
  params?: Record<string, string>
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
  /** Q0: purpose of the study (D4.1 §4.3.2); notes only */
  study_purpose?: StudyPurpose | null
  q2?: Q2 | null
  /** Q2b, only with Q2 = A: has the network run for many years? (D4.1 §11.2.2) */
  network_long_standing?: boolean | null
  q3?: Q3
  q4?: Q4[]
  q5?: Q5 | null
  q6a?: Q6a | null
  q6b?: Q6b | null
  q7?: Q7 | null
  // Optional Q8: the study's time horizon, one for LCA and LCC. Q8a when the
  // system operates (null = the year of the study),
  // Q8b analysis period in years, Q8c technical lifetime of the main assets
  // (used only when Q8b is empty; null = falls back to advanced.asset_lifetime).
  operating_start?: 'now' | 'future' | null
  operating_start_year?: number | null
  analysis_period_years?: number | null
  asset_lifetime_years?: number | null
  // Q9 (required in the questionnaire): does the study support a decision, and at
  // what scale (D4.1 Table 1). null/absent = read off Q1, with a note (old cases).
  decision_context?: DecisionContext | null
  // Q9b (only with Q9 = structural): is the market screening documented
  // (about 1% or more of new capacity, D4.1 §11.3.1)? false = Situation A with
  // B as a sensitivity; null = B, with a note asking for the proof.
  market_screening_documented?: boolean | null
  // Q10 (required with the economic dimension): a public policy or planning
  // objective, or a public decision-maker (D4.2 §2.2-2.3, adds the S-LCC).
  // null/absent = read off Q1, with a note (old cases).
  policy_objective?: boolean | null
  comparison_goal?: ComparisonGoal | null
  /** Q7b: name and scope of the reference market (not the market of the symbiosis products). */
  reference_market_region?: string | null
  reference_market_scope?: ReferenceMarketScope | null
  /** Q12: does the symbiosis need new dedicated shared assets? (D4.2 §4.2, D4.1 §6.3.3) */
  dedicated_shared_assets?: boolean | null

  flows?: Flow[]
  sites?: Site[]
  alternative_scenarios?: AlternativeScenario[]

  // Derived state (set by engine)
  ilcd_situation?: IlcdSituation | null
  lcc_type?: LccType | null
  slca_activation_state?: SlcaActivationState | null

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
  applicable_rules?: ApplicableRule[]
  cdp_flags?: CdpFlag[]
  warnings?: CaseWarning[]
  sector_rules?: SectorRule[]
}
