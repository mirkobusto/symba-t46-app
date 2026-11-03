import { useTranslation } from 'react-i18next'

import { useHealth } from '../hooks/useHealth'

interface Props {
  compact?: boolean
}

export default function HealthCheck({ compact = false }: Props) {
  const { t } = useTranslation()
  const { status } = useHealth()

  // a working backend is not news for a visitor: "Backend: OK · v0.0.1" read
  // as "prototype" to the regional officer (UX round 2026-11-02)
  if (status === 'ok') return null

  const dotClass = status === 'unreachable'
    ? 'status-dot status-dot-error'
    : 'status-dot status-dot-loading'
  const label = status === 'loading' ? t('health.checking') : t('health.unreachable')

  return (
    <span className={`health-check ${compact ? 'health-check-compact' : ''}`}>
      <span className={dotClass} aria-hidden="true" />
      <span>
        {t('health.backendLabel')}: {label}
      </span>
    </span>
  )
}
