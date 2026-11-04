// What a scenario's network changes against the case's, in words (scenario
// networks, designed by Fable, owner OK 2026-11-04). The same rules as
// backend/app/engine/dcf_rows.network_diff, checked on shared fixtures
// (__tests__/fixtures/networkDiffCases.json). Matched by row id, never by
// name; nothing is computed.

import type { DcfRow } from '../types/dcfData'

export interface NetworkDiff {
  actors_added: { actor: string }[]
  actors_removed: { actor: string }[]
  actors_renamed: { before: string; after: string }[]
  flows_rerouted: { flow: string; from_before: string; to_before: string; from_after: string; to_after: string }[]
  flows_dropped: { flow: string }[]
  flows_only_in_scenario: { flow: string; from: string; to: string }[]
  value_changes: { flow: string; field: string; before: unknown; after: unknown }[]
}

export const DIFF_VALUE_FIELDS = ['flow.quantity_measured', 'flow.quantity_projected', 'flow.unit', 'flow.type']

function actorLabel(row: DcfRow, fallback?: string): string {
  const name = row.values['actor.name']
  return typeof name === 'string' && name.trim() ? name : fallback || row.row_id
}

function wired(row: DcfRow): [string, string] | null {
  const o = row.values['flow.origin_actor_id']
  const d = row.values['flow.dest_actor_id']
  return typeof o === 'string' && o && typeof d === 'string' && d ? [o, d] : null
}

const empty = (v: unknown) => v === '' || v === null || v === undefined

export function networkDiff(baseActors: DcfRow[], baseFlows: DcfRow[], varActors: DcfRow[], varFlows: DcfRow[]): NetworkDiff {
  const baseA = new Map(baseActors.map((r) => [r.row_id, r]))
  const varA = new Map(varActors.map((r) => [r.row_id, r]))
  const nameIn = (actors: Map<string, DcfRow>, id: string) => {
    const row = actors.get(id)
    return row ? actorLabel(row, id) : id
  }
  const diff: NetworkDiff = {
    actors_added: [], actors_removed: [], actors_renamed: [],
    flows_rerouted: [], flows_dropped: [], flows_only_in_scenario: [], value_changes: [],
  }
  for (const [id, row] of varA) {
    const base = baseA.get(id)
    if (!base) diff.actors_added.push({ actor: actorLabel(row, id) })
    else if (actorLabel(row, id) !== actorLabel(base, id)) {
      diff.actors_renamed.push({ before: actorLabel(base, id), after: actorLabel(row, id) })
    }
  }
  for (const [id, row] of baseA) if (!varA.has(id)) diff.actors_removed.push({ actor: actorLabel(row, id) })

  const baseF = new Map(baseFlows.map((r) => [r.row_id, r]))
  const varF = new Map(varFlows.map((r) => [r.row_id, r]))
  for (const [id, row] of baseF) {
    const before = wired(row)
    if (!before) continue
    const name = (row.values['flow.name'] as string) || id
    const other = varF.get(id)
    const after = other ? wired(other) : null
    if (!other || !after) {
      diff.flows_dropped.push({ flow: name })
      continue
    }
    if (after[0] !== before[0] || after[1] !== before[1]) {
      diff.flows_rerouted.push({
        flow: name,
        from_before: nameIn(baseA, before[0]), to_before: nameIn(baseA, before[1]),
        from_after: nameIn(varA, after[0]), to_after: nameIn(varA, after[1]),
      })
    }
    for (const field of DIFF_VALUE_FIELDS) {
      const was = row.values[field]
      const now = other.values[field]
      if (empty(was) && empty(now)) continue
      if (was !== now) diff.value_changes.push({ flow: name, field, before: was ?? null, after: now ?? null })
    }
  }
  for (const [id, row] of varF) {
    const w = wired(row)
    const base = baseF.get(id)
    if (!w || (base && wired(base))) continue
    diff.flows_only_in_scenario.push({ flow: (row.values['flow.name'] as string) || id, from: nameIn(varA, w[0]), to: nameIn(varA, w[1]) })
  }
  return diff
}

export function isEmptyDiff(d: NetworkDiff): boolean {
  return Object.values(d).every((list) => list.length === 0)
}
