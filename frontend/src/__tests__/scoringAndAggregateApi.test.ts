import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ApiError,
  fetchCasesAggregate,
  fetchScoring,
  putScoring,
} from '../services/api'

const ok = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as Response

const notFound = (detail: string) =>
  ({
    ok: false,
    status: 404,
    statusText: 'Not Found',
    json: () => Promise.resolve({ detail }),
    text: () => Promise.resolve(JSON.stringify({ detail })),
  }) as Response

describe('scoring API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetchScoring returns the payload on 200', async () => {
    const sample = {
      case_id: 'abc',
      source: 'CIRCE',
      schema_version: '1.0-draft',
      computed_at: null,
      indicators: [],
      notes: null,
    }
    const mock = vi.fn(() => Promise.resolve(ok(sample))) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const result = await fetchScoring('abc')
    expect(result.case_id).toBe('abc')
  })

  it('fetchScoring throws ApiError on 404', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(notFound('No scoring')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await expect(fetchScoring('abc')).rejects.toBeInstanceOf(ApiError)
  })

  it('putScoring PUTs the payload', async () => {
    const payload = {
      case_id: 'abc',
      source: 'CIRCE',
      schema_version: '1.0-draft',
      computed_at: null,
      indicators: [],
      notes: null,
    }
    const mock = vi.fn(() => Promise.resolve(ok(payload))) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await putScoring('abc', payload)
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [url, init] = calls[0] as [string, RequestInit]
    expect(String(url)).toContain('/api/scoring/abc')
    expect(init?.method).toBe('PUT')
  })
})

describe('aggregate API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetchCasesAggregate returns the breakdown', async () => {
    const sample = {
      total: 3,
      by_pathway: [{ key: 'IS-01', count: 2 }, { key: 'IS-02', count: 1 }],
      by_q6a_sector: [],
      by_q7_geographic_scope: [],
      by_ilcd_situation: [],
    }
    const mock = vi.fn(() => Promise.resolve(ok(sample))) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const result = await fetchCasesAggregate()
    expect(result.total).toBe(3)
    expect(result.by_pathway[0].key).toBe('IS-01')
  })
})
