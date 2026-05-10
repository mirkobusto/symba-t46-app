import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCaseStore } from '../store/caseStore'

const okResponse = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as Response

describe('caseStore', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with an empty draft and no result', () => {
    const s = useCaseStore.getState()
    expect(s.draft.q1 ?? null).toBeNull()
    expect(s.result).toBeNull()
    expect(s.loading).toBe(false)
    expect(s.error).toBeNull()
  })

  it('patchDraft merges into the existing draft', () => {
    useCaseStore.getState().patchDraft({ q1: 'B' })
    expect(useCaseStore.getState().draft.q1).toBe('B')
    useCaseStore.getState().patchDraft({ q2: 'D' })
    expect(useCaseStore.getState().draft.q1).toBe('B')
    expect(useCaseStore.getState().draft.q2).toBe('D')
  })

  it('runDraft populates result on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          okResponse({ pathway_id: 'IS-01', activated_nodes: ['x'] }),
        ),
      ),
    )
    useCaseStore.getState().patchDraft({ q1: 'A', q2: 'A' })
    const out = await useCaseStore.getState().runDraft()
    expect(out?.pathway_id).toBe('IS-01')
    expect(useCaseStore.getState().result?.pathway_id).toBe('IS-01')
    expect(useCaseStore.getState().error).toBeNull()
  })

  it('runDraft sets error on 400', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          text: () =>
            Promise.resolve(JSON.stringify({ detail: 'Invalid Q1: None' })),
          json: () => Promise.resolve({ detail: 'Invalid Q1: None' }),
        } as Response),
      ),
    )
    const out = await useCaseStore.getState().runDraft()
    expect(out).toBeNull()
    expect(useCaseStore.getState().error).toContain('400')
    expect(useCaseStore.getState().error).toContain('Invalid Q1')
  })

  it('reset clears draft, result and error', () => {
    useCaseStore.getState().patchDraft({ q1: 'B' })
    useCaseStore.setState({ result: { pathway_id: 'IS-02' }, error: 'x' })
    useCaseStore.getState().reset()
    const s = useCaseStore.getState()
    expect(s.draft.q1 ?? null).toBeNull()
    expect(s.result).toBeNull()
    expect(s.error).toBeNull()
  })
})
