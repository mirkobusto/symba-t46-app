import { describe, expect, it } from 'vitest'

import i18n from '../i18n'
import { exportFilename } from '../pages/dcfFilename'
import {
  longDate, reportMeta, reportRows, reportSector, scenarioConfigLines, scenarioNetworkLines,
} from '../pages/reportPayload'
import type { Case, CaseDetail, SectorRule } from '../types/api'
import type { DcfData } from '../types/dcfData'

// What the result page sends with the case for the Word report (UX round
// 2026-11-08, theme B): the cover, the rows, the sector rules and the
// scenario changes, worded as the screen words them.
const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options ?? {}) as string

const BASE: Case = {
  q1: 'B', q2: 'A', q3: { env: true, eco: true, soc: false }, q4: [], q7: 'B', flows: [], sites: [],
  decision_context: 'micro', ilcd_situation: 'ILCD Situation A', lcc_type: 'C+E',
  slca_activation_state: 'deactivated', activated_nodes: [], lca: {}, lcc: {},
}

describe('report payload', () => {
  it('names the report and the case file after the case and the day', () => {
    const day = new Date('2026-11-08T10:00:00Z')
    expect(exportFilename('Report', 'Frövi cartiera e serra (Anna)', 'docx', day))
      .toBe('Report_Frovi-cartiera-e-serra-Anna_2026-11-08.docx')
    expect(exportFilename('Case', null, 'json', day)).toBe('Case_draft_2026-11-08.json')
  })

  it('fills the cover from the saved case, with dates in the reader\'s language', async () => {
    await i18n.changeLanguage('it')
    const detail = {
      id: 'x', name: 'Valle del Formaggio', slug: 'agri-b-sita-a839e04a', ilcd_situation: null,
      created_at: '2026-11-01T09:00:00Z', updated_at: '2026-11-07T09:00:00Z',
      prepared_by: 'Giulia Rinaldi', case_contact: 'giulia@example.org', case: BASE,
    } as CaseDetail
    const meta = reportMeta({
      caseName: 'old name', detail, saved: true, diverged: true, lang: 'it', now: new Date('2026-11-08T10:00:00Z'),
    })
    expect(meta).toEqual({
      case_name: 'Valle del Formaggio', case_ref: 'agri-b-sita-a839e04a', prepared_by: 'Giulia Rinaldi',
      contact: 'giulia@example.org', generated_on: '8 novembre 2026', saved_on: '7 novembre 2026', state: 'diverged',
    })
    expect(reportMeta({ caseName: null, detail: null, saved: false, diverged: false, lang: 'en' }).state).toBe('unsaved')
    expect(longDate('not a date', 'en')).toBe('')
  })

  it('drops the Q-codes from the reasons in guided mode', async () => {
    await i18n.changeLanguage('en')
    const expert = reportRows(BASE, t, false).map((r) => r.why ?? '').join(' ')
    const guided = reportRows(BASE, t, true).map((r) => r.why ?? '').join(' ')
    expect(expert).toMatch(/\(Q\d+/)
    expect(guided).not.toMatch(/\(Q\d+/)
  })

  it('words the sector rules as the page does, without the line numbers', async () => {
    await i18n.changeLanguage('it')
    const rule: SectorRule = {
      chapter_key: 'agrifood', chapter: '§4 Agri-Food and Biorefineries', activated_by: [{ kind: 'flow', name: 'Siero' }],
      id: 'p2_agrifood_01', group: 'boundary', strength: 'must', applies_when: null,
      statement: 'English statement', source: 'D4.1 Part 2 §4.2', lines: 'L00393',
    }
    const [chapter] = reportSector([rule], i18n.t, 'it')
    expect(chapter.chapter).toMatch(/^§4 /)
    expect(chapter.reason).toContain('Siero')
    expect(chapter.rules[0].strength).toBe(i18n.t('result.sectorRules.strength.must'))
    expect(JSON.stringify(chapter)).not.toContain('L00393')
  })

  it('lists the configuration rows a scenario changes, and its network in words', async () => {
    await i18n.changeLanguage('en')
    const scenario: Case = { ...BASE, lcc_type: 'C+E+S', policy_objective: true }
    const lines = scenarioConfigLines(BASE, scenario, t)
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.every((l) => l.includes(' → '))).toBe(true)
    expect(scenarioConfigLines(BASE, BASE, t)).toEqual([])

    const actor = (id: string, name: string) => ({ row_id: id, values: { 'actor.name': name } })
    const data = {
      schema_version: '1.1', case_id: 'x', layout: {},
      rows_by_section: { actors: [actor('a1', 'Dairy')], flow_matrix: [] },
      networks_by_scenario: { sc1: { rows_by_section: { actors: [actor('a1', 'Dairy'), actor('a2', 'Farm')], flow_matrix: [] }, layout: {} } },
    } as unknown as DcfData
    expect(scenarioNetworkLines(data, 'sc1', t).join(' ')).toContain('Farm')
    expect(scenarioNetworkLines(data, 'other', t)).toEqual([])
    expect(scenarioNetworkLines(null, 'sc1', t)).toEqual([])
  })
})
