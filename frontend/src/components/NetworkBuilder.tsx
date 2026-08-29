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
// analyst's to-do.

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactFlow, {
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  type NodeDragHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'

import DcfRowFields from './DcfRowFields'
import { actorNodes, flowEdges, nodeClassName, unwiredFlows } from './networkGraph'
import { useDcfDataStore } from '../store/dcfDataStore'
import type { Case } from '../types/api'
import type { DcfPayload, DcfSection } from '../types/dcf'
import {
  ACTORS_SECTION,
  FLOW_MATRIX_SECTION,
  type DcfDataIssue,
  type DcfRow,
} from '../types/dcfData'

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

function sectionOf(payload: DcfPayload, id: string): DcfSection | undefined {
  return payload.sections.find((s) => s.id === id)
}

function issuesFor(
  validation: { errors: DcfDataIssue[]; missing_required: DcfDataIssue[] } | null,
  rowId: string,
): DcfDataIssue[] {
  if (!validation) return []
  return [...validation.errors, ...validation.missing_required].filter(
    (i) => i.row_id === rowId,
  )
}

export default function NetworkBuilder({ payload, sourceCase, caseId }: Props) {
  const { t } = useTranslation()
  const data = useDcfDataStore((s) => s.data)
  const validation = useDcfDataStore((s) => s.validation)
  const dirty = useDcfDataStore((s) => s.dirty)
  const syncing = useDcfDataStore((s) => s.syncing)
  const error = useDcfDataStore((s) => s.error)
  const addActor = useDcfDataStore((s) => s.addActor)
  const connect = useDcfDataStore((s) => s.connect)
  const updateValue = useDcfDataStore((s) => s.updateValue)
  const removeRow = useDcfDataStore((s) => s.removeRow)
  const setPosition = useDcfDataStore((s) => s.setPosition)
  const saveToServer = useDcfDataStore((s) => s.saveToServer)

  const [selection, setSelection] = useState<Selection | null>(null)

  const actorRows = useMemo(
    () => data.rows_by_section[ACTORS_SECTION] ?? [],
    [data],
  )
  const flowRows = useMemo(
    () => data.rows_by_section[FLOW_MATRIX_SECTION] ?? [],
    [data],
  )

  const nodes: Node[] = useMemo(
    () =>
      actorNodes(actorRows, data.layout, (i) => `${t('networkBuilder.actor')} ${i + 1}`).map(
        (node) => ({
          id: node.id,
          position: node.position,
          data: {
            label: (
              <span className="nb-node-label">
                <strong>{node.label}</strong>
                <em>{node.role ?? t('networkBuilder.noRole')}</em>
              </span>
            ),
          },
          className: nodeClassName(node),
          selected: selection?.rowId === node.id,
        }),
      ),
    [actorRows, data.layout, selection, t],
  )

  const edges: Edge[] = useMemo(
    () =>
      flowEdges(flowRows).map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label ?? undefined,
        className: `nb-edge nb-edge-${edge.type ?? 'unset'}`,
        selected: selection?.rowId === edge.id,
      })),
    [flowRows, selection],
  )

  const unwired = unwiredFlows(flowRows)

  const onNodeDragStop: NodeDragHandler = (_e, node) => {
    setPosition(node.id, { x: node.position.x, y: node.position.y })
  }

  function onConnect(conn: Connection) {
    if (!conn.source || !conn.target) return
    const rowId = connect(conn.source, conn.target)
    if (rowId) setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId })
  }

  const selectedSection = selection ? sectionOf(payload, selection.sectionId) : undefined
  const selectedRow: DcfRow | undefined = selection
    ? (data.rows_by_section[selection.sectionId] ?? []).find(
        (r) => r.row_id === selection.rowId,
      )
    : undefined

  const missingCount = validation?.missing_required.length ?? 0

  return (
    <div className="nb-wrap">
      <div className="nb-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            const rowId = addActor()
            setSelection({ sectionId: ACTORS_SECTION, rowId })
          }}
        >
          {t('networkBuilder.addActor')}
        </button>

        <span className="nb-status">
          {caseId === null
            ? t('networkBuilder.unsavedCase')
            : dirty
              ? t('networkBuilder.unsavedChanges')
              : t('networkBuilder.synced')}
        </span>

        {missingCount > 0 ? (
          <span className="dd-pill dd-pill-amber">
            {t('networkBuilder.missingRequired', { count: missingCount })}
          </span>
        ) : null}

        <button
          type="button"
          className="btn btn-secondary"
          disabled={caseId === null || syncing || !dirty}
          onClick={() => void saveToServer()}
        >
          {syncing ? t('networkBuilder.saving') : t('networkBuilder.save')}
        </button>
      </div>

      {error ? <p className="error-text nb-error">{error}</p> : null}

      <div className="nb-canvas">
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
          fitView
          proOptions={{ hideAttribution: false }}
        >
          <Background />
          <Controls />
        </ReactFlow>

        <aside className="nb-panel">
          {selectedSection && selectedRow ? (
            <>
              <h3 className="nb-panel-title">{selectedSection.title_en}</h3>
              <DcfRowFields
                section={selectedSection}
                row={selectedRow}
                actors={actorRows}
                sites={sourceCase.sites ?? []}
                issues={issuesFor(validation, selectedRow.row_id)}
                onChange={(fieldId, value) =>
                  updateValue(selection!.sectionId, selectedRow.row_id, fieldId, value)
                }
                onRemove={() => {
                  removeRow(selection!.sectionId, selectedRow.row_id)
                  setSelection(null)
                }}
              />
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
                  className="dd-pill"
                  onClick={() =>
                    setSelection({ sectionId: FLOW_MATRIX_SECTION, rowId: row.row_id })
                  }
                >
                  {typeof row.values['flow.name'] === 'string'
                    ? String(row.values['flow.name'])
                    : row.row_id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
