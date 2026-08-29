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

export interface DcfData {
  schema_version: string
  case_id: string
  rows_by_section: Record<string, DcfRow[]>
  layout: Record<string, DcfNodePosition>
  updated_at?: string | null
}

export interface DcfDataIssue {
  code: string
  section_id: string
  row_id: string | null
  field_id: string | null
  detail: string
}

export interface DcfSectionCompleteness {
  section_id: string
  rows: number
  required_fields: number
  filled_required: number
}

export interface DcfDataValidation {
  errors: DcfDataIssue[]
  missing_required: DcfDataIssue[]
  completeness: DcfSectionCompleteness[]
}

export interface DcfDataEnvelope {
  data: DcfData
  validation: DcfDataValidation
}

export const DCF_DATA_SCHEMA_VERSION = '1.0'

// Section ids the Network Builder edits.
export const ACTORS_SECTION = 'actors'
export const FLOW_MATRIX_SECTION = 'flow_matrix'
