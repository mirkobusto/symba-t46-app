import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDcfDataStore } from '../store/dcfDataStore'
import type { Flow } from '../types/api'
import type { DcfPayload } from '../types/dcf'
import { ACTORS_SECTION, FLOW_MATRIX_SECTION } from '../types/dcfData'

function field(id: string, extra: Record<string, unknown> = {}) {
  return {
    id,
    label_en: id,
    type: 'string',
    required: false,
    activation_predicate: 'always',
    ...extra,
  }
}

/** A payload with the two sections the builder edits. `flowFields` lets a
 * test simulate a pathway that activates fewer fields. */
function payloadWith(flowFields: string[]): DcfPayload {
  return {
    schema_version: '1.0-draft',
    case_id: 'case-1',
    pathway_id: 'IS-01',
    ilcd_situation: null,
    lcc_type: null,
    slca_activation_state: null,
    is_01_extended: false,
    sections: [
      {
        id: ACTORS_SECTION,
        title_en: 'Actors',
        description_en: '',
        applies_when: 'always',
        row_collection: 'user_added',
        active: true,
        fields: [field('actor.id'), field('actor.name'), field('actor.role')],
      },
      {
        id: FLOW_MATRIX_SECTION,
        title_en: 'Flow Matrix',
        description_en: '',
        applies_when: 'always',
        row_collection: 'pre_seeded_from_case_flows',
        active: true,
        fields: flowFields.map((f) => field(f)),
      },
    ],
    mandates_by_category: {},
    network_render_spec: null,
  } as unknown as DcfPayload
}

const FULL_FLOW_FIELDS = [
  'flow.id',
  'flow.name',
  'flow.q5_class',
  'flow.unit',
  'flow.quantity_measured',
  'flow.origin_actor_id',
  'flow.dest_actor_id',
]

const CASE_FLOWS: Flow[] = [
  { id: 'f1', name: 'sludge', q5: 'a', physical_unit: 't/y', physical_quantity: 120 },
  { id: 'f2', name: 'biogas', q5: 'c' },
]

const okResponse = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as Response

describe('dcfDataStore', () => {
  beforeEach(() => {
    useDcfDataStore.getState().reset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('seeds one flow row per declared case flow, keyed by the flow id', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(rows.map((r) => r.row_id)).toEqual(['f1', 'f2'])
    expect(rows[0].values['flow.name']).toBe('sludge')
    expect(rows[0].values['flow.unit']).toBe('t/y')
    expect(rows[0].values['flow.quantity_measured']).toBe(120)
  })

  it('re-seeding is idempotent', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    useDcfDataStore.getState().syncWithPayload(p, CASE_FLOWS)
    useDcfDataStore.getState().syncWithPayload(p, CASE_FLOWS)
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION],
    ).toHaveLength(2)
  })

  it('does not seed values for fields the pathway did not activate', () => {
    // quantity_measured only activates for q2 in {A, D}
    useDcfDataStore
      .getState()
      .syncWithPayload(
        payloadWith(FULL_FLOW_FIELDS.filter((f) => f !== 'flow.quantity_measured')),
        CASE_FLOWS,
      )
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(rows[0].values['flow.quantity_measured']).toBeUndefined()
    expect(rows[0].values['flow.unit']).toBe('t/y')
  })

  it('prunes values when a Q1-Q7 edit deactivates a field', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION][0]
        .values['flow.quantity_measured'],
    ).toBe(120)

    useDcfDataStore
      .getState()
      .syncWithPayload(
        payloadWith(FULL_FLOW_FIELDS.filter((f) => f !== 'flow.quantity_measured')),
        CASE_FLOWS,
      )
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION][0]
        .values['flow.quantity_measured'],
    ).toBeUndefined()
  })

  it('addActor creates a row and a canvas position', () => {
    const rowId = useDcfDataStore.getState().addActor('WWTP Alfa')
    const state = useDcfDataStore.getState()
    expect(state.data.rows_by_section[ACTORS_SECTION][0].values['actor.name']).toBe(
      'WWTP Alfa',
    )
    expect(state.data.layout[rowId]).toBeDefined()
    expect(state.dirty).toBe(true)
  })

  it('connect wires the first seeded flow that has no endpoints yet', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')

    const rowId = useDcfDataStore.getState().connect(a1, a2)

    expect(rowId).toBe('f1')
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(rows).toHaveLength(2)
    expect(rows[0].values['flow.origin_actor_id']).toBe(a1)
    expect(rows[0].values['flow.dest_actor_id']).toBe(a2)
  })

  it('connect creates a new flow row once every seeded flow is wired', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2)
    useDcfDataStore.getState().connect(a2, a1)

    const rowId = useDcfDataStore.getState().connect(a1, a2)
    expect(rowId).not.toBe('f1')
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION],
    ).toHaveLength(3)
  })

  it('refuses to connect an actor to itself', () => {
    const a1 = useDcfDataStore.getState().addActor('A')
    expect(useDcfDataStore.getState().connect(a1, a1)).toBeNull()
  })

  it('removing an actor unwires its flows and drops its position', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2)

    useDcfDataStore.getState().removeRow(ACTORS_SECTION, a2)

    const state = useDcfDataStore.getState()
    expect(state.data.layout[a2]).toBeUndefined()
    const wired = state.data.rows_by_section[FLOW_MATRIX_SECTION][0]
    expect(wired.values['flow.origin_actor_id']).toBe(a1)
    expect(wired.values['flow.dest_actor_id']).toBeUndefined()
  })

  it('clearing an input removes the key instead of storing an empty string', () => {
    const a1 = useDcfDataStore.getState().addActor('A')
    useDcfDataStore.getState().updateValue(ACTORS_SECTION, a1, 'actor.role', 'producer')
    useDcfDataStore.getState().updateValue(ACTORS_SECTION, a1, 'actor.role', '')
    expect(
      useDcfDataStore.getState().data.rows_by_section[ACTORS_SECTION][0].values,
    ).not.toHaveProperty('actor.role')
  })

  it('saveToServer PUTs to the bound case and clears the dirty flag', async () => {
    const envelope = {
      data: {
        schema_version: '1.0',
        case_id: 'case-1',
        rows_by_section: {},
        layout: {},
        updated_at: '2026-08-29T10:00:00Z',
      },
      validation: { errors: [], missing_required: [], completeness: [] },
    }
    const mock = vi.fn(() => Promise.resolve(okResponse(envelope))) as unknown as typeof fetch
    vi.stubGlobal('fetch', mock)

    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('A')
    const ok = await useDcfDataStore.getState().saveToServer()

    expect(ok).toBe(true)
    expect(useDcfDataStore.getState().dirty).toBe(false)
    const calls = (mock as unknown as { mock: { calls: unknown[][] } }).mock.calls
    const [url, init] = calls[0] as [string, RequestInit]
    expect(String(url)).toContain('/api/dcf/case-1/data')
    expect(init?.method).toBe('PUT')
  })

  it('saveToServer refuses when no case id is bound', async () => {
    useDcfDataStore.getState().addActor('A')
    expect(await useDcfDataStore.getState().saveToServer()).toBe(false)
    expect(useDcfDataStore.getState().error).toBe('no-case-id')
  })

  it('binding to a different case starts from a clean draft', () => {
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('A')
    useDcfDataStore.getState().bindTo('case-2')
    const state = useDcfDataStore.getState()
    expect(state.data.rows_by_section[ACTORS_SECTION] ?? []).toHaveLength(0)
    expect(state.data.case_id).toBe('case-2')
  })

  it('binding an unsaved draft to a freshly saved case keeps what was drawn', () => {
    useDcfDataStore.getState().addActor('A')
    useDcfDataStore.getState().bindTo('case-9')
    const state = useDcfDataStore.getState()
    expect(state.data.rows_by_section[ACTORS_SECTION]).toHaveLength(1)
    expect(state.data.case_id).toBe('case-9')
    expect(state.dirty).toBe(true)
  })

  it('loadExample drops in three actors and two wired flows', () => {
    useDcfDataStore.getState().loadExample(payloadWith(FULL_FLOW_FIELDS), {
      producer: 'Producer plant',
      consumer: 'Receiving plant',
      facilitator: 'Park operator',
      flow: 'Example flow',
    })

    const state = useDcfDataStore.getState()
    const actors = state.data.rows_by_section[ACTORS_SECTION]
    const flows = state.data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(actors).toHaveLength(3)
    expect(actors[0].values['actor.name']).toBe('Producer plant')
    expect(flows).toHaveLength(2)
    expect(flows[0].values['flow.origin_actor_id']).toBe('ex-a1')
    expect(flows[0].values['flow.dest_actor_id']).toBe('ex-a2')
    expect(Object.keys(state.data.layout)).toHaveLength(3)
    expect(state.dirty).toBe(true)
  })

  it('the example only fills fields the pathway activated', () => {
    // no flow.unit in this payload -> the example must not invent one,
    // or the very first save would come back 422 field_not_active
    useDcfDataStore.getState().loadExample(
      payloadWith(FULL_FLOW_FIELDS.filter((f) => f !== 'flow.unit')),
      { producer: 'P', consumer: 'C', facilitator: 'F', flow: 'flow' },
    )
    const flows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(flows[0].values['flow.unit']).toBeUndefined()
    expect(flows[0].values['flow.name']).toBe('flow 1')
  })

  it('loading the example keeps the Q5 flows but unwires them', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    const store = useDcfDataStore.getState()
    store.syncWithPayload(p, CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2) // wires the seeded f1

    useDcfDataStore.getState().loadExample(p, {
      producer: 'P', consumer: 'C', facilitator: 'F', flow: 'flow',
    })

    const flows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    const seeded = flows.filter((r) => !r.row_id.startsWith('ex-'))
    expect(seeded.map((r) => r.row_id)).toEqual(['f1', 'f2'])
    // f1 pointed at an actor the example replaced: a dangling reference
    // would be a 422 on save, so it comes back unwired.
    expect(seeded[0].values['flow.origin_actor_id']).toBeUndefined()
    expect(seeded[0].values['flow.name']).toBe('sludge')
  })
})
