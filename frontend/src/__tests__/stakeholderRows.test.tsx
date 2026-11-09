import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '../i18n'
import StakeholderView from '../components/StakeholderView'
import { usePreferenceStore } from '../store/preferenceStore'
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
    // in its own row, in words, and not twice (UX round 6, P5-02)
    expect(screen.getByText('Environmental effects')).toBeTruthy()
    expect(screen.getByText('No: environmental effects are not assessed in this study.')).toBeTruthy()
    expect(screen.queryByText(/does not assess environmental impacts/)).toBeNull()
    expect(screen.queryByText('Functional unit')).toBeNull()
    expect(screen.getByText('What is measured')).toBeTruthy()
    expect(screen.getByText('Independent check')).toBeTruthy()
    expect(screen.queryByText(/S-LCA/)).toBeNull()
    expect(screen.queryByText(/Why:/)).toBeNull()
  })

  it('gives the in-app Authority tab the five signals of the public view, without Q codes', () => {
    // UX round 6, P3-07: three bare signals with "(Q4=D)", the public page five explained ones
    usePreferenceStore.setState({ mode: 'guided' })
    render(<StakeholderView stakeholderType="authority" caseData={{ ...ECO_ONLY, q4: ['D'] }} scoring={null} />)
    expect(screen.getByText('Independent review of the study')).toBeTruthy()
    expect(screen.getByText('panel of three or more experts')).toBeTruthy()
    expect(screen.getByText('Set up for a public decision (societal LCC)')).toBeTruthy()
    expect(screen.getByText(/Do No Significant Harm/)).toBeTruthy()
    expect(screen.queryByText(/Q4\s*=/)).toBeNull()
    usePreferenceStore.setState({ mode: 'expert' })
  })

  it('does not promise the community social indicators when the study has none', () => {
    render(<StakeholderView stakeholderType="community" caseData={ECO_ONLY} scoring={null} />)
    expect(screen.getByText(/social effects are not assessed/)).toBeTruthy()
    expect(screen.getByText(/ask whoever carries out the study to add them/)).toBeTruthy()
    // no "Results" box before any result is loaded (removed 2026-11-09)
    expect(screen.queryByText('No results yet')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Results' })).toBeNull()
    expect(screen.queryByText(/contact on this page/)).toBeNull()
  })

  it('shows the industry its costing row without the reason', () => {
    render(<StakeholderView stakeholderType="industry" caseData={ECO_ONLY} scoring={null} />)
    expect(screen.getByText('Costing')).toBeTruthy()
    expect(screen.queryByText(/\(Q10\)/)).toBeNull()
  })
})
