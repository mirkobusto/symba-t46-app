import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import type { TraceEntry } from '../types/api'

interface TraceListProps {
  trace: TraceEntry[]
  defaultOpen?: boolean
  title?: string
}

export default function TraceList({
  trace,
  defaultOpen = false,
  title = 'Trace',
}: TraceListProps) {
  const [open, setOpen] = useState(defaultOpen)
  if (!trace || trace.length === 0) return null
  return (
    <section className="trace-list">
      <button
        type="button"
        className="trace-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>
          {title} ({trace.length})
        </span>
      </button>
      {open ? (
        <ul className="trace-items">
          {trace.map((entry, idx) => (
            <li key={`${entry.deliverable}-${entry.node_id}-${idx}`}>
              <code>
                {entry.deliverable} §{entry.section}
              </code>{' '}
              <span className="trace-node">/ {entry.node_id}</span>
              {entry.node_type ? (
                <span className="trace-node-type"> ({entry.node_type})</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
