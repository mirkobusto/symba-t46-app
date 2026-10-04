import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import i18n from '../i18n'
import PrivacyPage from '../pages/PrivacyPage'

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

describe('PrivacyPage (draft notice)', () => {
  function renderPage() {
    return render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    )
  }

  it('says it is a draft and lists the seven sections, with the data anchor the footer links to', () => {
    renderPage()
    expect(screen.getByRole('note')).toHaveTextContent(/DRAFT for legal review/)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(7)
    // the footer's "Browser storage" link targets the section that lists the browser keys
    expect(document.getElementById('data')).toBeInTheDocument()
  })

  it('describes what the code really stores', () => {
    renderPage()
    const text = document.body.textContent ?? ''
    for (const fact of ['bcrypt', 'symba-auth', 'symba-case-draft', 'IP address', 'no cookies']) {
      expect(text).toContain(fact)
    }
  })

  it('leaves what only the controller knows as placeholders instead of inventing it', () => {
    renderPage()
    expect((document.body.textContent ?? '').match(/\[PLACEHOLDER/g)?.length).toBeGreaterThanOrEqual(6)
  })

  it('has an Italian version without placeholders in English', async () => {
    await i18n.changeLanguage('it')
    renderPage()
    expect(screen.getByRole('note')).toHaveTextContent(/BOZZA per revisione legale/)
    expect(document.body.textContent).toContain('[SEGNAPOSTO')
  })
})
