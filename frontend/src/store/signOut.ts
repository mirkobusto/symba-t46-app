// What signing out does to the work kept in this browser. The next person to
// sign in on the same browser found the previous account's case in the
// questionnaire (Kimi test 2026-11-04, A1-01): signing out now empties the
// case draft and the drawn network. A token refused by the server
// (services/api.ts) does not come through here: that draft stays, to be saved
// after signing in again.

import { useCaseStore } from './caseStore'
import { useDcfDataStore } from './dcfDataStore'

/** Whether emptying the drafts would lose something not on the server. */
export function hasUnsavedWork(): boolean {
  const kase = useCaseStore.getState()
  if (kase.savedDiverged || useDcfDataStore.getState().dirty) return true
  // answers never saved as a case
  return kase.serverCaseId === null && (kase.lastSavedAt !== null || kase.result !== null)
}

export function clearLocalWork(): void {
  useCaseStore.getState().reset()
  useDcfDataStore.getState().reset()
}
