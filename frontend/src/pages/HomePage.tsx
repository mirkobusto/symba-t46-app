import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useCaseStore } from '../store/caseStore'

export default function HomePage() {
  const navigate = useNavigate()
  const reset = useCaseStore((s) => s.reset)

  function handleStart() {
    reset()
    navigate('/questionnaire')
  }

  return (
    <div className="home">
      <h1>SYMBA T4.6 — IS Assessment Tool</h1>
      <p className="home-tagline">
        Industrial Symbiosis methodology selection for LCA / LCC / S-LCA.
      </p>
      <p className="home-description">
        Answer seven short questions about your industrial-symbiosis case
        study. The decision engine derives the terminal IS pathway
        (IS-01..IS-05) and a complete methodological configuration from
        the 186 Phase&nbsp;1 nodes of deliverables D4.1, D4.2 and D4.3,
        plus the 40 cross-method validation rules.
      </p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleStart}
      >
        Start new assessment
        <ArrowRight size={18} />
      </button>
    </div>
  )
}
