// Questionnaire page — i18n.

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import AdvancedEditor from '../components/AdvancedEditor'
import FlowsEditor from '../components/FlowsEditor'
import LoadingOverlay from '../components/LoadingOverlay'
import QuestionCard from '../components/QuestionCard'
import ScenariosEditor from '../components/ScenariosEditor'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type {
  AlternativeScenario,
  Flow,
  Q1,
  Q2,
  Q4,
  Q6a,
  Q6b,
  Q7,
  ComparisonGoal,
  DecisionContext,
  ReferenceMarketScope,
} from '../types/api'

const Q1_KEYS: Q1[] = ['A', 'B', 'C', 'D', 'E']
const Q2_KEYS: Q2[] = ['A', 'B']
const Q4_KEYS: Q4[] = ['A', 'B', 'C', 'D', 'E']
const Q6A_KEYS: Q6a[] = [
  'none',
  'agriculture_agrifood_biorefineries',
  'biobased_polymers',
  'plastics_packaging',
  'pulp_paper',
  'chemicals_fertilizers',
  'cement_construction',
  'steel_metals',
  'energy_utilities',
  'wastewater_sludge_biofactories',
  'textile_leather',
  'waste_valorization',
  'food_production',
  'multi_tenant_urban_building',
  'multi_sector',
  'other',
]
const Q6B_KEYS: Q6b[] = ['TRL9', 'TRL7-8', 'TRL5-6', 'TRL<5']
const Q7_KEYS: Q7[] = ['A', 'B', 'C']
const MARKET_SCOPES: ReferenceMarketScope[] = ['national', 'sub_national', 'continental']
const DECISION_KEYS: DecisionContext[] = ['micro', 'structural', 'none', 'corporate_report']
const COMPARISON_KEYS: ComparisonGoal[] = ['waste_treatment', 'product_substitution', 'co_primary']

const Q4_WARN_KEYS: Partial<Record<Q4, string>> = {
  C: 'questionnaire.q4.options.C.warn',
  D: 'questionnaire.q4.options.D.warn',
}

/** Years as the API wants them: a non-negative number, or null when empty/invalid. */
function parseYears(raw: string): number | null {
  const n = Number(raw.trim())
  return raw.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null
}

/** A calendar year, or null when empty/invalid. */
function parseYear(raw: string): number | null {
  const n = Number(raw.trim())
  return raw.trim() !== '' && Number.isInteger(n) && n >= 1900 && n <= 2200 ? n : null
}

const START_KEYS = ['', 'now', 'future'] as const

export default function QuestionnairePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const draft = useCaseStore((s) => s.draft)
  const patchDraft = useCaseStore((s) => s.patchDraft)
  const runDraft = useCaseStore((s) => s.runDraft)
  const reset = useCaseStore((s) => s.reset)
  const loading = useCaseStore((s) => s.loading)
  const error = useCaseStore((s) => s.error)

  const [q1, setQ1] = useState<Q1 | undefined>(draft.q1 ?? undefined)
  const [q2, setQ2] = useState<Q2 | undefined>(draft.q2 ?? undefined)
  const [longStanding, setLongStanding] = useState<'' | 'yes' | 'no'>(
    draft.network_long_standing == null ? '' : draft.network_long_standing ? 'yes' : 'no',
  )
  const [env, setEnv] = useState(draft.q3?.env ?? true)
  const [eco, setEco] = useState(draft.q3?.eco ?? false)
  const [soc, setSoc] = useState(draft.q3?.soc ?? false)
  const [q4, setQ4] = useState<Set<Q4>>(new Set(draft.q4 ?? []))
  const [flows, setFlows] = useState<Flow[]>(draft.flows ?? [])
  const [scenarios, setScenarios] = useState<AlternativeScenario[]>(
    draft.alternative_scenarios ?? [],
  )
  const [q6a, setQ6a] = useState<Q6a | undefined>(draft.q6a ?? undefined)
  const [q6b, setQ6b] = useState<Q6b | undefined>(draft.q6b ?? undefined)
  const [q7, setQ7] = useState<Q7 | undefined>(draft.q7 ?? undefined)
  const [marketRegion, setMarketRegion] = useState<string>(draft.reference_market_region ?? '')
  const [marketScope, setMarketScope] = useState<ReferenceMarketScope | ''>(draft.reference_market_scope ?? '')
  const [decisionContext, setDecisionContext] = useState<DecisionContext | ''>(
    draft.decision_context ?? '',
  )
  const [screening, setScreening] = useState<'' | 'yes' | 'no'>(
    draft.market_screening_documented == null ? '' : draft.market_screening_documented ? 'yes' : 'no',
  )
  const [policy, setPolicy] = useState<'' | 'yes' | 'no'>(
    draft.policy_objective == null ? '' : draft.policy_objective ? 'yes' : 'no',
  )
  const [comparisonGoal, setComparisonGoal] = useState<ComparisonGoal | ''>(
    draft.comparison_goal ?? '',
  )
  const [sharedAssets, setSharedAssets] = useState<'' | 'yes' | 'no'>(
    draft.dedicated_shared_assets == null ? '' : draft.dedicated_shared_assets ? 'yes' : 'no',
  )
  const [operatingStart, setOperatingStart] = useState<'' | 'now' | 'future'>(draft.operating_start ?? '')
  const [startYear, setStartYear] = useState<string>(
    draft.operating_start_year != null ? String(draft.operating_start_year) : '',
  )
  const [analysisPeriod, setAnalysisPeriod] = useState<string>(
    draft.analysis_period_years != null ? String(draft.analysis_period_years) : '',
  )
  const [assetLifetime, setAssetLifetime] = useState<string>(
    draft.asset_lifetime_years != null ? String(draft.asset_lifetime_years) : '',
  )
  const [advanced, setAdvanced] = useState<Record<string, unknown>>(
    draft.advanced ?? {},
  )

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setQ1(draft.q1 ?? undefined)
    setQ2(draft.q2 ?? undefined)
    setLongStanding(draft.network_long_standing == null ? '' : draft.network_long_standing ? 'yes' : 'no')
    setEnv(draft.q3?.env ?? true)
    setEco(draft.q3?.eco ?? false)
    setSoc(draft.q3?.soc ?? false)
    setQ4(new Set(draft.q4 ?? []))
    setFlows(draft.flows ?? [])
    setScenarios(draft.alternative_scenarios ?? [])
    setQ6a(draft.q6a ?? undefined)
    setQ6b(draft.q6b ?? undefined)
    setQ7(draft.q7 ?? undefined)
    setMarketRegion(draft.reference_market_region ?? '')
    setMarketScope(draft.reference_market_scope ?? '')
    setOperatingStart(draft.operating_start ?? '')
    setStartYear(draft.operating_start_year != null ? String(draft.operating_start_year) : '')
    setAnalysisPeriod(draft.analysis_period_years != null ? String(draft.analysis_period_years) : '')
    setAssetLifetime(
      draft.asset_lifetime_years != null ? String(draft.asset_lifetime_years) : '',
    )
    setDecisionContext(draft.decision_context ?? '')
    setScreening(draft.market_screening_documented == null ? '' : draft.market_screening_documented ? 'yes' : 'no')
    setPolicy(draft.policy_objective == null ? '' : draft.policy_objective ? 'yes' : 'no')
    setComparisonGoal(draft.comparison_goal ?? '')
    setSharedAssets(draft.dedicated_shared_assets == null ? '' : draft.dedicated_shared_assets ? 'yes' : 'no')
    setAdvanced(draft.advanced ?? {})
  }, [draft])
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggleQ4(value: Q4) {
    const next = new Set(q4)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setQ4(next)
  }

  const q3Empty = !env && !eco && !soc
  // Q9 is required: the ILCD situation follows it (D4.1 Table 1), not Q1
  // Q10 is required when the economic dimension is on: it decides the societal LCC
  const canRun = !!q1 && !q3Empty && decisionContext !== '' && (!eco || policy !== '') && !loading

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canRun) {
        e.preventDefault()
        void handleRun()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRun, q1, q2, longStanding, env, eco, soc, q4, flows, scenarios, q6a, q6b, q7, marketRegion, marketScope, operatingStart, startYear, analysisPeriod, assetLifetime, decisionContext, screening, policy, comparisonGoal, sharedAssets, advanced])

  async function handleRun() {
    patchDraft({
      q1, q2,
      network_long_standing: q2 === 'A' && longStanding !== '' ? longStanding === 'yes' : null,
      q3: { env, eco, soc },
      q4: Array.from(q4),
      q5: undefined,
      flows,
      alternative_scenarios: scenarios,
      q6a, q6b, q7,
      reference_market_region: marketRegion.trim() || null,
      reference_market_scope: marketScope || null,
      operating_start: operatingStart || null,
      operating_start_year: operatingStart === 'future' ? parseYear(startYear) : null,
      analysis_period_years: parseYears(analysisPeriod),
      asset_lifetime_years: parseYears(assetLifetime),
      decision_context: decisionContext || null,
      market_screening_documented: decisionContext === 'structural' && screening !== '' ? screening === 'yes' : null,
      policy_objective: !eco || policy === '' ? null : policy === 'yes',
      comparison_goal: comparisonGoal || null,
      // Q12 is asked when LCA or LCC is on (D4.1 §6.3.3, D4.2 §4.2)
      dedicated_shared_assets: (env || eco) && sharedAssets !== '' ? sharedAssets === 'yes' : null,
      advanced,
    })
    const result = await runDraft()
    if (result) navigate('/result')
  }

  function handleReset() {
    if (window.confirm(t('questionnaire.confirmReset'))) {
      reset()
      setQ1(undefined); setQ2(undefined); setLongStanding('')
      setEnv(true); setEco(false); setSoc(false)
      setQ4(new Set()); setFlows([]); setScenarios([])
      setQ6a(undefined); setQ6b(undefined); setQ7(undefined)
      setMarketRegion(''); setMarketScope('')
      setOperatingStart(''); setStartYear(''); setAnalysisPeriod('')
      setAssetLifetime('')
      setDecisionContext('')
      setScreening('')
      setPolicy('')
      setComparisonGoal('')
      setSharedAssets('')
      setAdvanced({})
    }
  }

  const mode = usePreferenceStore((s) => s.mode)

  return (
    <div className={`dd-page questionnaire questionnaire-mode-${mode}`}>
      <div className="dd-page-head">
        <div>
          <h1 className="dd-page-title">{t('questionnaire.title')}</h1>
          <p className="dd-page-sub">{t('questionnaire.intro')}</p>
        </div>
      </div>

      {mode === 'guided' ? (
        <div className="guided-banner" role="note">
          <strong>{t('questionnaire.guidedBannerTitle')}</strong>
          <p>{t('questionnaire.guidedBannerBody')}</p>
        </div>
      ) : null}

      {/* Q1 */}
      <QuestionCard
        id="q1"
        title={t('questionnaire.q1.title')}
        help={t('questionnaire.q1.help')}
        plain={t('questionnaire.q1.plain')}
        details={t('questionnaire.q1.details')}
      >
        {Q1_KEYS.map((v) => (
          <label key={v} className="opt">
            <input
              type="radio" name="q1" value={v}
              checked={q1 === v} onChange={() => setQ1(v)}
              aria-required="true" aria-invalid={!q1}
            />
            <span className="opt-label">{t(`questionnaire.q1.options.${v}.label`)}</span>
            <span className="opt-desc">{t(`questionnaire.q1.options.${v}.description`)}</span>
          </label>
        ))}
      </QuestionCard>

      {/* Q2 */}
      <QuestionCard
        id="q2"
        title={t('questionnaire.q2.title')}
        plain={t('questionnaire.q2.plain')}
        details={t('questionnaire.q2.details')}
      >
        {Q2_KEYS.map((v) => (
          <label key={v} className="opt">
            <input
              type="radio" name="q2" value={v}
              checked={q2 === v} onChange={() => setQ2(v)}
            />
            <span className="opt-label">{t(`questionnaire.q2.options.${v}.label`)}</span>
            <span className="opt-desc">{t(`questionnaire.q2.options.${v}.description`)}</span>
          </label>
        ))}
        {q2 === 'A' && (
          <>
            <p className="opt-label">{t('questionnaire.q2.longStanding.label')}</p>
            {(['yes', 'no'] as const).map((k) => (
              <label key={k} className="opt opt-single">
                <input
                  type="radio" name="q2-long-standing" value={k}
                  checked={longStanding === k}
                  onChange={() => setLongStanding(k)}
                />
                <span className="opt-label">{t(`questionnaire.q2.longStanding.${k}`)}</span>
              </label>
            ))}
          </>
        )}
      </QuestionCard>

      {/* Alternative scenarios: available to every study (D4.1 §4.3.3) */}
      <QuestionCard
        id="q2d-scenarios"
        title={t('questionnaire.q2dCard.title')}
        help={t('questionnaire.q2dCard.help')}
      >
        <ScenariosEditor scenarios={scenarios} onChange={setScenarios} />
      </QuestionCard>

      {/* Q3 */}
      <QuestionCard
        id="q3"
        title={t('questionnaire.q3.title')}
        help={t('questionnaire.q3.help')}
        plain={t('questionnaire.q3.plain')}
        details={t('questionnaire.q3.details')}
        warning={q3Empty ? t('questionnaire.q3.warning') : undefined}
      >
        <label className="opt">
          <input
            type="checkbox" checked={env}
            onChange={(e) => setEnv(e.target.checked)}
            aria-invalid={q3Empty}
          />
          <span className="opt-label">{t('questionnaire.q3.env')}</span>
        </label>
        <label className="opt">
          <input
            type="checkbox" checked={eco}
            onChange={(e) => setEco(e.target.checked)}
            aria-invalid={q3Empty}
          />
          <span className="opt-label">{t('questionnaire.q3.eco')}</span>
        </label>
        <label className="opt">
          <input
            type="checkbox" checked={soc}
            onChange={(e) => setSoc(e.target.checked)}
            aria-invalid={q3Empty}
          />
          <span className="opt-label">{t('questionnaire.q3.soc')}</span>
        </label>
      </QuestionCard>

      {/* Q4 */}
      <QuestionCard
        id="q4"
        title={t('questionnaire.q4.title')}
        help={t('questionnaire.q4.help')}
        plain={t('questionnaire.q4.plain')}
        details={t('questionnaire.q4.details')}
      >
        {Q4_KEYS.map((v) => {
          const warnKey = Q4_WARN_KEYS[v]
          return (
            <label key={v} className="opt">
              <input
                type="checkbox" checked={q4.has(v)}
                onChange={() => toggleQ4(v)}
              />
              <span className="opt-label">{t(`questionnaire.q4.options.${v}.label`)}</span>
              <span className="opt-desc">{t(`questionnaire.q4.options.${v}.description`)}</span>
              {warnKey && q4.has(v) ? (
                <span className="opt-warn">⚠ {t(warnKey)}</span>
              ) : null}
            </label>
          )
        })}
      </QuestionCard>

      {/* Q5 — flows table */}
      <QuestionCard
        id="q5"
        title={t('questionnaire.q5.title')}
        help={t('questionnaire.q5.help')}
        plain={t('questionnaire.q5.plain')}
        details={t('questionnaire.q5.details')}
      >
        <FlowsEditor flows={flows} onChange={setFlows} />
      </QuestionCard>

      {/* Q6a */}
      <QuestionCard
        id="q6a"
        title={t('questionnaire.q6a.title')}
        help={t('questionnaire.q6a.help')}
        plain={t('questionnaire.q6a.plain')}
        details={t('questionnaire.q6a.details')}
      >
        <select
          value={q6a ?? ''}
          onChange={(e) => setQ6a((e.target.value || undefined) as Q6a | undefined)}
          className="select"
        >
          <option value="">{t('common.notSet')}</option>
          {Q6A_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`questionnaire.q6a.options.${k}`)}
            </option>
          ))}
        </select>
      </QuestionCard>

      {/* Q6b */}
      <QuestionCard
        id="q6b"
        title={t('questionnaire.q6b.title')}
        plain={t('questionnaire.q6b.plain')}
        details={t('questionnaire.q6b.details')}
      >
        <select
          value={q6b ?? ''}
          onChange={(e) => setQ6b((e.target.value || undefined) as Q6b | undefined)}
          className="select"
        >
          <option value="">{t('common.notSet')}</option>
          {Q6B_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`questionnaire.q6b.options.${k}`)}
            </option>
          ))}
        </select>
      </QuestionCard>

      {/* Q7 */}
      <QuestionCard
        id="q7"
        title={t('questionnaire.q7.title')}
        help={t('questionnaire.q7.help')}
        plain={t('questionnaire.q7.plain')}
        details={t('questionnaire.q7.details')}
      >
        {Q7_KEYS.map((v) => (
          <label key={v} className="opt">
            <input
              type="radio" name="q7" value={v}
              checked={q7 === v} onChange={() => setQ7(v)}
            />
            <span className="opt-label">{t(`questionnaire.q7.options.${v}.label`)}</span>
            <span className="opt-desc">{t(`questionnaire.q7.options.${v}.description`)}</span>
          </label>
        ))}
        {/* Q7b — the market the reference (displaced) products come from (D4.1 §11.3.1) */}
        <p className="opt-label">{t('questionnaire.q7.market.label')}</p>
        <p className="opt-desc">{t('questionnaire.q7.market.help')}</p>
        <label className="qnum">
          <input
            type="text" name="q7-market-region" maxLength={120}
            className="qnum-input qtext-input" data-field="reference-market-region"
            aria-label={t('questionnaire.q7.market.region')}
            value={marketRegion}
            placeholder={t('questionnaire.q7.market.regionPlaceholder')}
            onChange={(e) => setMarketRegion(e.target.value)}
          />
        </label>
        {(['', ...MARKET_SCOPES] as const).map((k) => (
          <label key={k || 'unset'} className="opt opt-single">
            <input
              type="radio" name="q7-market-scope" value={k}
              checked={marketScope === k}
              onChange={() => setMarketScope(k)}
            />
            <span className="opt-label">{t(`questionnaire.q7.market.scope.${k || 'unset'}`)}</span>
          </label>
        ))}
      </QuestionCard>

      {/* Q8 — optional: one time horizon for LCA and LCC (operating year, analysis period, asset lifetime) */}
      <QuestionCard
        id="q8"
        title={t('questionnaire.q8.title')}
        help={t('questionnaire.q8.help')}
        plain={t('questionnaire.q8.plain')}
        details={t('questionnaire.q8.details')}
      >
        <p className="opt-label">{t('questionnaire.q8.start.label')}</p>
        {START_KEYS.map((k) => (
          <label key={k || 'unset'} className="opt opt-single">
            <input
              type="radio" name="q8-start" value={k}
              checked={operatingStart === k}
              onChange={() => setOperatingStart(k)}
            />
            <span className="opt-label">{t(`questionnaire.q8.start.options.${k || 'unset'}`)}</span>
          </label>
        ))}
        {operatingStart === 'future' && (
          <label className="qnum">
            <input
              type="number" min={1900} max={2200} step={1} inputMode="numeric"
              className="qnum-input" data-field="operating-start-year"
              value={startYear}
              placeholder={t('questionnaire.q8.start.yearPlaceholder')}
              onChange={(e) => setStartYear(e.target.value)}
            />
          </label>
        )}
        <p className="opt-label">{t('questionnaire.q8.period.label')}</p>
        <label className="qnum">
          <input
            type="number" min={0} step="any" inputMode="decimal"
            className="qnum-input" data-field="analysis-period"
            value={analysisPeriod}
            placeholder={t('questionnaire.q8.period.placeholder')}
            onChange={(e) => setAnalysisPeriod(e.target.value)}
          />
          <span className="qnum-unit">{t('questionnaire.q8.unit')}</span>
        </label>
        <p className="opt-label">{t('questionnaire.q8.lifetime.label')}</p>
        <label className="qnum">
          <input
            type="number" min={0} step="any" inputMode="decimal"
            className="qnum-input" data-field="asset-lifetime"
            value={assetLifetime}
            placeholder={t('questionnaire.q8.placeholder')}
            onChange={(e) => setAssetLifetime(e.target.value)}
          />
          <span className="qnum-unit">{t('questionnaire.q8.unit')}</span>
        </label>
      </QuestionCard>

      {/* Q9 — required: the ILCD situation follows the decision and its scale (D4.1 Table 1), not Q1 */}
      <QuestionCard
        id="q9"
        title={t('questionnaire.q9.title')}
        help={t('questionnaire.q9.help')}
        plain={t('questionnaire.q9.plain')}
        details={t('questionnaire.q9.details')}
      >
        {/* Radios, not a dropdown: the answers are sentences, and a native menu cuts them off. */}
        {DECISION_KEYS.map((k) => (
          <label key={k} className="opt opt-single">
            <input
              type="radio" name="q9" value={k}
              checked={decisionContext === k}
              aria-required="true"
              onChange={() => setDecisionContext(k)}
            />
            <span className="opt-label">{t(`questionnaire.q9.options.${k}`)}</span>
          </label>
        ))}
        {decisionContext === 'structural' && (
          <>
            <p className="opt-label">{t('questionnaire.q9.screening.label')}</p>
            {(['yes', 'no'] as const).map((k) => (
              <label key={k} className="opt opt-single">
                <input
                  type="radio" name="q9-screening" value={k}
                  checked={screening === k}
                  onChange={() => setScreening(k)}
                />
                <span className="opt-label">{t(`questionnaire.q9.screening.${k}`)}</span>
              </label>
            ))}
          </>
        )}
      </QuestionCard>

      {/* Q10 — required with the economic dimension: it decides the societal LCC (D4.2 §2.3) */}
      {eco ? (
        <QuestionCard
          id="q10"
          title={t('questionnaire.q10.title')}
          help={t('questionnaire.q10.help')}
          plain={t('questionnaire.q10.plain')}
          details={t('questionnaire.q10.details')}
        >
          {(['yes', 'no'] as const).map((k) => (
            <label key={k} className="opt opt-single">
              <input
                type="radio" name="q10" value={k}
                checked={policy === k}
                onChange={() => setPolicy(k)}
                aria-required="true"
              />
              <span className="opt-label">{t(`questionnaire.q10.options.${k}`)}</span>
            </label>
          ))}
        </QuestionCard>
      ) : null}

      {/* Q11 — optional: what the study compares sets the functional unit basis (D4.1 Part 2) */}
      <QuestionCard
        id="q11"
        title={t('questionnaire.q11.title')}
        help={t('questionnaire.q11.help')}
        plain={t('questionnaire.q11.plain')}
        details={t('questionnaire.q11.details')}
      >
        {(['', ...COMPARISON_KEYS] as const).map((k) => (
          <label key={k || 'unset'} className="opt opt-single">
            <input
              type="radio" name="q11" value={k}
              checked={comparisonGoal === k}
              onChange={() => setComparisonGoal(k)}
            />
            <span className="opt-label">
              {t(`questionnaire.q11.options.${k || 'unset'}`)}
            </span>
          </label>
        ))}
      </QuestionCard>

      {/* Q12 — optional, with LCA or LCC: new dedicated shared assets (D4.2 §4.2, D4.1 §6.3.3) */}
      {env || eco ? (
        <QuestionCard
          id="q12"
          title={t('questionnaire.q12.title')}
          help={t('questionnaire.q12.help')}
          plain={t('questionnaire.q12.plain')}
          details={t('questionnaire.q12.details')}
        >
          {(['', 'yes', 'no'] as const).map((k) => (
            <label key={k || 'unset'} className="opt opt-single">
              <input
                type="radio" name="q12" value={k}
                checked={sharedAssets === k}
                onChange={() => setSharedAssets(k)}
              />
              <span className="opt-label">{t(`questionnaire.q12.options.${k || 'unset'}`)}</span>
            </label>
          ))}
        </QuestionCard>
      ) : null}

      {/* Advanced */}
      <details className="advanced-card">
        <summary>
          <strong>{t('questionnaire.advancedCard.title')}</strong>
          <span className="muted">
            {' · '}
            {t('questionnaire.advancedCard.activeKeys', { count: Object.keys(advanced).length })}
          </span>
        </summary>
        <div className="advanced-card-body">
          <AdvancedEditor advanced={advanced} onChange={setAdvanced} />
        </div>
      </details>

      {/* Stated before the run, not after: the tool derives a
          methodological configuration, it does not compute the numbers, and a
          user who learns that from the empty result feels misled. */}
      <p className="questionnaire-scope-note">{t('questionnaire.scopeNote')}</p>

      <div className="run-bar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRun}
          disabled={!canRun}
        >
          {loading ? t('questionnaire.runningButton') : t('questionnaire.runButton')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          {t('questionnaire.resetButton')}
        </button>
        {!q1 ? (
          <span className="muted">{t('questionnaire.q1Required')}</span>
        ) : (
          <span className="muted run-tip">{t('questionnaire.shortcutTip')}</span>
        )}
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? <LoadingOverlay /> : null}
    </div>
  )
}
