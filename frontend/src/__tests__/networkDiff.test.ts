import { describe, expect, it } from 'vitest'

import { networkDiff } from '../pages/networkDiff'
import type { DcfRow } from '../types/dcfData'
import fixtures from './fixtures/networkDiffCases.json'

// The same fixtures as backend/tests/test_dcf_network_scenarios.py: the page
// and the files say the same thing about a scenario's network.
describe('networkDiff', () => {
  const base = fixtures.base as { actors: DcfRow[]; flows: DcfRow[] }
  it.each(fixtures.cases.map((c) => [c.name, c] as const))('%s', (_, c) => {
    const v = c.variant as { actors: DcfRow[]; flows: DcfRow[] }
    expect(networkDiff(base.actors, base.flows, v.actors, v.flows)).toEqual(c.expected)
  })
})
