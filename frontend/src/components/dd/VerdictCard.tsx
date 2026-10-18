// VerdictCard — the result headliner.
//
// Big gradient card: a headline (the ILCD situation in words) and, when
// `codes` is passed, the codes demoted to badges beside it, so the first
// thing read is a sentence rather than an identifier. Used on ResultPage
// and (light variant) on the public reader shell.

import type { ReactNode } from 'react'

interface Props {
  eyebrow?: ReactNode
  headline: ReactNode
  subtitle?: ReactNode
  tags?: ReactNode[]
  variant?: 'admin' | 'reader'
  /** Traceability codes shown beside a prose headline. */
  codes?: string[]
  /** Explanatory sentence under the headline. */
  body?: ReactNode
}

export default function VerdictCard({
  eyebrow, headline, subtitle, tags, variant = 'admin',
  codes, body,
}: Props) {
  const prose = Boolean(codes?.length)
  return (
    <div className={`dd-verdict dd-verdict-${variant}`}>
      {eyebrow ? <div className="dd-verdict-eyebrow">{eyebrow}</div> : null}
      <div className={`dd-verdict-title${prose ? ' dd-verdict-title-prose' : ''}`}>
        <span>{headline}</span>
      </div>
      {codes?.length ? (
        <div className="dd-verdict-codes">
          {codes.map((c) => (
            <code key={c}>{c}</code>
          ))}
        </div>
      ) : null}
      {body ? <p className="dd-verdict-body">{body}</p> : null}
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
