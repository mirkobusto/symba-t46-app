import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import BlockedMessage from '../components/BlockedMessage'
import type { BlockInfo } from '../types/api'

const blockInfo: BlockInfo = {
  block_id: 'BLOCK-01',
  message: 'C2 coordination is incompatible with C+E-LCC scope.',
  suggested_resolutions: [
    'Switch to C-LCC scope',
    'Reconsider coordination model to C1',
  ],
  violated_constraints: [
    {
      deliverable: 'D4.2',
      section: '3.1.4',
      node_id: 'HC-03',
      rationale: 'Hard constraint between Q1 and Q3',
    },
  ],
  trace: [],
}

describe('BlockedMessage', () => {
  it('renders the block id and user message', () => {
    render(<BlockedMessage blockInfo={blockInfo} />)
    expect(screen.getByText('BLOCK-01')).toBeInTheDocument()
    expect(
      screen.getByText(
        /C2 coordination is incompatible with C\+E-LCC scope/i,
      ),
    ).toBeInTheDocument()
  })

  it('renders all suggested resolutions', () => {
    render(<BlockedMessage blockInfo={blockInfo} />)
    expect(screen.getByText(/Switch to C-LCC scope/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Reconsider coordination model to C1/i),
    ).toBeInTheDocument()
  })

  it('shows violated-constraints toggle button', () => {
    render(<BlockedMessage blockInfo={blockInfo} />)
    expect(
      screen.getByRole('button', { name: /Violated constraints/i }),
    ).toBeInTheDocument()
  })
})
