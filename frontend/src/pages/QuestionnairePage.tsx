import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import ProgressIndicator from '../components/ProgressIndicator'
import QuestionCard from '../components/QuestionCard'
import { useSessionStore } from '../store/sessionStore'

export default function QuestionnairePage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const storeSessionId = useSessionStore((s) => s.sessionId)
  const questions = useSessionStore((s) => s.questions)
  const answers = useSessionStore((s) => s.answers)
  const currentQuestionIndex = useSessionStore((s) => s.currentQuestionIndex)
  const loading = useSessionStore((s) => s.loading)
  const error = useSessionStore((s) => s.error)

  const loadQuestions = useSessionStore((s) => s.loadQuestions)
  const loadSession = useSessionStore((s) => s.loadSession)
  const setAnswer = useSessionStore((s) => s.setAnswer)
  const goToQuestion = useSessionStore((s) => s.goToQuestion)
  const resolveSession = useSessionStore((s) => s.resolveSession)

  // Load questions on mount; load session if URL session differs from store.
  useEffect(() => {
    void loadQuestions()
  }, [loadQuestions])

  useEffect(() => {
    if (!sessionId) return
    if (sessionId !== storeSessionId) {
      void loadSession(sessionId)
    }
  }, [sessionId, storeSessionId, loadSession])

  const totalQuestions = questions?.length ?? 10
  const currentQuestion = useMemo(() => {
    if (!questions || questions.length === 0) return null
    const idx = Math.max(0, Math.min(currentQuestionIndex, questions.length - 1))
    return questions[idx]
  }, [questions, currentQuestionIndex])

  async function handleSelect(value: unknown) {
    if (!currentQuestion) return
    try {
      await setAnswer(currentQuestion.id, value)
      const isLast = currentQuestionIndex >= totalQuestions - 1
      if (!isLast) {
        goToQuestion(currentQuestionIndex + 1)
        return
      }
      // Last question answered: try to resolve.
      const result = await resolveSession()
      if (result.blocked) {
        navigate(`/error/${sessionId}?reason=blocked`)
      } else {
        navigate(`/result/${sessionId}`)
      }
    } catch {
      // error already in store
    }
  }

  function handleBack() {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1)
    }
  }

  function handleForward() {
    if (currentQuestionIndex < totalQuestions - 1) {
      goToQuestion(currentQuestionIndex + 1)
    }
  }

  if (!sessionId) {
    return <p>Missing session id.</p>
  }

  if (!questions) {
    return <p>Loading questions…</p>
  }

  if (!currentQuestion) {
    return <p>No questions available.</p>
  }

  const selectedValue = answers[currentQuestion.id]
  const hasAnswered = selectedValue !== undefined

  return (
    <div className="questionnaire">
      <ProgressIndicator
        current={currentQuestionIndex}
        total={totalQuestions}
      />

      <QuestionCard
        question={currentQuestion}
        selectedValue={selectedValue}
        onSelect={handleSelect}
        disabled={loading}
      />

      <div className="questionnaire-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentQuestionIndex === 0 || loading}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <span className="questionnaire-hint">
          {hasAnswered
            ? 'Click a different option to update your answer.'
            : 'Select an option to continue.'}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleForward}
          disabled={
            !hasAnswered ||
            currentQuestionIndex >= totalQuestions - 1 ||
            loading
          }
          title={
            hasAnswered
              ? 'Go to next question'
              : 'Answer this question to continue'
          }
        >
          Next <ArrowRight size={16} />
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </div>
  )
}
