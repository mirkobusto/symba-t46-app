import { beforeEach, describe, expect, it } from 'vitest'

import { usePreferenceStore } from '../store/preferenceStore'

describe('preferenceStore hints', () => {
  beforeEach(() => {
    usePreferenceStore.getState().restoreHints()
  })

  it('starts with no hint dismissed', () => {
    expect(usePreferenceStore.getState().dismissedHints['network-builder']).toBeUndefined()
  })

  it('remembers a dismissed hint without touching the others', () => {
    usePreferenceStore.getState().dismissHint('network-builder')
    const { dismissedHints } = usePreferenceStore.getState()
    expect(dismissedHints['network-builder']).toBe(true)
    expect(dismissedHints['some-other']).toBeUndefined()
  })

  it('restoreHints brings them all back', () => {
    usePreferenceStore.getState().dismissHint('network-builder')
    usePreferenceStore.getState().restoreHints()
    expect(usePreferenceStore.getState().dismissedHints).toEqual({})
  })
})
