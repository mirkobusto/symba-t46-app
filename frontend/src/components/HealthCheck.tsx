import { useTranslation } from 'react-i18next'

import { useHealth } from '../hooks/useHealth'

interface Props {
  compact?: boolean
}

export default function HealthCheck({ compact = false }: Props) {
  const { t } = useTranslation()
  const { status, version } = useHealth()

  const dotClass =
    status === 'ok'
      ? 'status-dot status-dot-ok'
      : status === 'unreachable'
        ? 'status-dot status-dot-error'
        : 'status-dot status-dot-loading'

  const label =
    status === 'loading'
      ? t('health.checking')
      : status === 'ok'
        ? t('health.ok')
        : t('health.unreachable')

  return (
    <span className={`health-check ${compact ? 'health-check-compact' : ''}`}>
      <span className={dotClass} aria-hidden="true" />
      <span>
        {t('health.backendLabel')}: {label}
        {status === 'ok' && version ? <span className="muted"> · v{version}</span> : null}
      </span>
    </span>
  )
}
