import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useHealth } from '../hooks/useHealth'

export default function HealthBanner() {
  const { t } = useTranslation()
  const { status } = useHealth()
  if (status !== 'unreachable') return null
  return (
    <div className="health-banner" role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>
        {t('health.bannerPart1')} <code>http://localhost:8088</code>{' '}
        {t('health.bannerPart2')}
      </span>
    </div>
  )
}
