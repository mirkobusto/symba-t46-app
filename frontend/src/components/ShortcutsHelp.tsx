// Shortcuts help dialog. Triggered by `?` key (when no input is
// focused), closed by Esc or backdrop click. Lists the global
// keyboard shortcuts available in the app.

import { useEffect, useState } from 'react'

interface Shortcut {
  keys: string
  description: string
  context?: string
}

const SHORTCUTS: Shortcut[] = [
  { keys: '?', description: 'Show this shortcuts help' },
  { keys: 'Ctrl/⌘ + Enter', description: 'Run pipeline', context: 'Questionnaire' },
  { keys: 'Esc', description: 'Close this dialog' },
]

function isTextInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable
}

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Open with `?` (Shift+/), but only when not typing into an input
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
          Keyboard shortcuts
        </h2>
        <table className="shortcuts-table">
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.keys}>
                <td>
                  <kbd>{s.keys}</kbd>
                </td>
                <td>
                  {s.description}
                  {s.context ? (
                    <span className="muted"> · {s.context}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted modal-hint">
          Press <kbd>Esc</kbd> or click outside to close.
        </p>
      </div>
    </div>
  )
}
