// Read-only network diagram on the DCF overview.
//
// Two modes, decided by whether the Network Builder has been used:
//
//   - **drawn** — actors and wired flows from the stored DCF content,
//     rendered through the same mapping the builder uses, plus the
//     pathway / ILCD badges of DCF spec §5.6.
//   - **placeholder** — the pre-builder fallback: one anonymous pair of
//     actors per declared flow, with a banner pointing at the builder.

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { actorNodes, flowEdges, nodeClassName } from './networkGraph'
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
    ).map((node) => ({
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
    }))
    const edges: Edge[] = flowEdges(flowRows).map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label ?? undefined,
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
        data: { label: `Actor ?\n(origin of ${flow.name})` },
        style: { whiteSpace: 'pre-line' },
      })
      placeholderNodes.push({
        id: destId,
        position: { x: xRight, y: Y_BOTTOM },
        data: { label: `Actor ?\n(dest of ${flow.name})` },
        style: { whiteSpace: 'pre-line' },
      })
      placeholderEdges.push({
        id: `edge-${flow.id}`,
        source: originId,
        target: destId,
        label: `${flow.name} (q5=${flow.q5})`,
        animated: false,
      })
    })

    return { nodes: placeholderNodes, edges: placeholderEdges }
  }, [caseFlows])

  if (!payload.network_render_spec) {
    return (
      <div className="dcf-network-placeholder">
        <p>
          The Network Diagram section is not active for this case
          configuration.
        </p>
      </div>
    )
  }

  return (
    <div className="dcf-network-diagram-wrap">
      {drawn ? (
        <div className="dcf-network-badges">
          <span className="dd-pill dd-pill-brand">{payload.pathway_id ?? '—'}</span>
          <span className="dd-pill dd-pill-brand">
            {payload.ilcd_situation ?? '—'}
          </span>
          <span className="dd-pill dd-pill-muted">
            {t('networkDiagram.counts', {
              actors: drawnGraph.nodes.length,
              flows: drawnGraph.edges.length,
            })}
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
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
