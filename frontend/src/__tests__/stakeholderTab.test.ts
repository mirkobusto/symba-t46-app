import { describe, expect, it } from 'vitest'

import { tabForRole } from '../pages/StakeholderReportPage'

// The welcome wizard asks who you are; until now nothing read the
// answer, and this page always opened on the Industry tab — which
// introduces itself as being for the IS analyst and the methodology
// reviewer. A community representative landed on the reviewer's view.
describe('which audience tab a role lands on', () => {
  it('sends each declared role to its own tab', () => {
    expect(tabForRole('community')).toBe('community')
    expect(tabForRole('authority')).toBe('authority')
    expect(tabForRole('industry')).toBe('industry')
    expect(tabForRole('enduser')).toBe('end-user')
  })

  it('keeps the technical tab for analysts and for an undeclared role', () => {
    expect(tabForRole('analyst')).toBe('industry')
    expect(tabForRole('unknown')).toBe('industry')
    expect(tabForRole(null)).toBe('industry')
  })
})
