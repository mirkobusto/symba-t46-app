// Questionnaire page — i18n.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import AdvancedEditor from '../components/AdvancedEditor'
import { activeAdvancedCount, invalidAdvancedKeys } from '../components/advancedKeys'
import FlowsEditor from '../components/FlowsEditor'
import LoadingOverlay from '../components/LoadingOverlay'
import QuestionCard from '../components/QuestionCard'
import { QuestionStepContext } from '../components/questionStep'
import ScenariosEditor from '../components/ScenariosEditor'
import { isBlankDraft, registerDraftFlush, useCaseStore } from '../store/caseStore'
import { startNewAssessment } from '../store/signOut'
import { usePreferenceStore } from '../store/preferenceStore'
import type {
  AlternativeScenario,
  Case,
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
  StudyPurpose,
} from '../types/api'

const Q1_KEYS: Q1[] = ['A', 'B', 'C', 'D', 'E']
const Q2_KEYS: Q2[] = ['A', 'B']
const Q4_KEYS: Q4[] = ['A', 'B', 'C', 'D', 'E']
// '(none)' next to '(not set)' was two empty choices (UX round 2026-11-03)
const Q6A_KEYS: Q6a[] = [
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
const PURPOSES: StudyPurpose[] = ['analysis', 'improvement', 'expansion', 'design', 'restructuring']
const DECISION_KEYS: DecisionContext[] = ['micro', 'structural', 'none', 'corporate_report']
const COMPARISON_KEYS: ComparisonGoal[] = ['waste_treatment', 'product_substitution', 'co_primary']

const Q4_WARN_KEYS: Partial<Record<Q4, string>> = {
  C: 'questionnaire.q4.options.C.warn',
  D: 'questionnaire.q4.options.D.warn',
}

/** The bound the engine accepts (Case.analysis_period_years, le=500): not a
 * methodological limit, a typo guard. 0, negatives and 9999 went through
 * silently, to be dropped or refused by the engine (Kimi test 2026-11-04, A8-04). */
const MAX_YEARS = 500

/** Years as the API wants them: a number above 0, or null when empty/invalid. */
function parseYears(raw: string): number | null {
  const n = Number(raw.trim())
  return raw.trim() !== '' && Number.isFinite(n) && n > 0 && n <= MAX_YEARS ? n : null
}

/** A calendar year, or null when empty/invalid. */
function parseYear(raw: string): number | null {
  const n = Number(raw.trim())
  return raw.trim() !== '' && Number.isInteger(n) && n >= 1900 && n <= 2200 ? n : null
}

const START_KEYS = ['', 'now', 'future'] as const

// "Q9 — What is the study for…? *" → "What is the study for…?"
function cardTitle(title: string): string {
  return title.replace(/^Q\d+[ab]?\s+—\s+/, '').replace(/\s*\*$/, '')
}

export default function QuestionnairePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const draft = useCaseStore((s) => s.draft)
  const patchDraft = useCaseStore((s) => s.patchDraft)
  const runDraft = useCaseStore((s) => s.runDraft)
  const serverCaseName = useCaseStore((s) => s.serverCaseName)
  const serverCaseId = useCaseStore((s) => s.serverCaseId)
  const deletedCaseName = useCaseStore((s) => s.deletedCaseName)
  const loading = useCaseStore((s) => s.loading)
  const error = useCaseStore((s) => s.error)

  const [q1, setQ1] = useState<Q1 | undefined>(draft.q1 ?? undefined)
  const [purpose, setPurpose] = useState<StudyPurpose | ''>(draft.study_purpose ?? '')
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
  // one company's accounts (Situation C2): no counterfactual and no reference
  // market to ask, allocation and no substitution credits (D4.1 §7.2.3)
  const oneCompany = decisionContext === 'corporate_report'
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
  // scenarios whose JSON cannot be read: running would use their previous
  // changes as if they were the new ones (UX round 6, P7-05)
  const [invalidScenarios, setInvalidScenarios] = useState<string[]>([])

  // the reset the answers on screen come after (see the flush below): set in
  // the same render as the answers, so the two never disagree
  const [shownGeneration, setShownGeneration] = useState(() => useCaseStore.getState().generation)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setShownGeneration(useCaseStore.getState().generation)
    setQ1(draft.q1 ?? undefined)
    setPurpose(draft.study_purpose ?? '')
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
  const flowsWithoutQ5 = flows.some((f) => !f.q5)
  // Q8 is optional, but what is typed in it must be a number of years
  const q8Invalid = [analysisPeriod, assetLifetime].some((v) => v.trim() !== '' && parseYears(v) === null)
    || (operatingStart === 'future' && startYear.trim() !== '' && parseYear(startYear) === null)
  // what still blocks the run, in page order, named by the card title (the
  // step number on screen is a CSS counter, the Q code alone meant nothing to
  // a newcomer, and "Q1 is required" stayed silent about Q9 and Q10)
  const mode = usePreferenceStore((s) => s.mode)
  const missing: { id: string; label: string }[] = [
    ...(!q1 ? [{ id: 'q1', label: cardTitle(t('questionnaire.q1.title')) }] : []),
    ...(q3Empty ? [{ id: 'q3', label: cardTitle(t('questionnaire.q3.title')) }] : []),
    ...(decisionContext === '' ? [{ id: 'q9', label: cardTitle(t('questionnaire.q9.title')) }] : []),
    ...(eco && policy === '' ? [{ id: 'q10', label: cardTitle(t('questionnaire.q10.title')) }] : []),
    ...(flowsWithoutQ5 ? [{ id: 'q5', label: t('questionnaire.flowsMissingQ5') }] : []),
    ...(q8Invalid ? [{ id: 'q8', label: `${cardTitle(t('questionnaire.q8.title'))} (${t('questionnaire.q8.invalidShort')})` }] : []),
    // a value the engine cannot read was dropped in silence (UX round 6, P7-13)
    ...(mode !== 'guided' && invalidAdvancedKeys(advanced).length > 0
      ? [{ id: 'advanced', label: t('questionnaire.advancedCard.invalid') }] : []),
    ...(invalidScenarios.length > 0
      ? [{ id: 'q2d-scenarios', label: t('scenarios.invalidJson', { names: invalidScenarios.join(', ') }) }]
      : []),
  ]
  const canRun = missing.length === 0 && !loading

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
  }, [canRun, purpose, q1, q2, longStanding, env, eco, soc, q4, flows, scenarios, q6a, q6b, q7, marketRegion, marketScope, operatingStart, startYear, analysisPeriod, assetLifetime, decisionContext, screening, policy, comparisonGoal, sharedAssets, advanced])

  // the answers as a draft patch: written on run, and also when the page is
  // left or reloaded, so nothing typed is lost before the first run
  function buildPatch(): Partial<Case> {
    return {
      study_purpose: purpose || null,
      q1, q2,
      network_long_standing: q2 === 'A' && !oneCompany && longStanding !== '' ? longStanding === 'yes' : null,
      q3: { env, eco, soc },
      q4: Array.from(q4),
      q5: undefined,
      flows,
      alternative_scenarios: scenarios,
      q6a, q6b, q7,
      reference_market_region: oneCompany ? null : marketRegion.trim() || null,
      reference_market_scope: oneCompany ? null : marketScope || null,
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
    }
  }
  const buildPatchRef = useRef(buildPatch)
  const generationRef = useRef(shownGeneration)
  useEffect(() => {
    buildPatchRef.current = buildPatch
    generationRef.current = shownGeneration
  })
  // Whoever asks whether work would be lost (sign out, new assessment) first
  // has the answers on screen written to the draft (UX round 6, P7-03). After
  // a reset the answers on screen are from before it: leaving the page must
  // not write them back, or a signed-out user's case came back (A1-01).
  useEffect(() => {
    const save = () => {
      if (useCaseStore.getState().generation !== generationRef.current) return
      patchDraft(buildPatchRef.current())
    }
    const unregister = registerDraftFlush(save)
    window.addEventListener('beforeunload', save)
    return () => {
      unregister()
      window.removeEventListener('beforeunload', save)
      save()
    }
  }, [patchDraft])

  // the ILCD situation codes ("(Situation A)") meant nothing to a newcomer in
  // guided mode, where the examples say the same in words (UX round 5, P4-13)
  // Only the code goes: "(Situation B; the screening must be documented)" keeps
  // the obligation (Fable review of #212)
  // the option letters ("B. Regional") pointed nowhere in guided mode, where the
  // texts name the options in words (UX round 6, P4-17)
  const optionLabel = (key: string) => {
    const text = t(key)
    return mode === 'guided' ? text.replace(/^[A-E]\.\s+/, '') : text
  }
  const plainSituation = (text: string) => {
    if (mode !== 'guided') return text
    return text
      .replace(/\s*\((?:ILCD\s+)?situa\S*\s+[A-C]\d?(?:,[^()]*)?\)\s*$/i, '')
      .replace(/\((?:ILCD\s+)?situa\S*\s+[A-C]\d?\s*;\s*/i, '(')
  }

  async function handleRun() {
    patchDraft(buildPatch())
    const result = await runDraft()
    if (result) navigate('/result')
  }

  // the same action as "Start a new assessment" everywhere: it asks only when
  // something would be lost, and says what stays (UX round 6, P7-21)
  async function handleReset() {
    if (await startNewAssessment()) {
      setPurpose('')
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


  // Guided mode runs one question at a time (UX round 2026-11-02: a single
  // page of ~8,300 px wore out the plant manager). The steps are read off the
  // cards actually on the page, in page order, so the cards that appear on an
  // answer (Q10 with costs, Q12 with LCA or LCC) join the sequence by
  // themselves.
  const [allOnOnePage, setAllOnOnePage] = useState(false)
  const stepper = mode === 'guided' && !allOnOnePage
  const pageRef = useRef<HTMLDivElement>(null)
  const [steps, setSteps] = useState<{ id: string; part: string }[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  /* eslint-disable react-hooks/set-state-in-effect */
  // after every render on purpose: any answer can add or remove a card; the
  // comparison below stops the loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const root = pageRef.current
    if (!root) return
    const found: { id: string; part: string }[] = []
    let part = ''
    root.querySelectorAll('h2.qpart-title, section.qcard').forEach((el) => {
      if (el.tagName === 'H2') part = el.textContent ?? ''
      else if (el.id) found.push({ id: el.id, part })
    })
    const same = found.length === steps.length && found.every((s, i) => s.id === steps[i].id)
    if (!same) setSteps(found)
  })
  /* eslint-enable react-hooks/set-state-in-effect */
  const current = steps[Math.min(stepIndex, Math.max(steps.length - 1, 0))]

  function goToStep(index: number) {
    const next = Math.max(0, Math.min(index, steps.length - 1))
    setStepIndex(next)
    // after "Next" the question sat below the fold, under the banners (P3-15, P7-11)
    if (next === 0) window.scrollTo(0, 0)
    else window.requestAnimationFrame(() =>
      document.getElementById(steps[next].id)?.scrollIntoView({ block: 'start' }))
  }
  // a "still to answer" link: the step in guided mode, the card otherwise
  function goToMissing(id: string) {
    const at = steps.findIndex((st) => st.id === id)
    if (stepper && at >= 0) goToStep(at)
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // the intro banner and the scope note are said once, on the first question
  const firstStep = !stepper || stepIndex === 0

  // warn while typing, as the engine decides (activate.horizon_exceeds_threshold, D4.2 §9.3)
  const horizonThreshold = Number(advanced['future_background_threshold_years']) || 15
  const horizonOver = [analysisPeriod, assetLifetime]
    .some((v) => v.trim() !== '' && Number(v) > horizonThreshold)

  return (
    <div
      ref={pageRef}
      className={`dd-page questionnaire questionnaire-steps questionnaire-mode-${mode}${stepper ? ' questionnaire-stepper' : ''}`}
    >
      <div className="dd-page-head">
        <div>
          <h1 className="dd-page-title">{t('questionnaire.title')}</h1>
          <p className="dd-page-sub">
            {mode === 'guided' ? t('questionnaire.introPlain') : t('questionnaire.intro')}
          </p>
          {/* the published examples sat only on Home, which the reviewer
              found by chance (UX round 2026-11-02) */}
          <p className="dd-page-sub">
            <Link to="/#presets">{t('questionnaire.examplesLink')}</Link>
          </p>
        </div>
      </div>

      {/* which case these answers are: "New assessment" in the menu reopened
          the previous case without saying so (UX round 6, P6-14) */}
      {serverCaseId || deletedCaseName !== null || !isBlankDraft({ ...draft, ...buildPatch() }) ? (
        <p className="questionnaire-editing" role="status">
          {serverCaseId
            ? t('questionnaire.editing.saved', { name: serverCaseName ?? '' })
            : deletedCaseName !== null
              ? t('cases.deletedOpen', { name: deletedCaseName, button: t('cases.saveFirstButton') })
              : t('questionnaire.editing.notSaved')}{' '}
          <button type="button" className="btn btn-secondary" onClick={() => void handleReset()}>
            {t('questionnaire.resetButton')}
          </button>
        </p>
      ) : null}

      {mode === 'guided' && firstStep ? (
        <div className="guided-banner" role="note">
          <strong>{t('questionnaire.guidedBannerTitle')}</strong>
          <p>{t('questionnaire.guidedBannerBody')}</p>
        </div>
      ) : null}

      {mode === 'guided' ? (
        <p className="stepper-toggle">
          <button type="button" className="btn-link" onClick={() => setAllOnOnePage(!allOnOnePage)}>
            {allOnOnePage ? t('questionnaire.stepper.showSteps') : t('questionnaire.stepper.showAll')}
          </button>
        </p>
      ) : null}

      <QuestionStepContext.Provider value={stepper && current ? current.id : null}>
        <h2 className="qpart-title" id="qpart-study">{t('questionnaire.parts.study')}</h2>

        {/* Q0 — optional: purpose of the study (D4.1 §4.3.2); it derives nothing */}
        <QuestionCard
          id="q0"
          title={t('questionnaire.q0.title')}
          help={t('questionnaire.q0.help')}
          plain={t('questionnaire.q0.plain')}
          details={t('questionnaire.q0.details')}
        >
          {(['', ...PURPOSES] as const).map((k) => (
            <label key={k || 'unset'} className="opt">
              <input
                type="radio" name="q0" value={k}
                checked={purpose === k}
                onChange={() => setPurpose(k)}
              />
              <span className="opt-label">{t(`questionnaire.q0.options.${k || 'unset'}.label`)}</span>
              {k ? <span className="opt-desc">{t(`questionnaire.q0.options.${k}.description`)}</span> : null}
            </label>
          ))}
        </QuestionCard>

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
              <span className="opt-label">{optionLabel(`questionnaire.q1.options.${v}.label`)}</span>
              <span className="opt-desc">{t(`questionnaire.q1.options.${v}.description`)}</span>
            </label>
          ))}
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
              <span className="opt-label">{(mode === 'guided' && t(`questionnaire.q9.optionsPlain.${k}`, { defaultValue: '' }))
                || plainSituation(t(`questionnaire.q9.options.${k}`))}</span>
              {/* Q9 is where newcomers gave up: an example per answer */}
              {mode === 'guided' ? (
                <span className="opt-desc">{t(`questionnaire.q9.examples.${k}`)}</span>
              ) : null}
            </label>
          ))}
          {decisionContext === 'structural' && (
            <>
              <p className="opt-label">{t(mode === 'guided' ? 'questionnaire.q9.screening.labelPlain' : 'questionnaire.q9.screening.label')}</p>
              {(['yes', 'no'] as const).map((k) => (
                <label key={k} className="opt opt-single">
                  <input
                    type="radio" name="q9-screening" value={k}
                    checked={screening === k}
                    onChange={() => setScreening(k)}
                  />
                  <span className="opt-label">{plainSituation(t(`questionnaire.q9.screening.${k}`))}</span>
                </label>
              ))}
            </>
          )}
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
              <span className="opt-label">{optionLabel(`questionnaire.q2.options.${v}.label`)}</span>
              <span className="opt-desc">{t(`questionnaire.q2.options.${v}.description`)}</span>
            </label>
          ))}
          {q2 === 'A' && !oneCompany && (
            <>
              <p className="opt-label">{t('questionnaire.q2.longStanding.label')}</p>
              {/* "I don't know" leaves it unanswered: the plain HNSRS reference */}
              {(['yes', 'no', 'unknown'] as const).map((k) => (
                <label key={k} className="opt opt-single">
                  <input
                    type="radio" name="q2-long-standing" value={k}
                    checked={longStanding === (k === 'unknown' ? '' : k)}
                    onChange={() => setLongStanding(k === 'unknown' ? '' : k)}
                  />
                  <span className="opt-label">{t(`questionnaire.q2.longStanding.${k}`)}</span>
                </label>
              ))}
            </>
          )}
        </QuestionCard>

        {/* Q8 — optional: one time horizon for LCA and LCC (operating year, analysis period, asset lifetime) */}
        <QuestionCard
          id="q8"
          title={t('questionnaire.q8.title')}
          help={t('questionnaire.q8.help')}
          plain={t('questionnaire.q8.plain')}
          details={t('questionnaire.q8.details')}
          warning={q8Invalid ? t('questionnaire.q8.invalid', { max: MAX_YEARS })
            : horizonOver ? t('questionnaire.q8.horizonWarning', { threshold: horizonThreshold }) : undefined}
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
              type="number" min={0} max={MAX_YEARS} step="any" inputMode="decimal"
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
              type="number" min={0} max={MAX_YEARS} step="any" inputMode="decimal"
              className="qnum-input" data-field="asset-lifetime"
              value={assetLifetime}
              placeholder={t('questionnaire.q8.placeholder')}
              onChange={(e) => setAssetLifetime(e.target.value)}
            />
            <span className="qnum-unit">{t('questionnaire.q8.unit')}</span>
          </label>
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
            aria-labelledby="q6b-title"
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
                <span className="opt-label">{optionLabel(`questionnaire.q4.options.${v}.label`)}</span>
                <span className="opt-desc">{t(`questionnaire.q4.options.${v}.description`)}</span>
                {warnKey && q4.has(v) ? (
                  <span className="opt-warn">⚠ {t(mode === 'guided' ? `${warnKey}Plain` : warnKey)}</span>
                ) : null}
              </label>
            )
          })}
        </QuestionCard>

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

        <h2 className="qpart-title" id="qpart-exchanges">{t('questionnaire.parts.exchanges')}</h2>

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
              <span className="opt-label">{optionLabel(`questionnaire.q7.options.${v}.label`)}</span>
              <span className="opt-desc">{t(`questionnaire.q7.options.${v}.description`)}</span>
            </label>
          ))}
          {/* Q7b — the market the reference (displaced) products come from (D4.1 §11.3.1);
              not asked for one company's accounts (C2) */}
          {!oneCompany && (
            <>
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
            </>
          )}
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

        <h2 className="qpart-title" id="qpart-description">{t('questionnaire.parts.description')}</h2>


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
            aria-labelledby="q6a-title"
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

        {/* Alternative scenarios (D4.1 §4.3.3) and the expert overrides are
            written as JSON keys: analyst tools, out of guided mode */}
        {mode !== 'guided' ? (
          <QuestionCard
            id="q2d-scenarios"
            title={t('questionnaire.q2dCard.title')}
            help={t('questionnaire.q2dCard.help')}
          >
            <ScenariosEditor
              scenarios={scenarios} onChange={setScenarios} baseline={buildPatch()}
              onInvalidChange={setInvalidScenarios}
            />
          </QuestionCard>
        ) : null}

        {/* Advanced */}
        {mode !== 'guided' ? (
          <details className="advanced-card" id="advanced">
            <summary>
              <strong>{t('questionnaire.advancedCard.title')}</strong>
              <span className="muted">
                {' · '}
                {t('questionnaire.advancedCard.activeKeys', { count: activeAdvancedCount(advanced) })}
              </span>
            </summary>
            <div className="advanced-card-body">
              <AdvancedEditor advanced={advanced} onChange={setAdvanced} />
            </div>
          </details>
        ) : null}

        {/* Stated before the run, not after: the tool derives a
            methodological configuration, it does not compute the numbers, and a
            user who learns that from the empty result feels misled. */}
      </QuestionStepContext.Provider>

      {stepper && current ? (
        <nav className="stepper-nav" aria-label={t('questionnaire.stepper.navLabel')}>
          <button
            type="button" className="btn btn-secondary"
            onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0}
          >
            {t('questionnaire.stepper.back')}
          </button>
          <span className="stepper-progress" title={t('questionnaire.stepper.totalChanges')}>
            {t('questionnaire.stepper.progress', {
              n: Math.min(stepIndex, steps.length - 1) + 1, total: steps.length, part: current.part,
            })}
            <small className="stepper-total-note"> · {t('questionnaire.stepper.totalChanges')}</small>
          </span>
          <button
            type="button" className="btn btn-primary"
            onClick={() => goToStep(stepIndex + 1)} disabled={stepIndex >= steps.length - 1}
          >
            {t('questionnaire.stepper.next')}
          </button>
        </nav>
      ) : null}

      {firstStep ? (
        <p className="questionnaire-scope-note">
          {t(mode === 'guided' ? 'questionnaire.scopeNotePlain' : 'questionnaire.scopeNote')}
        </p>
      ) : null}

      <div className="run-bar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRun}
          disabled={!canRun}
        >
          {loading ? t('questionnaire.runningButton') : t('questionnaire.runButton')}
        </button>
        {missing.length > 0 ? (
          <span className="muted run-missing">
            <span className="run-missing-list">
              {t('questionnaire.stillRequired')}{' '}
              {missing.map((m, i) => (
                <span key={m.id}>
                  {i > 0 ? ' · ' : null}
                  <a href={`#${m.id}`} onClick={(e) => { e.preventDefault(); goToMissing(m.id) }}>
                    {m.label}
                  </a>
                </span>
              ))}
            </span>
            {/* phone only (CSS): the list of titles took three lines of a
                fixed bar and covered the answers (UX round 6, P4-02); a
                count and one link to the first open question instead */}
            <span className="run-missing-count">
              {t('questionnaire.stillRequired')} {missing.length} ·{' '}
              <a href={`#${missing[0].id}`} onClick={(e) => { e.preventDefault(); goToMissing(missing[0].id) }}>
                {t('questionnaire.goToFirstMissing')}
              </a>
            </span>
          </span>
        ) : (
          <span className="muted run-tip">{t('questionnaire.shortcutTip')}</span>
        )}
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? <LoadingOverlay /> : null}
    </div>
  )
}
