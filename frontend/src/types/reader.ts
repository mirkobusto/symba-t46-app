// TS mirror of backend/app/routers/public.py (PublicReport,
// RegionAggregate). Keep in sync with the Python source.

import type { Case } from './api'
import type { ScoringPayload } from './scoring'

export interface PublicReportResponse {
  id: string
  name: string
  pathway_id: string | null
  created_at: string
  updated_at: string
  case: Case
  scoring: ScoringPayload | null
}

export interface PublicRegionEntry {
  key: string
  count: number
}

export interface PublicRegionResponse {
  region: string
  total: number
  by_pathway: PublicRegionEntry[]
  by_sector: PublicRegionEntry[]
}
