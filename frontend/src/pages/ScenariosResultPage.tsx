// Comparative result page for Q2-D scenarios runs (Feature C).
// Renders a table with one row per scenario (baseline + alternatives)
// and key derived states. Diffs vs baseline are highlighted.

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useCaseStore } from '../store/caseStore'
import type { Case } from '../types/api'

interface RowData {
  id: string
  label: string
  pathway: string | null
  ilcd: string | null
  lccType: string | null
  slca: string | null
  activated: number
  blocks: number
  violations: number
  cdps: number
}

function rowFromCase(id: string, label: string, c: Case): RowData {
  return {
    id, label,
    pathway: c.pathway_id ?? null,
    ilcd: c.ilcd_situation ?? null,
    lccType: c.lcc_type ?? null,
    slca: c.slca_activation_state ?? null,
    activated: c.activated_nodes?.length ?? 0,
    blocks: c.blocked_by?.length ?? 0,
    violations: c.rule_violations?.length ?? 0,
    cdps: c.cdp_flags?.length ?? 0,
  }
}

export default function ScenariosResultPage() {
  const { t } = useTranslation()
  const sr = useCaseStore((s) => s.scenariosResult)

  if (!sr) {
    return (
      <div className="result">
        <h1>{t('scenariosResult.title')}</h1>
        <p className="muted">
          No scenarios result yet. Open the questionnaire, select Q2=D,
          define alternative scenarios, then click "Run scenarios" on
          the result page.
        </p>
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
        {t('scenariosResult.description', { n: sr.scenarios.length })}
      </p>

      <div className="scenarios-table-wrap">
        <table className="flows-table scenarios-table">
          <thead>
            <tr>
              <th>{t('scenariosResult.columns.scenario')}</th>
              <th>{t('scenariosResult.columns.pathway')}</th>
              <th>{t('scenariosResult.columns.ilcd')}</th>
              <th>{t('scenariosResult.columns.lccType')}</th>
              <th>{t('scenariosResult.columns.slca')}</th>
              <th>{t('scenariosResult.columns.activated')}</th>
              <th>{t('scenariosResult.columns.blocks')}</th>
              <th>{t('scenariosResult.columns.violations')}</th>
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
                    <br />
                    <code>{row.id}</code>
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.pathway, baselineRow.pathway)}>
                    {row.pathway ?? '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.ilcd, baselineRow.ilcd)}>
                    {row.ilcd ?? '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.lccType, baselineRow.lccType)}>
                    {row.lccType ?? '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.slca, baselineRow.slca)}>
                    {row.slca ?? '—'}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.activated, baselineRow.activated)}>
                    {row.activated}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.blocks, baselineRow.blocks)}>
                    {row.blocks}
                  </td>
                  <td className={isBaseline ? '' : diffClass(row.violations, baselineRow.violations)}>
                    {row.violations}
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
