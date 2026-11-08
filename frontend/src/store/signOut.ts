// What the actions that put the current case away do to the work kept in this
// browser: signing out, starting a new assessment, loading a saved case or an
// example. The next person to sign in on the same browser found the previous
// account's case in the questionnaire (Kimi test 2026-11-04, A1-01): signing
// out empties the case draft and the drawn network. A token refused by the
// server (services/api.ts) does not come through here: that draft stays, to be
// saved after signing in again.
//
// Each of these actions asked, or not, by a rule of its own: signing out did
// not ask about answers changed and not worked out again, "Start new
// assessment" never asked (UX round 6, P7-03, P1-09, P7-04). They now share
// hasUnsavedWork() and one wording, which says what stays.

import i18n from 'i18next'

import { ApiError } from '../services/api'
import { useAuthStore } from './authStore'
import { answersFingerprint, flushDraft, isBlankDraft, useCaseStore } from './caseStore'
import { useDcfDataStore, hasUnsavedNetwork } from './dcfDataStore'
import { askConfirm } from './dialogStore'
import { useToastStore } from './toastStore'

/** Whether emptying the drafts would lose something not on the server. */
export function hasUnsavedWork(): boolean {
  // answers typed in the questionnaire and not written to the draft yet
  flushDraft()
  const kase = useCaseStore.getState()
  if (hasUnsavedNetwork(useDcfDataStore.getState())) return true
  if (kase.serverCaseId === null) return !isBlankDraft(kase.draft)
  // a browser state from before the saved answers were remembered
  if (kase.savedAnswers === null) return kase.savedDiverged
  return answersFingerprint(kase.draft) !== kase.savedAnswers
}

export function clearLocalWork(): void {
  useCaseStore.getState().reset()
  useDcfDataStore.getState().reset()
}

/** Ask before putting the current work away, when something would be lost.
 * `action` names what comes next (the confirm button). True: go ahead. */
export async function confirmDiscard(action: 'newAssessment' | 'signOut' | 'loadCase' | 'loadExample'): Promise<boolean> {
  if (!hasUnsavedWork()) return true
  const name = useCaseStore.getState().serverCaseName
  const t = i18n.t.bind(i18n)
  const what = name ? t('discard.savedCase', { name }) : t('discard.notSaved')
  return askConfirm(`${t(`discard.${action}.lead`)} ${what}`, t(`discard.${action}.button`))
}

/** Put the current case away and start from a blank questionnaire, after
 * asking when something would be lost. True when it was done. */
export async function startNewAssessment(): Promise<boolean> {
  if (!(await confirmDiscard('newAssessment'))) return false
  clearLocalWork()
  return true
}

/** Whether a failed request says the open case no longer exists. The server
 * answers 404 "Case '…' not found" also for a case the caller may not see:
 * after a session expired, the case is still there, so only a signed-in
 * user's 404 counts ("No DCF content stored" is not about the case). */
export function isOpenCaseGone(e: unknown): boolean {
  return e instanceof ApiError && e.status === 404 && /^Case\b/.test(e.detail)
    && useAuthStore.getState().token !== null
    && useCaseStore.getState().serverCaseId !== null
}

/** If `e` says the open case was deleted (from My cases, or on another
 * device), keep its answers and network here as a case not saved yet and say
 * so, instead of a raw "Case '<uuid>' not found" (UX round 6, P7-01).
 * True when that was the error. */
export function handleCaseGone(e: unknown): boolean {
  if (!isOpenCaseGone(e)) return false
  caseWasDeleted()
  return true
}

/** The open case was deleted on the server: its answers and network stay
 * here as a case not saved yet, and the user is told so. */
export function caseWasDeleted(): void {
  const kase = useCaseStore.getState()
  if (kase.serverCaseId === null) return
  const name = kase.serverCaseName ?? ''
  useDcfDataStore.getState().detach()
  kase.detachDeletedCase()
  useToastStore.getState().push({
    type: 'info',
    message: i18n.t('cases.deletedOpen', { name, button: i18n.t('cases.saveFirstButton') }),
    durationMs: 12000,
  })
}
