import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '../i18n'
import DcfSectionViewer from '../components/DcfSectionViewer'
import type { DcfSection } from '../types/dcf'

// The DCF page shows the API's text in the reader's language and says why a
// field is asked in words, not as a predicate (UX round 2026-11-02).
const SECTION: DcfSection = {
  id: 'actors', title_en: 'Actors', description_en: 'New first-class concept: actors are not in the current Case model',
  title: 'Attori', description: 'Chi partecipa agli scambi.',
  applies_when: 'always', row_collection: 'user_added', active: true,
  fields: [{
    id: 'actor.public_private', label_en: 'Public / private ownership', label: 'Proprietà pubblica / privata',
    type: 'enum', required: false, activation_predicate: 'q3.eco or q3.soc',
    reason: 'lo studio ha la dimensione economica o quella sociale (Q3)',
    enum_values: ['public', 'private'], enum_labels: { public: 'pubblica', private: 'privata' },
  }],
}

describe('DcfSectionViewer', () => {
  it('uses the localized text and the reason in words', () => {
    render(<DcfSectionViewer section={SECTION} />)
    expect(screen.getByText('Chi partecipa agli scambi.')).toBeTruthy()
    expect(screen.getByText('Proprietà pubblica / privata')).toBeTruthy()
    expect(screen.getByText('pubblica; privata')).toBeTruthy()
    expect(screen.getByText(/dimensione economica o quella sociale/)).toBeTruthy()
    expect(screen.queryByText(/first-class concept/)).toBeNull()
    expect(screen.queryByText('q3.eco or q3.soc')).toBeNull()
  })

  it('lists only the values the files offer, not the retired ones (UX round 6, P1-05)', () => {
    const section: DcfSection = {
      ...SECTION,
      fields: [{
        id: 'actor.role', label_en: 'Role', label: 'Ruolo', type: 'enum', required: true,
        activation_predicate: 'always', enum_values: ['partner', 'facilitator'],
        // the labels of retired values ride along, to show a stored one
        enum_labels: { partner: 'partner', facilitator: 'facilitatore', producer: 'produttore', consumer: 'utilizzatore' },
      }],
    }
    render(<DcfSectionViewer section={section} />)
    expect(screen.getByText('partner; facilitatore')).toBeTruthy()
    expect(screen.queryByText(/produttore/)).toBeNull()
  })
})
