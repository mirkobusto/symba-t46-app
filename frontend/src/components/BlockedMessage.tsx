import { useState } from 'react'
import { ChevronDown, ChevronRight, Ban } from 'lucide-react'

import type { BlockInfo } from '../types/api'

interface BlockedMessageProps {
  blockInfo: BlockInfo
}

export default function BlockedMessage({ blockInfo }: BlockedMessageProps) {
  const [showConstraints, setShowConstraints] = useState(false)
  return (
    <section className="blocked-message" role="alert">
      <div className="blocked-header">
        <Ban size={28} aria-hidden="true" />
        <div>
          <h2>Combination blocked</h2>
          <code className="blocked-id">{blockInfo.block_id}</code>
        </div>
      </div>

      <p className="blocked-text">{blockInfo.message}</p>

      {blockInfo.suggested_resolutions.length > 0 ? (
        <div className="blocked-resolutions">
          <h3>Suggested resolutions</h3>
          <ol>
            {blockInfo.suggested_resolutions.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {blockInfo.violated_constraints.length > 0 ? (
        <div className="blocked-constraints">
          <button
            type="button"
            className="trace-toggle"
            onClick={() => setShowConstraints((s) => !s)}
            aria-expanded={showConstraints}
          >
            {showConstraints ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span>
              Violated constraints ({blockInfo.violated_constraints.length})
            </span>
          </button>
          {showConstraints ? (
            <ul className="constraints-list">
              {blockInfo.violated_constraints.map((c, idx) => (
                <li key={`${c.node_id}-${idx}`}>
                  <code>
                    {c.deliverable} §{c.section} / {c.node_id}
                  </code>
                  {c.rationale ? (
                    <p className="constraint-rationale">{c.rationale}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
