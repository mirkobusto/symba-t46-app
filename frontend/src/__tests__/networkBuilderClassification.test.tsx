import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import '../i18n'
import NetworkBuilder from '../components/NetworkBuilder'
import { useDcfDataStore } from '../store/dcfDataStore'
import type { Case } from '../types/api'
import type { DcfPayload } from '../types/dcf'
import { ACTORS_SECTION, FLOW_CLASSIFICATION_SECTION, FLOW_MATRIX_SECTION } from '../types/dcfData'

// Classification and substitution next to the flow in the editor, not only in
// the Excel file (round 4 leftover, decided by Fable on 2026-11-03).
const f = (id: string, extra: Record<string, unknown> = {}) =>
  ({ id, label_en: id, type: 'string', required: false, activation_predicate: 'always', ...extra })

const section = (id: string, fields: ReturnType<typeof f>[]) =>
  ({ id, title_en: id, description_en: '', applies_when: 'always', row_collection: 'user_added', active: true, fields })

const PAYLOAD = {
  schema_version: '1.0', case_id: 'c1', ilcd_situation: null, lcc_type: null, slca_activation_state: null,
  sections: [
    section(ACTORS_SECTION, [f('actor.id'), f('actor.name')]),
    section(FLOW_MATRIX_SECTION, [f('flow.id'), f('flow.name'), f('flow.origin_actor_id', { type: 'fk_actor' }),
      f('flow.dest_actor_id', { type: 'fk_actor' })]),
    section(FLOW_CLASSIFICATION_SECTION, [f('classif.flow_id', { type: 'fk_flow' }),
      f('classif.legal_status', { type: 'enum', label: 'Legal classification', enum_values: ['waste', 'by_product'] })]),
  ],
  mandates_by_category: {}, obligations: [], network_render_spec: null,
} as unknown as DcfPayload

const CASE = { q1: 'B', q3: { env: true, eco: true, soc: false }, q4: [], sites: [],
  flows: [{ id: 'f1', name: 'Sludge', q5: 'a' }] } as unknown as Case

describe('NetworkBuilder: classification panel', () => {
  beforeAll(() => {
    globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as never
  })
  beforeEach(() => useDcfDataStore.getState().reset())

  it('fills the flow classification row from the flow panel', () => {
    // the Data Collection page seeds the questionnaire flows
    useDcfDataStore.getState().syncWithPayload(PAYLOAD, CASE.flows ?? [])
    render(<MemoryRouter><NetworkBuilder payload={PAYLOAD} sourceCase={CASE} caseId={null} /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Sludge' }))
    fireEvent.click(screen.getByText(/Classification and substitution/))
    fireEvent.change(screen.getByLabelText(/Legal classification/), { target: { value: 'by_product' } })
    const rows = useDcfDataStore.getState().data.rows_by_section[FLOW_CLASSIFICATION_SECTION]
    expect(rows).toEqual([{ row_id: 'classif-f1', values: { 'classif.flow_id': 'f1', 'classif.legal_status': 'by_product' } }])
  })
})
