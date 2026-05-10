// Footer indicator showing when the case draft was last persisted to
// localStorage. Re-renders every 10 s to keep the relative time
// reasonably fresh without spamming setState.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCaseStore } from '../store/caseStore'

function formatAgo(ts: number, t: ReturnType<typeof useTranslation>['t']): string {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 5) return t('savedStatus.justNow')
  if (seconds < 60) return t('savedStatus.secondsAgo', { n: seconds })
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t('savedStatus.minutesAgo', { n: minutes })
  const hours = Math.floor(minutes / 60)
  return t('savedStatus.hoursAgo', { n: hours })
}

export default function SaveStatus() {
  const { t } = useTranslation()
  const lastSavedAt = useCaseStore((s) => s.lastSavedAt)
  const [, setTick] = useState(0)

  // Re-render every 10 s so the relative-time label stays fresh
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 10000)
    return () => window.clearInterval(id)
  }, [])

  if (!lastSavedAt) {
    return <span className="save-status muted">{t('savedStatus.empty')}</span>
  }
  return <span className="save-status muted">{formatAgo(lastSavedAt, t)}</span>
}
