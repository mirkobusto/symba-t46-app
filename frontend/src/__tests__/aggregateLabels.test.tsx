import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import AggregatePage from '../pages/AggregatePage'

// UX round 2026-11-03 (P4-04, P5-09): raw keys and category counts on the dashboard
describe('regional dashboard', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true, status: 200,
      json: () => Promise.resolve({
        total: 3,
        by_lcc_type: [{ key: 'C+E', count: 2 }, { key: 'deactivated', count: 1 }],
        by_q6a_sector: [{ key: 'agriculture_agrifood_biorefineries', count: 3 }],
        by_q7_geographic_scope: [{ key: 'B', count: 2 }, { key: '(none)', count: 1 }],
        by_ilcd_situation: [{ key: 'ILCD Situation A', count: 3 }],
      }),
    } as Response)))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('shows labels, not keys', async () => {
    render(<MemoryRouter><AggregatePage /></MemoryRouter>)
    expect((await screen.findAllByText('Agriculture / agri-food / biorefineries')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('B. Regional').length).toBeGreaterThan(0)
    expect(screen.getByText('no costing')).toBeInTheDocument()
    expect(screen.queryByText('agriculture_agrifood_biorefineries')).toBeNull()
    expect(screen.queryByText(/\(Q6a\)|\(Q7\)/)).toBeNull()
  })
})
