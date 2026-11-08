import { useTranslation } from 'react-i18next'

// Labels for the breakdown keys of the dashboards (regional and public region).
// The tables printed raw keys ("agriculture_agrifood_biorefineries", "B",
// "ILCD Situation A"); they now use the labels of the questionnaire and the
// result (UX round 2026-11-03, P4-04, P5-09).
export type Axis = 'ilcd' | 'lcc' | 'sector' | 'scope'

/** The key a breakdown gives to cases without a value. */
export function isNoneKey(key: string): boolean {
  return key === '(none)' || key === '' || key === 'none'
}

/** A breakdown split into the values given and the cases without one: "not
 * answered" read as the most common value on both dashboards (UX round 6,
 * P7-23), so it is shown apart and never ranked. */
export function splitNone<E extends { key: string; count: number }>(entries: E[]): { given: E[]; none: number } {
  return {
    given: entries.filter((e) => !isNoneKey(e.key)),
    none: entries.filter((e) => isNoneKey(e.key)).reduce((n, e) => n + e.count, 0),
  }
}

export function useAxisLabel() {
  const { t } = useTranslation()
  return (axis: Axis, key: string): string => {
    if (isNoneKey(key)) {
      // a case without an ILCD situation is a costing-only study, not an unanswered question
      if (axis === 'ilcd') return t('aggregate.noLca')
      if (axis === 'sector') return t('aggregate.noSector')
      return t('aggregate.noneKey')
    }
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
