// TS mirror of backend/app/domain/scoring.py (Pydantic v2).
// Kept in sync manually with the Python source-of-truth.

export type Dimension = 'env' | 'eco' | 'soc'

export interface ScoringIndicator {
  id: string
  label_en: string
  dimension: Dimension
  value: number | null
  unit: string | null
  scale_min: number | null
  scale_max: number | null
  interpretation_en: string | null
  source_ref: string | null
}

export interface ScoringPayload {
  case_id: string
  source: string
  schema_version: string
  computed_at: string | null
  indicators: ScoringIndicator[]
  notes: string | null
}

// ----- /api/cases/aggregate/breakdown -----

export interface AggregateBreakdownEntry {
  key: string
  count: number
}

export interface CasesAggregate {
  total: number
  by_pathway: AggregateBreakdownEntry[]
  by_q6a_sector: AggregateBreakdownEntry[]
  by_q7_geographic_scope: AggregateBreakdownEntry[]
  by_ilcd_situation: AggregateBreakdownEntry[]
}
