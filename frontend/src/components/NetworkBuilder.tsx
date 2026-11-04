// NetworkBuilder — drag & drop editor for the DCF network (phase 2).
//
// Nodes are Actors rows, edges are Flow Matrix rows. What the analyst
// draws here is exactly what the Excel/docx DCF will carry, so the
// canvas edits the same `rows_by_section` the backend validates:
// dropping a node unwires its flows, connecting two nodes fills
// flow.origin_actor_id / flow.dest_actor_id, and the canvas positions
// are persisted so a reopened case looks the way it was left.
//
// Flows declared in Q5 are seeded as unwired rows (store.syncWithPayload)
// and listed under the canvas until they are drawn — that list is the
// analyst's to-do. Every arrow is one of those flows, chosen explicitly;
// their name and payment class are read-only here (UX round 5, D2).

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Connection,
  type Edge,
  type Node,
  type NodeDragHandler,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { FLOW_EDGE_TYPES } from './flowEdgeTypes'

import DcfRowFields from './DcfRowFields'
import { actorNodes, flowEdges, layeredLayout, nodeClassName, unwiredFlows } from './networkGraph'
import { networkView, useDcfDataStore } from '../store/dcfDataStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type { Case } from '../types/api'
import type { DcfPayload, DcfSection } from '../types/dcf'
import {
  ACTORS_SECTION,
  FLOW_CLASSIFICATION_SECTION,
  FLOW_MATRIX_SECTION,
  type DcfDataIssue,
  type DcfRow,
} from '../types/dcfData'
import { askChoice, askConfirm } from '../store/dialogStore'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { edgeShifts } from './networkGraph'

interface Props {
  payload: DcfPayload
  sourceCase: Case
  /** Server case id, or null while the case is only a local draft. */
  caseId: string | null
}

interface Selection {
  sectionId: string
  rowId: string
}

/** A questionnaire flow's name and payment class are set there (D2). */
const QUESTIONNAIRE_FIELDS = new Set(['flow.name', 'flow.q5_class'])

/** Key for the dismissible how-it-works strip. */
const HINT_ID = 'network-builder'

const HINT_STEPS = ['step1', 'step2', 'step3'] as const

function sectionOf(payload: DcfPayload, id: string): DcfSection | undefined {
  return payload.sections.find((s) => s.id === id)
}

function issuesFor(
  validation: { errors: DcfDataIssue[]; missing_required: DcfDataIssue[] } | null,
  rowId: string,
  scenarioId: string | null = null,
): DcfDataIssue[] {
  if (!validation) return []
  // a scenario's network has rows with the case's ids: keep each issue on its network
  return [...validation.errors, ...validation.missing_required].filter(
    (i) => i.row_id === rowId && (i.scenario_id ?? null) === scenarioId,
  )
}

export default function NetworkBuilder({ payload, sourceCase, caseId }: Props) {
  const { t } = useTranslation()
  const stored = useDcfDataStore((s) => s.data)
  // the case's network, or the active scenario's own (scenario networks,
  // designed by Fable, owner OK 2026-11-04)
  const activeScenario = useDcfDataStore((s) => s.activeScenario)
  const setActiveScenario = useDcfDataStore((s) => s.setActiveScenario)
  const dropScenarioNetwork = useDcfDataStore((s) => s.dropScenarioNetwork)
  const data = useMemo(() => networkView(stored, activeScenario), [stored, activeScenario])
  const scenarios = useMemo(() => sourceCase.alternative_scenarios ?? [], [sourceCase.alternative_scenarios])
  const orphans = useMemo(
    () => Object.keys(stored.networks_by_scenario ?? {}).filter((id) => !scenarios.some((sc) => sc.id === id)),
    [stored.networks_by_scenario, scenarios],
  )
  const ownNetwork = !!(activeScenario && stored.networks_by_scenario?.[activeScenario])
  const validation = useDcfDataStore((s) => s.validation)
  const dirty = useDcfDataStore((s) => s.dirty)
  const syncing = useDcfDataStore((s) => s.syncing)
  const error = useDcfDataStore((s) => s.error)
  const addActor = useDcfDataStore((s) => s.addActor)
  const connect = useDcfDataStore((s) => s.connect)
  const reverseFlow = useDcfDataStore((s) => s.reverseFlow)
  const caseFlowIds = useDcfDataStore((s) => s.caseFlowIds)
  const signedIn = useAuthStore((s) => s.token !== null)
  const pushToast = useToastStore((s) => s.push)
  const updateValue = useDcfDataStore((s) => s.updateValue)
  const removeRow = useDcfDataStore((s) => s.removeRow)
  const setClassification = useDcfDataStore((s) => s.setClassification)
  const setPosition = useDcfDataStore((s) => s.setPosition)
  const setLayout = useDcfDataStore((s) => s.setLayout)
  const saveToServer = useDcfDataStore((s) => s.saveToServer)
  const loadExample = useDcfDataStore((s) => s.loadExample)
  const hintDismissed = usePreferenceStore((s) => s.dismissedHints[HINT_ID])
  const dismissHint = usePreferenceStore((s) => s.dismissHint)

  const [selection, setSelection] = useState<Selection | null>(null)
  /** The flow the next arrow will be: set by clicking it in the to-do list. */
  const [armed, setArmed] = useState<string | null>(null)
  const flowRef = useRef<ReactFlowInstance | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)

  // On a narrow screen the "side" panel sits below the canvas: bring it into
  // view when something is selected, or the fields seem not to open (P6-04)
  useEffect(() => {
    if (!selection || typeof window === 'undefined' || window.innerWidth > 900) return
    panelRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [selection])

  async function handleDropScenario() {
    if (!activeScenario || !(await askConfirm(t('networkBuilder.scenarioDropConfirm')))) return
    const id = activeScenario
    dropScenarioNetwork(id)
    // an orphan has nothing left to show
    if (!scenarios.some((sc) => sc.id === id)) setActiveScenario(null)
  }

  // a scenario deleted from the questionnaire, with no network of its own
  useEffect(() => {
    if (activeScenario && !scenarios.some((sc) => sc.id === activeScenario) && !orphans.includes(activeScenario)) {
      setActiveScenario(null)
    }
  }, [activeScenario, scenarios, orphans, setActiveScenario])

  /** Add an actor and keep it on screen: on a phone it landed outside the canvas. */
  function handleAddActor() {
    const rowId = addActor()
    setSelection({ sectionId: ACTORS_SECTION, rowId })
    // only where it lands off-canvas: on a desktop the view would jump
    if (window.innerWidth <= 900) {
      window.setTimeout(() => flowRef.current?.fitView({ padding: 0.2 }), 50)
    }
  }

  const actorRows = useMemo(
    () => data.rows_by_section[ACTORS_SECTION] ?? [],
    [data],
  )
  const flowRows = useMemo(
    () => data.rows_by_section[FLOW_MATRIX_SECTION] ?? [],
    [data],
  )

  /** Lay the actors out by flow direction (round 5 deferred item). */
  async function handleArrange() {
    if (Object.keys(data.layout).length > 0 && !(await askConfirm(t('networkBuilder.arrangeConfirm')))) return
    setLayout(layeredLayout(actorRows.map((r) => r.row_id), flowEdges(flowRows)))
    window.setTimeout(() => flowRef.current?.fitView({ padding: 0.2 }), 50)
  }

  const flowCounts = useMemo(() => {
    const out: Record<string, { gives: number; receives: number }> = {}
    for (const row of flowRows) {
      const o = row.values['flow.origin_actor_id']
      const d = row.values['flow.dest_actor_id']
      if (typeof o !== 'string' || typeof d !== 'string') continue
      out[o] = { gives: (out[o]?.gives ?? 0) + 1, receives: out[o]?.receives ?? 0 }
      out[d] = { gives: out[d]?.gives ?? 0, receives: (out[d]?.receives ?? 0) + 1 }
    }
    return out
  }, [flowRows])

  const nodes: Node[] = useMemo(
    () =>
      actorNodes(actorRows, data.layout, (i) => `${t('networkBuilder.actor')} ${i + 1}`, flowRows).map(
        (node) => ({
          id: node.id,
          position: node.position,
          data: {
            label: (
              <span className="nb-node-label">
                <strong>{node.label}</strong>
                <em>{node.role ? t(`networkBuilder.roles.${node.role}`, { defaultValue: node.role }) : t('networkBuilder.noRole')}</em>
                {/* what it gives and receives, from the arrows: one role could
                    not say both (UX round 5, D6) */}
                {flowCounts[node.id] ? (
                  <small>{t('networkBuilder.givesReceives', flowCounts[node.id])}</small>
                ) : null}
              </span>
            ),
          },
          className: nodeClassName(node),
          selected: selection?.rowId === node.id,
        }),
      ),
    [actorRows, data.layout, selection, t, flowCounts, flowRows],
  )

  const edges: Edge[] = useMemo(() => {
    const drawn = flowEdges(flowRows)
    const shifts = edgeShifts(drawn)
    return drawn.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label ?? undefined,
      // the direction decides who gives and who receives: it has to show
      // (P5-02); parallel arrows between the same actors must not overlap (P1-03)
      type: 'flow',
      data: { shift: shifts[edge.id] },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
      style: { strokeWidth: 2 },
      className: `nb-edge nb-edge-${edge.type ?? 'unset'}`,
      selected: selection?.rowId === edge.id,
    }))
  }, [flowRows, selection])

  // the to-do list: questionnaire flows not drawn yet (rows outside the
  // questionnaire are listed apart, below)
  const unwired = unwiredFlows(flowRows).filter(
    (r) => caseFlowIds.includes(r.row_id) || r.row_id.startsWith('ex-'),
  )

  const onNodeDragStop: NodeDragHandler = (_e, node) => {
    setPosition(node.id, { x: node.position.x, y: node.position.y })
  }

  const flowName = (row: DcfRow) =>
    typeof row.values['flow.name'] === 'string' && row.values['flow.name']
      ? String(row.values['flow.name'])
      : row.row_id
  const actorName = (rowId: unknown) => {
    const i = actorRows.findIndex((a) => a.row_id === rowId)
    if (i < 0) return '—'
    const name = actorRows[i].values['actor.name']
    return typeof name === 'string' && name.trim() ? name : `${t('networkBuilder.actor')} ${i + 1}`
  }

  /** Which questionnaire flow a new arrow is: the armed one, the only one
   * left, or the analyst's choice — never "the next in the list" (P1-02). */
  async function pickFlow(): Promise<string | null> {
    const free = unwired.filter((r) => caseFlowIds.includes(r.row_id))
    if (armed && free.some((r) => r.row_id === armed)) return armed
    if (free.length === 0) {
      pushToast({ type: 'info', message: t('networkBuilder.allDrawn'), durationMs: 8000 })
      return null
    }
    if (free.length === 1) return free[0].row_id
    return askChoice(
      t('networkBuilder.whichFlow'),
      free.map((r) => ({
        value: r.row_id,
        label: flowName(r),
        detail: r.values['flow.q5_class']
          ? t(`flows.plainOptions.${String(r.values['flow.q5_class'])}`)
          : undefined,
      })),
    )
  }

  async function onConnect(conn: Connection) {
    if (!conn.source || !conn.target) return
    if (conn.source === conn.target) {
      pushToast({ type: 'info', message: t('networkBuilder.sameActor') })
      return
    }
    const flowId = await pickFlow()
    if (!flowId) return
    const rowId = connect(conn.source, conn.target, flowId)
    setArmed(null)
    if (rowId) setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId })
  }

  /** Field edits from the panel: an arrow from an actor to itself is refused. */
  function onFieldChange(sectionId: string, row: DcfRow, fieldId: string, value: unknown) {
    if (sectionId === FLOW_MATRIX_SECTION && value) {
      const other = fieldId === 'flow.origin_actor_id'
        ? row.values['flow.dest_actor_id']
        : fieldId === 'flow.dest_actor_id' ? row.values['flow.origin_actor_id'] : undefined
      if (other && other === value) {
        pushToast({ type: 'info', message: t('networkBuilder.sameActor') })
        return
      }
    }
    updateValue(sectionId, row.row_id, fieldId, value)
  }

  async function onRemove(sectionId: string, row: DcfRow) {
    if (sectionId === ACTORS_SECTION) {
      const linked = flowRows.filter(
        (f) => f.values['flow.origin_actor_id'] === row.row_id || f.values['flow.dest_actor_id'] === row.row_id,
      ).length
      const name = actorName(row.row_id)
      const ok = await askConfirm(
        linked > 0
          ? t('networkBuilder.confirmRemoveActorFlows', { name, count: linked })
          : t('networkBuilder.confirmRemoveActor', { name }),
      )
      if (!ok) return
    } else if (!caseFlowIds.includes(row.row_id)) {
      if (!(await askConfirm(t('networkBuilder.confirmRemoveFlow', { name: flowName(row) })))) return
    }
    removeRow(sectionId, row.row_id)
    setSelection(null)
  }

  async function handleLoadExample() {
    // Replacing a network someone drew would be rude; ask first.
    if (
      actorRows.length > 0 &&
      !(await askConfirm(t('networkBuilder.exampleReplaceConfirm')))
    ) {
      return
    }
    loadExample(payload, {
      producer: t('networkBuilder.example.producer'),
      consumer: t('networkBuilder.example.consumer'),
      facilitator: t('networkBuilder.example.facilitator'),
      flow: t('networkBuilder.example.flow'),
    })
    setSelection(null)
  }

  // Legal and economic classification and the substituted product of a flow,
  // filled in next to the flow instead of only in the Excel file (round 4
  // leftover, decided by Fable): the same Flow Classification row the file has
  function classificationBlock(flowRow: DcfRow) {
    const section = sectionOf(payload, FLOW_CLASSIFICATION_SECTION)
    if (!section?.active) return null
    const fields = section.fields.filter((f) => f.id !== 'classif.flow_id')
    if (fields.length === 0) return null
    const row = (data.rows_by_section[FLOW_CLASSIFICATION_SECTION] ?? [])
      .find((r) => r.values['classif.flow_id'] === flowRow.row_id)
      ?? { row_id: `classif-${flowRow.row_id}`, values: {} }
    return (
      <details className="nb-classification">
        <summary>{t('networkBuilder.panelClassification')}</summary>
        <DcfRowFields
          section={{ ...section, fields }}
          row={row}
          actors={actorRows}
          sites={sourceCase.sites ?? []}
          issues={issuesFor(validation, row.row_id)}
          note={t('networkBuilder.classificationNote')}
          onChange={(fieldId, value) => setClassification(flowRow.row_id, fieldId, value)}
        />
      </details>
    )
  }

  const selectedSection = selection ? sectionOf(payload, selection.sectionId) : undefined
  const selectedRow: DcfRow | undefined = selection
    ? (data.rows_by_section[selection.sectionId] ?? []).find(
        (r) => r.row_id === selection.rowId,
      )
    : undefined

  // Counted here, on what is on screen, so it moves while fields are filled
  // in (it used to change only after saving, P5-06); clicking it goes to the
  // first row with a gap.
  const missing = useMemo(() => {
    const out: Selection[] = []
    for (const sectionId of [ACTORS_SECTION, FLOW_MATRIX_SECTION]) {
      const section = sectionOf(payload, sectionId)
      if (!section?.active) continue
      const required = section.fields.filter((f) => f.required && !f.derived)
      for (const row of data.rows_by_section[sectionId] ?? []) {
        // a row outside the questionnaire is to remove, not to fill in
        if (sectionId === FLOW_MATRIX_SECTION && !caseFlowIds.includes(row.row_id)
          && !row.row_id.startsWith('ex-')) continue
        for (const f of required) {
          const v = row.values[f.id]
          if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
            out.push({ sectionId, rowId: row.row_id })
          }
        }
      }
    }
    return out
  }, [payload, data, caseFlowIds])
  const missingCount = missing.length

  const drawnFlows = flowRows.filter(
    (r) => r.values['flow.origin_actor_id'] && r.values['flow.dest_actor_id'],
  )
  // rows that are not a flow of the questionnaire: hand-drawn before UX round
  // 5, or flows removed from the questionnaire since they were drawn
  const strayFlows = flowRows.filter(
    (r) => !caseFlowIds.includes(r.row_id) && !r.row_id.startsWith('ex-'),
  )
  const isQuestionnaireFlow = (rowId: string) => caseFlowIds.includes(rowId)
  const panelTitle = (() => {
    if (!selectedRow || !selection) return null
    if (selection.sectionId === ACTORS_SECTION) {
      return `${t('networkBuilder.panelActor')}: ${actorName(selectedRow.row_id)}`
    }
    const o = selectedRow.values['flow.origin_actor_id']
    const d = selectedRow.values['flow.dest_actor_id']
    const route = o && d ? ` (${actorName(o)} → ${actorName(d)})` : ''
    return `${t('networkBuilder.panelFlow')}: ${flowName(selectedRow)}${route}`
  })()

  return (
    <div className="nb-wrap">
      {scenarios.length > 0 || orphans.length > 0 ? (
        <div className="nb-scenario">
          <label>
            {t('networkBuilder.scenarioPick')}{' '}
            <select
              className="row-select"
              value={activeScenario ?? ''}
              onChange={(e) => {
                setSelection(null)
                setActiveScenario(e.target.value || null)
              }}
            >
              <option value="">{t('networkBuilder.scenarioCase')}</option>
              {scenarios.map((sc) => <option key={sc.id} value={sc.id}>{sc.label || sc.id}</option>)}
              {orphans.map((id) => (
                <option key={id} value={id}>{t('networkBuilder.scenarioOrphan', { id })}</option>
              ))}
            </select>
          </label>
          {activeScenario ? (
            <p className="nb-scenario-note">
              {t(ownNetwork ? 'networkBuilder.scenarioOwn' : 'networkBuilder.scenarioReadThrough')}
              {ownNetwork ? (
                <>
                  {' '}
                  <button type="button" className="btn btn-secondary" onClick={() => void handleDropScenario()}>
                    {t('networkBuilder.scenarioDrop')}
                  </button>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="nb-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddActor}
        >
          {t('networkBuilder.addActor')}
        </button>

        {activeScenario ? null : (
          <button type="button" className="btn btn-secondary" onClick={handleLoadExample}>
            {t('networkBuilder.loadExample')}
          </button>
        )}

        {actorRows.length > 1 ? (
          <button type="button" className="btn btn-secondary" onClick={() => void handleArrange()}>
            {t('networkBuilder.arrange')}
          </button>
        ) : null}

        <span className="nb-status">
          {caseId === null
            ? t('networkBuilder.unsavedCase')
            : dirty
              ? t('networkBuilder.unsavedChanges')
              : t('networkBuilder.synced')}
        </span>

        {missingCount > 0 && !activeScenario ? (
          <button
            type="button"
            className="dd-pill dd-pill-amber nb-missing"
            onClick={() => setSelection(missing[0])}
            title={t('networkBuilder.missingGoTo')}
          >
            {t('networkBuilder.missingRequired', { count: missingCount })}
          </button>
        ) : null}

        <button
          type="button"
          className="btn btn-secondary"
          disabled={caseId === null || syncing || !dirty || !signedIn}
          onClick={() => void saveToServer()}
        >
          {syncing ? t('networkBuilder.saving') : t('networkBuilder.save')}
        </button>
      </div>

      {hintDismissed ? null : (
        <div className="nb-hint">
          <ol>
            {HINT_STEPS.map((key) => (
              <li key={key}>{t(`networkBuilder.hint.${key}`)}</li>
            ))}
          </ol>
          <button
            type="button"
            className="nb-hint-dismiss"
            onClick={() => dismissHint(HINT_ID)}
          >
            {t('networkBuilder.hint.dismiss')}
          </button>
        </div>
      )}

      {caseId !== null && !signedIn ? (
        // after signing out the page let the network be edited and saving
        // answered "404: Case '…' not found" (P1-05)
        <p className="nb-warning">{t('networkBuilder.signInToSave')}</p>
      ) : null}
      {armed && unwired.some((r) => r.row_id === armed) ? (
        <p className="nb-armed" role="status">
          {t('networkBuilder.armed', {
            name: flowName(flowRows.find((r) => r.row_id === armed) ?? { row_id: armed, values: {} }),
          })}
        </p>
      ) : null}
      {error ? <p className="error-text nb-error">{error}</p> : null}

      <div className="nb-canvas">
        {actorRows.length === 0 ? (
          <div className="nb-empty">
            <h3>{t('networkBuilder.empty.title')}</h3>
            <p>{t('networkBuilder.empty.body')}</p>
            <div className="nb-empty-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddActor}
              >
                {t('networkBuilder.addActor')}
              </button>
              {/* the example replaces the case's network: not from a scenario's */}
              {activeScenario ? null : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLoadExample}
                >
                  {t('networkBuilder.loadExample')}
                </button>
              )}
            </div>
          </div>
        ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          onNodeClick={(_e, node) =>
            setSelection({ sectionId: ACTORS_SECTION, rowId: node.id })
          }
          onEdgeClick={(_e, edge) =>
            setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId: edge.id })
          }
          onPaneClick={() => setSelection(null)}
          edgeTypes={FLOW_EDGE_TYPES}
          onInit={(instance) => { flowRef.current = instance }}
          fitView
          proOptions={{ hideAttribution: false }}
        >
          <Background />
          <Controls />
        </ReactFlow>
        )}

        <aside className="nb-panel" ref={panelRef}>
          {selectedSection && selectedRow && selection ? (
            <>
              <h3 className="nb-panel-title">{panelTitle}</h3>
              <DcfRowFields
                section={selectedSection}
                row={selectedRow}
                actors={actorRows}
                sites={sourceCase.sites ?? []}
                issues={issuesFor(validation, selectedRow.row_id, activeScenario)}
                onChange={(fieldId, value) =>
                  onFieldChange(selection.sectionId, selectedRow, fieldId, value)
                }
                onRemove={
                  // a questionnaire flow not drawn has nothing to remove: the
                  // button did nothing but mark the network unsaved (Fable, #203)
                  selection.sectionId === FLOW_MATRIX_SECTION &&
                  isQuestionnaireFlow(selectedRow.row_id) &&
                  !selectedRow.values['flow.origin_actor_id'] &&
                  !selectedRow.values['flow.dest_actor_id']
                    ? undefined
                    : () => void onRemove(selection.sectionId, selectedRow)
                }
                {...(selection.sectionId === FLOW_MATRIX_SECTION
                  ? isQuestionnaireFlow(selectedRow.row_id)
                    ? {
                        readOnly: QUESTIONNAIRE_FIELDS,
                        note: t('networkBuilder.fromQuestionnaire'),
                        removeLabel: selectedRow.values['flow.origin_actor_id'] || selectedRow.values['flow.dest_actor_id']
                          ? t('networkBuilder.unwire')
                          : undefined,
                      }
                    : { note: t('networkBuilder.notInQuestionnaire') }
                  : {})}
                actions={
                  selection.sectionId === FLOW_MATRIX_SECTION &&
                  selectedRow.values['flow.origin_actor_id'] &&
                  selectedRow.values['flow.dest_actor_id'] ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => reverseFlow(selectedRow.row_id)}
                    >
                      {t('networkBuilder.reverse')}
                    </button>
                  ) : null
                }
              />
              {selection.sectionId === FLOW_MATRIX_SECTION && !activeScenario ? classificationBlock(selectedRow) : null}
            </>
          ) : (
            <p className="nb-panel-empty">{t('networkBuilder.selectHint')}</p>
          )}
        </aside>
      </div>

      {unwired.length > 0 ? (
        <div className="nb-unwired">
          <h4>{t('networkBuilder.unwiredTitle')}</h4>
          <p className="nb-unwired-hint">{t('networkBuilder.unwiredHint')}</p>
          <ul>
            {unwired.map((row) => (
              <li key={row.row_id}>
                <button
                  type="button"
                  className={`dd-pill${armed === row.row_id ? ' dd-pill-brand' : ''}`}
                  aria-pressed={armed === row.row_id}
                  onClick={() => {
                    // arms the flow for the next arrow, and opens its fields: on a
                    // phone, picking the two actors there is the way to draw it
                    setArmed(isQuestionnaireFlow(row.row_id) ? row.row_id : null)
                    setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId: row.row_id })
                  }}
                >
                  {flowName(row)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {drawnFlows.length > 0 ? (
        // every arrow reachable even when two overlap on the canvas (P1-03)
        <div className="nb-unwired nb-drawn">
          <h4>{t('networkBuilder.drawnTitle')}</h4>
          <ul>
            {drawnFlows.map((row) => (
              <li key={row.row_id}>
                <button
                  type="button"
                  className={`dd-pill${selection?.rowId === row.row_id ? ' dd-pill-brand' : ''}`}
                  onClick={() => setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId: row.row_id })}
                >
                  {flowName(row)}: {actorName(row.values['flow.origin_actor_id'])} → {actorName(row.values['flow.dest_actor_id'])}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {strayFlows.length > 0 ? (
        <div className="nb-unwired nb-stray">
          <h4>{t('networkBuilder.strayTitle')}</h4>
          <p className="nb-unwired-hint">{t('networkBuilder.strayHint')}</p>
          <ul>
            {strayFlows.map((row) => (
              <li key={row.row_id}>
                <button
                  type="button"
                  className="dd-pill"
                  onClick={() => setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId: row.row_id })}
                >
                  {flowName(row)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
