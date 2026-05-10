// "Show reasoning" panel — i18n.

import { useTranslation } from 'react-i18next'

import type { CdpFlag, RuleViolation } from '../types/api'

interface Props {
  activatedNodes: string[]
  rule_violations: RuleViolation[]
  cdp_flags: CdpFlag[]
  pillars: { name: string; data: Record<string, unknown> }[]
}

function groupByPrefix(nodes: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const id of nodes) {
    const prefix = id.split('_')[0] ?? id
    if (!out[prefix]) out[prefix] = []
    out[prefix].push(id)
  }
  return out
}

const PREFIX_LABELS: Record<string, string> = {
  lca: 'LCA',
  lcc: 'LCC',
  slca: 'S-LCA',
  system: 'System',
}

function severityClass(s: string | null | undefined): string {
  if (s === 'HIGH') return 'severity severity-high'
  if (s === 'MEDIUM') return 'severity severity-medium'
  if (s === 'LOW') return 'severity severity-low'
  return 'severity'
}

export default function ReasoningPanel({
  activatedNodes,
  rule_violations,
  cdp_flags,
  pillars,
}: Props) {
  const { t } = useTranslation()
  const grouped = groupByPrefix(activatedNodes)
  const groupKeys = Object.keys(grouped).sort()

  return (
    <div className="reasoning">
      {/* Activated nodes by pillar */}
      <section className="reasoning-section">
        <h3>{t('reasoning.activatedNodes', { count: activatedNodes.length })}</h3>
        <div className="node-groups">
          {groupKeys.map((prefix) => (
            <details key={prefix} className="node-group">
              <summary>
                <strong>{PREFIX_LABELS[prefix] ?? prefix}</strong>
                <span className="muted"> · {grouped[prefix].length}</span>
              </summary>
              <ul className="node-list">
                {grouped[prefix].map((id) => (
                  <li key={id}>
                    <code>{id}</code>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* Pillar configs */}
      <section className="reasoning-section">
        <h3>{t('reasoning.pillarConfigs')}</h3>
        {pillars
          .filter((p) => Object.keys(p.data).length > 0)
          .map((p) => (
            <details key={p.name} className="pillar-config">
              <summary>
                <strong>{p.name}</strong>
                <span className="muted">
                  {' · '}
                  {t('reasoning.pillarKeys', { count: Object.keys(p.data).length })}
                </span>
              </summary>
              <dl className="pillar-dl">
                {Object.entries(p.data).map(([k, v]) => (
                  <div key={k} className="pillar-row">
                    <dt>
                      <code>{k}</code>
                    </dt>
                    <dd>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        {pillars.every((p) => Object.keys(p.data).length === 0) ? (
          <p className="muted">{t('reasoning.noPillarValues')}</p>
        ) : null}
      </section>

      {/* Violations */}
      <section className="reasoning-section">
        <h3>{t('reasoning.l2Violations', { count: rule_violations.length })}</h3>
        {rule_violations.length === 0 ? (
          <p className="muted">{t('reasoning.noViolations')}</p>
        ) : (
          <ul className="violation-list">
            {rule_violations.map((v, i) => (
              <li key={`${v.rule_id}-${i}`} className="violation-card">
                <code className="violation-id">{v.rule_id}</code>
                <span>{v.message}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CDPs */}
      <section className="reasoning-section">
        <h3>{t('reasoning.l3Cdps', { count: cdp_flags.length })}</h3>
        {cdp_flags.length === 0 ? (
          <p className="muted">{t('reasoning.noCdps')}</p>
        ) : (
          <ul className="cdp-list">
            {cdp_flags.map((cdp) => (
              <li key={cdp.cdp_id} className="cdp-card">
                <header>
                  <code className="cdp-id">{cdp.cdp_id}</code>
                  <span className={severityClass(cdp.severity)}>
                    {cdp.severity ?? '—'}
                  </span>
                  <strong>{cdp.name}</strong>
                </header>
                <p className="cdp-tension">{cdp.tension}</p>
                <p className="cdp-resolution">
                  <span className="muted">{t('reasoning.resolution')}:</span>{' '}
                  {cdp.resolution_at_l3}
                </p>
                {cdp.methods.length > 0 ? (
                  <p className="cdp-methods">
                    {cdp.methods.map((m) => (
                      <span key={m} className="chip">
                        {m}
                      </span>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
