// Suspense boundary for the pages loaded on demand (code splitting, open
// items 2026-11-03): the shell stays on screen while a page's chunk arrives.

import { Suspense, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

function Loading() {
  const { t } = useTranslation()
  return <p className="muted" role="status">{t('common.pageLoading')}</p>
}

export default function PageSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}
