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
//   2. **Keeping values** — editing the answers can switch a field off
//      under content already entered. The values stay in the draft and on the
//      server as "dormant" (never exported) and come back if the field is
//      asked again: pruning them lost data silently (UX round 5, D3).
//   3. **Sync** — load / save against the server, keeping `dirty` so the
//      UI can show unsaved state.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { ApiError, fetchDcfData, putDcfData } from '../services/api'
import type { AlternativeScenario, Flow } from '../types/api'
import type { DcfPayload } from '../types/dcf'
import {
  ACTORS_SECTION,
  DCF_DATA_SCHEMA_VERSION,
  FLOW_CLASSIFICATION_SECTION,
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

/** Whether the drawn network holds work the server does not have: changes
 * not saved, or a network drawn for a case not saved yet. */
export function hasUnsavedNetwork(state: { caseId: string | null; dirty: boolean; data: DcfData }): boolean {
  return state.dirty || (state.caseId === null && hasDrawing(state.data))
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

/** Anything drawn: an actor, or a flow wired at both ends. */
function hasDrawing(data: DcfData): boolean {
  if (rowsOf(data, ACTORS_SECTION).length > 0) return true
  return rowsOf(data, FLOW_MATRIX_SECTION).some(
    (r) => r.values['flow.origin_actor_id'] && r.values['flow.dest_actor_id'],
  )
}

// ----- Scenario networks (designed by Fable, owner OK 2026-11-04) -----
// While a scenario is active the editor works on its own network: actors,
// flows and positions. It reads through to the case's network until the
// first change, which copies it. Every other section stays the case's.

const NETWORK_SECTIONS = [ACTORS_SECTION, FLOW_MATRIX_SECTION]

/** The network the editor shows: the case's, or the active scenario's. */
export function networkView(data: DcfData, scenarioId: string | null): DcfData {
  const variant = scenarioId ? data.networks_by_scenario?.[scenarioId] : undefined
  if (!variant) return data
  return {
    ...data,
    rows_by_section: {
      ...data.rows_by_section,
      [ACTORS_SECTION]: variant.rows_by_section[ACTORS_SECTION] ?? [],
      [FLOW_MATRIX_SECTION]: variant.rows_by_section[FLOW_MATRIX_SECTION] ?? [],
    },
    layout: variant.layout,
  }
}

/** Write `next` (an edited view) back: actors, flows and positions to the
 * active scenario's network when they changed, everything else to the case. */
function commitView(data: DcfData, scenarioId: string | null, next: DcfData): DcfData {
  if (!scenarioId) return next
  const view = networkView(data, scenarioId)
  const networkChanged = next.layout !== view.layout
    || NETWORK_SECTIONS.some((id) => next.rows_by_section[id] !== view.rows_by_section[id])
  const base: DcfData = {
    ...data,
    rows_by_section: {
      ...next.rows_by_section,
      [ACTORS_SECTION]: rowsOf(data, ACTORS_SECTION),
      [FLOW_MATRIX_SECTION]: rowsOf(data, FLOW_MATRIX_SECTION),
    },
  }
  if (!networkChanged) return base
  return {
    ...base,
    networks_by_scenario: {
      ...(data.networks_by_scenario ?? {}),
      [scenarioId]: {
        rows_by_section: {
          [ACTORS_SECTION]: rowsOf(next, ACTORS_SECTION),
          [FLOW_MATRIX_SECTION]: rowsOf(next, FLOW_MATRIX_SECTION),
        },
        layout: next.layout,
      },
    },
  }
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
  /** Ids of the flows of the questionnaire, as of the last sync. A Flow
   * Matrix row with one of these ids IS that flow; any other row is not in
   * the questionnaire (UX round 5, D2). */
  caseFlowIds: string[]
  validation: DcfDataValidation | null
  dirty: boolean
  syncing: boolean
  lastSyncedAt: number | null
  error: string | null
  /** The last failed save, for the page to tell a deleted case from other errors. */
  saveError: unknown
  /** The scenario whose network the editor shows; null = the case's. Not saved. */
  activeScenario: string | null

  bindTo: (caseId: string | null) => void
  setActiveScenario: (scenarioId: string | null) => void
  /** Drop a scenario's own network: it reads the case's network again. */
  dropScenarioNetwork: (scenarioId: string) => void
  /** Rebind the current (or given) content to another saved case, keeping
   * its rows and layout — used by "Save as new". Marks it dirty. */
  carryTo: (caseId: string, data?: DcfData) => void
  syncWithPayload: (payload: DcfPayload, flows: Flow[], scenarios?: AlternativeScenario[]) => void
  addActor: (name?: string) => string
  /** Wire a questionnaire flow between two actors. Null when refused: the
   * same actor at both ends, or a flow that is not in the questionnaire. */
  connect: (originRowId: string, destRowId: string, flowRowId: string) => string | null
  /** Swap origin and destination of a drawn flow. */
  reverseFlow: (rowId: string) => void
  updateValue: (
    sectionId: string,
    rowId: string,
    fieldId: string,
    value: unknown,
  ) => void
  removeRow: (sectionId: string, rowId: string) => void
  /** Set one classification field of a flow, creating its Flow
   * Classification row on the first value (round 4 leftover). */
  setClassification: (flowRowId: string, fieldId: string, value: unknown) => void
  setPosition: (rowId: string, pos: DcfNodePosition) => void
  /** Replace the positions of the actors (automatic layout). */
  setLayout: (positions: Record<string, DcfNodePosition>) => void
  loadExample: (payload: DcfPayload, labels: ExampleLabels) => void
  loadFromServer: (caseId: string) => Promise<boolean>
  /** Put away the changes not saved: the network the server holds for the
   * bound case comes back (an empty one when none was ever saved). */
  discardChanges: () => Promise<boolean>
  /** The bound case was deleted: keep what was drawn as the draft of a case
   * not saved yet, so saving the case again carries it (UX round 6, P7-01). */
  detach: () => void
  saveToServer: () => Promise<boolean>
  reset: () => void
}

export const useDcfDataStore = create<DcfDataState>()(
  persist(
    (set, get) => ({
      caseId: null,
      data: { ...EMPTY_DATA },
      caseFlowIds: [],
      validation: null,
      dirty: false,
      syncing: false,
      lastSyncedAt: null,
      error: null,
      saveError: null,
      activeScenario: null,

      setActiveScenario(scenarioId) {
        set({ activeScenario: scenarioId })
      },

      dropScenarioNetwork(scenarioId) {
        const data = get().data
        if (!data.networks_by_scenario?.[scenarioId]) return
        const networks = { ...data.networks_by_scenario }
        delete networks[scenarioId]
        set({ data: { ...data, networks_by_scenario: networks }, dirty: true })
      },

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
          activeScenario: null,
          // the questionnaire flows of the previous case are not this one's
          caseFlowIds: [],
          // a local draft becoming a saved case has something to push only
          // if something was drawn: an empty draft is not "unsaved" (P1-10)
          dirty: current === null && caseId !== null && hasDrawing(get().data),
        })
      },

      syncWithPayload(payload, flows, scenarios) {
        const active = activeFieldsBySection(payload)
        let data = get().data
        let changed = false

        // 1. seed a Flow Matrix row per declared case flow (idempotent:
        //    the row id IS the case flow id); name and payment class of a
        //    questionnaire flow always follow the questionnaire (D2)
        const flowAllowed = active[FLOW_MATRIX_SECTION]
        if (flowAllowed) {
          const byId = new Map(flows.filter((f) => f.id).map((f) => [f.id as string, f]))
          const followed = rowsOf(data, FLOW_MATRIX_SECTION).map((row) => {
            const flow = byId.get(row.row_id)
            if (!flow) return row
            const values = { ...row.values }
            let touched = false
            if (flowAllowed.has('flow.name') && values['flow.name'] !== flow.name) {
              values['flow.name'] = flow.name
              touched = true
            }
            if (flowAllowed.has('flow.q5_class') && flow.q5 && values['flow.q5_class'] !== flow.q5) {
              values['flow.q5_class'] = flow.q5
              touched = true
            }
            return touched ? { ...row, values } : row
          })
          if (followed.some((r, i) => r !== rowsOf(data, FLOW_MATRIX_SECTION)[i])) {
            data = withRows(data, FLOW_MATRIX_SECTION, followed)
            changed = true
          }
          const existing = new Set(
            rowsOf(data, FLOW_MATRIX_SECTION).map((r) => r.row_id),
          )
          const seeded: DcfRow[] = []
          for (const flow of flows) {
            if (!flow.id || existing.has(flow.id)) continue
            const values: Record<string, unknown> = {}
            if (flowAllowed.has('flow.name')) values['flow.name'] = flow.name
            if (flowAllowed.has('flow.q5_class') && flow.q5) values['flow.q5_class'] = flow.q5
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

        // 2. seed a Flow Classification row from the Freedom-to-Act answer
        //    given in Q5 (Flow.sellable_elsewhere), once per flow: a row the
        //    analyst already has for that flow is theirs and is not touched
        const classAllowed = active[FLOW_CLASSIFICATION_SECTION]
        if (
          classAllowed &&
          classAllowed.has('classif.flow_id') &&
          classAllowed.has('classif.independent_market')
        ) {
          const classified = new Set(
            rowsOf(data, FLOW_CLASSIFICATION_SECTION).map(
              (r) => r.values['classif.flow_id'],
            ),
          )
          const seeded: DcfRow[] = []
          for (const flow of flows) {
            if (!flow.id || flow.sellable_elsewhere == null) continue
            if (classified.has(flow.id)) continue
            seeded.push({
              row_id: `classif-${flow.id}`,
              values: {
                'classif.flow_id': flow.id,
                'classif.independent_market': flow.sellable_elsewhere ? 'yes' : 'no',
              },
            })
          }
          if (seeded.length > 0) {
            data = withRows(data, FLOW_CLASSIFICATION_SECTION, [
              ...rowsOf(data, FLOW_CLASSIFICATION_SECTION),
              ...seeded,
            ])
            changed = true
          }
        }

        // 3. a scenario's own network follows the questionnaire too: names,
        //    who pays whom as the scenario sets it (flow_q5) or as the case
        //    does, and a row (unwired) for a flow added after the copy
        const variants = data.networks_by_scenario ?? {}
        if (flowAllowed && Object.keys(variants).length > 0) {
          const overridesOf = new Map((scenarios ?? []).map((sc) => [sc.id, sc.overrides?.flow_q5]))
          let variantsChanged = false
          const nextVariants: typeof variants = {}
          for (const [scenarioId, variant] of Object.entries(variants)) {
            const q5Of = (overridesOf.get(scenarioId) ?? {}) as Record<string, string>
            const rows = variant.rows_by_section[FLOW_MATRIX_SECTION] ?? []
            const have = new Set(rows.map((r) => r.row_id))
            let touched = false
            const followed = rows.map((row) => {
              const flow = flows.find((f) => f.id === row.row_id)
              if (!flow) return row
              const q5 = q5Of[row.row_id] ?? flow.q5
              const values = { ...row.values }
              let changedRow = false
              if (flowAllowed.has('flow.name') && values['flow.name'] !== flow.name) {
                values['flow.name'] = flow.name
                changedRow = true
              }
              // without the scenarios the override is unknown: leave the class as it is
              if (scenarios && flowAllowed.has('flow.q5_class') && q5 && values['flow.q5_class'] !== q5) {
                values['flow.q5_class'] = q5
                changedRow = true
              }
              if (!changedRow) return row
              touched = true
              return { ...row, values }
            })
            for (const flow of flows) {
              if (!flow.id || have.has(flow.id)) continue
              const values: Record<string, unknown> = {}
              if (flowAllowed.has('flow.name')) values['flow.name'] = flow.name
              const q5 = q5Of[flow.id] ?? flow.q5
              if (flowAllowed.has('flow.q5_class') && q5) values['flow.q5_class'] = q5
              // as seeded for the case: otherwise the comparison would report a
              // unit and a quantity "removed" that nobody touched
              if (flow.physical_unit && flowAllowed.has('flow.unit')) values['flow.unit'] = flow.physical_unit
              if (flow.physical_quantity != null && flowAllowed.has('flow.quantity_measured')) {
                values['flow.quantity_measured'] = flow.physical_quantity
              }
              followed.push({ row_id: flow.id, values })
              touched = true
            }
            nextVariants[scenarioId] = touched
              ? { ...variant, rows_by_section: { ...variant.rows_by_section, [FLOW_MATRIX_SECTION]: followed } }
              : variant
            variantsChanged ||= touched
          }
          if (variantsChanged) {
            data = { ...data, networks_by_scenario: nextVariants }
            changed = true
          }
        }

        // Seeding is not an edit: it does not make the network "unsaved" (the
        // files seed the same rows on the server side).
        const caseFlowIds = flows.map((f) => f.id).filter((id): id is string => !!id)
        if (changed) set({ data, caseFlowIds })
        else if (caseFlowIds.join('|') !== get().caseFlowIds.join('|')) set({ caseFlowIds })
      },

      carryTo(caseId, data) {
        // "Save as new": the network drawn for the previous case comes along.
        const source = data ?? get().data
        set({
          caseId,
          data: { ...source, case_id: caseId },
          validation: null,
          dirty: true,
        })
      },

      addActor(name) {
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
        const rows = rowsOf(data, ACTORS_SECTION)
        const rowId = nextActorRowId()
        const values: Record<string, unknown> = {}
        if (name) values['actor.name'] = name
        set({
          data: commitView(stored, activeScenario, {
            ...withRows(data, ACTORS_SECTION, [...rows, { row_id: rowId, values }]),
            layout: { ...data.layout, [rowId]: autoPosition(rows.length) },
          }),
          dirty: true,
        })
        return rowId
      },

      connect(originRowId, destRowId, flowRowId) {
        // Every arrow is a flow of the questionnaire, chosen explicitly: the
        // first free flow used to be taken whatever the two actors were, and
        // a flow the engine does not know has no treatment, rules or
        // obligations (UX round 5, D2).
        if (originRowId === destRowId) return null
        if (!get().caseFlowIds.includes(flowRowId)) return null
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
        const rows = rowsOf(data, FLOW_MATRIX_SECTION)
        if (!rows.some((r) => r.row_id === flowRowId)) return null
        const nextRows = rows.map((r) =>
          r.row_id === flowRowId
            ? {
                ...r,
                values: {
                  ...r.values,
                  'flow.origin_actor_id': originRowId,
                  'flow.dest_actor_id': destRowId,
                },
              }
            : r,
        )
        set({ data: commitView(stored, activeScenario, withRows(data, FLOW_MATRIX_SECTION, nextRows)), dirty: true })
        return flowRowId
      },

      reverseFlow(rowId) {
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
        const rows = rowsOf(data, FLOW_MATRIX_SECTION)
        const nextRows = rows.map((r) => {
          if (r.row_id !== rowId) return r
          const origin = r.values['flow.origin_actor_id']
          const dest = r.values['flow.dest_actor_id']
          if (!origin || !dest) return r
          return {
            ...r,
            values: { ...r.values, 'flow.origin_actor_id': dest, 'flow.dest_actor_id': origin },
          }
        })
        if (nextRows.every((r, i) => r === rows[i])) return   // nothing drawn to reverse
        set({ data: commitView(stored, activeScenario, withRows(data, FLOW_MATRIX_SECTION, nextRows)), dirty: true })
      },

      updateValue(sectionId, rowId, fieldId, value) {
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
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
        set({ data: commitView(stored, activeScenario, withRows(data, sectionId, nextRows)), dirty: true })
      },

      setClassification(flowRowId, fieldId, value) {
        const data = get().data
        const rows = rowsOf(data, FLOW_CLASSIFICATION_SECTION)
        const existing = rows.find((r) => r.values['classif.flow_id'] === flowRowId)
        if (existing) {
          get().updateValue(FLOW_CLASSIFICATION_SECTION, existing.row_id, fieldId, value)
          return
        }
        if (value === '' || value === null || value === undefined) return
        const used = new Set(rows.map((r) => r.row_id))
        let rowId = `classif-${flowRowId}`
        for (let n = 2; used.has(rowId); n += 1) rowId = `classif-${flowRowId}-${n}`
        set({
          data: withRows(data, FLOW_CLASSIFICATION_SECTION, [
            ...rows,
            { row_id: rowId, values: { 'classif.flow_id': flowRowId, [fieldId]: value } },
          ]),
          dirty: true,
        })
      },

      removeRow(sectionId, rowId) {
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
        if (sectionId === FLOW_MATRIX_SECTION && get().caseFlowIds.includes(rowId)) {
          // "Remove" on a questionnaire flow takes the arrow off the canvas;
          // the flow goes back to the "not yet drawn" list (P1-01)
          const target = rowsOf(data, FLOW_MATRIX_SECTION).find((r) => r.row_id === rowId)
          if (!target?.values['flow.origin_actor_id'] && !target?.values['flow.dest_actor_id']) return
          const unwired = rowsOf(data, FLOW_MATRIX_SECTION).map((row) => {
            if (row.row_id !== rowId) return row
            const values = { ...row.values }
            delete values['flow.origin_actor_id']
            delete values['flow.dest_actor_id']
            return { ...row, values }
          })
          set({ data: commitView(stored, activeScenario, withRows(data, FLOW_MATRIX_SECTION, unwired)), dirty: true })
          return
        }
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
        set({ data: commitView(stored, activeScenario, next), dirty: true })
      },

      setPosition(rowId, pos) {
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
        set({ data: commitView(stored, activeScenario, { ...data, layout: { ...data.layout, [rowId]: pos } }), dirty: true })
      },

      setLayout(positions) {
        const { data: stored, activeScenario } = get()
        const data = networkView(stored, activeScenario)
        set({ data: commitView(stored, activeScenario, { ...data, layout: { ...data.layout, ...positions } }), dirty: true })
      },

      loadExample(payload, labels) {
        // it writes the case's network; never from a scenario's (Fable review)
        if (get().activeScenario) return
        // A worked example is the fastest way to understand what the
        // canvas expects: three actors, two wired flows, plausible
        // values — but only for fields this configuration actually activated,
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
          actorRow('ex-a1', labels.producer, 'partner'),
          actorRow('ex-a2', labels.consumer, 'partner'),
          actorRow('ex-a3', labels.facilitator, 'facilitator'),
        ]

        const flowRow = (
          rowId: string,
          name: string,
          origin: string,
          dest: string,
          type: string,
          unit: string,
        ): DcfRow => {
          const values: Record<string, unknown> = {
            'flow.origin_actor_id': origin,
            'flow.dest_actor_id': dest,
          }
          if (flowFields.has('flow.name')) values['flow.name'] = name
          if (flowFields.has('flow.type')) values['flow.type'] = type
          if (flowFields.has('flow.unit')) values['flow.unit'] = unit
          if (flowFields.has('flow.regime')) values['flow.regime'] = 'continuous'
          if (flowFields.has('flow.uncertainty.type')) {
            values['flow.uncertainty.type'] = 'point'
          }
          return { row_id: rowId, values }
        }

        // The example owns the actors. A case with flows gets its own first
        // two flows wired between the example actors (the editor draws only
        // flows of the questionnaire, D2), the rest unwired in the to-do
        // list; only a case without flows gets the two generic example flows.
        const caseIds = get().caseFlowIds
        const caseRows = rowsOf(get().data, FLOW_MATRIX_SECTION)
          .filter((row) => !row.row_id.startsWith('ex-'))
          .map((row) => {
            const values = { ...row.values }
            delete values['flow.origin_actor_id']
            delete values['flow.dest_actor_id']
            return { ...row, values }
          })
        const wiring: [string, string][] = [['ex-a1', 'ex-a2'], ['ex-a2', 'ex-a1']]
        let wired = 0
        const kept = caseRows.map((row) => {
          if (wired >= wiring.length || !caseIds.includes(row.row_id)) return row
          const [origin, dest] = wiring[wired++]
          return {
            ...row,
            values: { ...row.values, 'flow.origin_actor_id': origin, 'flow.dest_actor_id': dest },
          }
        })
        const exampleFlows = caseIds.length > 0
          ? []
          : [
              flowRow('ex-f1', `${labels.flow} 1`, 'ex-a1', 'ex-a2', 'by_product', 't/y'),
              flowRow('ex-f2', `${labels.flow} 2`, 'ex-a2', 'ex-a3', 'energy', 'MWh/y'),
            ]

        set({
          data: {
            ...get().data,
            rows_by_section: {
              ...get().data.rows_by_section,
              [ACTORS_SECTION]: actors,
              [FLOW_MATRIX_SECTION]: [...exampleFlows, ...kept],
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
          // Coming back to the page reloaded the server copy over changes not
          // saved yet, a scenario's own network included (Kimi test 2026-11-04,
          // A3-01): unsaved work on this case, from before the request or made
          // while it ran, stays; the page keeps saying it is unsaved.
          if (get().caseId === caseId && get().dirty) {
            set({ syncing: false })
            return false
          }
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

      async discardChanges() {
        const caseId = get().caseId
        if (!caseId) return false
        set({ syncing: true, error: null })
        try {
          const env = await fetchDcfData(caseId)
          if (get().caseId !== caseId) return false
          set({
            data: env.data,
            validation: env.validation,
            dirty: false,
            syncing: false,
            activeScenario: null,
            lastSyncedAt: Date.now(),
          })
          return true
        } catch (e) {
          // nothing stored yet: the saved network is the empty one
          if (e instanceof ApiError && e.status === 404 && get().caseId === caseId) {
            set({
              data: { ...EMPTY_DATA, case_id: caseId },
              validation: null,
              dirty: false,
              syncing: false,
              activeScenario: null,
              lastSyncedAt: Date.now(),
            })
            return true
          }
          set({ syncing: false, error: e instanceof Error ? e.message : 'unknown' })
          return false
        }
      },

      detach() {
        if (get().caseId === null) return
        set({
          caseId: null,
          data: { ...get().data, case_id: '' },
          validation: null,
          dirty: hasDrawing(get().data),
          error: null,
          saveError: null,
        })
      },

      async saveToServer() {
        const { caseId, data } = get()
        if (!caseId) {
          set({ error: 'no-case-id' })
          return false
        }
        set({ syncing: true, error: null, saveError: null })
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
            saveError: e,
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
          caseFlowIds: [],
          validation: null,
          dirty: false,
          syncing: false,
          lastSyncedAt: null,
          error: null,
          saveError: null,
          activeScenario: null,
        })
      },
    }),
    {
      name: 'symba-dcf-draft',
      // `dirty` too: after a reload the draft must still know it holds unsaved work
      partialize: (state) => ({ caseId: state.caseId, data: state.data, dirty: state.dirty }),
    },
  ),
)
