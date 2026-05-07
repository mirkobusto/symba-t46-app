// SPEC §3.6 — singleton API client. Wrapper su fetch nativo.

import type {
  AnswerSubmitRequest,
  AnswersSubmitResponse,
  PathwayResolutionResponse,
  PathwaysListResponse,
  QuestionsListResponse,
  SessionCreateRequest,
  SessionDetailResponse,
  SessionResponse,
} from '../types/api'

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
        // FastAPI errors come as {"detail": "..."} JSON
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
      // ignore body read errors
    }
    throw new ApiError(res.status, detail)
  }
  if (res.status === 204) return null as T
  return (await res.json()) as T
}

export const api = {
  // Decision engine -------------------------------------------------------
  getQuestions: (): Promise<QuestionsListResponse> =>
    request('/api/decision-engine/questions'),

  getPathways: (): Promise<PathwaysListResponse> =>
    request('/api/decision-engine/pathways'),

  // Sessions --------------------------------------------------------------
  createSession: (input?: SessionCreateRequest): Promise<SessionResponse> =>
    request('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(input ?? {}),
    }),

  getSession: (id: string): Promise<SessionDetailResponse> =>
    request(`/api/sessions/${encodeURIComponent(id)}`),

  deleteSession: (id: string): Promise<SessionResponse> =>
    request(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  submitAnswers: (
    id: string,
    answers: AnswerSubmitRequest[],
  ): Promise<AnswersSubmitResponse> =>
    request(`/api/sessions/${encodeURIComponent(id)}/answers`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  resolveSession: (id: string): Promise<PathwayResolutionResponse> =>
    request(`/api/sessions/${encodeURIComponent(id)}/resolve`, {
      method: 'POST',
    }),

  getPathway: (id: string): Promise<PathwayResolutionResponse> =>
    request(`/api/sessions/${encodeURIComponent(id)}/pathway`),

  // Health ----------------------------------------------------------------
  getHealth: (): Promise<{ status: string; version?: string }> =>
    request('/api/health'),
}

export const apiBaseUrl = API_BASE_URL
