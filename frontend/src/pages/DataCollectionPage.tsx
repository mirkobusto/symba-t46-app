// DataCollectionPage — Phase 3 of the DCF rollout.
//
// Renders the DcfPayload composed by the backend (POST /api/dcf/preview)
// for the current Case in the store. Shows:
//   1. A header with ILCD / LCC / S-LCA badges
//   2. The Network Diagram (interactive React Flow placeholder)
//   3. Each section with its active fields (or "not active" notice)
//   4. Download buttons: xlsx + docx
//
// Two tabs: the read-only Overview above, and the Network Builder,
// where the actors and the flow matrix are actually drawn and stored
// (/api/dcf/{case_id}/data). The xlsx stays the offline companion.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import DcfSectionViewer from '../components/DcfSectionViewer'
import NetworkBuilder from '../components/NetworkBuilder'
import ObligationList from '../components/ObligationList'
import NetworkDiagram from '../components/NetworkDiagram'
import {
  ApiError,
  fetchDcfDocx,
  fetchDcfDocxForCase,
  fetchDcfPreview,
  getCase,
  fetchDcfXlsx,
  fetchDcfXlsxForCase,
} from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { useToastStore } from '../store/toastStore'
import type { DcfPayload } from '../types/dcf'
import { dcfChanges, hasChanges, type DcfChanges } from './dcfChanges'
import { configurationRows } from './configurationRows'
import { dcfFilename } from './dcfFilename'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function DataCollectionPage() {
  const { t, i18n } = useTranslation()
  const result = useCaseStore((s) => s.result)
  const draft = useCaseStore((s) => s.draft)
  const serverCaseId = useCaseStore((s) => s.serverCaseId)
  const serverCaseName = useCaseStore((s) => s.serverCaseName)
  const savedDiverged = useCaseStore((s) => s.savedDiverged)
  const mode = usePreferenceStore((s) => s.mode)
  const pushToast = useToastStore((s) => s.push)
  const bindDcfData = useDcfDataStore((s) => s.bindTo)
  const dcfDirty = useDcfDataStore((s) => s.dirty)
  const saveDcfData = useDcfDataStore((s) => s.saveToServer)
  const loadDcfData = useDcfDataStore((s) => s.loadFromServer)
  const syncDcfWithPayload = useDcfDataStore((s) => s.syncWithPayload)
  // a load from the server that lands after the sync replaces the rows: sync
  // again then, or names and Q5 stay stale (Fable review of #203)
  const dcfLastSynced = useDcfDataStore((s) => s.lastSyncedAt)

  const [payload, setPayload] = useState<DcfPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingXlsx, setDownloadingXlsx] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)
  const [tab, setTab] = useState<'overview' | 'network'>('overview')
  const [changes, setChanges] = useState<DcfChanges | null>(null)

  const sourceCase = result ?? draft
  // Without an answered Q1 there is no case to build a file from: the API would answer
  // "400: Invalid Q1: None". Say so, with a way forward, instead of calling it.
  const hasCase = !!sourceCase.q1

  useEffect(() => {
    if (!hasCase) return   // nothing to fetch; the empty state is rendered below
    // Stale-while-revalidate: keep the previous payload visible while the
    // new one loads. Avoids synchronous setState inside the effect body
    // (eslint react-hooks/set-state-in-effect).
    let cancelled = false
    fetchDcfPreview(sourceCase)
      .then((p) => {
        if (!cancelled) {
          setPayload(p)
          setError(null)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const msg =
          e instanceof ApiError
            ? `${e.status}: ${e.detail}`
            : e instanceof Error
              ? e.message
              : 'unknown'
        setError(msg)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // sourceCase changes whenever the store mutates — re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sourceCase), i18n.language])

  // Attach the Network Builder draft to the saved case (if any) and pull
  // whatever was stored server-side for it.
  useEffect(() => {
    bindDcfData(serverCaseId)
    if (serverCaseId) void loadDcfData(serverCaseId)
  }, [serverCaseId, bindDcfData, loadDcfData])

  // After the answers were worked out again, say what that changed in the
  // file against the saved version (UX round 5, D3 / P7-06).
  const diverged = serverCaseId !== null && savedDiverged
  useEffect(() => {
    if (!diverged || !serverCaseId || !payload) return
    let cancelled = false
    getCase(serverCaseId)
      .then((saved) => fetchDcfPreview(saved.case))
      .then((before) => {
        if (!cancelled) setChanges(dcfChanges(before, payload))
      })
      .catch(() => {
        if (!cancelled) setChanges(null)
      })
    return () => {
      cancelled = true
    }
  }, [diverged, serverCaseId, payload])

  // Seed the flow rows declared in Q5 (values of fields this configuration
  // no longer asks for are kept, dormant: see dcfDataStore).
  useEffect(() => {
    if (payload) syncDcfWithPayload(payload, sourceCase.flows ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, JSON.stringify(sourceCase.flows), dcfLastSynced])

  /**
   * A saved case exports through the case-scoped endpoint, so the file
   * carries the network drawn in the builder. Unsaved changes are pushed
   * first — downloading a file that does not match what is on screen
   * would be worse than a moment's wait.
   */
  async function exportBlob(kind: 'xlsx' | 'docx'): Promise<Blob> {
    // the cover states the configuration with the result page's own rows
    // (UX round 5, D7)
    const rows = result
      ? configurationRows(result, (key, options) => t(key, options ?? {}) as string)
          .map(({ label, value }) => ({ label, value }))
      : []
    if (serverCaseId) {
      if (dcfDirty) await saveDcfData()
      return kind === 'xlsx'
        ? fetchDcfXlsxForCase(serverCaseId, rows)
        : fetchDcfDocxForCase(serverCaseId, rows)
    }
    return kind === 'xlsx' ? fetchDcfXlsx(sourceCase, rows) : fetchDcfDocx(sourceCase, rows)
  }

  async function handleDownloadXlsx() {
    setDownloadingXlsx(true)
    try {
      const blob = await exportBlob('xlsx')
      triggerDownload(blob, dcfFilename(serverCaseName, 'xlsx'))
    } catch (e) {
      pushToast({
        type: 'error',
        message:
          e instanceof ApiError
            ? `${t('dcf.downloadError')} — ${e.detail}`
            : t('dcf.downloadError'),
        durationMs: 8000,
      })
    } finally {
      setDownloadingXlsx(false)
    }
  }

  async function handleDownloadDocx() {
    setDownloadingDocx(true)
    try {
      const blob = await exportBlob('docx')
      triggerDownload(blob, dcfFilename(serverCaseName, 'docx'))
    } catch (e) {
      pushToast({
        type: 'error',
        message:
          e instanceof ApiError
            ? `${t('dcf.downloadError')} — ${e.detail}`
            : t('dcf.downloadError'),
        durationMs: 8000,
      })
    } finally {
      setDownloadingDocx(false)
    }
  }

  if (!hasCase) {
    return (
      <div className="dd-page dcf-page">
        <h1 className="dd-page-title">{t('dcf.noCase.title')}</h1>
        <p className="muted">{t('dcf.noCase.desc')}</p>
        {/* a company that received the workbook landed here and was sent to the
            questionnaire (UX round 5, P2-11) */}
        <p className="muted">{t('dcf.noCase.received')}</p>
        <Link to="/questionnaire" className="btn btn-primary">
          {t('dcf.noCase.cta')}
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dcf-page">
        <p>{t('dcf.loading')}</p>
      </div>
    )
  }

  if (error || !payload) {
    return (
      <div className="dcf-page">
        <h1>{t('dcf.errorTitle')}</h1>
        <p className="error-text">{error ?? t('dcf.errorNoPayload')}</p>
        <Link to="/result" className="btn btn-secondary">
          {t('dcf.backToResult')}
        </Link>
      </div>
    )
  }

  return (
    <div className="dd-page dcf-page">
      <div className="dcf-header">
        <h1 className="dd-page-title">
          {t('dcf.title')}
          {serverCaseName ? (
            <span className="dd-page-case"> · {serverCaseName}</span>
          ) : null}
        </h1>
        <p className="dd-page-sub">{t('dcf.subtitle')}</p>
        {mode === 'guided' ? <p className="dd-page-sub">{t('dcf.guidedIntro')}</p> : null}
        <div className="dcf-badges" style={{ marginTop: 12 }}>
          {/* the situation in words, as on the result page; "deactivated" was engine output */}
          {payload.costing_only ? null : (
            // a costing-only study has no ILCD situation (UX round 5, P3-04)
            <span className="dd-pill dd-pill-brand">
              {payload.ilcd_situation
                ? t(`narrative.ilcd.${payload.ilcd_situation}.title`, { defaultValue: payload.ilcd_situation })
                : '—'}
            </span>
          )}
          {payload.lcc_type && payload.lcc_type !== 'deactivated' ? (
            <span className="dd-pill dd-pill-brand">
              {t(`result.lccBadge.${payload.lcc_type}`, { defaultValue: `LCC ${payload.lcc_type}` })}
            </span>
          ) : null}
          <span className="dd-pill dd-pill-brand">
            <strong>S-LCA:</strong>{' '}
            {payload.slca_activation_state === 'active' ? t('common.yes') : t('common.no')}
          </span>
        </div>
        {diverged ? (
          <div className="nb-warning dcf-changes" role="status">
            <p>{t('dcf.savedDiverged')}</p>
            {changes && hasChanges(changes) ? (
              <p>
                {t('dcf.changes', { removed: changes.removed, added: changes.added })}
                {changes.fieldsGone.length > 0
                  ? ' ' + t('dcf.changesFieldsGone', { fields: changes.fieldsGone.join(', ') })
                  : ''}
                {changes.fieldsNew.length > 0
                  ? ' ' + t('dcf.changesFieldsNew', { fields: changes.fieldsNew.join(', ') })
                  : ''}
              </p>
            ) : changes ? (
              <p>{t('dcf.changesNone')}</p>
            ) : null}
            <Link to="/result" className="btn btn-primary">{t('dcf.goSaveChanges')}</Link>
          </div>
        ) : null}
        {payload.slca_activation_state === 'active' ? (
          // the S-LCA inventory follows D4.3 with its own instruments; this file
          // does not collect it (decided by Fable, UX round 2026-11-03)
          <p className="dd-soft" style={{ marginTop: 10 }}>{t('dcf.socialDeferred')}</p>
        ) : null}
      </div>

      {/* the download buttons were twenty screens down on a phone (P6-03) */}
      <div className="dcf-files-top">
        <p className="dcf-files-note">{t('dcf.filesNote')}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleDownloadXlsx}
          disabled={downloadingXlsx || diverged}
        >
          {downloadingXlsx ? t('dcf.downloadingXlsx') : t('dcf.downloadXlsx')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownloadDocx}
          disabled={downloadingDocx || diverged}
        >
          {downloadingDocx ? t('dcf.downloadingDocx') : t('dcf.downloadDocx')}
        </button>
      </div>
      {!serverCaseId || dcfDirty ? (
        // the same note as by the bottom buttons: on a phone the top ones are
        // the ones used (Fable review of #204)
        <p className="dd-soft">{t(serverCaseId ? 'dcf.unsavedNetwork' : 'dcf.unsavedCase')}</p>
      ) : null}

      <div className="dd-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'overview'}
          className={`dd-tab${tab === 'overview' ? ' dd-tab-active' : ''}`}
          onClick={() => setTab('overview')}
        >
          {t('dcf.tabOverview')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'network'}
          className={`dd-tab${tab === 'network' ? ' dd-tab-active' : ''}`}
          onClick={() => setTab('network')}
        >
          {t('dcf.tabNetworkBuilder')}
        </button>
      </div>

      {tab === 'network' ? (
        <div className="dcf-network-section">
          <h2>{t('networkBuilder.title')}</h2>
          <p className="dd-page-sub">{t('networkBuilder.subtitle')}</p>
          {serverCaseId === null ? (
            <p className="nb-warning">{t('networkBuilder.saveCaseFirst')}</p>
          ) : null}
          <NetworkBuilder
            payload={payload}
            sourceCase={sourceCase}
            caseId={serverCaseId}
          />
        </div>
      ) : null}

      {tab === 'overview' ? (
      <>
      <div className="dcf-network-section">
        <h2>{t('dcf.networkTitle')}</h2>
        <NetworkDiagram
          payload={payload}
          caseFlows={sourceCase.flows ?? []}
        />
      </div>

      {/* Collapsed by default: this page exists to say which data to
          collect, and the 100+ obligations used to stand between the
          reader and the field tables, with the download buttons a
          thousand lines further down. The count stays visible so the
          list is not hidden, only folded. */}
      <details className="dcf-obligations">
        <summary>
          <h2>{t('dcf.obligationsTitle')}</h2>
          <span className="dd-pill dd-pill-muted">{payload.obligations.length}</span>
        </summary>
        <ObligationList
          obligations={payload.obligations}
          sourceCase={sourceCase}
        />
      </details>

      <div className="dcf-sections-list">
        {payload.sections
          .filter((section) => section.id !== 'methodological_choices')
          .map((section) => (
            <DcfSectionViewer key={section.id} section={section} />
          ))}
      </div>
      </>
      ) : null}

      <div className="dcf-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleDownloadXlsx}
          disabled={downloadingXlsx || diverged}
        >
          {downloadingXlsx ? t('dcf.downloadingXlsx') : t('dcf.downloadXlsx')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownloadDocx}
          disabled={downloadingDocx || diverged}
        >
          {downloadingDocx ? t('dcf.downloadingDocx') : t('dcf.downloadDocx')}
        </button>
        <Link to="/result" className="btn btn-secondary">
          {t('dcf.backToResult')}
        </Link>
      </div>
      {diverged ? (
        // the files of a saved case come from the server copy: downloading them
        // now would contradict this page (UX round 5, P7-01)
        <p className="dd-soft">{t('dcf.savedDiverged')}</p>
      ) : !serverCaseId || dcfDirty ? (
        // the files are built from what the server holds: a network drawn on an
        // unsaved case is not in them yet (UX round 3-4, P1-02)
        <p className="dd-soft">{t(serverCaseId ? 'dcf.unsavedNetwork' : 'dcf.unsavedCase')}</p>
      ) : null}

      <p className="dcf-footer-note">
        {t('dcf.footerNote')}
      </p>
    </div>
  )
}
