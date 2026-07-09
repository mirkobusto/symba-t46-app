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
} from '../types/api'

const Q1_KEYS: Q1[] = ['A', 'B', 'C', 'D', 'E']
const Q2_KEYS: Q2[] = ['A', 'B', 'C', 'D']
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
const Q7_KEYS: Q7[] = ['A', 'B', 'C', 'D']

const Q4_WARN_KEYS: Partial<Record<Q4, string>> = {
  C: 'questionnaire.q4.options.C.warn',
  D: 'questionnaire.q4.options.D.warn',
}

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
  const [advanced, setAdvanced] = useState<Record<string, unknown>>(
    draft.advanced ?? {},
  )

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setQ1(draft.q1 ?? undefined)
    setQ2(draft.q2 ?? undefined)
    setEnv(draft.q3?.env ?? true)
    setEco(draft.q3?.eco ?? false)
    setSoc(draft.q3?.soc ?? false)
    setQ4(new Set(draft.q4 ?? []))
    setFlows(draft.flows ?? [])
    setScenarios(draft.alternative_scenarios ?? [])
    setQ6a(draft.q6a ?? undefined)
    setQ6b(draft.q6b ?? undefined)
    setQ7(draft.q7 ?? undefined)
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
  const canRun = !!q1 && !q3Empty && !loading

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
  }, [canRun, q1, q2, env, eco, soc, q4, flows, scenarios, q6a, q6b, q7, advanced])

  async function handleRun() {
    patchDraft({
      q1, q2,
      q3: { env, eco, soc },
      q4: Array.from(q4),
      q5: undefined,
      flows,
      alternative_scenarios: q2 === 'D' ? scenarios : [],
      q6a, q6b, q7,
      advanced,
    })
    const result = await runDraft()
    if (result) navigate('/result')
  }

  function handleReset() {
    if (window.confirm(t('questionnaire.confirmReset'))) {
      reset()
      setQ1(undefined); setQ2(undefined)
      setEnv(true); setEco(false); setSoc(false)
      setQ4(new Set()); setFlows([]); setScenarios([])
      setQ6a(undefined); setQ6b(undefined); setQ7(undefined)
      setAdvanced({})
    }
  }

  const mode = usePreferenceStore((s) => s.mode)

  return (
    <div className={`questionnaire questionnaire-mode-${mode}`}>
      <h1>{t('questionnaire.title')}</h1>
      <p className="muted">{t('questionnaire.intro')}</p>

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
      </QuestionCard>

      {/* Q2-D scenarios */}
      {q2 === 'D' ? (
        <QuestionCard
          id="q2d-scenarios"
          title={t('questionnaire.q2dCard.title')}
          help={t('questionnaire.q2dCard.help')}
        >
          <ScenariosEditor scenarios={scenarios} onChange={setScenarios} />
        </QuestionCard>
      ) : null}

      {/* Q3 */}
      <QuestionCard
        id="q3"
        title={t('questionnaire.q3.title')}
        help={t('questionnaire.q3.help')}
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
        details={t('questionnaire.q5.details')}
      >
        <FlowsEditor flows={flows} onChange={setFlows} />
      </QuestionCard>

      {/* Q6a */}
      <QuestionCard
        id="q6a"
        title={t('questionnaire.q6a.title')}
        help={t('questionnaire.q6a.help')}
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
      </QuestionCard>

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
