// Shared mapping from stored DCF rows to a drawable graph.
//
// Two surfaces render the same network: the Network Builder (editable)
// and the read-only diagram on the DCF overview. Keeping the mapping
// here means they cannot disagree about what an actor node or a flow
// edge is — and it is plain data, so it is testable without React.

import type { DcfNodePosition, DcfRow } from '../types/dcfData'

export interface GraphNode {
  id: string
  label: string
  role: string | null
  sector: string | null
  position: DcfNodePosition
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string | null
  type: string | null
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

/** Grid fallback for an actor the canvas has never positioned. */
export function fallbackPosition(index: number): DcfNodePosition {
  const perRow = 3
  return { x: 40 + (index % perRow) * 260, y: 40 + Math.floor(index / perRow) * 160 }
}

export function actorNodes(
  actors: DcfRow[],
  layout: Record<string, DcfNodePosition>,
  unnamedLabel: (index: number) => string,
): GraphNode[] {
  return actors.map((row, index) => ({
    id: row.row_id,
    label: str(row.values['actor.name']) ?? unnamedLabel(index),
    role: str(row.values['actor.role']),
    sector: str(row.values['actor.sector']),
    position: layout[row.row_id] ?? fallbackPosition(index),
  }))
}

/**
 * Flow rows that are wired at both ends. A row with one endpoint missing
 * is a flow the analyst declared but has not drawn yet — it belongs in
 * the "not yet drawn" list, not on the canvas.
 */
export function flowEdges(flows: DcfRow[]): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (const row of flows) {
    const source = str(row.values['flow.origin_actor_id'])
    const target = str(row.values['flow.dest_actor_id'])
    if (!source || !target) continue
    edges.push({
      id: row.row_id,
      source,
      target,
      label: str(row.values['flow.name']),
      type: str(row.values['flow.type']),
    })
  }
  return edges
}

export function unwiredFlows(flows: DcfRow[]): DcfRow[] {
  return flows.filter(
    (row) =>
      !str(row.values['flow.origin_actor_id']) ||
      !str(row.values['flow.dest_actor_id']),
  )
}

/** CSS classes encoding role (shape) and sector (colour) — DCF spec §5.6. */
export function nodeClassName(node: GraphNode, extra = ''): string {
  return [
    'nb-node',
    `nb-node-${node.role ?? 'unset'}`,
    node.sector ? `nb-sector-${node.sector}` : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}
