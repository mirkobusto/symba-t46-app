// SPEC §3.5 — TypeScript types che mirrorano le response del backend Pydantic.
// Vedi backend/app/schemas/ e backend/app/domain/models_domain.py per riferimento.

export type SessionStatus =
  | 'draft'
  | 'answers_complete'
  | 'pathway_resolved'
  | 'archived'

export interface TraceEntry {
  deliverable: string
  section: string
  node_id: string
  node_type?: string | null
  [extra: string]: unknown
}

export interface QuestionOption {
  value: string | boolean
  label: string
  [extra: string]: unknown
}

export interface Question {
  id: string
  key: string
  label: string
  description: string
  options: QuestionOption[]
  trace: TraceEntry[]
  post_processing_trigger?: string | null
  [extra: string]: unknown
}

export interface QuestionsListResponse {
  questions: Question[]
}

export interface PathwayMetadata {
  id: string
  name: string
  description?: string | null
  answer_fingerprint: Record<string, unknown>
  configuration: PathwayConfiguration
  trace: TraceEntry[]
  warnings: string[]
  use_cases_examples: string[]
  [extra: string]: unknown
}

export interface PathwaysListResponse {
  pathways: PathwayMetadata[]
}

// Configuration is loose: campi possono variare per pathway.
export interface PathwayConfiguration {
  lca?: Record<string, unknown>
  lcc?: Record<string, unknown>
  slca?: Record<string, unknown>
  [extra: string]: unknown
}

export interface ViolatedConstraint {
  deliverable: string
  section: string
  node_id: string
  rationale?: string | null
  [extra: string]: unknown
}

export interface BlockInfo {
  block_id: string
  message: string
  suggested_resolutions: string[]
  violated_constraints: ViolatedConstraint[]
  trace: TraceEntry[]
}

export interface InvariantViolation {
  invariant_id: string
  severity: string
  message: string
}

export interface PathwayResolutionResponse {
  session_id: string
  resolved_at: string
  pathway_id: string | null
  pathway_name: string | null
  configuration: PathwayConfiguration | null
  applied_rules: string[]
  warnings: string[]
  invariant_violations: InvariantViolation[]
  blocked: boolean
  block_info: BlockInfo | null
  trace: TraceEntry[]
  match_distance: number | null
}

// ---- Sessions -------------------------------------------------------------

export interface SessionCreateRequest {
  case_name?: string | null
  notes?: string | null
}

export interface SessionResponse {
  id: string
  created_at: string
  updated_at: string
  status: SessionStatus
  case_name: string | null
  notes: string | null
  answers_count: number
  pathway_resolved: boolean
}

export interface AnswerOut {
  question_id: string
  value: unknown
  created_at: string
  updated_at: string
}

export interface SessionDetailResponse extends SessionResponse {
  answers: AnswerOut[]
}

export interface AnswerSubmitRequest {
  question_id: string
  value: unknown
}

export interface AnswersSubmitResponse {
  session_id: string
  accepted: string[]
  rejected: { question_id?: string; reason?: string; [k: string]: unknown }[]
  answers_count: number
  status: SessionStatus
}
