import { useTranslation } from 'react-i18next'

// Labels for the breakdown keys of the dashboards (regional and public region).
// The tables printed raw keys ("agriculture_agrifood_biorefineries", "B",
// "ILCD Situation A"); they now use the labels of the questionnaire and the
// result (UX round 2026-11-03, P4-04, P5-09).
export type Axis = 'ilcd' | 'lcc' | 'sector' | 'scope'

export function useAxisLabel() {
  const { t } = useTranslation()
  return (axis: Axis, key: string): string => {
    if (key === '(none)' || key === '' || key === 'none') return t('aggregate.noneKey')
    switch (axis) {
      case 'ilcd':
        return t(`result.situationBadge.${key.replace('ILCD Situation ', '')}`, { defaultValue: key })
      case 'lcc':
        return key === 'deactivated' ? t('aggregate.noCosting') : t(`result.lccBadge.${key}`, { defaultValue: key })
      case 'sector':
        return t(`questionnaire.q6a.options.${key}`, { defaultValue: key })
      case 'scope':
        return t(`questionnaire.q7.options.${key}.label`, { defaultValue: key })
    }
  }
}
