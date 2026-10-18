import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '../i18n'
import StakeholderView from '../components/StakeholderView'
import type { Case } from '../types/api'

// R6 (2026-10-18): each audience sees its rows of the configuration, without the
// analyst's reasons, and is told when a dimension it cares about is not assessed.
const ECO_ONLY: Case = {
  q1: 'B', q2: 'A', q3: { env: false, eco: true, soc: false }, q4: [], flows: [], sites: [],
  ilcd_situation: 'ILCD Situation A', lcc_type: 'C+N', slca_activation_state: 'deactivated',
  policy_objective: false, activated_nodes: [], lca: {}, lcc: {},
}

describe('StakeholderView rows', () => {
  it('tells the end user that the environment is not assessed instead of an empty block', () => {
    render(<StakeholderView stakeholderType="end-user" caseData={ECO_ONLY} scoring={null} />)
    expect(screen.getByText(/does not assess environmental impacts/)).toBeTruthy()
    expect(screen.queryByText(/Why:/)).toBeNull()
  })

  it('shows the industry its costing row without the reason', () => {
    render(<StakeholderView stakeholderType="industry" caseData={ECO_ONLY} scoring={null} />)
    expect(screen.getByText('Costing')).toBeTruthy()
    expect(screen.queryByText(/\(Q10\)/)).toBeNull()
  })
})
