// Server-side cases list page (Feature D).
// Lists saved cases, supports load (populates draft + navigates to
// questionnaire) and delete.

import { Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { ApiError, deleteCase, getCase, listCases } from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { useToastStore } from '../store/toastStore'
import type { CaseSummary } from '../types/api'

export default function CasesListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setDraft = useCaseStore((s) => s.setDraft)
  const pushToast = useToastStore((s) => s.push)

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

  async function handleLoad(id: string) {
    try {
      const detail = await getCase(id)
      setDraft(detail.case)
      navigate('/questionnaire')
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
    if (!window.confirm(t('cases.confirmDelete', { name: item.name }))) return
    try {
      await deleteCase(item.id)
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
    <div className="result">
      <h1>{t('cases.title')}</h1>
      <p className="muted">{t('cases.intro')}</p>

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
          <p className="muted">{t('cases.empty')}</p>
          <Link to="/questionnaire" className="btn btn-primary">
            {t('result.noResult.cta')}
          </Link>
        </div>
      ) : (
        <table className="flows-table">
          <thead>
            <tr>
              <th>{t('cases.columns.name')}</th>
              <th>{t('cases.columns.pathway')}</th>
              <th>{t('cases.columns.updated')}</th>
              <th aria-label="actions"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.pathway_id ?? '—'}</td>
                <td className="muted">
                  {new Date(item.updated_at).toLocaleString()}
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
