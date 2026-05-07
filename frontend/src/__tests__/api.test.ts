import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { api, ApiError } from '../services/api'

function mockFetchOnce(payload: unknown, init: { ok?: boolean; status?: number } = {}) {
  const ok = init.ok ?? true
  const status = init.status ?? (ok ? 200 : 400)
  return vi.fn(() =>
    Promise.resolve({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      text: () =>
        Promise.resolve(
          typeof payload === 'string' ? payload : JSON.stringify(payload),
        ),
      json: () => Promise.resolve(payload),
    } as unknown as Response),
  )
}

describe('api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createSession POSTs to /api/sessions and returns session', async () => {
    const fetchMock = mockFetchOnce({
      id: 'abc',
      created_at: 't',
      updated_at: 't',
      status: 'draft',
      case_name: 'X',
      notes: null,
      answers_count: 0,
      pathway_resolved: false,
    })
    vi.stubGlobal('fetch', fetchMock)
    const session = await api.createSession({ case_name: 'X' })
    expect(session.id).toBe('abc')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    const [url, init] = call
    expect(url).toContain('/api/sessions')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ case_name: 'X' }))
  })

  it('submitAnswers wraps payload in {answers}', async () => {
    const fetchMock = mockFetchOnce({
      session_id: 's1',
      accepted: ['q1'],
      rejected: [],
      answers_count: 1,
      status: 'draft',
    })
    vi.stubGlobal('fetch', fetchMock)
    const res = await api.submitAnswers('s1', [{ question_id: 'q1', value: 'A' }])
    expect(res.accepted).toEqual(['q1'])
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    const [, init] = call
    expect(init.body).toBe(
      JSON.stringify({ answers: [{ question_id: 'q1', value: 'A' }] }),
    )
  })

  it('throws ApiError with parsed FastAPI detail', async () => {
    const fetchMock = mockFetchOnce(
      { detail: 'session not found' },
      { ok: false, status: 404 },
    )
    vi.stubGlobal('fetch', fetchMock)
    await expect(api.getSession('missing')).rejects.toBeInstanceOf(ApiError)
    try {
      await api.getSession('missing')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiErr = err as ApiError
      expect(apiErr.status).toBe(404)
      expect(apiErr.detail).toBe('session not found')
    }
  })
})
