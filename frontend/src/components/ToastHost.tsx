// Renders all active toasts in a fixed bottom-right stack. Each toast
// is dismissible by click on the X icon. Auto-dismiss is handled by
// the toast store's setTimeout.

import { X } from 'lucide-react'

import { useToastStore } from '../store/toastStore'

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="toast-host" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          role={t.type === 'error' ? 'alert' : 'status'}
        >
          <span className="toast-message">{t.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
