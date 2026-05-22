// Network diagram rendering for the DCF payload.
//
// v1: view-only (per DCF spec §3 P4). The render_spec from the backend
// describes WHAT to render once the Actors + Flow Matrix tabs of the
// xlsx are filled in. In v1 the matrices are not yet populated by the
// app (the analyst fills them offline in Excel), so this component
// shows a small placeholder graph derived from the Case's existing
// flows + a banner explaining what will appear once data is collected.
//
// Future v2 (editing-as-input candidate, spec §3 P4): drag-and-drop
// actor / edge editing that round-trips to the Flow Matrix.

import { useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'

import type { Flow } from '../types/api'
import type { DcfPayload } from '../types/dcf'

interface Props {
  payload: DcfPayload
  caseFlows: Flow[]
}

export default function NetworkDiagram({ payload, caseFlows }: Props) {
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
      <div className="dcf-network-banner">
        <strong>Preview only.</strong> The diagram shown below uses the
        flows declared in the questionnaire as a placeholder. The full
        actor → flow → actor network will appear once the Actors and
        Flow Matrix tabs of the companion Excel are filled in and
        re-imported (planned for a future release).
      </div>
      <div style={{ width: '100%', height: 380 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
