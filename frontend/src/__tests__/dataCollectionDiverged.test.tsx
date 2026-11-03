import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import DataCollectionPage from '../pages/DataCollectionPage'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'

const PAYLOAD = {
  schema_version: '1.0-draft',
  case_id: 'c-1',
  ilcd_situation: 'ILCD Situation A',
  lcc_type: null,
  slca_activation_state: 'deactivated',
  sections: [],
  obligations: [],
  mandates: [],
  network_render_spec: null,
}

function respond(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status < 400,
    status,
    statusText: 'x',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)
}

// The files of a saved case come from the server copy. After the answers were
// worked out again, downloading them would contradict the page (UX round 5, P7-01).
describe('DataCollectionPage of a saved case worked out again', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useCaseStore.getState().reset()
    useDcfDataStore.getState().reset()
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (String(url).includes('/api/dcf/preview')) return respond(PAYLOAD)
        if (String(url).includes('/api/cases/')) return respond({ id: 'c-1', name: 'Dairy', case: { q1: 'B' } })
        return respond({ detail: 'not found' }, 404)
      }),
    )
  })

  afterEach(() => vi.restoreAllMocks())

  it('disables the downloads and says why while the shown case differs from the saved one', async () => {
    useCaseStore.getState().setDraft({ q1: 'B' } as never)
    useCaseStore.getState().setServerCase('c-1', 'Dairy')
    useCaseStore.setState({ savedDiverged: true })
    render(
      <MemoryRouter>
        <DataCollectionPage />
      </MemoryRouter>,
    )
    // the buttons are at the top and at the bottom of the page (UX round 5, P6-03)
    const xlsx = await screen.findAllByRole('button', { name: 'Download Excel (.xlsx)' })
    expect(xlsx).toHaveLength(2)
    for (const b of xlsx) expect(b).toBeDisabled()
    expect(screen.getAllByText(/These files follow the saved version of the case/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Go to the result to save the changes' })).toHaveAttribute('href', '/result')
  })

  it('keeps the downloads available once the case is saved again', async () => {
    useCaseStore.getState().setDraft({ q1: 'B' } as never)
    useCaseStore.getState().setServerCase('c-1', 'Dairy')
    render(
      <MemoryRouter>
        <DataCollectionPage />
      </MemoryRouter>,
    )
    for (const b of await screen.findAllByRole('button', { name: 'Download Excel (.xlsx)' })) {
      expect(b).toBeEnabled()
    }
    expect(screen.queryByText(/These files follow the saved version/)).not.toBeInTheDocument()
  })
})
