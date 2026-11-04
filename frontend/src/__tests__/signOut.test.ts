import { beforeEach, describe, expect, it } from 'vitest'

import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { clearLocalWork, hasUnsavedWork } from '../store/signOut'

// Kimi test 2026-11-04, A1-01: the next account on the browser found the case
describe('signing out', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
    useDcfDataStore.getState().reset()
  })

  it('empties the case draft and the network', () => {
    useCaseStore.getState().patchDraft({ q1: 'B' })
    useCaseStore.getState().setServerCase('case-1', 'Dairy')
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('Dairy')
    clearLocalWork()
    expect(useCaseStore.getState().draft.q1).toBeUndefined()
    expect(useCaseStore.getState().serverCaseId).toBeNull()
    expect(useDcfDataStore.getState().data.rows_by_section.actors ?? []).toHaveLength(0)
  })

  it('a saved case with nothing changed is not unsaved work', () => {
    useCaseStore.getState().patchDraft({ q1: 'B' })
    useCaseStore.getState().setServerCase('case-1', 'Dairy')
    expect(hasUnsavedWork()).toBe(false)
  })

  it('answers never saved, or a network not saved, are', () => {
    useCaseStore.getState().patchDraft({ q1: 'B' })
    expect(hasUnsavedWork()).toBe(true)
    useCaseStore.getState().setServerCase('case-1', 'Dairy')
    useDcfDataStore.getState().bindTo('case-1')
    useDcfDataStore.getState().addActor('Dairy')
    expect(hasUnsavedWork()).toBe(true)
  })

  it('an empty browser is not', () => {
    expect(hasUnsavedWork()).toBe(false)
  })
})
