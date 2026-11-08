import { describe, expect, it } from 'vitest'

import {
  actorNodes,
  flowEdges,
  layeredLayout,
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
    // a → c leaves the same actor as f1 and f2: its own lane too (UX round 6)
    expect(new Set([shifts.f1, shifts.f2, shifts.f4]).size).toBe(3)
    const ends = { sourceX: 100, sourceY: 50, targetX: 300, targetY: 250, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const [path1, , y1] = flowEdgePath(ends, shifts.f1)
    const [path2, , y2] = flowEdgePath(ends, shifts.f2)
    expect(path1).not.toBe(path2)
    expect(y1).not.toBe(y2)
  })

  it('keeps two flows apart when one actor is right above the other (UX round 6, P8-13)', async () => {
    const { flowEdgePath } = await import('../components/networkGraph')
    const ends = { sourceX: 100, sourceY: 50, targetX: 100, targetY: 250, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const [, x1] = flowEdgePath(ends, 0)
    const [path2, x2] = flowEdgePath(ends, 24)
    expect(x2 - x1).toBe(24)
    expect(path2).toContain('124')
  })

  it('puts the label of two actors side by side under the source, not between the boxes (P2-12)', async () => {
    const { flowEdgePath } = await import('../components/networkGraph')
    const ends = { sourceX: 100, sourceY: 200, targetX: 500, targetY: 60, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const [, , labelY] = flowEdgePath(ends, 0)
    expect(labelY).toBeGreaterThan(200)
  })

  it('keeps apart the labels of two flows leaving the same actor (UX round 6, DCF page diagram)', async () => {
    const { edgeShifts, flowEdgePath } = await import('../components/networkGraph')
    // the dairy case: the biogas plant sends digestate to the farms and heat to
    // the greenhouse, both actors to its right
    const shifts = edgeShifts([
      { id: 'whey', source: 'dairy', target: 'biogas', label: null, type: null },
      { id: 'digestate', source: 'biogas', target: 'farms', label: null, type: null },
      { id: 'heat', source: 'biogas', target: 'greenhouse', label: null, type: null },
    ])
    expect(shifts.digestate).not.toBe(shifts.heat)
    const farms = { sourceX: 340, sourceY: 100, targetX: 640, targetY: 40, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const greenhouse = { sourceX: 340, sourceY: 100, targetX: 640, targetY: 100, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const [, , y1] = flowEdgePath(farms, shifts.digestate)
    const [, , y2] = flowEdgePath(greenhouse, shifts.heat)
    expect(Math.abs(y1 - y2)).toBeGreaterThanOrEqual(16)
  })

  it('gives +24 and -24 two label depths, not one', async () => {
    const { flowEdgePath } = await import('../components/networkGraph')
    const ends = { sourceX: 100, sourceY: 200, targetX: 500, targetY: 60, sourcePosition: 'bottom', targetPosition: 'top' } as never
    const ys = [0, 24, -24, 48].map((s) => flowEdgePath(ends, s)[2])
    expect(new Set(ys).size).toBe(4)
  })

  it('also separates two flows entering the same actor', async () => {
    const { edgeShifts } = await import('../components/networkGraph')
    const shifts = edgeShifts([
      { id: 'f1', source: 'a', target: 'c', label: null, type: null },
      { id: 'f2', source: 'b', target: 'c', label: null, type: null },
    ])
    expect(shifts.f1).not.toBe(shifts.f2)
  })
})

describe('layeredLayout', () => {
  const col = (pos: { y: number }) => (pos.y - 40) / 200

  it('puts a chain in three layers, top to bottom', () => {
    const p = layeredLayout(['c', 'b', 'a'], [{ source: 'a', target: 'b' }, { source: 'b', target: 'c' }])
    expect([col(p.a), col(p.b), col(p.c)]).toEqual([0, 1, 2])
  })

  it('terminates on a cycle and still lays out every actor', () => {
    const p = layeredLayout(['a', 'b'], [{ source: 'a', target: 'b' }, { source: 'b', target: 'a' }])
    expect([col(p.a), col(p.b)]).toEqual([0, 1])
  })

  it('a hub with two customers: customers in the next layer, side by side', () => {
    const p = layeredLayout(['hub', 'x', 'y'], [{ source: 'hub', target: 'x' }, { source: 'hub', target: 'y' }])
    expect([col(p.x), col(p.y)]).toEqual([1, 1])
    expect(p.x.x).not.toBe(p.y.x)
  })

  it('an actor with no flow goes in a last layer', () => {
    const p = layeredLayout(['a', 'b', 'lone'], [{ source: 'a', target: 'b' }])
    expect(col(p.lone)).toBe(2)
  })

  it('actorNodes uses it when nobody has arranged the network', () => {
    const actors = [{ row_id: 'b', values: {} }, { row_id: 'a', values: {} }]
    const flows = [{ row_id: 'f', values: { 'flow.origin_actor_id': 'a', 'flow.dest_actor_id': 'b' } }]
    const nodes = actorNodes(actors, {}, (i) => `A${i}`, flows)
    expect(nodes.find((n) => n.id === 'a')!.position.y).toBeLessThan(nodes.find((n) => n.id === 'b')!.position.y)
  })
})
