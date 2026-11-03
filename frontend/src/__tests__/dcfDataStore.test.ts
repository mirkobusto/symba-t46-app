import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDcfDataStore } from '../store/dcfDataStore'
import type { Flow } from '../types/api'
import type { DcfPayload } from '../types/dcf'
import {
  ACTORS_SECTION,
  FLOW_CLASSIFICATION_SECTION,
  FLOW_MATRIX_SECTION,
} from '../types/dcfData'

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
 * test simulate a configuration that activates fewer fields. */
function payloadWith(flowFields: string[]): DcfPayload {
  return {
    schema_version: '1.0-draft',
    case_id: 'case-1',
    ilcd_situation: null,
    lcc_type: null,
    slca_activation_state: null,
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

  it('seeds a classification row from the Freedom-to-Act answer, once', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    p.sections.push({
      ...p.sections[1],
      id: FLOW_CLASSIFICATION_SECTION,
      row_collection: 'auto_from_flow_matrix',
      fields: [field('classif.flow_id'), field('classif.independent_market')],
    } as (typeof p.sections)[number])
    const flows: Flow[] = [
      { id: 'f1', name: 'sludge', q5: 'a', sellable_elsewhere: true },
      { id: 'f2', name: 'biogas', q5: 'c', sellable_elsewhere: false },
      { id: 'f3', name: 'heat', q5: 'c' },
    ]
    const store = useDcfDataStore.getState()
    store.syncWithPayload(p, flows)
    store.syncWithPayload(p, flows)
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_CLASSIFICATION_SECTION]
    expect(rows.map((r) => [r.values['classif.flow_id'], r.values['classif.independent_market']]))
      .toEqual([['f1', 'yes'], ['f2', 'no']])
    // the analyst's own row for a flow is not overwritten by a changed answer
    store.syncWithPayload(p, [{ ...flows[0], sellable_elsewhere: false }])
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_CLASSIFICATION_SECTION][0]
        .values['classif.independent_market'],
    ).toBe('yes')
  })

  it('setClassification creates the flow\'s classification row on the first value, then updates it', () => {
    const st = useDcfDataStore.getState()
    st.setClassification('f9', 'classif.legal_status', '')
    expect(useDcfDataStore.getState().data.rows_by_section[FLOW_CLASSIFICATION_SECTION] ?? []).toEqual([])
    st.setClassification('f9', 'classif.legal_status', 'by_product')
    st.setClassification('f9', 'classif.avoidable', 'yes')
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_CLASSIFICATION_SECTION]!
    expect(rows).toEqual([{ row_id: 'classif-f9', values: {
      'classif.flow_id': 'f9', 'classif.legal_status': 'by_product', 'classif.avoidable': 'yes' } }])
    expect(useDcfDataStore.getState().dirty).toBe(true)
  })

  it('re-seeding is idempotent', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    useDcfDataStore.getState().syncWithPayload(p, CASE_FLOWS)
    useDcfDataStore.getState().syncWithPayload(p, CASE_FLOWS)
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION],
    ).toHaveLength(2)
  })

  it('does not seed values for fields the configuration did not activate', () => {
    // quantity_measured only activates for q2 = A
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

  it('keeps values when an answer edit switches a field off (dormant, UX round 5)', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    useDcfDataStore
      .getState()
      .syncWithPayload(
        payloadWith(FULL_FLOW_FIELDS.filter((f) => f !== 'flow.quantity_measured')),
        CASE_FLOWS,
      )
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION][0]
        .values['flow.quantity_measured'],
    ).toBe(120)
  })

  it('seeding the questionnaire flows does not mark the network unsaved', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const state = useDcfDataStore.getState()
    expect(state.data.rows_by_section[FLOW_MATRIX_SECTION]).toHaveLength(CASE_FLOWS.length)
    expect(state.dirty).toBe(false)
  })

  it('carryTo rebinds the drawn network to a new case and marks it unsaved', () => {
    const store = useDcfDataStore.getState()
    store.bindTo('old-case')
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const actorId = useDcfDataStore.getState().addActor('WWTP Alfa')
    useDcfDataStore.getState().carryTo('new-case')
    const state = useDcfDataStore.getState()
    expect(state.caseId).toBe('new-case')
    expect(state.data.case_id).toBe('new-case')
    expect(state.data.layout[actorId]).toBeDefined()
    expect(state.data.rows_by_section[ACTORS_SECTION][0].values['actor.name']).toBe('WWTP Alfa')
    expect(state.dirty).toBe(true)
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

  it('connect wires the chosen questionnaire flow, not the first free one (UX round 5, D2)', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')

    const rowId = useDcfDataStore.getState().connect(a1, a2, 'f2')

    expect(rowId).toBe('f2')
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(rows).toHaveLength(2)
    expect(rows[0].values['flow.origin_actor_id']).toBeUndefined()
    expect(rows[1].values['flow.origin_actor_id']).toBe(a1)
    expect(rows[1].values['flow.dest_actor_id']).toBe(a2)
  })

  it('connect refuses a flow that is not in the questionnaire', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    expect(useDcfDataStore.getState().connect(a1, a2, 'fx-hand-drawn')).toBeNull()
    expect(useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]).toHaveLength(2)
  })

  it('refuses to connect an actor to itself', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    expect(useDcfDataStore.getState().connect(a1, a1, 'f1')).toBeNull()
  })

  it('reverseFlow swaps origin and destination', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2, 'f1')
    useDcfDataStore.getState().reverseFlow('f1')
    const [f1] = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(f1.values['flow.origin_actor_id']).toBe(a2)
    expect(f1.values['flow.dest_actor_id']).toBe(a1)
  })

  it('removing the arrow of a questionnaire flow unwires it and keeps its values', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2, 'f1')
    useDcfDataStore.getState().removeRow(FLOW_MATRIX_SECTION, 'f1')
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(rows.map((r) => r.row_id)).toEqual(['f1', 'f2'])
    expect(rows[0].values['flow.origin_actor_id']).toBeUndefined()
    expect(rows[0].values['flow.quantity_measured']).toBe(120)
  })

  it('removing a row that is not in the questionnaire deletes it', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    useDcfDataStore.setState((st) => ({
      data: {
        ...st.data,
        rows_by_section: {
          ...st.data.rows_by_section,
          [FLOW_MATRIX_SECTION]: [
            ...st.data.rows_by_section[FLOW_MATRIX_SECTION],
            { row_id: 'fx-legacy', values: { 'flow.name': 'old' } },
          ],
        },
      },
    }))
    useDcfDataStore.getState().removeRow(FLOW_MATRIX_SECTION, 'fx-legacy')
    expect(
      useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION].map((r) => r.row_id),
    ).toEqual(['f1', 'f2'])
  })

  it('re-sync makes name and Q5 of a questionnaire flow follow the questionnaire', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    useDcfDataStore.getState().syncWithPayload(p, CASE_FLOWS)
    useDcfDataStore.getState().syncWithPayload(p, [
      { ...CASE_FLOWS[0], name: 'dewatered sludge', q5: 'd' },
      CASE_FLOWS[1],
    ])
    const [f1] = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    expect(f1.values['flow.name']).toBe('dewatered sludge')
    expect(f1.values['flow.q5_class']).toBe('d')
    expect(f1.values['flow.quantity_measured']).toBe(120) // entered values stay
    expect(useDcfDataStore.getState().dirty).toBe(false)
  })

  it('opening a saved case with only seeded rows is not "unsaved" (Fable review of #203)', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    useDcfDataStore.getState().bindTo('case-1')
    expect(useDcfDataStore.getState().dirty).toBe(false)
  })

  it('switching case forgets the previous questionnaire flows', () => {
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    useDcfDataStore.getState().bindTo('case-2')
    expect(useDcfDataStore.getState().caseFlowIds).toEqual([])
  })

  it('removing or reversing a flow that is not drawn changes nothing', () => {
    useDcfDataStore.getState().syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const before = useDcfDataStore.getState().data
    useDcfDataStore.getState().removeRow(FLOW_MATRIX_SECTION, 'f1')
    useDcfDataStore.getState().reverseFlow('f1')
    expect(useDcfDataStore.getState().data).toBe(before)
    expect(useDcfDataStore.getState().dirty).toBe(false)
  })

  it('a flow removed from the questionnaire is kept, no longer counted as one of its flows', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    useDcfDataStore.getState().syncWithPayload(p, CASE_FLOWS)
    useDcfDataStore.getState().syncWithPayload(p, [CASE_FLOWS[0]])
    const state = useDcfDataStore.getState()
    expect(state.data.rows_by_section[FLOW_MATRIX_SECTION].map((r) => r.row_id)).toEqual(['f1', 'f2'])
    expect(state.caseFlowIds).toEqual(['f1'])
  })

  it('removing an actor unwires its flows and drops its position', () => {
    const store = useDcfDataStore.getState()
    store.syncWithPayload(payloadWith(FULL_FLOW_FIELDS), CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2, 'f1')

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

  it('the example only fills fields the configuration activated', () => {
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

  it('on a case with flows the example wires its own first two flows (UX round 5, D2)', () => {
    const p = payloadWith(FULL_FLOW_FIELDS)
    const store = useDcfDataStore.getState()
    store.syncWithPayload(p, CASE_FLOWS)
    const a1 = useDcfDataStore.getState().addActor('A')
    const a2 = useDcfDataStore.getState().addActor('B')
    useDcfDataStore.getState().connect(a1, a2, 'f1')

    useDcfDataStore.getState().loadExample(p, {
      producer: 'P', consumer: 'C', facilitator: 'F', flow: 'flow',
    })

    const flows = useDcfDataStore.getState().data.rows_by_section[FLOW_MATRIX_SECTION]
    // no generic example flows next to the case's own
    expect(flows.map((r) => r.row_id)).toEqual(['f1', 'f2'])
    expect(flows[0].values['flow.origin_actor_id']).toBe('ex-a1')
    expect(flows[0].values['flow.dest_actor_id']).toBe('ex-a2')
    expect(flows[1].values['flow.origin_actor_id']).toBe('ex-a2')
    expect(flows[0].values['flow.name']).toBe('sludge')
  })
})
