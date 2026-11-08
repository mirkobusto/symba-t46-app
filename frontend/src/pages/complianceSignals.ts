// The compliance signals of a case, one source for the in-app Authority tab
// and the public Authority view (UX round 6, P3-07: the in-app tab showed three
// bare signals with Q codes, the public page five explained ones).
//
// Its own module because a page may only export components (eslint
// react-refresh/only-export-components), and configurationRows reads the
// review outcome from here too.

import type { Case } from '../types/api'
import type { ComplianceStatus } from '../components/dd/ComplianceChecklist'

type Translate = (key: string, options?: Record<string, unknown>) => string

export interface ComplianceSignal {
  key: string
  name: string
  desc: string
  status: ComplianceStatus
  label?: string
}

/** Who checks the study, from Q4 alone: a public comparative assertion (C)
 *  and EU policy alignment (D, a T4.6 choice in lca_mc_36) call for a panel
 *  of at least three independent experts; an academic publication (E) for a
 *  journal's peer review (decided by Fable, UX round 6, P5-02). */
export function reviewOf(kase: Pick<Case, 'q4'>): 'panel' | 'journal' | 'none' {
  const q4 = kase.q4 ?? []
  if (q4.includes('C') || q4.includes('D')) return 'panel'
  if (q4.includes('E')) return 'journal'
  return 'none'
}

export function complianceSignals(c: Case, t: Translate): ComplianceSignal[] {
  const q4 = c.q4 ?? []
  const c2 = c.ilcd_situation === 'ILCD Situation C2'
  const review = reviewOf(c)
  const eco = !!c.q3?.eco
  const societal = eco && (c.lcc_type ?? '').includes('S')
  // P4-10: "No: …" in the text and "not declared" on the badge. A case saved
  // before Q10 was required says nothing either way: that one is undeclared.
  const slcc = !eco ? 'off' : c2 ? 'c2' : societal ? 'yes'
    : c.policy_objective == null ? 'undeclared' : 'no'
  return [
    {
      key: 'review',
      name: t('reader.compliance.review.name'),
      desc: t(`reader.compliance.review.${review}`),
      status: review === 'none' ? 'no' : 'ok',
      label: t(`reader.compliance.review.badge.${review}`),
    },
    {
      key: 'pef',
      name: t('reader.compliance.pef.name'),
      // one company's accounts (C2) use allocation, not the CFF (D4.1 §7.2.3);
      // in B the CFF is a sensitivity of the consequential model (decided 2026-11-03)
      desc: t(q4.includes('D') && c2 ? 'reader.compliance.pef.descC2'
        : q4.includes('D') && c.ilcd_situation === 'ILCD Situation B'
          ? 'reader.compliance.pef.descB' : 'reader.compliance.pef.desc'),
      status: q4.includes('D') && !c2 ? 'ok' : 'no',
      label: q4.includes('D') && !c2 ? undefined : t('reader.compliance.notPlanned'),
    },
    {
      key: 'public',
      name: t('reader.compliance.public.name'),
      desc: t('reader.compliance.public.desc'),
      status: q4.includes('C') ? 'ok' : 'no',
      label: q4.includes('C') ? undefined : t('reader.compliance.notPlanned'),
    },
    {
      // whether the costing takes society's view a public decision needs (D4.2 §2.3)
      key: 'slcc',
      name: t('reader.compliance.slcc.name'),
      desc: t(`reader.compliance.slcc.${slcc}`),
      status: slcc === 'yes' ? 'ok' : slcc === 'off' || slcc === 'c2' ? 'na' : 'no',
      label: slcc === 'no' ? t('reader.compliance.notPlanned') : undefined,
    },
    {
      key: 'dnsh',
      name: t('reader.compliance.dnsh.name'),
      desc: t('reader.compliance.dnsh.desc'),
      // the tool screens nothing for DNSH: "pending" promised a check
      status: 'na',
      label: t('reader.compliance.notAssessed'),
    },
  ]
}
