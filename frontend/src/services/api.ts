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

const API_BASE_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  'http://localhost:8088'

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
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
export async function fetchReportDocx(input: Case): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/api/pipeline/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
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

export function checkHealth(): Promise<{ status: string; version: string }> {
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
  return fetch(`${API_BASE_URL}/api/cases/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res.ok) {
      throw new ApiError(res.status, res.statusText)
    }
  })
}
