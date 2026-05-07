interface ProgressIndicatorProps {
  current: number // 0-based index
  total: number
}

export default function ProgressIndicator({
  current,
  total,
}: ProgressIndicatorProps) {
  const safeTotal = Math.max(total, 1)
  const displayed = Math.min(current + 1, safeTotal)
  const percent = Math.round((displayed / safeTotal) * 100)
  return (
    <div className="progress" aria-label={`Question ${displayed} of ${safeTotal}`}>
      <div className="progress-label">
        Question <strong>{displayed}</strong> of {safeTotal}
      </div>
      <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
