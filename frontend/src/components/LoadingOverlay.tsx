import { useTranslation } from 'react-i18next'

interface Props {
  message?: string
}

export default function LoadingOverlay({ message }: Props) {
  const { t } = useTranslation()
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="spinner" aria-hidden="true" />
        <span>{message ?? t('loading.default')}</span>
      </div>
    </div>
  )
}
