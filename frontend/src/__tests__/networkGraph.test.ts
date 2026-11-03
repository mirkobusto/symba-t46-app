import { describe, expect, it } from 'vitest'

import {
  actorNodes,
  flowEdges,
  nodeClassName,
  unwiredFlows,
} from '../components/networkGraph'
import type { DcfRow } from '../types/dcfData'

const ACTORS: DcfRow[] = [
  { row_id: 'a1', values: { 'actor.name': 'WWTP Alfa', 'actor.role': 'producer' } },
  { row_id: 'a2', values: { 'actor.role': 'consumer', 'actor.sector': 'pulp_paper' } },
]

const FLOWS: DcfRow[] = [
  {
    row_id: 'f1',
    values: {
      'flow.name': 'sludge',
      'flow.type': 'waste',
      'flow.origin_actor_id': 'a1',
      'flow.dest_actor_id': 'a2',
    },
  },
  { row_id: 'f2', values: { 'flow.name': 'biogas' } },
  { row_id: 'f3', values: { 'flow.name': 'heat', 'flow.origin_actor_id': 'a1' } },
]

describe('networkGraph', () => {
  it('labels an unnamed actor with the caller-supplied fallback', () => {
    const nodes = actorNodes(ACTORS, {}, (i) => `Actor ${i + 1}`)
    expect(nodes[0].label).toBe('WWTP Alfa')
    expect(nodes[1].label).toBe('Actor 2')
  })

  it('uses the stored canvas position, falling back to a grid slot', () => {
    const nodes = actorNodes(ACTORS, { a1: { x: 10, y: 20 } }, () => 'x')
    expect(nodes[0].position).toEqual({ x: 10, y: 20 })
    expect(nodes[1].position).not.toEqual({ x: 10, y: 20 })
  })

  it('treats a blank name as unnamed', () => {
    const nodes = actorNodes(
      [{ row_id: 'a1', values: { 'actor.name': '   ' } }],
      {},
      () => 'fallback',
    )
    expect(nodes[0].label).toBe('fallback')
  })

  it('only wires flows that have both endpoints', () => {
    const edges = flowEdges(FLOWS)
    expect(edges).toHaveLength(1)
    expect(edges[0]).toMatchObject({ source: 'a1', target: 'a2', label: 'sludge' })
  })

  it('reports half-wired and unwired flows as not yet drawn', () => {
    expect(unwiredFlows(FLOWS).map((r) => r.row_id)).toEqual(['f2', 'f3'])
  })

  it('encodes role and sector in the node class names', () => {
    const [named, sectored] = actorNodes(ACTORS, {}, () => 'x')
    expect(nodeClassName(named)).toContain('nb-node-producer')
    expect(nodeClassName(sectored)).toContain('nb-sector-pulp_paper')
    expect(nodeClassName({ ...named, role: null })).toContain('nb-node-unset')
  })
})

describe('edgeShifts and flowEdgePath', () => {
  it('draws two flows between the same actors apart, also in the same direction (Fable review of #203)', async () => {
    const { edgeShifts, flowEdgePath } = await import('../components/networkGraph')
    const shifts = edgeShifts([
      { id: 'f1', source: 'a', target: 'b', label: null, type: null },
      { id: 'f2', source: 'a', target: 'b', label: null, type: null },
      { id: 'f3', source: 'b', target: 'a', label: null, type: null },
      { id: 'f4', source: 'a', target: 'c', label: null, type: null },
    ])
    expect(new Set([shifts.f1, shifts.f2, shifts.f3]).size).toBe(3)
    expect(shifts.f4).toBe(0)
    const ends = { sourceX: 100, sourceY: 50, targetX: 300, targetY: 250, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const [path1, , y1] = flowEdgePath(ends, shifts.f1)
    const [path2, , y2] = flowEdgePath(ends, shifts.f2)
    expect(path1).not.toBe(path2)
    expect(y1).not.toBe(y2)
  })
})
