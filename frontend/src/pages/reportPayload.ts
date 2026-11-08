// What the result page sends with the case when it asks for the .docx report.
//
// The document is written on the server, but some of its parts are worded
// here, from the same functions the screen uses, so the file and the page
// cannot say different things (UX round 2026-11-08, theme B): the cover (case
// name, reference, who prepared it, dates in the reader's language, whether
// the answers are saved), the sector rules in the reader's language (the
// document printed them in English with [must] / [should], P3-03), and what
// each scenario changes in the configuration rows and in its network.
//
// The scenario lines follow the scenario comparison page (ScenariosResultPage:
// the configuration rows that differ, and the network diff in words); the
// answers a scenario changes and the obligations it adds or removes are
// worded on the server, which runs the scenarios itself.

import type { TFunction } from 'i18next'

import { chapterName } from '../i18n/engineNotes'
import { sectorNote, sectorStatement } from '../i18n/sectorTerms'
import type { ReportMeta, ReportRow, ReportSectorChapter } from '../services/api'
import type { Case, CaseDetail, SectorRule } from '../types/api'
import { ACTORS_SECTION, FLOW_MATRIX_SECTION, type DcfData } from '../types/dcfData'
import { configurationRows, withoutQCodes } from './configurationRows'
import { networkDiff } from './networkDiff'

type Translate = (key: string, options?: Record<string, unknown>) => string

/** A date in the reader's language: "8 novembre 2026", not "2026-11-08" (P8-17). */
export function longDate(value: Date | string, lang: string): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** The cover: the share fields of the saved case when there is one (P8-01). */
export function reportMeta(opts: {
  caseName: string | null
  detail: CaseDetail | null
  saved: boolean
  diverged: boolean
  lang: string
  now?: Date
}): ReportMeta {
  const { caseName, detail, saved, diverged, lang } = opts
  return {
    case_name: detail?.name ?? caseName ?? null,
    case_ref: detail?.slug ?? null,
    prepared_by: detail?.prepared_by ?? null,
    contact: detail?.case_contact ?? null,
    generated_on: longDate(opts.now ?? new Date(), lang),
    saved_on: detail?.updated_at ? longDate(detail.updated_at, lang) || null : null,
    state: saved ? (diverged ? 'diverged' : 'saved') : 'unsaved',
  }
}

/** The configuration rows of the page; guided mode never shows the Q-codes. */
export function reportRows(result: Case, t: Translate, guided: boolean): ReportRow[] {
  return configurationRows(result, t, { guided }).map(({ label, value, why }) => ({
    label,
    value,
    why: why && guided ? withoutQCodes(why) : why,
  }))
}

/** The D4.1 Part 2 rules grouped by chapter, worded as the page words them.
 * The line numbers stay on the page: the section is the reference a reader of
 * the document can follow. */
export function reportSector(rules: SectorRule[], t: TFunction, lang: string): ReportSectorChapter[] {
  const chapters = new Map<string, SectorRule[]>()
  for (const r of rules) {
    const list = chapters.get(r.chapter) ?? []
    list.push(r)
    chapters.set(r.chapter, list)
  }
  return [...chapters.entries()].map(([chapter, list]) => ({
    chapter: chapterName(t, chapter) ?? chapter,
    reason: t('result.sectorRules.activatedBy', {
      reasons: list[0].activated_by
        .map((a) => (a.kind === 'flow'
          ? t('result.sectorRules.byFlow', { name: a.name })
          : t('result.sectorRules.byCaseSector')))
        .join(', '),
    }),
    rules: list.map((r) => ({
      strength: t(`result.sectorRules.strength.${r.strength}`),
      text: sectorStatement(t, lang, r),
      source: r.source,
      note: r.note ? sectorNote(t, lang, r) : null,
    })),
  }))
}

/** The configuration rows a scenario changes, "row: before → after", as the
 * scenario comparison lists them. */
export function scenarioConfigLines(base: Case, scenario: Case, t: Translate): string[] {
  const before = new Map(configurationRows(base, t).map((r) => [r.key, r]))
  const after = new Map(configurationRows(scenario, t).map((r) => [r.key, r]))
  const keys = [...new Set([...before.keys(), ...after.keys()])]
  return keys
    .filter((k) => before.get(k)?.value !== after.get(k)?.value)
    .map((k) => t('docxReport.scenario.change', {
      label: (after.get(k) ?? before.get(k))!.label,
      before: before.get(k)?.value ?? '—',
      after: after.get(k)?.value ?? '—',
    }))
}

function shown(value: unknown): string {
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

/** What the scenario's own network changes against the case's, in words; none
 * when the scenario has no network of its own. */
export function scenarioNetworkLines(data: DcfData | null, scenarioId: string, t: Translate): string[] {
  const variant = data?.networks_by_scenario?.[scenarioId]
  if (!data || !variant) return []
  const rows = (section: string, from: { rows_by_section: DcfData['rows_by_section'] }) =>
    from.rows_by_section[section] ?? []
  const d = networkDiff(rows(ACTORS_SECTION, data), rows(FLOW_MATRIX_SECTION, data),
    rows(ACTORS_SECTION, variant), rows(FLOW_MATRIX_SECTION, variant))
  return [
    ...d.actors_added.map((x) => t('scenariosResult.networkActorAdded', x)),
    ...d.actors_removed.map((x) => t('scenariosResult.networkActorRemoved', x)),
    ...d.actors_renamed.map((x) => t('scenariosResult.networkActorRenamed', x)),
    ...d.flows_rerouted.map((x) => t('scenariosResult.networkFlowRerouted', {
      flow: x.flow, fromBefore: x.from_before, toBefore: x.to_before, fromAfter: x.from_after, toAfter: x.to_after,
    })),
    ...d.flows_dropped.map((x) => t('scenariosResult.networkFlowDropped', x)),
    ...d.flows_only_in_scenario.map((x) => t('scenariosResult.networkFlowOnlyHere', x)),
    ...d.value_changes.map((x) => t('scenariosResult.networkValue', {
      flow: x.flow, field: t(`scenariosResult.networkField_${x.field.replace('flow.', '')}`),
      before: shown(x.before), after: shown(x.after),
    })),
  ]
}
