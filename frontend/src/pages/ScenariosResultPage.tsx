// Comparative result page for alternative-scenario runs (Feature C).
// Renders a table with one row per scenario (baseline + alternatives)
// and key derived states. Diffs vs baseline are highlighted.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { answerChanges, changedAnswers, inertAnswerHints } from '../components/scenarioChanges'
import { translateNote } from '../i18n/engineNotes'
import { schemaTerm } from '../i18n/schemaTerms'
import { fetchDcfData } from '../services/api'
import { useCaseStore } from '../store/caseStore'
import { useDcfDataStore } from '../store/dcfDataStore'
import { usePreferenceStore } from '../store/preferenceStore'
import { ACTORS_SECTION, FLOW_MATRIX_SECTION, type DcfData } from '../types/dcfData'
import { isEmptyDiff, networkDiff, type NetworkDiff } from './networkDiff'
import type { Case, CaseWarning, NodeChange, NodeChanges } from '../types/api'
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

type Axis = (axis: 'ilcd' | 'lcc', value: string) => string

// What a scenario changes against the case, in the words of the result page:
// the comparison showed only counts ("107 / 109 nodes"), which told the
// analyst nothing about which practice the change brings (UX round 2026-11-02).
// The situation, the costing and the S-LCA lead, as in the table above
// (UX round 2026-11-08, P1-01).
function diffAgainst(base: Case, scenario: Case, t: (k: string, o?: Record<string, unknown>) => string, lang: string, axis: Axis): Diff {
  const rows: Diff['rows'] = []
  const derived: [string, string | null | undefined, string | null | undefined, (v: string) => string][] = [
    [t('scenariosResult.columns.ilcd'), base.ilcd_situation, scenario.ilcd_situation, (v) => axis('ilcd', v)],
    [t('scenariosResult.columns.lccType'), base.lcc_type, scenario.lcc_type, (v) => axis('lcc', v)],
    [t('scenariosResult.columns.slca'), base.slca_activation_state, scenario.slca_activation_state,
      (v) => t(v === 'active' ? 'common.yes' : 'common.no')],
  ]
  for (const [label, was, now, say] of derived) {
    if ((was ?? null) !== (now ?? null)) {
      rows.push({ label, before: was ? say(was) : '—', after: now ? say(now) : '—' })
    }
  }
  const before = Object.fromEntries(configurationRows(base, t).map((r) => [r.key, r]))
  const after = Object.fromEntries(configurationRows(scenario, t).map((r) => [r.key, r]))
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
  rows.push(...keys
    .filter((k) => before[k]?.value !== after[k]?.value)
    .map((k) => ({
      label: (after[k] ?? before[k]).label,
      before: before[k]?.value ?? '—',
      after: after[k]?.value ?? '—',
    })))
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

// notes the hints already say in their own words
const SAID_BY_HINTS = new Set(['structural_screening_missing', 'structural_without_screening'])

/** Engine notes the scenario has and the case has not: often the reason a
 * change of answer changes nothing (UX round 2026-11-08, P1-01). */
function newNotes(base: Case, scenario: Case): CaseWarning[] {
  const key = (w: CaseWarning) => `${w.code}|${JSON.stringify(w.params ?? {})}`
  const seen = new Set((base.warnings ?? []).map(key))
  return (scenario.warnings ?? []).filter((w) => !seen.has(key(w)))
}

function NodeList({ nodes, changed }: { nodes: NodeChange[]; changed?: boolean }) {
  const { t } = useTranslation()
  return (
    <ul className="scenario-node-list">
      {nodes.map((n) => (
        <li key={n.id}>
          <span className="muted">{methodName(n.method)}{n.source_section ? `, ${n.source_section}` : ''}: </span>
          {n.text}
          {changed && n.before ? (
            <><br /><span className="muted">{t('scenariosResult.nodes.before')} {n.before}</span></>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function methodName(method?: string | null): string {
  return method === 'SLCA' ? 'S-LCA' : method ?? ''
}

/** The practices behind the configuration that the scenario adds, removes or
 * words differently, with their text as traced on the deliverables (P6-09). */
function NodeChangesBlock({ changes }: { changes?: NodeChanges | null }) {
  const { t } = useTranslation()
  if (!changes) return null
  const groups: [string, NodeChange[], boolean][] = [
    ['added', changes.added, false],
    ['removed', changes.removed, false],
    ['changed', changes.changed, true],
  ]
  if (groups.every(([, list]) => list.length === 0)) return null
  return (
    <div className="scenario-nodes">
      <p className="muted">{t('scenariosResult.nodes.lead')}</p>
      {groups.filter(([, list]) => list.length > 0).map(([kind, list, changed]) => (
        <details key={kind} className="scenario-nodes-group">
          <summary>{t(`scenariosResult.nodes.${kind}`, { count: list.length })}</summary>
          <NodeList nodes={list} changed={changed} />
        </details>
      ))}
    </div>
  )
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
  // guided mode: no question codes and no engine notes written for analysts
  const guided = usePreferenceStore((s) => s.mode) === 'guided'

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
        const tt = t as never as (k: string, o?: Record<string, unknown>) => string
        const d = diffAgainst(sr.baseline, sc.result, tt, i18n.language, label as Axis)
        const changed = changedAnswers(sr.baseline, sc.result)
        const answers = answerChanges(changed, sr.baseline, tt)
        const hints = inertAnswerHints(changed, sr.baseline, tt, guided)
        const notes = guided ? [] : newNotes(sr.baseline, sc.result).filter((w) => !SAID_BY_HINTS.has(w.code))
        const nothing = d.rows.length === 0 && d.added.length === 0 && d.removed.length === 0
        return (
          <section key={sc.id} className="scenario-diff">
            <h2 className="result-notes-title">
              {sc.label || sc.id} — {t('scenariosResult.whatChanges')}
            </h2>
            {/* the answers first: "Nothing changes" alone hid what the scenario tried (P1-01) */}
            <p><strong>{t('scenariosResult.answersTitle')}</strong></p>
            {answers.changes.length === 0 && answers.otherKeys.length === 0 ? (
              <p className="muted">{t('scenariosResult.sameAnswers')}</p>
            ) : (
              <ul>
                {answers.changes.map((c) => (
                  <li key={c.question}>{c.question}: {c.before} → {c.after}</li>
                ))}
                {answers.otherKeys.length > 0 ? (
                  <li className="muted">{t('scenarios.otherKeys', { count: answers.otherKeys.length })}</li>
                ) : null}
              </ul>
            )}
            <p><strong>{t('scenariosResult.configTitle')}</strong></p>
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
            {hints.length > 0 || notes.length > 0 ? (
              <div className="scenario-why">
                <p><strong>{t('scenariosResult.whyTitle')}</strong></p>
                <ul>
                  {hints.map((h) => <li key={h}>{h}</li>)}
                  {notes.map((w, i) => <li key={`${w.code}-${i}`}>{translateNote(t, w)}</li>)}
                </ul>
              </div>
            ) : nothing && answers.changes.length > 0 ? (
              <p className="muted">{t('scenariosResult.noChangeWhy')}</p>
            ) : null}
            <NodeChangesBlock changes={sc.node_changes} />
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
