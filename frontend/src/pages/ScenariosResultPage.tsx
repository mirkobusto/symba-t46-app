// Comparative result page for alternative-scenario runs (Feature C).
// Renders a table with one row per scenario (baseline + alternatives)
// and key derived states. Diffs vs baseline are highlighted.

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { schemaTerm } from '../i18n/schemaTerms'
import { useCaseStore } from '../store/caseStore'
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

export default function ScenariosResultPage() {
  const { t, i18n } = useTranslation()
  // the same words as the result page: no raw 'ILCD Situation', 'C+E' or 'alt1' (UX round 4)
  const label = useAxisLabel()
  const sr = useCaseStore((s) => s.scenariosResult)

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
  const scenarioRows = sr.scenarios.map((s) =>
    rowFromCase(s.id, s.label || s.id, s.result),
  )
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
