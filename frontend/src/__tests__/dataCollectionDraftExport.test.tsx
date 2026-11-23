import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import DataCollectionPage from '../pages/DataCollectionPage'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { ACTORS_SECTION, FLOW_MATRIX_SECTION } from '../types/dcfData'

function field(id: string) {
  return { id, label_en: id, type: 'string', required: false, activation_predicate: 'always' }
}

// the two sections the Network Builder edits
const PAYLOAD = {
  schema_version: '1.0-draft',
  case_id: 'c-1',
  ilcd_situation: 'ILCD Situation A',
  lcc_type: null,
  slca_activation_state: 'deactivated',
  sections: [
    { id: ACTORS_SECTION, title_en: 'Actors', description_en: '', applies_when: 'always', row_collection: 'user_added',
      active: true, fields: [field('actor.id'), field('actor.name')] },
    { id: FLOW_MATRIX_SECTION, title_en: 'Flow Matrix', description_en: '', applies_when: 'always',
      row_collection: 'pre_seeded_from_case_flows', active: true,
      fields: [field('flow.id'), field('flow.name'), field('flow.q5_class'), field('flow.origin_actor_id'), field('flow.dest_actor_id')] },
  ],
  obligations: [],
  mandates: [],
  network_render_spec: null,
}

function respond(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status < 400,
    status,
    statusText: 'x',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)
}

// A case never saved (no account) keeps the network in this browser, and the
// server has no copy of it: the files were built without it, so the Excel and
// Word had the picture of the network but not its actors and flows.
describe('DataCollectionPage download of a case never saved', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useCaseStore.getState().reset()
    useDcfDataStore.getState().reset()
    fetchMock = vi.fn((url: string) => {
      if (String(url).includes('/api/dcf/preview')) return respond(PAYLOAD)
      if (String(url).includes('/api/dcf/export/')) {
        return Promise.resolve({ ok: true, status: 200, statusText: 'OK', blob: () => Promise.resolve(new Blob([new Uint8Array([1])])) } as Response)
      }
      return respond({ detail: 'not found' }, 404)
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() }))
  })

  afterEach(() => vi.restoreAllMocks())

  async function download(kind: 'xlsx' | 'docx') {
    useCaseStore.getState().setDraft({ q1: 'B', flows: [{ id: 'f1', name: 'sludge', q5: 'a' }] } as never)
    render(
      <MemoryRouter>
        <DataCollectionPage />
      </MemoryRouter>,
    )
    const buttons = await screen.findAllByRole('button', { name: kind === 'xlsx' ? 'Download Excel (.xlsx)' : 'Download companion document (.docx)' })
    // the questionnaire flows are seeded once the payload is in
    await waitFor(() => expect(useDcfDataStore.getState().caseFlowIds).toEqual(['f1']))
    expect(useCaseStore.getState().serverCaseId).toBeNull()

    let wired: string | null = null
    act(() => {
      const store = useDcfDataStore.getState()
      const a1 = store.addActor('WWTP Alfa')
      const a2 = store.addActor('Biogas plant Beta')
      wired = store.connect(a1, a2, 'f1')
    })
    expect(wired).toBe('f1')

    fireEvent.click(buttons[0])
    const path = `/api/dcf/export/${kind}`
    await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => String(url).includes(path))).toBe(true))
    const [, init] = fetchMock.mock.calls.find(([url]) => String(url).includes(path)) as [string, RequestInit]
    return JSON.parse(String(init.body)) as {
      case: { q1: string }
      data: { rows_by_section: Record<string, { row_id: string; values: Record<string, unknown> }[]> }
    }
  }

  it.each(['xlsx', 'docx'] as const)('sends the drawn actors and flows with the %s request', async (kind) => {
    const body = await download(kind)
    expect(body.case.q1).toBe('B')
    const actors = body.data.rows_by_section[ACTORS_SECTION]
    expect(actors.map((r) => r.values['actor.name'])).toEqual(['WWTP Alfa', 'Biogas plant Beta'])
    const flow = body.data.rows_by_section[FLOW_MATRIX_SECTION].find((r) => r.row_id === 'f1')
    expect(flow?.values['flow.origin_actor_id']).toBe(actors[0].row_id)
    expect(flow?.values['flow.dest_actor_id']).toBe(actors[1].row_id)
  })

  it('tells the truth about an unsaved case: the drawing goes into the files, kept only in this browser', async () => {
    useCaseStore.getState().setDraft({ q1: 'B' } as never)
    render(
      <MemoryRouter>
        <DataCollectionPage />
      </MemoryRouter>,
    )
    await screen.findAllByRole('button', { name: 'Download Excel (.xlsx)' })
    expect(screen.getAllByText(/network you draw goes into the files, but for now it is kept only in this browser/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/do not contain the network/)).not.toBeInTheDocument()
  })
})
