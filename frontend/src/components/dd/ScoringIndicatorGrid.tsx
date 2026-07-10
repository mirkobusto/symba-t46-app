// ScoringIndicatorGrid — 3 tiles for env / eco / soc indicators.
//
// When no numeric value is provided, the tile renders in a dimmed
// "pending" state showing an em-dash. Colors bind to the dimension
// (green / blue / pink) for immediate visual filtering.

interface Indicator {
  dim: 'env' | 'eco' | 'soc'
  label: string
  value?: number | null
  unit?: string | null
}

interface Props {
  indicators: Indicator[]
  compact?: boolean
}

const DIM_CLASS: Record<Indicator['dim'], string> = {
  env: 'dd-ind-env',
  eco: 'dd-ind-eco',
  soc: 'dd-ind-soc',
}

const DIM_LABEL: Record<Indicator['dim'], string> = {
  env: 'ENV',
  eco: 'ECO',
  soc: 'SOC',
}

export default function ScoringIndicatorGrid({ indicators, compact }: Props) {
  return (
    <div className={`dd-ind-grid ${compact ? 'dd-ind-grid-compact' : ''}`}>
      {indicators.map((ind, i) => {
        const isPending = ind.value == null
        return (
          <div
            key={`${ind.dim}-${i}`}
            className={`dd-ind ${DIM_CLASS[ind.dim]} ${isPending ? 'dd-ind-pending' : ''}`}
          >
            <div className="dd-ind-dim">{DIM_LABEL[ind.dim]}</div>
            <div className="dd-ind-value dd-mono">
              {isPending ? '—' : ind.value}
              {!isPending && ind.unit ? (
                <span className="dd-ind-unit"> {ind.unit}</span>
              ) : null}
            </div>
            {ind.label ? <div className="dd-ind-label">{ind.label}</div> : null}
          </div>
        )
      })}
    </div>
  )
}
