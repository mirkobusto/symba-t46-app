// Renders the pending in-app dialog of store/dialogStore (confirm or text).

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDialogStore } from '../store/dialogStore'

export default function DialogHost() {
  const current = useDialogStore((s) => s.current)
  if (!current) return null
  // keyed by request, so the text field starts from each request's value
  return <Dialog key={current.id} message={current.message} input={current.input} confirmLabel={current.confirmLabel} />
}

function Dialog({ message, input, confirmLabel }: { message: string; input?: string; confirmLabel?: string }) {
  const { t } = useTranslation()
  const close = useDialogStore((s) => s.close)
  const [value, setValue] = useState(input ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const isText = input !== undefined

  useEffect(() => {
    (inputRef.current ?? confirmRef.current)?.focus()
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isText) close(true)
    else if (value.trim()) close(value.trim())
  }

  return (
    <div className="dd-modal-backdrop" onClick={() => close(null)}>
      <form
        className="dd-modal dd-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={message}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Escape') close(null) }}
        onSubmit={submit}
      >
        <p className="dd-modal-lead">{message}</p>
        {isText ? (
          <input
            ref={inputRef}
            className="dd-dialog-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={message}
          />
        ) : null}
        <div className="dd-page-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="dd-btn dd-btn-ghost" onClick={() => close(null)}>
            {t('common.cancel')}
          </button>
          <button ref={confirmRef} type="submit" className="dd-btn dd-btn-primary" disabled={isText && !value.trim()}>
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </form>
    </div>
  )
}
