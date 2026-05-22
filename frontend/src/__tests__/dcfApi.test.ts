import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchDcfDocx, fetchDcfPreview, fetchDcfXlsx } from '../services/api'

const okJsonResponse = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as Response

const okBlobResponse = (mimeType: string) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    blob: () => Promise.resolve(new Blob([new Uint8Array([1, 2, 3])], { type: mimeType })),
  }) as Response

const errResponse = (status: number, detail: string) =>
  ({
    ok: false,
    status,
    statusText: 'Bad Request',
    text: () => Promise.resolve(JSON.stringify({ detail })),
  }) as Response

describe('DCF API client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetchDcfPreview POSTs the case and returns the DcfPayload', async () => {
    const samplePayload = {
      schema_version: '1.0-draft',
      case_id: 'abc',
      pathway_id: 'IS-01',
      ilcd_situation: null,
      lcc_type: null,
      slca_activation_state: null,
      is_01_extended: false,
      sections: [],
      mandates_by_category: {},
      network_render_spec: null,
    }
    const mock = vi.fn(() =>
      Promise.resolve(okJsonResponse(samplePayload)),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const result = await fetchDcfPreview({ q1: 'B' })

    expect(result.pathway_id).toBe('IS-01')
    expect(result.case_id).toBe('abc')
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [url, init] = calls[0] as [string, RequestInit]
    expect(String(url)).toContain('/api/dcf/preview')
    expect(init?.method).toBe('POST')
  })

  it('fetchDcfXlsx returns a Blob and hits the right URL', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(
        okBlobResponse(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ),
      ),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const blob = await fetchDcfXlsx({ q1: 'B' })

    expect(blob).toBeInstanceOf(Blob)
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    expect(String(calls[0][0])).toContain('/api/dcf/export/xlsx')
  })

  it('fetchDcfDocx returns a Blob and hits the right URL', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(
        okBlobResponse(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ),
      ),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const blob = await fetchDcfDocx({ q1: 'B' })

    expect(blob).toBeInstanceOf(Blob)
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    expect(String(calls[0][0])).toContain('/api/dcf/export/docx')
  })

  it('fetchDcfXlsx surfaces error detail on failure', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(errResponse(400, 'q1 missing')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await expect(fetchDcfXlsx({})).rejects.toMatchObject({
      status: 400,
      detail: 'q1 missing',
    })
  })
})
