import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, RotateCcw } from 'lucide-react'

import BlockedMessage from '../components/BlockedMessage'
import { api } from '../services/api'
import { useSessionStore } from '../store/sessionStore'

export default function ErrorPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const pathway = useSessionStore((s) => s.pathway)
  const loadPathway = useSessionStore((s) => s.loadPathway)
  const reset = useSessionStore((s) => s.reset)
  const loading = useSessionStore((s) => s.loading)
  const error = useSessionStore((s) => s.error)

  useEffect(() => {
    if (!sessionId) return
    if (!pathway || pathway.session_id !== sessionId) {
      void loadPathway(sessionId)
    }
  }, [sessionId, pathway, loadPathway])

  async function handleStartNew() {
    if (sessionId) {
      try {
        await api.deleteSession(sessionId)
      } catch {
        // best-effort archive; continue anyway
      }
    }
    reset()
    navigate('/')
  }

  if (!sessionId) return <p>Missing session id.</p>
  if (loading && !pathway) return <p>Loading…</p>

  if (!pathway) {
    return (
      <div className="error-page">
        <h2>Something went wrong</h2>
        {error ? <p className="error-text">{error}</p> : null}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStartNew}
        >
          Start new assessment
        </button>
      </div>
    )
  }

  if (!pathway.blocked || !pathway.block_info) {
    // Not actually blocked — bounce to result.
    navigate(`/result/${sessionId}`)
    return null
  }

  return (
    <div className="error-page">
      <BlockedMessage blockInfo={pathway.block_info} />
      <div className="error-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(`/questionnaire/${sessionId}`)}
        >
          <Pencil size={16} /> Edit answers
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStartNew}
        >
          <RotateCcw size={16} /> Start new assessment
        </button>
      </div>
    </div>
  )
}
