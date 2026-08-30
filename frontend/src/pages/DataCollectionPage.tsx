// DataCollectionPage — Phase 3 of the DCF rollout.
//
// Renders the DcfPayload composed by the backend (POST /api/dcf/preview)
// for the current Case in the store. Shows:
//   1. A header with pathway / ILCD / LCC / S-LCA badges
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
  fetchDcfXlsx,
  fetchDcfXlsxForCase,
} from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { useToastStore } from '../store/toastStore'
import type { DcfPayload } from '../types/dcf'

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
  const { t } = useTranslation()
  const result = useCaseStore((s) => s.result)
  const draft = useCaseStore((s) => s.draft)
  const serverCaseId = useCaseStore((s) => s.serverCaseId)
  const serverCaseName = useCaseStore((s) => s.serverCaseName)
  const pushToast = useToastStore((s) => s.push)
  const bindDcfData = useDcfDataStore((s) => s.bindTo)
  const dcfDirty = useDcfDataStore((s) => s.dirty)
  const saveDcfData = useDcfDataStore((s) => s.saveToServer)
  const loadDcfData = useDcfDataStore((s) => s.loadFromServer)
  const syncDcfWithPayload = useDcfDataStore((s) => s.syncWithPayload)

  const [payload, setPayload] = useState<DcfPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingXlsx, setDownloadingXlsx] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)
  const [tab, setTab] = useState<'overview' | 'network'>('overview')

  const sourceCase = result ?? draft

  useEffect(() => {
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
  }, [JSON.stringify(sourceCase)])

  // Attach the Network Builder draft to the saved case (if any) and pull
  // whatever was stored server-side for it.
  useEffect(() => {
    bindDcfData(serverCaseId)
    if (serverCaseId) void loadDcfData(serverCaseId)
  }, [serverCaseId, bindDcfData, loadDcfData])

  // Seed the flow rows declared in Q5 and drop values for fields this
  // pathway no longer activates (a Q1-Q7 edit can deactivate a field
  // under content that was already drawn).
  useEffect(() => {
    if (payload) syncDcfWithPayload(payload, sourceCase.flows ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, JSON.stringify(sourceCase.flows)])

  /**
   * A saved case exports through the case-scoped endpoint, so the file
   * carries the network drawn in the builder. Unsaved changes are pushed
   * first — downloading a file that does not match what is on screen
   * would be worse than a moment's wait.
   */
  async function exportBlob(kind: 'xlsx' | 'docx'): Promise<Blob> {
    if (serverCaseId) {
      if (dcfDirty) await saveDcfData()
      return kind === 'xlsx'
        ? fetchDcfXlsxForCase(serverCaseId)
        : fetchDcfDocxForCase(serverCaseId)
    }
    return kind === 'xlsx' ? fetchDcfXlsx(sourceCase) : fetchDcfDocx(sourceCase)
  }

  async function handleDownloadXlsx() {
    setDownloadingXlsx(true)
    try {
      const blob = await exportBlob('xlsx')
      const name = payload?.case_id
        ? `dcf_${payload.case_id.slice(0, 8)}.xlsx`
        : 'dcf.xlsx'
      triggerDownload(blob, name)
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
      const name = payload?.case_id
        ? `dcf_${payload.case_id.slice(0, 8)}.docx`
        : 'dcf.docx'
      triggerDownload(blob, name)
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
        <div className="dcf-badges" style={{ marginTop: 12 }}>
          <span className="dd-pill dd-pill-brand">
            <strong>Pathway:</strong> {payload.pathway_id ?? '—'}
          </span>
          <span className="dd-pill dd-pill-brand">
            <strong>ILCD:</strong> {payload.ilcd_situation ?? '—'}
          </span>
          <span className="dd-pill dd-pill-brand">
            <strong>LCC:</strong> {payload.lcc_type ?? '—'}
          </span>
          <span className="dd-pill dd-pill-brand">
            <strong>S-LCA:</strong> {payload.slca_activation_state ?? '—'}
          </span>
          {payload.is_01_extended ? (
            <span className="dd-pill dd-pill-accent">IS-01 extended</span>
          ) : null}
        </div>
      </div>

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

      <div className="dcf-obligations">
        <h2>{t('dcf.obligationsTitle')}</h2>
        <ObligationList
          obligations={payload.obligations}
          sourceCase={sourceCase}
        />
      </div>

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
          disabled={downloadingXlsx}
        >
          {downloadingXlsx ? t('dcf.downloadingXlsx') : t('dcf.downloadXlsx')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownloadDocx}
          disabled={downloadingDocx}
        >
          {downloadingDocx ? t('dcf.downloadingDocx') : t('dcf.downloadDocx')}
        </button>
        <Link to="/result" className="btn btn-secondary">
          {t('dcf.backToResult')}
        </Link>
      </div>

      <p className="dcf-footer-note">
        {t('dcf.footerNote')}
      </p>
    </div>
  )
}
