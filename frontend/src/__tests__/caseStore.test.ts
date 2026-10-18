import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCaseStore, withCurrentAnswers } from '../store/caseStore'
import type { Case } from '../types/api'

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
    useCaseStore.getState().patchDraft({ q2: 'B' })
    expect(useCaseStore.getState().draft.q1).toBe('B')
    expect(useCaseStore.getState().draft.q2).toBe('B')
  })

  it('a draft with a retired Q2 option (C or D) is read as B', () => {
    for (const old of ['C', 'D']) {
      useCaseStore.getState().setDraft({ q1: 'B', q2: old } as unknown as Case)
      expect(useCaseStore.getState().draft.q2).toBe('B')
    }
    expect(withCurrentAnswers({ q2: 'A' })).toEqual({ q2: 'A' })
    expect(withCurrentAnswers({ q7: 'D' })).toEqual({ q7: 'C' })
    expect(withCurrentAnswers(null)).toBeNull()
  })

  it('a draft with the old shared-assets key shows Q12 answered, as the backend reads it', () => {
    expect(withCurrentAnswers({ advanced: { is_specific_capital_goods: 'true', asset_lifetime: 30 } }))
      .toEqual({ advanced: { asset_lifetime: 30 }, dedicated_shared_assets: true })
    // an explicit Q12 answer wins
    expect(withCurrentAnswers({ advanced: { is_specific_capital_goods: true }, dedicated_shared_assets: false }))
      .toEqual({ advanced: {}, dedicated_shared_assets: false })
  })

  it('a result in the retired Situation A multi-actor is read as Situation A', () => {
    expect(withCurrentAnswers({ ilcd_situation: 'ILCD Situation A multi-actor' }))
      .toEqual({ ilcd_situation: 'ILCD Situation A' })
  })

  it('runDraft populates result on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          okResponse({ ilcd_situation: 'ILCD Situation A', activated_nodes: ['x'] }),
        ),
      ),
    )
    useCaseStore.getState().patchDraft({ q1: 'A', q2: 'A' })
    const out = await useCaseStore.getState().runDraft()
    expect(out?.ilcd_situation).toBe('ILCD Situation A')
    expect(useCaseStore.getState().result?.ilcd_situation).toBe('ILCD Situation A')
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
    useCaseStore.setState({ result: { ilcd_situation: 'ILCD Situation B' }, error: 'x' })
    useCaseStore.getState().reset()
    const s = useCaseStore.getState()
    expect(s.draft.q1 ?? null).toBeNull()
    expect(s.result).toBeNull()
    expect(s.error).toBeNull()
  })
})
