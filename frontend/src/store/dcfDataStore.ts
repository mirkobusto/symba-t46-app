// Zustand store for the Network Builder draft (DCF content).
//
// Persistence model (option C): the analyst can draw the network before
// the case is saved server-side, so the draft lives in localStorage and
// is pushed to /api/dcf/{case_id}/data once a server case id exists.
//
// The store owns three responsibilities the canvas should not:
//
//   1. **Seeding** — the Flow Matrix is `pre_seeded_from_case_flows`, so
//      every flow the analyst declared in Q5 gets a row, keyed by the
//      case flow id (idempotent re-seeding).
//   2. **Staying legal** — values may only be written for fields the
//      pathway activated. Editing Q1-Q7 can deactivate a field under
//      content already drawn, so `syncWithPayload` prunes what the
//      backend would now reject with a 422.
//   3. **Sync** — load / save against the server, keeping `dirty` so the
//      UI can show unsaved state.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { ApiError, fetchDcfData, putDcfData } from '../services/api'
import type { Flow } from '../types/api'
import type { DcfPayload } from '../types/dcf'
import {
  ACTORS_SECTION,
  DCF_DATA_SCHEMA_VERSION,
  FLOW_MATRIX_SECTION,
  type DcfData,
  type DcfDataValidation,
  type DcfNodePosition,
  type DcfRow,
} from '../types/dcfData'

const EMPTY_DATA: DcfData = {
  schema_version: DCF_DATA_SCHEMA_VERSION,
  case_id: '',
  rows_by_section: {},
  layout: {},
}

/** Grid slot for the n-th actor, so a fresh node never lands on top of
 * an existing one. */
function autoPosition(index: number): DcfNodePosition {
  const perRow = 3
  return { x: 40 + (index % perRow) * 260, y: 40 + Math.floor(index / perRow) * 160 }
}

function rowsOf(data: DcfData, sectionId: string): DcfRow[] {
  return data.rows_by_section[sectionId] ?? []
}

function withRows(data: DcfData, sectionId: string, rows: DcfRow[]): DcfData {
  return {
    ...data,
    rows_by_section: { ...data.rows_by_section, [sectionId]: rows },
  }
}

/** Field ids the payload activated, per section. */
function activeFieldsBySection(payload: DcfPayload): Record<string, Set<string>> {
  const out: Record<string, Set<string>> = {}
  for (const section of payload.sections) {
    out[section.id] = new Set(section.fields.map((f) => f.id))
  }
  return out
}

let actorCounter = 0
function nextActorRowId(): string {
  actorCounter += 1
  return `a${Date.now().toString(36)}${actorCounter}`
}

let flowCounter = 0
function nextFlowRowId(): string {
  flowCounter += 1
  return `fx${Date.now().toString(36)}${flowCounter}`
}

/** Display names for the demo network, passed in so the store stays
 * free of i18n. */
export interface ExampleLabels {
  producer: string
  consumer: string
  facilitator: string
  flow: string
}

export interface DcfDataState {
  /** Server case id this draft belongs to; null while the case is unsaved. */
  caseId: string | null
  data: DcfData
  validation: DcfDataValidation | null
  dirty: boolean
  syncing: boolean
  lastSyncedAt: number | null
  error: string | null

  bindTo: (caseId: string | null) => void
  syncWithPayload: (payload: DcfPayload, flows: Flow[]) => void
  addActor: (name?: string) => string
  connect: (originRowId: string, destRowId: string) => string | null
  updateValue: (
    sectionId: string,
    rowId: string,
    fieldId: string,
    value: unknown,
  ) => void
  removeRow: (sectionId: string, rowId: string) => void
  setPosition: (rowId: string, pos: DcfNodePosition) => void
  loadExample: (payload: DcfPayload, labels: ExampleLabels) => void
  loadFromServer: (caseId: string) => Promise<boolean>
  saveToServer: () => Promise<boolean>
  reset: () => void
}

export const useDcfDataStore = create<DcfDataState>()(
  persist(
    (set, get) => ({
      caseId: null,
      data: { ...EMPTY_DATA },
      validation: null,
      dirty: false,
      syncing: false,
      lastSyncedAt: null,
      error: null,

      bindTo(caseId) {
        const current = get().caseId
        if (current === caseId) return
        // Switching to a different saved case: the previous draft belongs
        // to that other case, so start clean rather than leaking rows.
        set({
          caseId,
          data: {
            ...(current === null ? get().data : EMPTY_DATA),
            case_id: caseId ?? '',
          },
          validation: null,
          dirty: current === null && caseId !== null,
        })
      },

      syncWithPayload(payload, flows) {
        const active = activeFieldsBySection(payload)
        let data = get().data
        let changed = false

        // 1. prune values for fields this pathway no longer activates
        for (const [sectionId, rows] of Object.entries(data.rows_by_section)) {
          const allowed = active[sectionId]
          const nextRows = rows.map((row) => {
            const kept: Record<string, unknown> = {}
            let dropped = false
            for (const [fieldId, value] of Object.entries(row.values)) {
              if (allowed && allowed.has(fieldId)) kept[fieldId] = value
              else dropped = true
            }
            return dropped ? { ...row, values: kept } : row
          })
          if (nextRows.some((r, i) => r !== rows[i])) {
            data = withRows(data, sectionId, nextRows)
            changed = true
          }
        }

        // 2. seed a Flow Matrix row per declared case flow (idempotent:
        //    the row id IS the case flow id)
        const flowAllowed = active[FLOW_MATRIX_SECTION]
        if (flowAllowed) {
          const existing = new Set(
            rowsOf(data, FLOW_MATRIX_SECTION).map((r) => r.row_id),
          )
          const seeded: DcfRow[] = []
          for (const flow of flows) {
            if (!flow.id || existing.has(flow.id)) continue
            const values: Record<string, unknown> = {}
            if (flowAllowed.has('flow.name')) values['flow.name'] = flow.name
            if (flowAllowed.has('flow.q5_class')) values['flow.q5_class'] = flow.q5
            if (flow.physical_unit && flowAllowed.has('flow.unit')) {
              values['flow.unit'] = flow.physical_unit
            }
            if (
              flow.physical_quantity != null &&
              flowAllowed.has('flow.quantity_measured')
            ) {
              values['flow.quantity_measured'] = flow.physical_quantity
            }
            seeded.push({ row_id: flow.id, values })
          }
          if (seeded.length > 0) {
            data = withRows(data, FLOW_MATRIX_SECTION, [
              ...rowsOf(data, FLOW_MATRIX_SECTION),
              ...seeded,
            ])
            changed = true
          }
        }

        if (changed) set({ data, dirty: true })
      },

      addActor(name) {
        const data = get().data
        const rows = rowsOf(data, ACTORS_SECTION)
        const rowId = nextActorRowId()
        const values: Record<string, unknown> = {}
        if (name) values['actor.name'] = name
        set({
          data: {
            ...withRows(data, ACTORS_SECTION, [...rows, { row_id: rowId, values }]),
            layout: { ...data.layout, [rowId]: autoPosition(rows.length) },
          },
          dirty: true,
        })
        return rowId
      },

      connect(originRowId, destRowId) {
        if (originRowId === destRowId) return null
        const data = get().data
        const rows = rowsOf(data, FLOW_MATRIX_SECTION)
        // Prefer a seeded flow that has not been wired up yet, so the
        // flows declared in Q5 end up on the canvas instead of duplicates.
        const unwired = rows.find(
          (r) =>
            !r.values['flow.origin_actor_id'] && !r.values['flow.dest_actor_id'],
        )
        const target = unwired ?? { row_id: nextFlowRowId(), values: {} }
        const updated: DcfRow = {
          ...target,
          values: {
            ...target.values,
            'flow.origin_actor_id': originRowId,
            'flow.dest_actor_id': destRowId,
          },
        }
        const nextRows = unwired
          ? rows.map((r) => (r.row_id === target.row_id ? updated : r))
          : [...rows, updated]
        set({ data: withRows(data, FLOW_MATRIX_SECTION, nextRows), dirty: true })
        return updated.row_id
      },

      updateValue(sectionId, rowId, fieldId, value) {
        const data = get().data
        const rows = rowsOf(data, sectionId)
        const nextRows = rows.map((row) => {
          if (row.row_id !== rowId) return row
          const values = { ...row.values }
          // An empty input clears the key rather than storing "": the
          // backend treats both as empty, and a missing key keeps the
          // payload honest about what was actually filled in.
          if (value === '' || value === null || value === undefined) {
            delete values[fieldId]
          } else {
            values[fieldId] = value
          }
          return { ...row, values }
        })
        set({ data: withRows(data, sectionId, nextRows), dirty: true })
      },

      removeRow(sectionId, rowId) {
        const data = get().data
        let next = withRows(
          data,
          sectionId,
          rowsOf(data, sectionId).filter((r) => r.row_id !== rowId),
        )
        if (sectionId === ACTORS_SECTION) {
          // Drop the canvas position and unwire every flow that pointed
          // at this actor — a dangling reference is a 422 on save.
          const layout = { ...next.layout }
          delete layout[rowId]
          const flows = rowsOf(next, FLOW_MATRIX_SECTION).map((row) => {
            const values = { ...row.values }
            for (const key of ['flow.origin_actor_id', 'flow.dest_actor_id']) {
              if (values[key] === rowId) delete values[key]
            }
            return { ...row, values }
          })
          next = { ...withRows(next, FLOW_MATRIX_SECTION, flows), layout }
        }
        set({ data: next, dirty: true })
      },

      setPosition(rowId, pos) {
        const data = get().data
        set({ data: { ...data, layout: { ...data.layout, [rowId]: pos } }, dirty: true })
      },

      loadExample(payload, labels) {
        // A worked example is the fastest way to understand what the
        // canvas expects: three actors, two wired flows, plausible
        // values — but only for fields this pathway actually activated,
        // so the example itself stays legal for the case.
        const active = activeFieldsBySection(payload)
        const actorFields = active[ACTORS_SECTION] ?? new Set<string>()
        const flowFields = active[FLOW_MATRIX_SECTION] ?? new Set<string>()

        const actorRow = (rowId: string, name: string, role: string): DcfRow => {
          const values: Record<string, unknown> = {}
          if (actorFields.has('actor.name')) values['actor.name'] = name
          if (actorFields.has('actor.role')) values['actor.role'] = role
          return { row_id: rowId, values }
        }

        const actors = [
          actorRow('ex-a1', labels.producer, 'producer'),
          actorRow('ex-a2', labels.consumer, 'consumer'),
          actorRow('ex-a3', labels.facilitator, 'facilitator'),
        ]

        const flowRow = (
          rowId: string,
          name: string,
          origin: string,
          dest: string,
          type: string,
        ): DcfRow => {
          const values: Record<string, unknown> = {
            'flow.origin_actor_id': origin,
            'flow.dest_actor_id': dest,
          }
          if (flowFields.has('flow.name')) values['flow.name'] = name
          if (flowFields.has('flow.type')) values['flow.type'] = type
          if (flowFields.has('flow.unit')) values['flow.unit'] = 't/y'
          if (flowFields.has('flow.regime')) values['flow.regime'] = 'continuous'
          if (flowFields.has('flow.uncertainty.type')) {
            values['flow.uncertainty.type'] = 'point'
          }
          return { row_id: rowId, values }
        }

        // The example owns the actors, so any flow the analyst had
        // already wired now points at actors that no longer exist. Those
        // rows are kept — they are the flows declared in Q5 and belong in
        // the to-do list — but unwired, since a dangling reference is a
        // 422 on the next save.
        const kept = rowsOf(get().data, FLOW_MATRIX_SECTION)
          .filter((row) => !row.row_id.startsWith('ex-'))
          .map((row) => {
            const values = { ...row.values }
            delete values['flow.origin_actor_id']
            delete values['flow.dest_actor_id']
            return { ...row, values }
          })

        set({
          data: {
            ...get().data,
            rows_by_section: {
              ...get().data.rows_by_section,
              [ACTORS_SECTION]: actors,
              [FLOW_MATRIX_SECTION]: [
                flowRow('ex-f1', `${labels.flow} 1`, 'ex-a1', 'ex-a2', 'by_product'),
                flowRow('ex-f2', `${labels.flow} 2`, 'ex-a2', 'ex-a3', 'energy'),
                ...kept,
              ],
            },
            layout: {
              'ex-a1': autoPosition(0),
              'ex-a2': autoPosition(1),
              'ex-a3': autoPosition(2),
            },
          },
          dirty: true,
        })
      },

      async loadFromServer(caseId) {
        set({ syncing: true, error: null })
        try {
          const env = await fetchDcfData(caseId)
          set({
            caseId,
            data: env.data,
            validation: env.validation,
            dirty: false,
            syncing: false,
            lastSyncedAt: Date.now(),
          })
          return true
        } catch (e) {
          // 404 = nothing stored yet: keep whatever the local draft holds.
          const notFound = e instanceof ApiError && e.status === 404
          set({
            caseId,
            syncing: false,
            error: notFound ? null : e instanceof Error ? e.message : 'unknown',
          })
          return false
        }
      },

      async saveToServer() {
        const { caseId, data } = get()
        if (!caseId) {
          set({ error: 'no-case-id' })
          return false
        }
        set({ syncing: true, error: null })
        try {
          const env = await putDcfData(caseId, { ...data, case_id: caseId })
          set({
            data: env.data,
            validation: env.validation,
            dirty: false,
            syncing: false,
            lastSyncedAt: Date.now(),
            error: null,
          })
          return true
        } catch (e) {
          set({
            syncing: false,
            error:
              e instanceof ApiError
                ? `${e.status}: ${e.detail}`
                : e instanceof Error
                  ? e.message
                  : 'unknown',
          })
          return false
        }
      },

      reset() {
        set({
          caseId: null,
          data: { ...EMPTY_DATA },
          validation: null,
          dirty: false,
          syncing: false,
          lastSyncedAt: null,
          error: null,
        })
      },
    }),
    {
      name: 'symba-dcf-draft',
      partialize: (state) => ({ caseId: state.caseId, data: state.data }),
    },
  ),
)
