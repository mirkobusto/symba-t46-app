// A token kept in the browser may no longer be accepted (expired, or a new
// signing secret after a server restart). Saved-case lists answer such a
// request as for a visitor, an empty list, so the page went on showing the
// account as signed in with no cases (Kimi test 2026-11-04, A8-08). One
// check at start-up: a 401 from /api/auth/me forgets the token (see
// services/api.ts) and says so.

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ApiError, authMe } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

export default function SessionCheck() {
  const { t } = useTranslation()
  useEffect(() => {
    if (!useAuthStore.getState().token) return
    authMe().catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 401) {
        useToastStore.getState().push({ type: 'info', message: t('auth.sessionExpired'), durationMs: 10000 })
      }
    })
    // once per page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
