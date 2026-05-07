import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import QuestionCard from '../components/QuestionCard'
import type { Question } from '../types/api'

const mockQuestion: Question = {
  id: 'q1',
  key: 'q1',
  label: 'What is the IS coordination model?',
  description: 'Pick one.',
  options: [
    { value: 'A', label: 'Single-owner' },
    { value: 'B', label: 'Multi-owner' },
    { value: 'C1', label: 'Park-led' },
    { value: 'C2', label: 'External-led' },
  ],
  trace: [],
}

describe('QuestionCard', () => {
  it('renders the question label and all options', () => {
    render(
      <QuestionCard question={mockQuestion} onSelect={() => undefined} />,
    )
    expect(
      screen.getByRole('heading', {
        name: /What is the IS coordination model/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Single-owner/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Park-led/i })).toBeInTheDocument()
  })

  it('invokes onSelect with the chosen value when an option is clicked', () => {
    const onSelect = vi.fn()
    render(<QuestionCard question={mockQuestion} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Multi-owner/i }))
    expect(onSelect).toHaveBeenCalledWith('B')
  })

  it('marks the selected option as pressed', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedValue="C1"
        onSelect={() => undefined}
      />,
    )
    const selected = screen.getByRole('button', { name: /Park-led/i })
    expect(selected).toHaveAttribute('aria-pressed', 'true')
  })
})
