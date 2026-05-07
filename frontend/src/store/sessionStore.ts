// SPEC §3.7 — zustand store. Persist su localStorage solo sessionId +
// currentQuestionIndex. Le risposte si ricaricano dal backend con getSession.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { api } from '../services/api'
import type {
  AnswerSubmitRequest,
  PathwayResolutionResponse,
  Question,
  SessionStatus,
} from '../types/api'

type StoreStatus = 'idle' | 'loading' | SessionStatus

export interface SessionState {
  // Server-side mirroring
  sessionId: string | null
  status: StoreStatus
  caseName: string | null

  // Client-side accumulator
  answers: Record<string, unknown>
  questions: Question[] | null

  // Resolution result
  pathway: PathwayResolutionResponse | null

  // UI state
  currentQuestionIndex: number
  loading: boolean
  error: string | null

  // Actions
  startNewSession: (caseName?: string) => Promise<string>
  loadQuestions: () => Promise<Question[]>
  loadSession: (sessionId: string) => Promise<void>
  setAnswer: (questionId: string, value: unknown) => Promise<void>
  goToQuestion: (index: number) => void
  resolveSession: () => Promise<PathwayResolutionResponse>
  loadPathway: (sessionId: string) => Promise<void>
  reset: () => void
}

const initialState = {
  sessionId: null,
  status: 'idle' as StoreStatus,
  caseName: null,
  answers: {},
  questions: null,
  pathway: null,
  currentQuestionIndex: 0,
  loading: false,
  error: null,
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startNewSession: async (caseName?: string) => {
        set({ loading: true, error: null })
        try {
          const session = await api.createSession(
            caseName ? { case_name: caseName } : undefined,
          )
          set({
            sessionId: session.id,
            status: session.status,
            caseName: session.case_name ?? null,
            answers: {},
            pathway: null,
            currentQuestionIndex: 0,
            loading: false,
          })
          return session.id
        } catch (err) {
          set({ loading: false, error: errorMessage(err) })
          throw err
        }
      },

      loadQuestions: async () => {
        const cached = get().questions
        if (cached && cached.length > 0) return cached
        set({ loading: true, error: null })
        try {
          const res = await api.getQuestions()
          set({ questions: res.questions, loading: false })
          return res.questions
        } catch (err) {
          set({ loading: false, error: errorMessage(err) })
          throw err
        }
      },

      loadSession: async (sessionId: string) => {
        set({ loading: true, error: null })
        try {
          const detail = await api.getSession(sessionId)
          const answers: Record<string, unknown> = {}
          for (const a of detail.answers) {
            answers[a.question_id] = a.value
          }
          set({
            sessionId: detail.id,
            status: detail.status,
            caseName: detail.case_name ?? null,
            answers,
            loading: false,
          })
        } catch (err) {
          set({ loading: false, error: errorMessage(err) })
          throw err
        }
      },

      setAnswer: async (questionId: string, value: unknown) => {
        const { sessionId } = get()
        if (!sessionId) throw new Error('No active session')
        set({ loading: true, error: null })
        try {
          const payload: AnswerSubmitRequest[] = [
            { question_id: questionId, value },
          ]
          const res = await api.submitAnswers(sessionId, payload)
          set((state) => ({
            answers: { ...state.answers, [questionId]: value },
            status: res.status,
            loading: false,
          }))
        } catch (err) {
          set({ loading: false, error: errorMessage(err) })
          throw err
        }
      },

      goToQuestion: (index: number) => {
        const total = get().questions?.length ?? 10
        const clamped = Math.max(0, Math.min(index, total - 1))
        set({ currentQuestionIndex: clamped })
      },

      resolveSession: async () => {
        const { sessionId } = get()
        if (!sessionId) throw new Error('No active session')
        set({ loading: true, error: null })
        try {
          const result = await api.resolveSession(sessionId)
          set({
            pathway: result,
            status: result.blocked ? get().status : 'pathway_resolved',
            loading: false,
          })
          return result
        } catch (err) {
          set({ loading: false, error: errorMessage(err) })
          throw err
        }
      },

      loadPathway: async (sessionId: string) => {
        set({ loading: true, error: null })
        try {
          const result = await api.getPathway(sessionId)
          set({
            sessionId,
            pathway: result,
            status: result.blocked ? get().status : 'pathway_resolved',
            loading: false,
          })
        } catch (err) {
          set({ loading: false, error: errorMessage(err) })
          throw err
        }
      },

      reset: () => {
        set({ ...initialState, questions: get().questions })
      },
    }),
    {
      name: 'symba-session',
      partialize: (state) => ({
        sessionId: state.sessionId,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    },
  ),
)

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}
