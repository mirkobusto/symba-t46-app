// Server-side cases list page (Feature D).
// Lists saved cases, supports load (populates draft + navigates to
// questionnaire) and delete.

import { Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useHealth } from '../hooks/useHealth'
import { ApiError, deleteCase, getCase, listCases } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useCaseStore } from '../store/caseStore'
import { useToastStore } from '../store/toastStore'
import type { CaseSummary } from '../types/api'
import { askConfirm } from '../store/dialogStore'
import { caseWasDeleted, confirmDiscard } from '../store/signOut'
import { useAxisLabel } from './aggregateLabels'

export default function CasesListPage() {
  const { t, i18n } = useTranslation()
  const label = useAxisLabel()
  const navigate = useNavigate()
  const setDraft = useCaseStore((s) => s.setDraft)
  const setServerCase = useCaseStore((s) => s.setServerCase)
  const setResult = useCaseStore((s) => s.setResult)
  const pushToast = useToastStore((s) => s.push)
  const signedIn = useAuthStore((s) => s.token !== null)
  const { anonymousSave } = useHealth()

  const [items, setItems] = useState<CaseSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      const list = await listCases()
      setItems(list)
      setError(null)
    } catch (e) {
      const detail = e instanceof Error ? e.message : 'unknown'
      setError(detail)
    }
  }

  // Initial fetch on mount. Setting state from an effect is the
  // standard pattern for "load on mount"; suppress the rule.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void refresh()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // "Open" lands on the saved verdict, "Edit answers" on the questionnaire
  // (round 4 leftover: Load always opened the result)
  async function handleLoad(id: string, target: 'result' | 'questionnaire' = 'result') {
    // loading replaced unsaved answers without a word (UX round 5, P7-09),
    // also when it is the open case itself, changed and not saved: loading it
    // back would drop exactly that work (Fable review of #205). The same rule
    // as signing out and starting a new assessment (UX round 6, P7-03)
    if (!(await confirmDiscard('loadCase'))) return
    try {
      const detail = await getCase(id)
      setDraft(detail.case)
      // Remember which server case this draft mirrors, so the Network
      // Builder syncs its DCF content to the right one.
      setServerCase(detail.id, detail.name, detail.case)
      // A saved case was stored after the pipeline ran, so it already
      // carries its verdict: land on the result rather than making the
      // user re-run the questionnaire to see what they just opened.
      if (detail.case.ilcd_situation) {
        setResult(detail.case)
        navigate(target === 'result' ? '/result' : '/questionnaire')
      } else {
        setResult(null)
        navigate('/questionnaire')
      }
    } catch (e) {
      const msg = e instanceof ApiError ? e.detail : (e as Error).message
      pushToast({
        type: 'error',
        message: t('cases.loadError', { detail: msg }),
        durationMs: 8000,
      })
    }
  }

  async function handleDelete(item: CaseSummary) {
    // say what goes with it: the public link, and that the open case stays
    // here as a case not saved (UX round 6, P7-21, P7-01)
    const open = useCaseStore.getState().serverCaseId === item.id
    const message = [
      t('cases.confirmDelete', { name: item.name }),
      item.shared_at ? t('cases.confirmDeleteShared') : null,
      open ? t('cases.confirmDeleteOpen') : null,
    ].filter(Boolean).join(' ')
    if (!(await askConfirm(message, t('cases.deleteButton')))) return
    try {
      await deleteCase(item.id)
      if (open) caseWasDeleted()
      await refresh()
    } catch (e) {
      const msg = e instanceof ApiError ? e.detail : (e as Error).message
      pushToast({
        type: 'error',
        message: t('cases.deleteError', { detail: msg }),
        durationMs: 8000,
      })
    }
  }

  return (
    <div className="dd-page">
      <h1 className="dd-page-title">{t('cases.title')}</h1>
      <p className="dd-page-sub">{t('cases.intro')}</p>

      <div style={{ margin: '8px 0 16px' }}>
        <Link to="/aggregate" className="btn btn-secondary">
          {t('aggregate.openButton')}
        </Link>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {items === null ? (
        <p className="muted">…</p>
      ) : items.length === 0 ? (
        <div>
          {/* without anonymous saving, a visitor who has not signed in has no
              cases on the server: say why the list is empty */}
          <p className="muted">
            {!signedIn && anonymousSave === false ? t('cases.signInToList') : t('cases.empty')}
          </p>
          <Link to="/questionnaire" className="btn btn-primary">
            {t('result.noResult.cta')}
          </Link>
        </div>
      ) : (
        <table className="flows-table cases-table">
          <thead>
            <tr>
              <th>{t('cases.columns.name')}</th>
              <th>{t('cases.columns.situation')}</th>
              <th>{t('cases.columns.updated')}</th>
              <th aria-label={t('common.actions')}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  {item.slug ? (
                    <div className="dd-mono" style={{ fontSize: 11, color: 'var(--dd-text-muted)' }}>
                      {item.slug}
                    </div>
                  ) : null}
                </td>
                <td>
                  {item.ilcd_situation ? label('ilcd', item.ilcd_situation) : '—'}
                  <div className="muted" style={{ fontSize: 12 }}>
                    {t(item.shared_at ? 'cases.sharedYes' : 'cases.sharedNo')}
                  </div>
                </td>
                <td className="muted">
                  {new Date(item.updated_at).toLocaleString(i18n.language)}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleLoad(item.id)}
                  >
                    <Upload size={14} />
                    {t('cases.loadButton')}
                  </button>{' '}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleLoad(item.id, 'questionnaire')}
                  >
                    {t('cases.editButton')}
                  </button>{' '}
                  {item.slug && item.shared_at ? (
                    <Link
                      to={`/r/${item.slug}`}
                      className="btn btn-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 {t('cases.publicLink')}
                    </Link>
                  ) : null}{' '}
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleDelete(item)}
                    aria-label={t('cases.deleteButton')}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
