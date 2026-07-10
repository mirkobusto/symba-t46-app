// VerdictCard — the pathway/result headliner.
//
// Big gradient card with the derived pathway id in display type, an
// optional "extended" flag rendered in italic amber, an ILCD /
// modeling subtitle, and free-form tags underneath. Used on ResultPage
// and (light variant) on the public reader shell.

import type { ReactNode } from 'react'

interface Props {
  eyebrow?: ReactNode
  pathway: ReactNode         // e.g. "IS-01"
  extended?: boolean
  subtitle?: ReactNode
  tags?: ReactNode[]
  variant?: 'admin' | 'reader'
}

export default function VerdictCard({
  eyebrow, pathway, extended = false, subtitle, tags, variant = 'admin',
}: Props) {
  return (
    <div className={`dd-verdict dd-verdict-${variant}`}>
      {eyebrow ? <div className="dd-verdict-eyebrow">{eyebrow}</div> : null}
      <div className="dd-verdict-title">
        <span>{pathway}</span>
        {extended ? <em className="dd-verdict-ext"> extended</em> : null}
      </div>
      {subtitle ? <div className="dd-verdict-subtitle">{subtitle}</div> : null}
      {tags?.length ? (
        <div className="dd-verdict-tags">
          {tags.map((t, i) => (
            <span key={i} className="dd-verdict-tag">{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
