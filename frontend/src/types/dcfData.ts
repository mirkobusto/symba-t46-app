// TS mirror of backend/app/domain/dcf_data.py.
// Kept in sync manually with the Pydantic v2 source-of-truth.
//
// DcfPayload (types/dcf.ts) says WHICH fields this case must fill in;
// DcfData is WHAT the analyst actually entered. Rows are identified by a
// client-assigned `row_id`: the schema's own id field (actor.id, flow.id)
// is derived from it server-side, foreign keys reference it, and the
// Network Builder canvas layout is keyed by it.

export interface DcfRow {
  row_id: string
  values: Record<string, unknown>
}

export interface DcfNodePosition {
  x: number
  y: number
}

/** The network of one alternative scenario: actors and flows only, a copy
 * of the case's network made on the first edit (designed by Fable, owner OK
 * 2026-11-04). */
export interface DcfNetworkVariant {
  rows_by_section: Record<string, DcfRow[]>
  layout: Record<string, DcfNodePosition>
}

/** What the files say to whoever receives them, set on the DCF page before
 * sending (UX round 6, P8-02): return-by date (YYYY-MM-DD), contact, version. */
export interface DcfSending {
  return_by?: string | null
  contact?: string | null
  version?: string | null
}

export interface DcfData {
  schema_version: string
  case_id: string
  /** Absent in content saved before 2026-11-08. */
  sending?: DcfSending | null
  rows_by_section: Record<string, DcfRow[]>
  layout: Record<string, DcfNodePosition>
  /** Keyed by AlternativeScenario.id; absent in content saved before 1.1. */
  networks_by_scenario?: Record<string, DcfNetworkVariant>
  updated_at?: string | null
}

export interface DcfDataIssue {
  code: string
  section_id: string
  row_id: string | null
  field_id: string | null
  detail: string
  scenario_id?: string | null
}

export interface DcfSectionCompleteness {
  section_id: string
  rows: number
  required_fields: number
  filled_required: number
}

export interface DcfDataValidation {
  errors: DcfDataIssue[]
  /** Values kept for a section or field this configuration does not ask for:
   * stored, never exported (UX round 5, D3). Absent from older responses. */
  dormant?: DcfDataIssue[]
  missing_required: DcfDataIssue[]
  completeness: DcfSectionCompleteness[]
}

export interface DcfDataEnvelope {
  data: DcfData
  validation: DcfDataValidation
}

export const DCF_DATA_SCHEMA_VERSION = '1.1'

// Section ids the Network Builder edits.
export const ACTORS_SECTION = 'actors'
export const FLOW_MATRIX_SECTION = 'flow_matrix'
export const FLOW_CLASSIFICATION_SECTION = 'flow_classification'
