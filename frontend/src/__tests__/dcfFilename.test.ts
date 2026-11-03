import { describe, expect, it } from 'vitest'

import { dcfFilename } from '../pages/dcfFilename'

describe('dcfFilename', () => {
  it('names the file after the case and the day', () => {
    const day = new Date('2026-11-03T10:00:00Z')
    expect(dcfFilename('Valle del Formaggio — siero, biogas e digestato', 'xlsx', day))
      .toBe('DCF_Valle-del-Formaggio-siero-biogas-e-digestato_2026-11-03.xlsx')
    expect(dcfFilename('Parc éco-industriel Dunkerque', 'docx', day)).toBe('DCF_Parc-eco-industriel-Dunkerque_2026-11-03.docx')
    expect(dcfFilename(null, 'xlsx', day)).toBe('DCF_draft_2026-11-03.xlsx')
  })
})
