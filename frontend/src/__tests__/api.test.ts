import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, runPipeline } from '../services/api'

const okResponse = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as Response

const errResponse = (status: number, detail: string) =>
  ({
    ok: false,
    status,
    statusText: 'Bad Request',
    json: () => Promise.resolve({ detail }),
    text: () => Promise.resolve(JSON.stringify({ detail })),
  }) as Response

describe('runPipeline', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs the case and returns the response body', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(okResponse({ pathway_id: 'IS-01' })),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)
    const result = await runPipeline({ q1: 'A' })
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock
      .calls
    expect(calls.length).toBe(1)
    const [url, init] = calls[0] as [string, RequestInit]
    expect(String(url)).toContain('/api/pipeline/run')
    expect(init?.method).toBe('POST')
    expect(result.pathway_id).toBe('IS-01')
  })

  it('throws ApiError with detail on 400', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(errResponse(400, "Invalid Q1: None"))),
    )
    await expect(runPipeline({})).rejects.toBeInstanceOf(ApiError)
    try {
      await runPipeline({})
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).status).toBe(400)
      expect((e as ApiError).detail).toContain('Invalid Q1')
    }
  })
})
