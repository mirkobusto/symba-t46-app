// Comparative result page for alternative-scenario runs (Feature C).
// Renders a table with one row per scenario (baseline + alternatives)
// and key derived states. Diffs vs baseline are highlighted.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { schemaTerm } from '../i18n/schemaTerms'
import { fetchDcfData } from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { ACTORS_SECTION, FLOW_MATRIX_SECTION, type DcfData } from '../types/dcfData'
import { isEmptyDiff, networkDiff, type NetworkDiff } from './networkDiff'
import type { Case } from '../types/api'
import { configurationRows } from './configurationRows'
import { useAxisLabel } from './aggregateLabels'

interface RowData {
  id: string
  label: string
  ilcd: string | null
  lccType: string | null
  slca: string | null
  activated: number
  blocks: number
  obligations: number
  cdps: number
}

function rowFromCase(id: string, label: string, c: Case): RowData {
  return {
    id, label,
    ilcd: c.ilcd_situation ?? null,
    lccType: c.lcc_type ?? null,
    slca: c.slca_activation_state ?? null,
    activated: c.activated_nodes?.length ?? 0,
    blocks: c.blocked_by?.length ?? 0,
    obligations: c.applicable_rules?.length ?? 0,
    cdps: c.cdp_flags?.length ?? 0,
  }
}

interface Diff {
  rows: { label: string; before: string; after: string }[]
  added: string[]
  removed: string[]
}

// What a scenario changes against the case, in the words of the result page:
// the comparison showed only counts ("107 / 109 nodes"), which told the
// analyst nothing about which practice the change brings (UX round 2026-11-02).
function diffAgainst(base: Case, scenario: Case, t: (k: string, o?: Record<string, unknown>) => string, lang: string): Diff {
  const before = Object.fromEntries(configurationRows(base, t).map((r) => [r.key, r]))
  const after = Object.fromEntries(configurationRows(scenario, t).map((r) => [r.key, r]))
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
  const rows = keys
    .filter((k) => before[k]?.value !== after[k]?.value)
    .map((k) => ({
      label: (after[k] ?? before[k]).label,
      before: before[k]?.value ?? '—',
      after: after[k]?.value ?? '—',
    }))
  // a scenario may change who pays whom for one flow: name the flow and both classes
  const baseQ5 = new Map((base.flows ?? []).map((f) => [f.id, f.q5]))
  for (const f of scenario.flows ?? []) {
    const was = baseQ5.get(f.id)
    if (was && f.q5 && was !== f.q5) {
      rows.push({
        label: t('scenariosResult.flowQ5Row', { flow: f.name || f.id }),
        before: t(`flows.options.${was}`),
        after: t(`flows.options.${f.q5}`),
      })
    }
  }
  const name = (id: string, fallback?: string | null) =>
    `${id} ${schemaTerm(lang, 'rule', id)?.name ?? fallback ?? ''}`.trim()
  const baseRules = new Map((base.applicable_rules ?? []).map((r) => [r.rule_id, r.name]))
  const scRules = new Map((scenario.applicable_rules ?? []).map((r) => [r.rule_id, r.name]))
  return {
    rows,
    added: [...scRules].filter(([id]) => !baseRules.has(id)).map(([id, n]) => name(id, n)),
    removed: [...baseRules].filter(([id]) => !scRules.has(id)).map(([id, n]) => name(id, n)),
  }
}

/** The DCF content of the open case: the editor's draft when it is this
 * case's (unsaved changes included), else what the server stores. Read only:
 * the editor's draft is never replaced from here. */
function useCaseNetwork(): DcfData | null {
  const serverCaseId = useCaseStore((s) => s.serverCaseId)
  const draftCaseId = useDcfDataStore((s) => s.caseId)
  const draft = useDcfDataStore((s) => s.data)
  const [fetched, setFetched] = useState<{ id: string; data: DcfData | null } | null>(null)
  const own = draftCaseId === serverCaseId
  useEffect(() => {
    if (own || !serverCaseId) return
    let cancelled = false
    fetchDcfData(serverCaseId)
      .then((env) => { if (!cancelled) setFetched({ id: serverCaseId, data: env.data }) })
      .catch(() => { if (!cancelled) setFetched({ id: serverCaseId, data: null }) })
    return () => { cancelled = true }
  }, [own, serverCaseId])
  if (own) return draft
  return fetched?.id === serverCaseId ? fetched.data : null
}

type T = (k: string, o?: Record<string, unknown>) => string

function shown(value: unknown): string {
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

/** One line per change, in the reader's words. */
function diffLines(d: NetworkDiff, t: T): string[] {
  return [
    ...d.actors_added.map((x) => t('scenariosResult.networkActorAdded', x)),
    ...d.actors_removed.map((x) => t('scenariosResult.networkActorRemoved', x)),
    ...d.actors_renamed.map((x) => t('scenariosResult.networkActorRenamed', x)),
    ...d.flows_rerouted.map((x) => t('scenariosResult.networkFlowRerouted', {
      flow: x.flow, fromBefore: x.from_before, toBefore: x.to_before, fromAfter: x.from_after, toAfter: x.to_after,
    })),
    ...d.flows_dropped.map((x) => t('scenariosResult.networkFlowDropped', x)),
    ...d.flows_only_in_scenario.map((x) => t('scenariosResult.networkFlowOnlyHere', x)),
    ...d.value_changes.map((x) => t('scenariosResult.networkValue', {
      flow: x.flow, field: t(`scenariosResult.networkField_${x.field.replace('flow.', '')}`),
      before: shown(x.before), after: shown(x.after),
    })),
  ]
}

function NetworkBlock({ data, scenarioId, t }: { data: DcfData | null; scenarioId: string; t: T }) {
  const variant = data?.networks_by_scenario?.[scenarioId]
  if (!data || !variant) {
    return <p className="muted">{t('scenariosResult.networkNone')}</p>
  }
  const rows = (section: string, from: { rows_by_section: Record<string, DcfData['rows_by_section'][string]> }) =>
    from.rows_by_section[section] ?? []
  const d = networkDiff(rows(ACTORS_SECTION, data), rows(FLOW_MATRIX_SECTION, data),
    rows(ACTORS_SECTION, variant), rows(FLOW_MATRIX_SECTION, variant))
  if (isEmptyDiff(d)) return <p className="muted">{t('scenariosResult.networkSame')}</p>
  return <ul>{diffLines(d, t).map((line, i) => <li key={i}>{line}</li>)}</ul>
}

export default function ScenariosResultPage() {
  const { t, i18n } = useTranslation()
  // the same words as the result page: no raw 'ILCD Situation', 'C+E' or 'alt1' (UX round 4)
  const label = useAxisLabel()
  const sr = useCaseStore((s) => s.scenariosResult)
  const network = useCaseNetwork()

  if (!sr) {
    return (
      <div className="result">
        <h1>{t('scenariosResult.title')}</h1>
        <p className="muted">{t('scenariosResult.empty')}</p>
        <Link to="/questionnaire" className="btn btn-primary">
          {t('result.noResult.cta')}
        </Link>
      </div>
    )
  }

  const baselineRow = rowFromCase('baseline', t('scenariosResult.baselineLabel'), sr.baseline)
  // a scenario that could not be run has no configuration to compare: it is
  // reported below, not as a row of dashes (Fable review of #205)
  const scenarioRows = sr.scenarios
    .filter((s) => !s.error)
    .map((s) => rowFromCase(s.id, s.label || s.id, s.result))
  const allRows = [baselineRow, ...scenarioRows]

  function diffClass<T>(value: T, baseline: T): string {
    return value === baseline ? '' : 'cell-diff'
  }

  return (
    <div className="result">
      <h1>{t('scenariosResult.title')}</h1>
      <p className="muted">
        {t('scenariosResult.description', { count: sr.scenarios.length })}
      </p>

      <div className="scenarios-table-wrap">
        <table className="flows-table scenarios-table">
          <thead>
            <tr>
              <th>{t('scenariosResult.columns.scenario')}</th>
              <th>{t('scenariosResult.columns.ilcd')}</th>
              <th>{t('scenariosResult.columns.lccType')}</th>
              <th>{t('scenariosResult.columns.slca')}</th>
              <th>{t('scenariosResult.columns.activated')}</th>
              <th>{t('scenariosResult.columns.blocks')}</th>
              <th>{t('scenariosResult.columns.obligations')}</th>
              <th>{t('scenariosResult.columns.cdps')}</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, i) => {
              const isBaseline = i === 0
              return (
                <tr key={row.id} className={isBaseline ? 'row-baseline' : ''}>
                  <td>
                    <strong>{row.label}</strong>
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.ilcd, baselineRow.ilcd)}>
                    {row.ilcd ? label('ilcd', row.ilcd) : '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.lccType, baselineRow.lccType)}>
                    {row.lccType ? label('lcc', row.lccType) : '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.slca, baselineRow.slca)}>
                    {row.slca ? t(row.slca === 'active' ? 'common.yes' : 'common.no') : '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.activated, baselineRow.activated)}>
                    {row.activated}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.blocks, baselineRow.blocks)}>
                    {row.blocks}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.obligations, baselineRow.obligations)}>
                    {row.obligations}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.cdps, baselineRow.cdps)}>
                    {row.cdps}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {sr.scenarios.map((sc) => {
        if (sc.error) {
          // an invalid scenario used to show an empty row and every obligation
          // "removed" (UX round 5, P7-11)
          return (
            <section key={sc.id} className="scenario-diff">
              <h2 className="result-notes-title">{sc.label || sc.id}</h2>
              <p className="error-text">{t('scenariosResult.failed', { detail: sc.error })}</p>
            </section>
          )
        }
        const d = diffAgainst(sr.baseline, sc.result, t as never, i18n.language)
        const nothing = d.rows.length === 0 && d.added.length === 0 && d.removed.length === 0
        return (
          <section key={sc.id} className="scenario-diff">
            <h2 className="result-notes-title">
              {sc.label || sc.id} — {t('scenariosResult.whatChanges')}
            </h2>
            {nothing ? <p className="muted">{t('scenariosResult.noChange')}</p> : null}
            {d.rows.length > 0 ? (
              <ul>
                {d.rows.map((r) => (
                  <li key={r.label}>
                    <strong>{r.label}</strong>: {r.before} → {r.after}
                  </li>
                ))}
              </ul>
            ) : null}
            {d.added.length > 0 ? (
              <p><strong>{t('scenariosResult.addedRules')}</strong>: {d.added.join('; ')}</p>
            ) : null}
            {d.removed.length > 0 ? (
              <p><strong>{t('scenariosResult.removedRules')}</strong>: {d.removed.join('; ')}</p>
            ) : null}
            {/* where the flows go, drawn in the network editor (owner OK 2026-11-04) */}
            <h3 className="scenario-network-title">{t('scenariosResult.networkTitle')}</h3>
            <NetworkBlock data={network} scenarioId={sc.id} t={t as never} />
          </section>
        )
      })}

      <div className="result-actions">
        <Link to="/result" className="btn btn-secondary">
          {t('scenariosResult.backToResult')}
        </Link>
        <Link to="/questionnaire" className="btn btn-secondary">
          {t('result.actions.adjust')}
        </Link>
      </div>
    </div>
  )
}
