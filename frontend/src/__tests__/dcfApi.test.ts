import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ApiError,
  fetchDcfData,
  fetchDcfDocx,
  fetchDcfPreview,
  fetchDcfXlsx,
  fetchDcfXlsxForCase,
  putDcfData,
} from '../services/api'

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
      ilcd_situation: null,
      lcc_type: null,
      slca_activation_state: null,
      sections: [],
      mandates_by_category: {},
      network_render_spec: null,
    }
    const mock = vi.fn(() =>
      Promise.resolve(okJsonResponse(samplePayload)),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const result = await fetchDcfPreview({ q1: 'B' })

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

  it('fetchDcfData GETs the stored content for a case', async () => {
    const envelope = {
      data: {
        schema_version: '1.0',
        case_id: 'c1',
        rows_by_section: {},
        layout: {},
        updated_at: null,
      },
      validation: { errors: [], missing_required: [], completeness: [] },
    }
    const mock = vi.fn(() =>
      Promise.resolve(okJsonResponse(envelope)),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const result = await fetchDcfData('c1')

    expect(result.data.case_id).toBe('c1')
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    expect(String(calls[0][0])).toContain('/api/dcf/c1/data')
  })

  it('putDcfData surfaces a structural rejection as ApiError(422)', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(errResponse(422, 'field_not_active')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await expect(
      putDcfData('c1', {
        schema_version: '1.0',
        case_id: 'c1',
        rows_by_section: {},
        layout: {},
      }),
    ).rejects.toBeInstanceOf(ApiError)
  })

  it('fetchDcfXlsxForCase posts the cover rows to the case-scoped export (UX round 5, D7)', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(okBlobResponse('application/vnd.ms-excel')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await fetchDcfXlsxForCase('c1', [{ label: 'Horizon', value: 'today' }])

    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [url, init] = calls[0] as [string, RequestInit | undefined]
    expect(String(url)).toContain('/api/dcf/c1/export/xlsx')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({ rows: [{ label: 'Horizon', value: 'today' }] })
  })

  it('sends the deadline, contact and version set on the page (UX round 6, P8-02)', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(okBlobResponse('application/vnd.ms-excel')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const sending = { return_by: '2026-11-22', contact: 'Giulia — g@example.org', version: '1' }
    await fetchDcfDocx({ q1: 'B' }, [], null, sending)

    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [, init] = calls[0] as [string, RequestInit | undefined]
    expect(JSON.parse(String(init?.body)).sending).toEqual(sending)
  })

  it.each([
    ['fetchDcfXlsx', fetchDcfXlsx, '/api/dcf/export/xlsx'],
    ['fetchDcfDocx', fetchDcfDocx, '/api/dcf/export/docx'],
  ] as const)('%s sends the network drawn for a case never saved as `data`', async (_name, fetchFile, path) => {
    const mock = vi.fn(() =>
      Promise.resolve(okBlobResponse('application/vnd.ms-excel')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    const drawn = {
      schema_version: '1.1',
      case_id: '',
      rows_by_section: {
        actors: [{ row_id: 'a1', values: { 'actor.name': 'WWTP Alfa' } }],
        flow_matrix: [{ row_id: 'f1', values: { 'flow.origin_actor_id': 'a1', 'flow.dest_actor_id': 'a2' } }],
      },
      layout: { a1: { x: 0, y: 0 } },
    }
    await fetchFile({ q1: 'B' }, [], null, null, drawn)

    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [url, init] = calls[0] as [string, RequestInit]
    expect(String(url)).toContain(path)
    expect(JSON.parse(String(init.body)).data).toEqual(drawn)
  })

  it('leaves `data` out of the request when there is no network to send', async () => {
    const mock = vi.fn(() =>
      Promise.resolve(okBlobResponse('application/vnd.ms-excel')),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await fetchDcfXlsx({ q1: 'B' })

    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [, init] = calls[0] as [string, RequestInit]
    expect(JSON.parse(String(init.body))).not.toHaveProperty('data')
  })

  it('reads the issues of a refused network in words, not as raw JSON', async () => {
    const mock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: () => Promise.resolve(JSON.stringify({
          detail: [
            { code: 'broken_reference', section_id: 'flow_matrix', detail: "'a-gone' does not match any row in section 'actors'" },
            { code: 'invalid_country_code', section_id: 'actors', detail: "'CZE' is not a two-letter ISO 3166-1 country code" },
          ],
        })),
      } as Response),
    ) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    await expect(fetchDcfXlsx({ q1: 'B' }, [], null, null, {
      schema_version: '1.1', case_id: '', rows_by_section: {}, layout: {},
    })).rejects.toMatchObject({
      status: 422,
      detail: "'a-gone' does not match any row in section 'actors'; 'CZE' is not a two-letter ISO 3166-1 country code",
    })
  })
})
