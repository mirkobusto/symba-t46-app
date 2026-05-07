import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import PathwayBadge from '../components/PathwayBadge'

describe('PathwayBadge', () => {
  it('renders the pathway id and name', () => {
    render(<PathwayBadge pathwayId="LCSA-P1" pathwayName="Standard IS Project" />)
    expect(screen.getByText('LCSA-P1')).toBeInTheDocument()
    expect(screen.getByText('Standard IS Project')).toBeInTheDocument()
  })

  it('falls back to "Unresolved" when pathwayId is null', () => {
    render(<PathwayBadge pathwayId={null} />)
    expect(screen.getByText(/Unresolved/i)).toBeInTheDocument()
  })
})
