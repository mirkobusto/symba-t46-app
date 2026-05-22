// TS mirror of backend/app/engine/dcf_compose.py:DcfPayload.
// Kept in sync manually with the Pydantic v2 source-of-truth.

export interface DcfFieldDescriptor {
  id: string
  label_en: string
  type: string
  required: boolean
  activation_predicate: string
  enum_values?: string[] | null
  enum_ref?: string | null
  description_en?: string | null
  default?: unknown
  min?: number | null
  max?: number | null
  row_condition?: string | null
  source_ref?: string | null
}

export interface DcfSection {
  id: string
  title_en: string
  description_en: string
  applies_when: string
  row_collection: string
  active: boolean
  fields: DcfFieldDescriptor[]
}

export interface DcfMandate {
  node_id: string
  method: string
  statement: string
  category: string
  trigger_q?: string[] | null
  trigger_condition?: string | null
  source_section?: string | null
}

// The Pydantic model serializes render_spec as a free-form dict; the
// shape below describes the keys we actually consume in
// NetworkDiagram.tsx. Extra keys are tolerated.
export interface NetworkRenderSpec {
  nodes?: {
    source?: string
    color_by?: string
    shape_by?: string
    shape_map?: Record<string, string>
    label?: string
  }
  edges?: {
    source?: string
    from?: string
    to?: string
    thickness_by?: string
    color_by?: string
    label?: string
  }
  annotations?: {
    badges?: string[]
    icons_for_active_dims?: string[]
  }
  layout?: {
    default?: string
    alternative?: string
  }
  export_targets?: string[]
  library_candidate?: string
  library_license?: string
}

export interface DcfPayload {
  schema_version: string
  case_id: string
  pathway_id: string | null
  ilcd_situation: string | null
  lcc_type: string | null
  slca_activation_state: string | null
  is_01_extended: boolean
  sections: DcfSection[]
  mandates_by_category: Record<string, DcfMandate[]>
  network_render_spec: NetworkRenderSpec | null
}
