// Shared mapping from stored DCF rows to a drawable graph.
//
// Two surfaces render the same network: the Network Builder (editable)
// and the read-only diagram on the DCF overview. Keeping the mapping
// here means they cannot disagree about what an actor node or a flow
// edge is — and it is plain data, so it is testable without React.

import { getSmoothStepPath, type EdgeProps } from 'reactflow'

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
  flows: DcfRow[] = [],
): GraphNode[] {
  // a network nobody has arranged yet is laid out by flow direction, not on a grid
  const auto = actors.some((row) => layout[row.row_id])
    ? null
    : layeredLayout(actors.map((r) => r.row_id), flowEdges(flows))
  return actors.map((row, index) => ({
    id: row.row_id,
    label: str(row.values['actor.name']) ?? unnamedLabel(index),
    role: str(row.values['actor.role']),
    sector: str(row.values['actor.sector']),
    position: layout[row.row_id] ?? auto?.[row.row_id] ?? fallbackPosition(index),
  }))
}

// top to bottom: an arrow leaves an actor from its bottom handle and enters
// the next from the top, so layers are rows (left to right, the arrows looped
// round the boxes and hid their labels)
const LAYER_GAP = 200
const SIBLING_GAP = 300

/**
 * Positions for the actors, top to bottom by flow direction (round 5
 * deferred item, written here rather than with a layout library): each actor
 * sits one layer below the actors that send it something (longest path),
 * cycles are broken at their back edges (A → B and B → A are legal
 * exchanges), actors are ordered within a layer by the average place of their
 * neighbours (two sweeps), and actors with no flow go in a last layer.
 */
export function layeredLayout(
  actorIds: string[],
  edges: Pick<GraphEdge, 'source' | 'target'>[],
): Record<string, DcfNodePosition> {
  const ids = new Set(actorIds)
  const succ = new Map<string, string[]>(actorIds.map((id) => [id, []]))
  const seenEdge = new Set<string>()
  const linked = new Set<string>()
  for (const e of edges) {
    if (!ids.has(e.source) || !ids.has(e.target) || e.source === e.target) continue
    const key = `${e.source}->${e.target}`
    if (seenEdge.has(key)) continue
    seenEdge.add(key)
    succ.get(e.source)!.push(e.target)
    linked.add(e.source)
    linked.add(e.target)
  }

  // drop back edges found by a depth-first search, in actor order
  const state = new Map<string, 'open' | 'done'>()
  const kept: [string, string][] = []
  const visit = (u: string) => {
    state.set(u, 'open')
    for (const v of succ.get(u)!) {
      if (state.get(v) === 'open') continue // back edge: a cycle
      kept.push([u, v])
      if (!state.has(v)) visit(v)
    }
    state.set(u, 'done')
  }
  for (const id of actorIds) if (!state.has(id)) visit(id)

  // longest path from the sources, on the acyclic edges
  const preds = new Map<string, string[]>(actorIds.map((id) => [id, []]))
  const succs = new Map<string, string[]>(actorIds.map((id) => [id, []]))
  for (const [u, v] of kept) {
    preds.get(v)!.push(u)
    succs.get(u)!.push(v)
  }
  const layer = new Map<string, number>()
  const indegree = new Map(actorIds.map((id) => [id, preds.get(id)!.length]))
  const queue = actorIds.filter((id) => indegree.get(id) === 0)
  for (const id of queue) layer.set(id, 0)
  while (queue.length > 0) {
    const u = queue.shift()!
    for (const v of succs.get(u)!) {
      layer.set(v, Math.max(layer.get(v) ?? 0, layer.get(u)! + 1))
      indegree.set(v, indegree.get(v)! - 1)
      if (indegree.get(v) === 0) queue.push(v)
    }
  }

  const connected = actorIds.filter((id) => linked.has(id))
  const lastColumn = connected.length > 0 ? Math.max(...connected.map((id) => layer.get(id)!)) + 1 : 0
  for (const id of actorIds) if (!linked.has(id)) layer.set(id, lastColumn)

  const columns: string[][] = []
  for (const id of actorIds) (columns[layer.get(id)!] ??= []).push(id)
  const rowOf = new Map<string, number>()
  const place = () => columns.forEach((col) => col?.forEach((id, i) => rowOf.set(id, i)))
  place()
  const barycenter = (id: string, neighbours: string[]) =>
    neighbours.length === 0
      ? rowOf.get(id)!
      : neighbours.reduce((sum, n) => sum + rowOf.get(n)!, 0) / neighbours.length
  const sortColumn = (col: string[] | undefined, by: Map<string, string[]>) => {
    if (!col) return
    col.sort((a, b) => barycenter(a, by.get(a)!) - barycenter(b, by.get(b)!) || rowOf.get(a)! - rowOf.get(b)!)
    col.forEach((id, i) => rowOf.set(id, i))
  }
  for (let sweep = 0; sweep < 2; sweep += 1) {
    for (let c = 1; c < columns.length; c += 1) sortColumn(columns[c], preds)
    for (let c = columns.length - 2; c >= 0; c -= 1) sortColumn(columns[c], succs)
  }

  const out: Record<string, DcfNodePosition> = {}
  columns.forEach((col, c) => col?.forEach((id, i) => {
    out[id] = { x: 40 + i * SIBLING_GAP, y: 40 + c * LAYER_GAP }
  }))
  return out
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

/**
 * How far each arrow's middle segment is moved, so arrows between the same two
 * actors (in either direction) are drawn apart instead of one on top of the
 * other: 0 for the first, then +24, -24, +48… (UX round 5, P1-03).
 */
export function edgeShifts(edges: GraphEdge[], step = 24): Record<string, number> {
  const seen = new Map<string, number>()
  const out: Record<string, number> = {}
  for (const edge of edges) {
    const key = [edge.source, edge.target].sort().join('|')
    const n = seen.get(key) ?? 0
    seen.set(key, n + 1)
    out[edge.id] = n === 0 ? 0 : (n % 2 === 1 ? 1 : -1) * Math.ceil(n / 2) * step
  }
  return out
}

/** The path of a flow arrow with its middle segment moved by `shift` (see FlowEdge). */
export function flowEdgePath(p: Pick<EdgeProps, 'sourceX' | 'sourceY' | 'targetX' | 'targetY' | 'sourcePosition' | 'targetPosition'>, shift: number) {
  const { sourceX, sourceY, targetX, targetY } = p
  // arrows leave from the bottom and enter from the top: the middle segment is
  // horizontal when the target is below, vertical otherwise
  const below = targetY > sourceY
  return getSmoothStepPath({
    ...p,
    borderRadius: 10,
    offset: 20,
    centerY: below ? (sourceY + targetY) / 2 + shift : undefined,
    centerX: below ? undefined : (sourceX + targetX) / 2 + shift,
  })
}

