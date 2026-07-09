// DataCollectionPage — Phase 3 of the DCF rollout.
//
// Renders the DcfPayload composed by the backend (POST /api/dcf/preview)
// for the current Case in the store. Shows:
//   1. A header with pathway / ILCD / LCC / S-LCA badges
//   2. The Network Diagram (interactive React Flow placeholder)
//   3. Each section with its active fields (or "not active" notice)
//   4. Download buttons: xlsx + docx
//
// In v1 the DCF is export-only (spec §3 P3) — the user fills the xlsx
// offline. Future v2 will add in-app data entry that round-trips to
// the Flow Matrix.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import DcfSectionViewer from '../components/DcfSectionViewer'
import NetworkDiagram from '../components/NetworkDiagram'
import {
  ApiError,
  fetchDcfDocx,
  fetchDcfPreview,
  fetchDcfXlsx,
} from '../services/api'
import { useCaseStore } from '../store/caseStore'
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
  const pushToast = useToastStore((s) => s.push)

  const [payload, setPayload] = useState<DcfPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingXlsx, setDownloadingXlsx] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)

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

  async function handleDownloadXlsx() {
    setDownloadingXlsx(true)
    try {
      const blob = await fetchDcfXlsx(sourceCase)
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
      const blob = await fetchDcfDocx(sourceCase)
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
    <div className="dcf-page">
      <div className="dcf-header">
        <h1>{t('dcf.title')}</h1>
        <p className="dcf-subtitle">{t('dcf.subtitle')}</p>
        <div className="dcf-badges">
          <span className="dcf-badge">
            <strong>Pathway:</strong> {payload.pathway_id ?? '—'}
          </span>
          <span className="dcf-badge">
            <strong>ILCD:</strong> {payload.ilcd_situation ?? '—'}
          </span>
          <span className="dcf-badge">
            <strong>LCC:</strong> {payload.lcc_type ?? '—'}
          </span>
          <span className="dcf-badge">
            <strong>S-LCA:</strong> {payload.slca_activation_state ?? '—'}
          </span>
          {payload.is_01_extended ? (
            <span className="dcf-badge dcf-badge-info">
              IS-01 extended
            </span>
          ) : null}
        </div>
      </div>

      <div className="dcf-network-section">
        <h2>{t('dcf.networkTitle')}</h2>
        <NetworkDiagram
          payload={payload}
          caseFlows={sourceCase.flows ?? []}
        />
      </div>

      <div className="dcf-sections-list">
        {payload.sections.map((section) => (
          <DcfSectionViewer
            key={section.id}
            section={section}
            mandatesByCategory={
              section.id === 'methodological_choices'
                ? payload.mandates_by_category
                : undefined
            }
          />
        ))}
      </div>

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
