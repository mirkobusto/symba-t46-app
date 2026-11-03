import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import ShareReportModal from '../components/dd/ShareReportModal'
import LoginPage from '../pages/LoginPage'
import PublicReportPage from '../pages/reader/PublicReportPage'

// UX round 2026-11-03: four bugs the persona agents met.
function answerWith(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
    ok: status < 400, status, statusText: 'x',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)))
}

describe('UX round 3 bugs', () => {
  beforeEach(async () => { await i18n.changeLanguage('en') })
  afterEach(() => vi.unstubAllGlobals())

  it('shows a validation error in words, not as the JSON FastAPI returns', async () => {
    answerWith(422, { detail: [{ type: 'value_error', loc: ['body', 'email'], msg: 'value is not a valid email address' }] })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('tab', { name: 'Create account' }))
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'marco@zuccherificio' } })
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'hunter2-strong' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Create account' }).find((b) => b.getAttribute('type') === 'submit')!)
    expect(await screen.findByText(/This email address is not valid/)).toBeInTheDocument()
    expect(screen.queryByText(/value_error/)).not.toBeInTheDocument()
  })

  it('answers an unknown report code in the reader language, with a way back to /r/open', async () => {
    await i18n.changeLanguage('it')
    answerWith(404, { detail: "Case 'valle-del-formaggio' not found" })
    render(
      <MemoryRouter initialEntries={['/r/valle-del-formaggio']}>
        <Routes><Route path="/r/:caseId" element={<PublicReportPage />} /></Routes>
      </MemoryRouter>,
    )
    expect(await screen.findByText(/Nessun report con questo codice/)).toBeInTheDocument()
    expect(screen.queryByText(/not found/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Prova un altro link o codice/ })).toHaveAttribute('href', '/r/open')
  })

  it('offers no share link for a case that is not saved on the server', () => {
    render(<ShareReportModal caseId={null} caseSlug={null} onClose={() => {}} />)
    expect(screen.getByText(/Save the case first/)).toBeInTheDocument()
    expect(screen.queryByText(/\/r\//)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
  })

  it('lists the four links only once the owner has shared the case', async () => {
    answerWith(200, { id: 'id-1', name: 'x', slug: 'agri-b-sita-19a8c0de', ilcd_situation: null,
      created_at: '', updated_at: '', shared_at: null, case: {} })
    const { unmount } = render(<ShareReportModal caseId="id-1" caseSlug={null} onClose={() => {}} />)
    expect(await screen.findByText(/The report is not public/)).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: 'Copy' })).toHaveLength(0)
    unmount()
    answerWith(200, { id: 'id-1', name: 'x', slug: 'agri-b-sita-19a8c0de', ilcd_situation: null,
      created_at: '', updated_at: '', shared_at: '2026-11-03T10:00:00', case: {} })
    render(<ShareReportModal caseId="id-1" caseSlug={null} onClose={() => {}} />)
    expect(await screen.findAllByRole('button', { name: 'Copy' })).toHaveLength(4)
    expect(screen.getByText(/\/r\/agri-b-sita-19a8c0de\/authority$/)).toBeInTheDocument()
  })
})

describe('scroll on the audience tabs of a public report', () => {
  it('reads the case of a report path, and none of the other reader pages', async () => {
    const { sharedCaseOf } = await import('../pages/reader/sharedReportPath')
    expect(sharedCaseOf('/r/agri-b-sita-19a8')).toBe('agri-b-sita-19a8')
    expect(sharedCaseOf('/r/agri-b-sita-19a8/industry')).toBe('agri-b-sita-19a8')
    expect(sharedCaseOf('/r/open')).toBeNull()
    expect(sharedCaseOf('/r/region/IT')).toBeNull()
    expect(sharedCaseOf('/result')).toBeNull()
  })
})

describe('in-app dialogs', () => {
  it('returns the typed name, and null on cancel', async () => {
    const { askText } = await import('../store/dialogStore')
    const DialogHost = (await import('../components/DialogHost')).default
    render(<DialogHost />)
    let pending = askText('Name it', '', 'Save')
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: ' Zuccherificio ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await expect(pending).resolves.toBe('Zuccherificio')
    pending = askText('Name it')
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    await expect(pending).resolves.toBeNull()
  })
})

describe('share switch (UX round 4, P1-01)', () => {
  it('turns sharing off as soon as it is unticked', async () => {
    const calls: unknown[] = []
    vi.stubGlobal('fetch', vi.fn((_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') calls.push(JSON.parse(String(init.body)))
      const shared = init?.method === 'POST' ? JSON.parse(String(init.body)).shared : true
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({
        id: 'id-1', name: 'x', slug: 'agri-b-sita-1a2b3c4d', ilcd_situation: null, created_at: '', updated_at: '',
        shared_at: shared ? '2026-11-03T10:00:00' : null, case: {} }) } as Response)
    }))
    render(<ShareReportModal caseId="id-1" caseSlug={null} onClose={() => {}} />)
    const box = await screen.findByRole('checkbox')
    await screen.findAllByRole('button', { name: 'Copy' })
    fireEvent.click(box)
    expect(await screen.findByText(/The report is not public/)).toBeInTheDocument()
    expect(calls).toEqual([{ shared: false, prepared_by: '', case_contact: '' }])
  })
})
