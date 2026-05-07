import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { useSessionStore } from '../store/sessionStore'

export default function HomePage() {
  const navigate = useNavigate()
  const startNewSession = useSessionStore((s) => s.startNewSession)
  const reset = useSessionStore((s) => s.reset)
  const loading = useSessionStore((s) => s.loading)
  const error = useSessionStore((s) => s.error)

  const [caseName, setCaseName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleStart(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      reset()
      const id = await startNewSession(caseName.trim() || undefined)
      navigate(`/questionnaire/${id}`)
    } catch {
      // error is in store; render below
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="home">
      <h1>SYMBA T4.6 — IS Assessment Tool</h1>
      <p className="home-tagline">
        Industrial Symbiosis scoping for LCA / LCC / S-LCA assessments.
      </p>
      <p className="home-description">
        Answer ten short questions about your industrial-symbiosis case study.
        The decision engine identifies the recommended LCSA pathway and returns
        a complete methodological configuration — system boundaries,
        functional unit, allocation rules, weighting and critical-review
        requirements — grounded in deliverables D4.1, D4.2 and D4.3.
      </p>

      <form className="home-start" onSubmit={handleStart}>
        <label htmlFor="case-name">
          Case study name <span className="muted">(optional)</span>
        </label>
        <input
          id="case-name"
          type="text"
          value={caseName}
          onChange={(e) => setCaseName(e.target.value)}
          placeholder="e.g. Sunflower-Compost-Park"
          maxLength={256}
          disabled={submitting || loading}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || loading}
        >
          {submitting ? 'Starting…' : 'Start new assessment'}
          <ArrowRight size={18} />
        </button>

        {error ? <p className="error-text">{error}</p> : null}
      </form>
    </div>
  )
}
