// Singleton fetch wrapper for the SYMBA T4.6 backend.
//
// The only endpoint used in 4-A is POST /api/pipeline/run; the
// `request<T>` helper is generic so future routes (sessions, etc.)
// can reuse the error-handling and JSON-marshalling convention.

import type { Case } from '../types/api'

const API_BASE_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  'http://localhost:8001'

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

export function checkHealth(): Promise<{ status: string; version: string }> {
  return request('/health')
}
