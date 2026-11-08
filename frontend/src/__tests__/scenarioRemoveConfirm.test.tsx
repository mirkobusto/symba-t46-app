import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n'
import ScenariosEditor from '../components/ScenariosEditor'
import { useDcfDataStore } from '../store/dcfDataStore'
import { useDialogStore } from '../store/dialogStore'
import type { AlternativeScenario } from '../types/api'

// UX round 6, P7-21: deleting a scenario asked nothing.
describe('removing a scenario', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useDialogStore.setState({ current: null })
  })
  afterEach(() => {
    useDialogStore.setState({ current: null })
    useDcfDataStore.setState({ data: { ...useDcfDataStore.getState().data, networks_by_scenario: {} } })
  })

  const withChanges: AlternativeScenario[] = [
    { id: 'alt1', label: 'Expansion', overrides: { q2: 'B', q6b: 'TRL7-8' } },
  ]

  it('asks first, says how many changes go, and keeps the scenario on cancel', async () => {
    const onChange = vi.fn()
    render(<ScenariosEditor scenarios={withChanges} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Expansion' }))
    await waitFor(() => expect(useDialogStore.getState().current).not.toBeNull())
    expect(useDialogStore.getState().current!.message).toBe('Remove the scenario “Expansion” and its 2 changes?')
    useDialogStore.getState().close(false)
    await Promise.resolve()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('says that a network drawn for it stays, and removes it on confirm', async () => {
    useDcfDataStore.setState({
      data: { ...useDcfDataStore.getState().data, networks_by_scenario: { alt1: { actors: [], flows: [] } as never } },
    })
    const onChange = vi.fn()
    render(<ScenariosEditor scenarios={withChanges} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Expansion' }))
    await waitFor(() => expect(useDialogStore.getState().current).not.toBeNull())
    expect(useDialogStore.getState().current!.message).toMatch(/network drawn for it .* is kept/)
    useDialogStore.getState().close(true)
    await waitFor(() => expect(onChange).toHaveBeenCalledWith([]))
  })

  it('removes an empty scenario without asking', async () => {
    const onChange = vi.fn()
    render(<ScenariosEditor scenarios={[{ id: 'alt1', label: '', overrides: {} }]} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove alt1' }))
    await waitFor(() => expect(onChange).toHaveBeenCalledWith([]))
    expect(useDialogStore.getState().current).toBeNull()
  })
})
