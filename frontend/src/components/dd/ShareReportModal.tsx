// ShareReportModal — opens from the Share button on ResultPage.
//
// Shows the 4 audience-specific reader URLs for the current case and
// a Copy button for each. Only a case saved on the server has a public
// report, so without a server id (or slug) the dialog shows no URL, only
// how to save the case first (UX round 2026-11-03: the pipeline id gave
// links that ended on "Report not found").

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useToastStore } from '../../store/toastStore'

const AUDIENCES = ['industry', 'community', 'authority', 'enduser'] as const
type Audience = (typeof AUDIENCES)[number]

interface Props {
  caseId?: string | null
  caseSlug?: string | null
  onClose: () => void
}

export default function ShareReportModal({ caseId, caseSlug, onClose }: Props) {
  const { t } = useTranslation()
  const pushToast = useToastStore((s) => s.push)
  const [copied, setCopied] = useState<Audience | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const key = caseSlug ?? caseId ?? null
  const canShare = !!key

  function urlFor(audience: Audience): string {
    return `${origin}/r/${key ?? 'CASE_ID'}/${audience}`
  }

  async function handleCopy(audience: Audience) {
    if (!canShare) return
    try {
      await navigator.clipboard.writeText(urlFor(audience))
      setCopied(audience)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      pushToast({ type: 'error', message: t('share.copyFailed') })
    }
  }

  return (
    <div className="dd-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dd-modal-head">
          <h2>{t('share.title')}</h2>
          <button type="button" className="dd-modal-close" onClick={onClose} aria-label={t('share.close')}>×</button>
        </div>

        {canShare ? <p className="dd-modal-lead">{t('share.lead')}</p> : null}

        {!canShare ? (
          <div className="dd-pending" style={{ marginBottom: 14 }}>
            <div className="dd-pending-head">⚠ {t('share.saveFirstTitle')}</div>
            <p className="dd-pending-body">{t('share.saveFirstBody')}</p>
          </div>
        ) : (
        <ul className="dd-share-list">
          {AUDIENCES.map((a) => (
            <li key={a} className="dd-share-item">
              <div className="dd-share-audience">
                <div className="dd-share-audience-name">
                  {t(`share.audience.${a}`)}
                </div>
                <div className="dd-share-url dd-mono">{urlFor(a)}</div>
              </div>
              <button
                type="button"
                className="dd-btn dd-btn-secondary"
                onClick={() => handleCopy(a)}
                disabled={!canShare}
              >
                {copied === a ? t('share.copied') : t('share.copy')}
              </button>
            </li>
          ))}
        </ul>
        )}

        <div className="dd-page-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="dd-btn dd-btn-primary" onClick={onClose}>
            {t('share.done')}
          </button>
        </div>
      </div>
    </div>
  )
}
