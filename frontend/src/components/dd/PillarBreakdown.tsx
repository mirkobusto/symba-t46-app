// PillarBreakdown — inline SVG donut + legend showing how many of the
// 186 Phase-1 nodes were activated, broken down by pillar.
//
// Fully self-contained: no chart library, no D3. Legend rows list
// pillar name, chip note, and count. Total shown in the donut hole.

interface Pillar {
  key: string
  label: string
  count: number
  color: string
  note?: string
}

interface Props {
  pillars: Pillar[]
  total: number
  scale?: number     // total-of-scale (e.g. 186) shown as "n / scale"
}

export default function PillarBreakdown({ pillars, total, scale }: Props) {
  const summed = pillars.reduce((a, p) => a + p.count, 0)
  const denom = Math.max(summed, 1)

  // Build donut slice offsets — using stroke-dasharray on a 15.91-radius
  // circle (circumference ≈ 100) makes this straightforward. `reduce`
  // avoids the "no reassignment after render" lint rule (React 19).
  const { slices } = pillars.reduce(
    (acc, p) => {
      const len = (p.count / denom) * 100
      acc.slices.push({ ...p, len, dashOffset: -acc.offset })
      return { slices: acc.slices, offset: acc.offset + len }
    },
    { slices: [] as Array<Pillar & { len: number; dashOffset: number }>, offset: 0 },
  )

  return (
    <div className="dd-pillar">
      <svg className="dd-pillar-pie" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="15.91" fill="transparent"
          stroke="var(--dd-border)" strokeWidth="3.2" />
        {slices.map((s) => (
          <circle
            key={s.key}
            cx="18" cy="18" r="15.91"
            fill="transparent"
            stroke={s.color}
            strokeWidth="3.2"
            strokeDasharray={`${s.len} 100`}
            strokeDashoffset={s.dashOffset}
            transform="rotate(-90 18 18)"
          />
        ))}
        <text x="18" y="17" textAnchor="middle" fontSize="6"
          fill="var(--dd-text)" fontWeight="700">{total}</text>
        {scale ? (
          <text x="18" y="22" textAnchor="middle" fontSize="3"
            fill="var(--dd-text-muted)">/ {scale}</text>
        ) : null}
      </svg>
      <div className="dd-pillar-legend">
        {pillars.map((p) => (
          <div key={p.key} className="dd-pillar-row">
            <span className="dd-pillar-dot" style={{ background: p.color }} />
            <span className="dd-pillar-name">
              {p.label}
              {p.note ? <em className="dd-pillar-note"> · {p.note}</em> : null}
            </span>
            <span className="dd-pillar-count dd-mono">{p.count}</span>
          </div>
        ))}
        <div className="dd-pillar-row dd-pillar-total">
          <span />
          <span className="dd-pillar-name">Total</span>
          <span className="dd-pillar-count dd-mono">{total}</span>
        </div>
      </div>
    </div>
  )
}
