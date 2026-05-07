import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '../store/sessionStore'

function jsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    text: () => Promise.resolve(JSON.stringify(body)),
    json: () => Promise.resolve(body),
  } as unknown as Response
}

describe('sessionStore', () => {
  beforeEach(() => {
    useSessionStore.getState().reset()
    useSessionStore.setState({ questions: null })
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('startNewSession creates a session and stores its id', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          id: 'sess-123',
          created_at: 't',
          updated_at: 't',
          status: 'draft',
          case_name: null,
          notes: null,
          answers_count: 0,
          pathway_resolved: false,
        }),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)
    const id = await useSessionStore.getState().startNewSession()
    expect(id).toBe('sess-123')
    expect(useSessionStore.getState().sessionId).toBe('sess-123')
    expect(useSessionStore.getState().status).toBe('draft')
  })

  it('setAnswer stores the answer locally after server accept', async () => {
    useSessionStore.setState({ sessionId: 'sess-1' })
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          session_id: 'sess-1',
          accepted: ['q1'],
          rejected: [],
          answers_count: 1,
          status: 'draft',
        }),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)
    await useSessionStore.getState().setAnswer('q1', 'A')
    expect(useSessionStore.getState().answers).toEqual({ q1: 'A' })
  })

  it('reset clears sessionId and answers but keeps cached questions', () => {
    useSessionStore.setState({
      sessionId: 's',
      answers: { q1: 'A' },
      questions: [
        {
          id: 'q1',
          key: 'q1',
          label: 'Q',
          description: '',
          options: [],
          trace: [],
        },
      ],
    })
    useSessionStore.getState().reset()
    expect(useSessionStore.getState().sessionId).toBeNull()
    expect(useSessionStore.getState().answers).toEqual({})
    expect(useSessionStore.getState().questions).toHaveLength(1)
  })
})
