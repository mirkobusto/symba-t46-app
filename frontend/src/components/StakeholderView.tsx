// StakeholderView — renders the scoring/case data filtered and framed
// for one of the 4 stakeholder types declared in the SYMBA T4.6 GA
// mandate: industry, community, authority, end-user.
//
// All four views share the same underlying data; what differs is
// (a) the highlighted indicators (filtered by dimension / id),
// (b) the framing text,
// (c) which parts of the verdict are shown,
// (d) what each audience is told it is looking at today and what will
//     appear once the scoring arrives.
//
// (d) exists because without the CIRCE payload — the normal state — the
// community and end-user views used to be byte-identical to each other,
// and the community tab promised "local impacts" while showing pathway
// codes. Four audiences are named in the Grant Agreement, so they stay
// four; what they say now has to differ on the data we actually hold.
//
// When `scoring` is null the CIRCE payload has not been ingested yet —
// which is the normal state today. The views used to degrade to the same
// table of codes for everyone, so a community representative and an
// industrial operator read an identical screen. They now show the
// verdict in words, restricted to the axes that audience is there for,
// and say plainly when a dimension the audience cares about is not being
// assessed at all.

import { useTranslation } from 'react-i18next'

import ConfigurationSummary from './ConfigurationSummary'
import { AUDIENCE_ROWS } from '../pages/configurationRows'
import { verdictFor, type VerdictDetail } from '../pages/resultNarrative'
import type { Case } from '../types/api'
import type { Dimension, ScoringIndicator, ScoringPayload } from '../types/scoring'

export type StakeholderType = 'industry' | 'community' | 'authority' | 'end-user'

interface Props {
  stakeholderType: StakeholderType
  caseData: Case
  scoring: ScoringPayload | null
}

/** Which axes of the verdict each audience is shown. */
const AXIS_FILTER: Record<StakeholderType, VerdictDetail['section'][]> = {
  industry: ['ilcd', 'lcc'],
  community: ['ilcd', 'slca'],
  authority: ['ilcd', 'lcc', 'slca'],
  'end-user': ['ilcd', 'slca'],
}

const DIMENSION_FILTER: Record<StakeholderType, Dimension[]> = {
  industry: ['env', 'eco', 'soc'],
  community: ['env', 'soc'],
  authority: ['env', 'eco', 'soc'],
  'end-user': ['env', 'soc'],
}

function filterIndicators(
  indicators: ScoringIndicator[],
  dimensions: Dimension[],
): ScoringIndicator[] {
  return indicators.filter((i) => dimensions.includes(i.dimension))
}

function IndicatorCard({ indicator }: { indicator: ScoringIndicator }) {
  const { t } = useTranslation()
  return (
    <div className={`stakeholder-indicator stakeholder-indicator-${indicator.dimension}`}>
      <div className="stakeholder-indicator-label">{indicator.label_en}</div>
      <div className="stakeholder-indicator-value">
        {indicator.value !== null ? indicator.value : t('stakeholder.indicatorPending')}
        {indicator.unit ? <span className="stakeholder-indicator-unit"> {indicator.unit}</span> : null}
      </div>
      {indicator.interpretation_en ? (
        <div className="stakeholder-indicator-interpretation">{indicator.interpretation_en}</div>
      ) : null}
    </div>
  )
}

export default function StakeholderView({ stakeholderType, caseData, scoring }: Props) {
  const { t } = useTranslation()

  const dimensions = DIMENSION_FILTER[stakeholderType]
  const filteredIndicators = scoring ? filterIndicators(scoring.indicators, dimensions) : []

  const verdict = verdictFor(caseData, (key, fallback) =>
    t(key, { defaultValue: fallback ?? '' }),
  )
  const axes = AXIS_FILTER[stakeholderType]
  // "Not assessed" is news for the audience that came for that dimension.
  // the slca row says it where the audience has it; the paragraph is for the others
  const socialOff = axes.includes('slca') && caseData.slca_activation_state === 'deactivated'
    && !AUDIENCE_ROWS[stakeholderType].includes('slca')
  const environmentalOff = !caseData.q3?.env
  const economicOff =
    axes.includes('lcc') && caseData.lcc_type === 'deactivated'

  // Codes are traceability for whoever checks the method; for a resident
  // or a consumer they are noise.
  const showCodes = stakeholderType === 'industry' || stakeholderType === 'authority'

  return (
    <div className="stakeholder-view">
      <p className="stakeholder-framing">{t(`stakeholder.framing.${stakeholderType}`)}</p>

      <p className="stakeholder-what-you-see">
        {t(`stakeholder.audience.${stakeholderType}.whatYouSee`)}
      </p>

      <section className="stakeholder-section">
        <h3>{t('stakeholder.verdictTitle')}</h3>
        {verdict ? (
          <>
            <p className="stakeholder-verdict-title">{verdict.title}</p>
            <p className="stakeholder-verdict-body">{verdict.body}</p>
            {(caseData.blocked_by ?? []).length === 0 ? (
              <ConfigurationSummary
                kase={caseData}
                only={AUDIENCE_ROWS[stakeholderType]}
                showNodeText={false}
                showWhy={false}
                headingLevel="h4"
                title={t('stakeholder.configTitle')}
              />
            ) : null}
          </>
        ) : (
          <p className="muted">{t('stakeholder.noVerdict')}</p>
        )}

        {environmentalOff ? (
          <p className="stakeholder-not-assessed">
            {t('stakeholder.notAssessed.environmental')}
          </p>
        ) : null}
        {socialOff ? (
          <p className="stakeholder-not-assessed">
            {t('stakeholder.notAssessed.social')}
          </p>
        ) : null}
        {economicOff ? (
          <p className="stakeholder-not-assessed">
            {t('stakeholder.notAssessed.economic')}
          </p>
        ) : null}

        {caseData.flows?.length ? (
          <p className="stakeholder-flows">
            {t('stakeholder.flowsLine', {
              count: caseData.flows.length,
              names: caseData.flows.map((f) => f.name).join(', '),
            })}
          </p>
        ) : null}

        {stakeholderType === 'end-user' ? (
          <p className="stakeholder-not-assessed">
            {t('stakeholder.audience.end-user.productCaveat')}
          </p>
        ) : null}

        {stakeholderType === 'authority' && caseData.q7 ? (
          <p className="stakeholder-flows">
            {t('stakeholder.audience.authority.scope', {
              scope: t(`questionnaire.q7.options.${caseData.q7}.description`, {
                defaultValue: caseData.q7,
              }),
            })}
          </p>
        ) : null}

        {showCodes ? (
          <p className="stakeholder-codes">
            {[caseData.ilcd_situation, caseData.lcc_type]
              .filter(Boolean)
              .join(' · ')}
          </p>
        ) : null}
      </section>

      <section className="stakeholder-section">
        <h3>{t('stakeholder.scoringTitle')}</h3>
        {scoring === null ? (
          <div className="stakeholder-scoring-placeholder">
            <strong>{t('stakeholder.scoringPendingTitle')}</strong>
            <p>{t(`stakeholder.audience.${stakeholderType}.whenScoring`)}</p>
          </div>
        ) : filteredIndicators.length === 0 ? (
          <p className="muted">{t('stakeholder.scoringEmpty')}</p>
        ) : (
          <div className="stakeholder-indicators-grid">
            {filteredIndicators.map((ind) => (
              <IndicatorCard key={ind.id} indicator={ind} />
            ))}
          </div>
        )}
      </section>

      {stakeholderType === 'industry' ? (
        <section className="stakeholder-section">
          <h3>{t('stakeholder.engineDetailsTitle')}</h3>
          <ul className="stakeholder-ul">
            <li>
              {t('stakeholder.activatedNodesCount', {
                count: caseData.activated_nodes?.length ?? 0,
              })}
            </li>
            <li>
              {/* Obligations, not violations: telling a local community it
                  is looking at "4 rule violations" reads as an accusation,
                  and nothing has been violated. */}
              {t('stakeholder.obligations', {
                count: caseData.applicable_rules?.length ?? 0,
              })}
            </li>
            <li>
              {t('stakeholder.cdpFlagsCount', {
                count: caseData.cdp_flags?.length ?? 0,
              })}
            </li>
          </ul>
        </section>
      ) : null}

      {stakeholderType === 'authority' ? (
        <section className="stakeholder-section">
          <h3>{t('stakeholder.complianceTitle')}</h3>
          <ul className="stakeholder-ul">
            <li>
              {t('stakeholder.compliance.peerReview', {
                status:
                  caseData.q4?.includes('E')
                    ? t('common.yes')
                    : t('common.no'),
              })}
            </li>
            <li>
              {t('stakeholder.compliance.pef', {
                status:
                  caseData.q4?.includes('D')
                    ? t('common.yes')
                    : t('common.no'),
              })}
            </li>
            <li>
              {t('stakeholder.compliance.publicClaim', {
                status:
                  caseData.q4?.includes('C')
                    ? t('common.yes')
                    : t('common.no'),
              })}
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  )
}
