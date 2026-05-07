import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Download, Pencil, RotateCcw } from 'lucide-react'

import AppliedRulesList from '../components/AppliedRulesList'
import ConfigurationSection from '../components/ConfigurationSection'
import PathwayBadge from '../components/PathwayBadge'
import TraceList from '../components/TraceList'
import WarningsBanner from '../components/WarningsBanner'
import { useSessionStore } from '../store/sessionStore'

type Tab = 'lca' | 'lcc' | 'slca'

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const pathway = useSessionStore((s) => s.pathway)
  const loading = useSessionStore((s) => s.loading)
  const error = useSessionStore((s) => s.error)
  const loadPathway = useSessionStore((s) => s.loadPathway)
  const reset = useSessionStore((s) => s.reset)

  const [tab, setTab] = useState<Tab>('lca')

  useEffect(() => {
    if (!sessionId) return
    if (!pathway || pathway.session_id !== sessionId) {
      void loadPathway(sessionId)
    }
  }, [sessionId, pathway, loadPathway])

  if (!sessionId) return <p>Missing session id.</p>
  if (loading && !pathway) return <p>Loading result…</p>
  if (error && !pathway) return <p className="error-text">{error}</p>
  if (!pathway) return <p>No result available.</p>

  if (pathway.blocked) {
    // Defensive: shouldn't happen but redirect anyway.
    navigate(`/error/${sessionId}?reason=blocked`)
    return null
  }

  const config = pathway.configuration ?? {}

  return (
    <div className="result">
      <header className="result-header">
        <PathwayBadge
          pathwayId={pathway.pathway_id}
          pathwayName={pathway.pathway_name}
        />
        {pathway.match_distance !== null && pathway.match_distance > 0 ? (
          <span className="match-distance">
            Closest match (Hamming distance: {pathway.match_distance})
          </span>
        ) : null}
      </header>

      <WarningsBanner warnings={pathway.warnings} title="Warnings" />

      <div className="result-tabs" role="tablist">
        {(['lca', 'lcc', 'slca'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'tab tab-active' : 'tab'}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="result-tab-content" role="tabpanel">
        {tab === 'lca' ? (
          <ConfigurationSection
            title="LCA configuration"
            config={config.lca as Record<string, unknown> | undefined}
          />
        ) : null}
        {tab === 'lcc' ? (
          <ConfigurationSection
            title="LCC configuration"
            config={config.lcc as Record<string, unknown> | undefined}
          />
        ) : null}
        {tab === 'slca' ? (
          <ConfigurationSection
            title="S-LCA configuration"
            config={config.slca as Record<string, unknown> | undefined}
          />
        ) : null}
      </div>

      <AppliedRulesList rules={pathway.applied_rules} />

      <TraceList trace={pathway.trace} title="Trace (sources)" />

      <div className="result-actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled
          title="Coming in Sprint 5"
        >
          <Download size={16} /> Download protocol (coming soon)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled
          title="Coming in Sprint 6"
        >
          <Download size={16} /> Download data template (coming soon)
        </button>
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
          onClick={() => {
            reset()
            navigate('/')
          }}
        >
          <RotateCcw size={16} /> Start new assessment
        </button>
      </div>
    </div>
  )
}
