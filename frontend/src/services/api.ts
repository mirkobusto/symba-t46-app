// Singleton fetch wrapper for the SYMBA T4.6 backend.
//
// The only endpoint used in 4-A is POST /api/pipeline/run; the
// `request<T>` helper is generic so future routes (sessions, etc.)
// can reuse the error-handling and JSON-marshalling convention.

import type {
  Case,
  CaseDetail,
  CaseSummary,
  ScenarioInput,
  ScenariosResponse,
} from '../types/api'
import i18n from '../i18n'
import { currentAuthToken, useAuthStore } from '../store/authStore'
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserPublic,
} from '../types/auth'
import type { DcfPayload } from '../types/dcf'
import type { DcfData, DcfDataEnvelope, DcfSending } from '../types/dcfData'
import type { PublicRegionResponse, PublicReportResponse } from '../types/reader'
import type { CasesAggregate, ScoringPayload } from '../types/scoring'

/**
 * Where the browser finds the API.
 *
 * `VITE_BACKEND_URL` wins when set (an empty string means "same origin").
 * Otherwise: in a production build the backend serves the frontend, so the API is on the
 * same origin and the base is empty (this is what makes the Docker image work behind any
 * domain); in development Vite serves the page on another port, so the API is on
 * localhost:8088. The production image used to bake in localhost:8088, which a visitor's
 * browser would have taken for its own machine.
 */
export function resolveApiBase(env: { VITE_BACKEND_URL?: string; PROD?: boolean }): string {
  return env.VITE_BACKEND_URL ?? (env.PROD ? '' : 'http://localhost:8088')
}

const API_BASE_URL: string = resolveApiBase({
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string | undefined,
  PROD: import.meta.env.PROD,
})

/** The address to show when the backend is unreachable: the API base, or this origin when it is the same. */
export function apiOriginLabel(): string {
  return API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
}

export class ApiError extends Error {
  status: number
  detail: string
  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

function authHeader(): Record<string, string> {
  const token = currentAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Paths where a 401 means wrong credentials, not an expired session. */
const SIGN_IN_PATHS = ['/api/auth/login', '/api/auth/register']

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const sentToken = currentAuthToken() !== null
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(init?.headers ?? {}),
    },
  })
  // the server no longer accepts the token (expired, or a new signing secret):
  // forget it, so the page stops showing someone signed in (Kimi test
  // 2026-11-04, A8-08). The case draft stays in the browser.
  if (res.status === 401 && sentToken && !SIGN_IN_PATHS.includes(path)) {
    useAuthStore.getState().clearSession()
  }
  if (!res.ok) {
    let detail = res.statusText
    try {
      const text = await res.text()
      if (text) {
        try {
          const parsed = JSON.parse(text) as { detail?: unknown }
          if (parsed && typeof parsed.detail === 'string') {
            detail = parsed.detail
          } else {
            detail = text
          }
        } catch {
          detail = text
        }
      }
    } catch {
      // fall through; keep statusText
    }
    throw new ApiError(res.status, detail)
  }
  return (await res.json()) as T
}

export function runPipeline(input: Case): Promise<Case> {
  return request<Case>('/api/pipeline/run', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

/**
 * POST the case to /api/pipeline/report and return the .docx as a Blob.
 * Caller is responsible for triggering the browser download (e.g. via
 * URL.createObjectURL + a temporary <a download>).
 */
export interface ReportRow {
  label: string
  value: string
  why?: string
}

/** The cover of the case report: who and what it is about (UX round 2026-11-08). */
export interface ReportMeta {
  case_name?: string | null
  case_ref?: string | null
  prepared_by?: string | null
  contact?: string | null
  generated_on?: string | null
  saved_on?: string | null
  state?: 'saved' | 'diverged' | 'unsaved' | null
}

export interface ReportSectorChapter {
  chapter: string
  reason?: string | null
  rules: { strength: string; text: string; source?: string | null; condition?: string | null; note?: string | null }[]
}

/** What a scenario changes in the configuration rows and in its network. */
export interface ReportScenario {
  id: string
  config: string[]
  network: string[]
}

export interface ReportExtras {
  meta?: ReportMeta
  sector?: ReportSectorChapter[]
  scenarios?: ReportScenario[]
  guided?: boolean
}

export async function fetchReportDocx(input: Case, rows: ReportRow[] = [], extras: ReportExtras = {}): Promise<Blob> {
  // the case report comes in the interface language (UX round 2026-11-02), with
  // the result page's "Your configuration" rows (UX round 2026-11-03), and the
  // cover, the sector rules and the scenario changes worded by the page (2026-11-08)
  const res = await fetch(`${API_BASE_URL}/api/pipeline/report${langQuery()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ case: input, rows, ...extras }),
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const text = await res.text()
      try {
        const parsed = JSON.parse(text) as { detail?: unknown }
        if (parsed && typeof parsed.detail === 'string') detail = parsed.detail
        else detail = text
      } catch {
        detail = text
      }
    } catch {
      // keep statusText
    }
    throw new ApiError(res.status, detail)
  }
  return res.blob()
}

export function checkHealth(): Promise<{ status: string; version: string; anonymous_save?: boolean }> {
  return request('/health')
}

export function runScenarios(
  baseline: Case,
  scenarios: ScenarioInput[],
): Promise<ScenariosResponse> {
  return request<ScenariosResponse>('/api/pipeline/run-scenarios', {
    method: 'POST',
    body: JSON.stringify({ baseline, scenarios }),
  })
}

// ----- Cases CRUD (Feature D) -----

export function listCases(): Promise<CaseSummary[]> {
  return request<CaseSummary[]>('/api/cases')
}

export function getCase(id: string): Promise<CaseDetail> {
  return request<CaseDetail>(`/api/cases/${encodeURIComponent(id)}`)
}

/** Turn the public report of a saved case on or off (UX round 2026-11-03). */
export function shareCase(
  id: string, body: { shared: boolean; prepared_by?: string | null; case_contact?: string | null },
): Promise<CaseDetail> {
  return request<CaseDetail>(`/api/cases/${encodeURIComponent(id)}/share`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function createCase(name: string, kase: Case): Promise<CaseDetail> {
  return request<CaseDetail>('/api/cases', {
    method: 'POST',
    body: JSON.stringify({ name, case: kase }),
  })
}

export function updateCase(
  id: string, name: string, kase: Case,
): Promise<CaseDetail> {
  return request<CaseDetail>(`/api/cases/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ name, case: kase }),
  })
}

export function deleteCase(id: string): Promise<void> {
  // the token was missing here, so a signed-in owner got 403 on their own case
  return fetch(`${API_BASE_URL}/api/cases/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeader(),
  }).then((res) => {
    if (!res.ok) {
      throw new ApiError(res.status, res.statusText)
    }
  })
}

// ----- DCF (Phase 2 backend, Phase 3 frontend integration) -----

// the Data Collection File comes back in the interface language: page,
// network editor, Excel and Word (UX round 2026-11-02)
function langQuery(): string {
  return `?lang=${encodeURIComponent(i18n.language || 'en')}`
}

export function fetchDcfPreview(input: Case): Promise<DcfPayload> {
  return request<DcfPayload>(`/api/dcf/preview${langQuery()}`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

/** A row of the result page's "Your configuration", sent with a download so
 * the cover of the files says the same (UX round 5, D7). */
export interface CoverRow {
  label: string
  value: string
  why?: string
}

async function fetchDcfBlob(path: string, body: unknown): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}${path}${langQuery()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const text = await res.text()
      try {
        const parsed = JSON.parse(text) as { detail?: unknown }
        if (parsed && typeof parsed.detail === 'string') detail = parsed.detail
        else detail = text
      } catch {
        detail = text
      }
    } catch {
      // keep statusText
    }
    throw new ApiError(res.status, detail)
  }
  return res.blob()
}

/**
 * Exports of a *saved* case: the workbook and the document come back
 * pre-filled with whatever the Network Builder stored for it, and with the
 * configuration rows on the cover. The draft variants below are for cases
 * never saved — they have no case id to look content up by.
 */
// `networkPng`: the network as drawn on screen (data URL), placed in both files;
// `sending`: deadline, contact and version set on the DCF page (UX round 6, P8-02)
export function fetchDcfXlsxForCase(
  caseId: string, rows: CoverRow[] = [], networkPng: string | null = null, sending: DcfSending | null = null,
): Promise<Blob> {
  return fetchDcfBlob(`/api/dcf/${encodeURIComponent(caseId)}/export/xlsx`,
    { rows, network_png: networkPng ?? undefined, sending: sending ?? undefined })
}

export function fetchDcfDocxForCase(
  caseId: string, rows: CoverRow[] = [], networkPng: string | null = null, sending: DcfSending | null = null,
): Promise<Blob> {
  return fetchDcfBlob(`/api/dcf/${encodeURIComponent(caseId)}/export/docx`,
    { rows, network_png: networkPng ?? undefined, sending: sending ?? undefined })
}

export function fetchDcfXlsx(
  input: Case, rows: CoverRow[] = [], networkPng: string | null = null, sending: DcfSending | null = null,
): Promise<Blob> {
  return fetchDcfBlob('/api/dcf/export/xlsx',
    { case: input, rows, network_png: networkPng ?? undefined, sending: sending ?? undefined })
}

export function fetchDcfDocx(
  input: Case, rows: CoverRow[] = [], networkPng: string | null = null, sending: DcfSending | null = null,
): Promise<Blob> {
  return fetchDcfBlob('/api/dcf/export/docx',
    { case: input, rows, network_png: networkPng ?? undefined, sending: sending ?? undefined })
}

// ----- Stored DCF content (Network Builder) -----

/**
 * Returns the DCF content stored for a *saved* case, with a freshly
 * computed validation report. Throws ApiError(404) when nothing has been
 * stored yet — callers read that as "empty file, start from the seed".
 */
export function fetchDcfData(caseId: string): Promise<DcfDataEnvelope> {
  return request<DcfDataEnvelope>(
    `/api/dcf/${encodeURIComponent(caseId)}/data`,
  )
}

/** Full replace. Rejects with ApiError(422) on structural errors; empty
 * required fields come back in `validation.missing_required` instead. */
export function putDcfData(
  caseId: string,
  data: DcfData,
): Promise<DcfDataEnvelope> {
  return request<DcfDataEnvelope>(
    `/api/dcf/${encodeURIComponent(caseId)}/data`,
    { method: 'PUT', body: JSON.stringify(data) },
  )
}

export function deleteDcfData(caseId: string): Promise<void> {
  return fetch(`${API_BASE_URL}/api/dcf/${encodeURIComponent(caseId)}/data`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  }).then((res) => {
    if (!res.ok && res.status !== 404) {
      throw new ApiError(res.status, res.statusText)
    }
  })
}

// ----- Scoring (Phase B — CIRCE I/O specification still TBD) -----

/**
 * Returns the scoring payload for `caseId` if any has been ingested.
 * Throws ApiError(404) when no scoring is available yet; callers
 * typically interpret 404 as "scoring not yet provided by CIRCE".
 */
export function fetchScoring(caseId: string): Promise<ScoringPayload> {
  return request<ScoringPayload>(
    `/api/scoring/${encodeURIComponent(caseId)}`,
  )
}

export function putScoring(
  caseId: string,
  payload: ScoringPayload,
): Promise<ScoringPayload> {
  return request<ScoringPayload>(`/api/scoring/${encodeURIComponent(caseId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// ----- Aggregate (Phase B — multi-stakeholder dashboard) -----

export function fetchCasesAggregate(): Promise<CasesAggregate> {
  return request<CasesAggregate>('/api/cases/aggregate/breakdown')
}

// ----- Public reader (Phase 6 — no-auth share URLs) -----

export function fetchPublicReport(key: string): Promise<PublicReportResponse> {
  return request<PublicReportResponse>(
    `/api/public/report/${encodeURIComponent(key)}`,
  )
}

export function fetchPublicRegion(code: string): Promise<PublicRegionResponse> {
  return request<PublicRegionResponse>(
    `/api/public/region/${encodeURIComponent(code)}`,
  )
}

// ----- Auth (Phase D) -----

export function authRegister(payload: RegisterRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function authLogin(payload: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function authMe(): Promise<UserPublic> {
  return request<UserPublic>('/api/auth/me')
}
