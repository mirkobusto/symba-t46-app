import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { translateNote } from '../i18n/engineNotes'
import de from '../i18n/locales/de'
import en from '../i18n/locales/en'
import es from '../i18n/locales/es'
import fr from '../i18n/locales/fr'
import itLocale from '../i18n/locales/it'
import { configurationRows, withoutQCodes } from '../pages/configurationRows'
import QuestionnairePage from '../pages/QuestionnairePage'
import { useCaseStore } from '../store/caseStore'
import { usePreferenceStore } from '../store/preferenceStore'
import type { Case } from '../types/api'

// UX round 6: in guided mode the configuration rows spoke the analyst's
// jargon (P3-12), the notes on the answers cited Q-codes (P2-11), and the
// questionnaire named options by letter and left acronyms unexplained (P4-17).
const t = (k: string, o?: Record<string, unknown>) => i18n.t(k, o ?? {}) as string
const JARGON = /Net Tax Factor|\bNTF\b|SSP|RCP|Pedigree|HNSRS|CNSRS|CAPEX|OPEX|\bPEF\b|\bCFF\b|\bEVT\b|§|\bQ\d|\bTRL\b|E-LCC|C-LCC|S-LCC/

describe('guided configuration rows', () => {
  beforeEach(async () => { await i18n.changeLanguage('en') })

  it.each([['en', en], ['it', itLocale], ['fr', fr], ['de', de], ['es', es]])('%s plain values carry no jargon', (_l, locale) => {
    const values = (node: unknown): string[] => (typeof node === 'string' ? [node]
      : Object.values(node as Record<string, unknown>).flatMap(values))
    for (const text of values((locale as unknown as { result: { configPlain: unknown } }).result.configPlain)) {
      expect(text).not.toMatch(JARGON)
    }
  })

  const KASE = {
    q1: 'B', q2: 'B', decision_context: 'micro', policy_objective: true, q3: { env: true, eco: true, soc: false },
    q4: ['D'], flows: [{ id: 'f1', name: 'Whey', q5: 'a' }], sites: [], alternative_scenarios: [], advanced: {},
    ilcd_situation: 'ILCD Situation A', lcc_type: 'C+E+S', slca_activation_state: 'deactivated',
    activated_nodes: [], blocked_by: [], applicable_rules: [], cdp_flags: [],
    lca: { zero_burden_classification: { f1: 'zero-burden from the point...' } },
  } as unknown as Case

  it('reads every row in plain words, and keeps the analyst text in expert mode', () => {
    const guided = Object.fromEntries(configurationRows(KASE, t, { guided: true }).map((r) => [r.key, r]))
    for (const row of Object.values(guided)) expect(`${row.value} ${withoutQCodes(row.why ?? '')}`).not.toMatch(JARGON)
    expect(guided.regional.value).toMatch(/^Not stated/)
    expect(guided.reference.value).toMatch(/without the new exchanges/)
    const expert = Object.fromEntries(configurationRows(KASE, t).map((r) => [r.key, r]))
    expect(expert.lcc.value).toMatch(/Net Tax Factor/)
    expect(expert.reference.value).toMatch(/CNSRS/)
  })

  it('drops option letters and answer codes from the reasons', () => {
    expect(withoutQCodes('B. Regional (Q7)')).toBe('Regional')
    expect(withoutQCodes('the results will support EU policy alignment (Q4 = D)')).toBe('the results will support EU policy alignment')
    expect(withoutQCodes('D4.1 §8.3 applies')).toBe('D4.1 §8.3 applies')
  })
})

describe('guided notes on the answers', () => {
  beforeEach(async () => { await i18n.changeLanguage('en') })

  it('names the case sector and the flows still without one', () => {
    const text = translateNote(i18n.t, {
      code: 'case_sector_without_flow', message: 'x', params: { chapter: '§8 Waste valorisation' },
    }, true, { flows: 'Biomethane' })
    expect(text).toMatch(/flows with no sector now: Biomethane/)
    expect(text).toMatch(/Biogas, biomethane or digestate/)
    expect(text).not.toMatch(/\{\{|§/)
    expect(text).toMatch(/\(Waste Valorisation\)/)
  })

  it('speaks of who pays whom, not of Q5', () => {
    const text = translateNote(i18n.t, { code: 'flow_sellable_but_waste', message: 'x', params: { flow: 'Whey' } }, true)
    expect(text).toMatch(/^For 'Whey'/)
    expect(text).not.toMatch(/Q5|§/)
  })
})

describe('guided questionnaire options', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useCaseStore.getState().reset()
  })
  afterEach(() => usePreferenceStore.setState({ mode: 'expert' }))

  it('names the options without letters and the market check in words', () => {
    usePreferenceStore.setState({ mode: 'guided' })
    render(<MemoryRouter><QuestionnairePage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /all the questions|one page/i }))
    expect(screen.getByText('Regional')).toBeInTheDocument()
    expect(screen.queryByText('B. Regional')).toBeNull()
    expect(screen.getByText(/the market check must be documented/)).toBeInTheDocument()
  })

  it('keeps the letters in expert mode', () => {
    render(<MemoryRouter><QuestionnairePage /></MemoryRouter>)
    expect(screen.getByText('B. Regional')).toBeInTheDocument()
  })
})
