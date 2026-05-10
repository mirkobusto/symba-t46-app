import { useHealth } from '../hooks/useHealth'

interface Props {
  compact?: boolean
}

export default function HealthCheck({ compact = false }: Props) {
  const status = useHealth()

  const dotClass =
    status === 'ok'
      ? 'status-dot status-dot-ok'
      : status === 'unreachable'
        ? 'status-dot status-dot-error'
        : 'status-dot status-dot-loading'

  const label =
    status === 'loading'
      ? 'checking'
      : status === 'ok'
        ? 'OK'
        : 'unreachable'

  return (
    <span className={`health-check ${compact ? 'health-check-compact' : ''}`}>
      <span className={dotClass} aria-hidden="true" />
      <span>Backend: {label}</span>
    </span>
  )
}
