import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import DataCollectionPage from '../pages/DataCollectionPage'
import { useCaseStore } from '../store/caseStore'

// Opening the Data Collection File before any assessment used to show the raw API error
// "400: Invalid Q1: None". It says what to do instead, and does not call the API.
describe('DataCollectionPage without a case', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useCaseStore.getState().reset()
    fetchMock = vi.fn(() => Promise.reject(new Error('the API must not be called without a case')))
    vi.stubGlobal('fetch', fetchMock)
  })

  it('explains that an assessment comes first and links to the questionnaire', () => {
    render(
      <MemoryRouter>
        <DataCollectionPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'No case yet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open questionnaire' })).toHaveAttribute(
      'href',
      '/questionnaire',
    )
    expect(screen.queryByText(/Invalid Q1/)).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
