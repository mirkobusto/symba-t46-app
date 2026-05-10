// Shortcuts help dialog. Triggered by `?` (when no input is focused),
// closed by Esc or backdrop click.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Item {
  keys: string
  descriptionKey: string
  contextKey?: string
}

const ITEMS: Item[] = [
  { keys: '?', descriptionKey: 'shortcuts.items.help' },
  { keys: 'Ctrl/⌘ + Enter', descriptionKey: 'shortcuts.items.run', contextKey: 'shortcuts.items.runContext' },
  { keys: 'R', descriptionKey: 'shortcuts.items.toggleReasoning', contextKey: 'shortcuts.items.toggleReasoningContext' },
  { keys: 'P', descriptionKey: 'shortcuts.items.print', contextKey: 'shortcuts.items.printContext' },
  { keys: 'Esc', descriptionKey: 'shortcuts.items.esc' },
]

function isTextInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  )
}

export default function ShortcutsHelp() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '?' && !isTextInputTarget(e.target)) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 id="shortcuts-title" className="modal-title">
          {t('shortcuts.title')}
        </h2>
        <table className="shortcuts-table">
          <tbody>
            {ITEMS.map((item) => (
              <tr key={item.keys}>
                <td>
                  <kbd>{item.keys}</kbd>
                </td>
                <td>
                  {t(item.descriptionKey)}
                  {item.contextKey ? (
                    <span className="muted"> · {t(item.contextKey)}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted modal-hint">
          {t('shortcuts.closeHint', { esc: 'Esc' }).split('Esc')[0]}
          <kbd>Esc</kbd>
          {t('shortcuts.closeHint', { esc: 'Esc' }).split('Esc')[1]}
        </p>
      </div>
    </div>
  )
}
