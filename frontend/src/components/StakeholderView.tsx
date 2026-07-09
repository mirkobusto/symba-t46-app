// StakeholderView — renders the scoring/case data filtered and framed
// for one of the 4 stakeholder types declared in the SYMBA T4.6 GA
// mandate: industry, community, authority, end-user.
//
// All four views share the same underlying data; what differs is
// (a) the highlighted indicators (filtered by dimension / id),
// (b) the framing text,
// (c) the calls-to-action.
//
// When `scoring` is null the CIRCE payload has not been ingested yet;
// each view shows a placeholder banner saying so.

import { useTranslation } from 'react-i18next'

import type { Case } from '../types/api'
import type { Dimension, ScoringIndicator, ScoringPayload } from '../types/scoring'

export type StakeholderType = 'industry' | 'community' | 'authority' | 'end-user'

interface Props {
  stakeholderType: StakeholderType
  caseData: Case
  scoring: ScoringPayload | null
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

  return (
    <div className="stakeholder-view">
      <p className="stakeholder-framing">{t(`stakeholder.framing.${stakeholderType}`)}</p>

      <section className="stakeholder-section">
        <h3>{t('stakeholder.pathwaySummaryTitle')}</h3>
        <dl className="stakeholder-dl">
          <dt>{t('stakeholder.labels.pathway')}</dt>
          <dd>{caseData.pathway_id ?? '—'}</dd>
          <dt>{t('stakeholder.labels.ilcd')}</dt>
          <dd>{caseData.ilcd_situation ?? '—'}</dd>
          <dt>{t('stakeholder.labels.lcc')}</dt>
          <dd>{caseData.lcc_type ?? '—'}</dd>
          <dt>{t('stakeholder.labels.slca')}</dt>
          <dd>{caseData.slca_activation_state ?? '—'}</dd>
        </dl>
      </section>

      <section className="stakeholder-section">
        <h3>{t('stakeholder.scoringTitle')}</h3>
        {scoring === null ? (
          <div className="stakeholder-scoring-placeholder">
            <strong>{t('stakeholder.scoringPendingTitle')}</strong>
            <p>{t('stakeholder.scoringPendingBody')}</p>
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
              {t('stakeholder.ruleViolations', {
                count: caseData.rule_violations?.length ?? 0,
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
