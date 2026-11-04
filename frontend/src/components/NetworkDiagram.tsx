// Read-only network diagram on the DCF overview.
//
// Two modes, decided by whether the Network Builder has been used:
//
//   - **drawn** — actors and wired flows from the stored DCF content,
//     rendered through the same mapping the builder uses, plus the
//     ILCD / LCC badges of DCF spec §5.6.
//   - **placeholder** — the pre-builder fallback: one anonymous pair of
//     actors per declared flow, with a banner pointing at the builder.

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactFlow, {
  Background,
  MarkerType,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'

import FlowControls from './FlowControls'
import { FLOW_EDGE_TYPES } from './flowEdgeTypes'

import { MIN_ZOOM, actorNodes, edgeShifts, flowEdges, nodeClassName } from './networkGraph'
import { useDcfDataStore } from '../store/dcfDataStore'
import type { Flow } from '../types/api'
import type { DcfPayload } from '../types/dcf'
import { ACTORS_SECTION, FLOW_MATRIX_SECTION } from '../types/dcfData'

interface Props {
  payload: DcfPayload
  caseFlows: Flow[]
}

export default function NetworkDiagram({ payload, caseFlows }: Props) {
  const { t } = useTranslation()
  const data = useDcfDataStore((s) => s.data)
  const actorRows = useMemo(
    () => data.rows_by_section[ACTORS_SECTION] ?? [],
    [data],
  )
  const flowRows = useMemo(
    () => data.rows_by_section[FLOW_MATRIX_SECTION] ?? [],
    [data],
  )
  const drawn = actorRows.length > 0

  const drawnGraph = useMemo(() => {
    const nodes: Node[] = actorNodes(
      actorRows,
      data.layout,
      (i) => `${t('networkBuilder.actor')} ${i + 1}`,
      flowRows,
    ).map((node) => ({
      id: node.id,
      position: node.position,
      data: {
        label: (
          <span className="nb-node-label">
            <strong>{node.label}</strong>
            <em>{node.role
              ? t(`networkBuilder.roles.${node.role}`, { defaultValue: node.role })
              : t('networkBuilder.noRole')}</em>
          </span>
        ),
      },
      className: nodeClassName(node),
    }))
    const drawn = flowEdges(flowRows)
    const shifts = edgeShifts(drawn)
    // arrowheads and apart parallel arrows, as in the editor (UX round 5)
    const edges: Edge[] = drawn.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label ?? undefined,
      type: 'flow',
      data: { shift: shifts[edge.id] },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
      style: { strokeWidth: 2 },
      className: `nb-edge nb-edge-${edge.type ?? 'unset'}`,
    }))
    return { nodes, edges }
  }, [actorRows, flowRows, data.layout, t])

  // Build a placeholder graph from the Case's existing flows.
  // Convention: every flow is treated as an exchange between two
  // anonymous actors (Actor A → Actor B for flow #1, etc.). This is
  // intentionally simplistic — the real graph emerges from the
  // Actors / Flow Matrix tabs filled in by the analyst.
  const { nodes, edges } = useMemo(() => {
    if (caseFlows.length === 0) {
      return { nodes: [], edges: [] }
    }

    const placeholderNodes: Node[] = []
    const placeholderEdges: Edge[] = []
    const NODE_W = 180
    const Y_TOP = 60
    const Y_BOTTOM = 240

    caseFlows.forEach((flow, idx) => {
      const xLeft = 60 + idx * (NODE_W + 80)
      const xRight = xLeft + NODE_W + 40
      const originId = `origin-${flow.id}`
      const destId = `dest-${flow.id}`
      placeholderNodes.push({
        id: originId,
        position: { x: xLeft, y: Y_TOP },
        // "Actor ?" read as a bug to a plant manager (UX round 2026-11-02)
        data: { label: t('dcf.diagram.whoGives', { flow: flow.name }) },
        style: { whiteSpace: 'pre-line' },
      })
      placeholderNodes.push({
        id: destId,
        position: { x: xRight, y: Y_BOTTOM },
        data: { label: t('dcf.diagram.whoReceives', { flow: flow.name }) },
        style: { whiteSpace: 'pre-line' },
      })
      placeholderEdges.push({
        id: `edge-${flow.id}`,
        source: originId,
        target: destId,
        label: flow.name,
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
        style: { strokeWidth: 2 },
      })
    })

    return { nodes: placeholderNodes, edges: placeholderEdges }
  }, [caseFlows, t])

  if (!payload.network_render_spec) {
    return (
      <div className="dcf-network-placeholder">
        <p>{t('networkDiagram.inactive')}</p>
      </div>
    )
  }

  return (
    // a preview built from the questionnaire is not a network anyone drew: it
    // stays out of the files' picture (Kimi test 2026-11-04, A1-02)
    <div className="dcf-network-diagram-wrap" data-placeholder={drawn ? undefined : 'true'}>
      {drawn ? (
        <div className="dcf-network-badges">
          {/* the same words as the rest of the page: the saved diagram switched to
              English codes and roles (UX round 5, P4-07, P5-10, P6-08) */}
          {payload.ilcd_situation && !payload.costing_only ? (
            <span className="dd-pill dd-pill-brand">
              {t(`result.situationBadge.${payload.ilcd_situation.replace('ILCD Situation ', '')}`, {
                defaultValue: payload.ilcd_situation,
              })}
            </span>
          ) : null}
          {payload.lcc_type && payload.lcc_type !== 'deactivated' ? (
            <span className="dd-pill dd-pill-brand">
              {t(`result.lccBadge.${payload.lcc_type}`, { defaultValue: `LCC ${payload.lcc_type}` })}
            </span>
          ) : null}
          <span className="dd-pill dd-pill-muted">
            {t('networkDiagram.actors', { count: drawnGraph.nodes.length })}
            {' · '}
            {t('networkDiagram.flows', { count: drawnGraph.edges.length })}
          </span>
        </div>
      ) : (
        <div className="dcf-network-banner">{t('networkDiagram.placeholder')}</div>
      )}
      <div style={{ width: '100%', height: 380 }}>
        <ReactFlow
          nodes={drawn ? drawnGraph.nodes : nodes}
          edges={drawn ? drawnGraph.edges : edges}
          nodesDraggable={false}
          nodesConnectable={false}
          edgeTypes={FLOW_EDGE_TYPES}
          fitView
          minZoom={MIN_ZOOM}
        >
          <Background />
          <FlowControls />
        </ReactFlow>
      </div>
    </div>
  )
}
