// Changing the role chosen in the welcome wizard: the sidebar links to the wizard on its first
// question (a saved role would otherwise open it on the second), and the wizard honours that.

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import Sidebar from '../components/admin/Sidebar'
import i18n from '../i18n'
import WelcomePage from '../pages/WelcomePage'
import { usePreferenceStore } from '../store/preferenceStore'

function renderWelcome(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <WelcomePage />
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  usePreferenceStore.setState({ role: null, task: null, hasOnboarded: false })
})

describe('Sidebar', () => {
  it('has a "Change role" link that opens the wizard on its first question', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Change role' })).toHaveAttribute(
      'href',
      '/welcome?step=1',
    )
  })

  it('has the label in every interface language', async () => {
    for (const [lang, label] of [
      ['it', 'Cambia ruolo'],
      ['fr', 'Changer de rôle'],
      ['de', 'Rolle ändern'],
      ['es', 'Cambiar de rol'],
    ]) {
      await i18n.changeLanguage(lang)
      const { unmount } = render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      )
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
      unmount()
    }
  })
})

describe('WelcomePage with a role already saved', () => {
  beforeEach(() => {
    usePreferenceStore.setState({ role: 'industry', task: 'read', hasOnboarded: true })
  })

  it('opens on the task question by default', () => {
    renderWelcome('/welcome')

    expect(screen.getByRole('heading', { name: /What would you like to do\?/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Who are you\?/ })).not.toBeInTheDocument()
  })

  it('opens on the role question, with the saved role selected, for ?step=1', () => {
    renderWelcome('/welcome?step=1')

    expect(screen.getByRole('heading', { name: /Who are you\?/ })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Industrial operator/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })
})

describe('WelcomePage with no role saved', () => {
  it('opens on the role question', () => {
    renderWelcome('/welcome')

    expect(screen.getByRole('heading', { name: /Who are you\?/ })).toBeInTheDocument()
  })
})
