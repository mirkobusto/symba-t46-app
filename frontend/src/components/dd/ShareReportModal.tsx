// ShareReportModal — opens from the Share button on ResultPage.
//
// Only a case saved on the server has a public report, and only once its
// owner shares it (UX round 2026-11-03, decided by Fable): before, every saved
// case was readable by anyone who guessed its slug. The dialog therefore
//   - without a server id: says how to save the case first;
//   - with one: lets the owner turn sharing on or off, and write who prepared
//     the case and whom to ask (both shown on the public report);
//   - once shared: lists the four audience URLs with a Copy button each.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApiError, getCase, shareCase } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { handleCaseGone } from '../../store/signOut'
import { useToastStore } from '../../store/toastStore'

const AUDIENCES = ['industry', 'community', 'authority', 'enduser'] as const
type Audience = (typeof AUDIENCES)[number]

interface Props {
  /** The case id on the server; null when the case is not saved. */
  caseId?: string | null
  caseSlug?: string | null
  onClose: () => void
}

export default function ShareReportModal({ caseId, caseSlug, onClose }: Props) {
  const { t } = useTranslation()
  const pushToast = useToastStore((s) => s.push)
  const navigate = useNavigate()
  const signedIn = useAuthStore((s) => s.token !== null)
  const [copied, setCopied] = useState<Audience | null>(null)
  const [loaded, setLoaded] = useState(!caseId)
  const [shared, setShared] = useState(false)
  const [wantShared, setWantShared] = useState(false)
  const [preparedBy, setPreparedBy] = useState('')
  const [contact, setContact] = useState('')
  const [slug, setSlug] = useState<string | null>(caseSlug ?? null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!caseId) return
    let cancelled = false
    getCase(caseId)
      .then((d) => {
        if (cancelled) return
        setShared(!!d.shared_at)
        setWantShared(!!d.shared_at)
        setPreparedBy(d.prepared_by ?? '')
        setContact(d.case_contact ?? '')
        setSlug(d.slug ?? caseSlug ?? null)
      })
      .catch((e: unknown) => {
        // deleted meanwhile: the dialog turns into "save the case first" (P7-01)
        handleCaseGone(e)
        /* otherwise the toggle still works; the save reports any error */
      })
      .finally(() => { if (!cancelled) setLoaded(true) })
    return () => { cancelled = true }
  }, [caseId, caseSlug])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const key = slug ?? caseId ?? null

  function urlFor(audience: Audience): string {
    return `${origin}/r/${key}/${audience}`
  }

  async function handleCopy(audience: Audience) {
    try {
      await navigator.clipboard.writeText(urlFor(audience))
      setCopied(audience)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      pushToast({ type: 'error', message: t('share.copyFailed') })
    }
  }

  // the switch applies as soon as it is touched: unticking it and closing with
  // "Done" left the report public while the dialog said otherwise (UX round 4,
  // 2026-11-03, P1-01); the button below saves only the name and the contact
  async function handleSave(next: boolean = wantShared) {
    if (!caseId) return
    setSaving(true)
    try {
      const d = await shareCase(caseId, { shared: next, prepared_by: preparedBy, case_contact: contact })
      setShared(!!d.shared_at)
      setWantShared(!!d.shared_at)
      setSlug(d.slug ?? slug)
    } catch (e) {
      setWantShared(shared)   // the server did not change: show its state again
      if (handleCaseGone(e)) return
      pushToast({ type: 'error', message: e instanceof ApiError ? e.detail : (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dd-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dd-modal-head">
          <h2>{t('share.title')}</h2>
          <button type="button" className="dd-modal-close" onClick={onClose} aria-label={t('share.close')}>×</button>
        </div>

        {!caseId ? (
          <div className="dd-pending" style={{ marginBottom: 14 }}>
            <div className="dd-pending-head">⚠ {t('share.saveFirstTitle')}</div>
            {/* the message named "Save as new…", a button that is not there
                before the first save, and asked a signed-in user to sign in
                (UX round 6, P7-10): the button is named from its own label */}
            <p className="dd-pending-body">
              {t(signedIn ? 'share.saveFirstBodySignedIn' : 'share.saveFirstBody',
                { button: t('cases.saveFirstButton') })}
            </p>
            {!signedIn ? (
              // three steps to remember became one button (UX round 4, P4-07)
              <button
                type="button"
                className="dd-btn dd-btn-primary"
                onClick={() => { onClose(); navigate('/login', { state: { from: '/result' } }) }}
              >
                {t('share.signInButton')}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="dd-share-settings">
            <label className="dd-share-toggle">
              <input
                type="checkbox"
                checked={wantShared}
                disabled={!loaded || saving}
                onChange={(e) => {
                  setWantShared(e.target.checked)
                  void handleSave(e.target.checked)
                }}
              />
              {t('share.publicToggle')}
            </label>
            <label className="dd-share-field">
              <span>{t('share.preparedByLabel')}</span>
              <input value={preparedBy} maxLength={120} onChange={(e) => setPreparedBy(e.target.value)} />
            </label>
            <label className="dd-share-field">
              <span>{t('share.contactLabel')}</span>
              <input value={contact} maxLength={200} onChange={(e) => setContact(e.target.value)} />
              {/* the Data Collection File uses it too: a Region's officer got
                  the companies' cost data (UX round 6, P3-16) */}
              <small className="dd-soft">{t('share.contactHint')}</small>
            </label>
            <button
              type="button"
              className="dd-btn dd-btn-secondary"
              onClick={() => void handleSave()}
              disabled={!loaded || saving}
            >
              {t('share.saveSharing')}
            </button>
          </div>
        )}

        {caseId && shared && key ? (
          <>
            <p className="dd-modal-lead">{t('share.sharedBody')} {t('share.lead')}</p>
            {/* nobody said when a case counts on a country page (UX round 6, P3-08) */}
            <p className="dd-soft">{t('share.countryPage')}</p>
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
                  >
                    {copied === a ? t('share.copied') : t('share.copy')}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : caseId && loaded ? (
          <p className="dd-soft">{t('share.notSharedBody')}</p>
        ) : null}

        <div className="dd-page-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="dd-btn dd-btn-primary" onClick={onClose}>
            {t('share.done')}
          </button>
        </div>
      </div>
    </div>
  )
}
