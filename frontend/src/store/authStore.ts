// authStore — JWT-based authentication state (Phase D).
//
// Persisted in localStorage via Zustand's `persist` middleware. The
// access token is attached to every fetch() call to /api/* by the
// helper in services/api.ts (it reads useAuthStore.getState().token).

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { UserPublic } from '../types/auth'

interface AuthState {
  token: string | null
  user: UserPublic | null
  setSession: (token: string, user: UserPublic) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: 'symba-auth',
    },
  ),
)

/** Helper for the fetch interceptor. Lives outside React. */
export function currentAuthToken(): string | null {
  return useAuthStore.getState().token
}
