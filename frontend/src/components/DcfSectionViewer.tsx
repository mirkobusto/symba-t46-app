// Renders one DcfSection as a table of active fields.
//
// For data sections (actors / flow_matrix / logistics / infrastructure)
// this shows the field labels, types, enum values, and the activation
// predicate that selected them. For derived sections
// (methodological_choices / network_diagram) the parent page renders a
// different component; this viewer just shows a "see below" note.

import { useTranslation } from 'react-i18next'

import { usePreferenceStore } from '../store/preferenceStore'
import type { DcfMandate, DcfSection } from '../types/dcf'

// who fills a section in: the companies' staff, or the analyst who carries out
// the study (UX round 4: "your staff fill in the sheets" met rows on discount
// rates and LCI datasets, P3-06, P7-03)
const ANALYST_SECTIONS = new Set(['flow_classification', 'reference_scenario', 'methodological_choices'])

interface Props {
  section: DcfSection
  // For methodological_choices, pass the activated mandates; otherwise undefined.
  mandatesByCategory?: Record<string, DcfMandate[]>
}

export default function DcfSectionViewer({ section, mandatesByCategory }: Props) {
  const { t } = useTranslation()
  const guided = usePreferenceStore((s) => s.mode) === 'guided'
  // in the reader's language when the API sent it (?lang=), schema text otherwise
  const title = section.title || section.title_en
  const description = section.description || section.description_en

  if (!section.active) {
    return (
      <div className="dcf-section dcf-section-inactive">
        <h3>{title}</h3>
        <p className="dcf-section-description">{description}</p>
        <p className="dcf-inactive-banner">{t('dcf.viewer.notActive')}</p>
      </div>
    )
  }

  if (section.id === 'methodological_choices' && mandatesByCategory) {
    return (
      <div className="dcf-section">
        <h3>{title}</h3>
        <p className="dcf-section-description">{description}</p>
        {Object.entries(mandatesByCategory).map(([category, mandates]) => (
          <div key={category} className="dcf-mandate-category">
            <h4>
              {category} <span className="dcf-count">({mandates.length})</span>
            </h4>
            <table className="dcf-table">
              <thead>
                <tr>
                  <th>{t('dcf.viewer.nodeId')}</th>
                  <th>{t('dcf.viewer.method')}</th>
                  <th>{t('dcf.viewer.statement')}</th>
                </tr>
              </thead>
              <tbody>
                {mandates.map((m) => (
                  <tr key={m.node_id}>
                    <td>
                      <code>{m.node_id}</code>
                    </td>
                    <td>{m.method}</td>
                    <td>{m.statement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }

  if (section.id === 'network_diagram') {
    return (
      <div className="dcf-section">
        <h3>{title}</h3>
        <p className="dcf-section-description">{description}</p>
        <p className="dcf-see-below">{t('dcf.viewer.seeAbove')}</p>
      </div>
    )
  }

  return (
    <div className="dcf-section">
      <h3>
        {title}{' '}
        <span className="dcf-count">{t('dcf.viewer.fieldsCount', { count: section.fields.length })}</span>
      </h3>
      <p className="dcf-section-who">
        <span className="dd-pill dd-pill-muted">
          {t(section.filled_by === 'both'
            ? 'dcf.viewer.whoBoth'
            : (section.filled_by ? section.filled_by === 'analyst' : ANALYST_SECTIONS.has(section.id))
              ? 'dcf.viewer.whoAnalyst'
              : 'dcf.viewer.whoCompanies')}
        </span>
      </p>
      <p className="dcf-section-description">{description}</p>
      {/* what a data provider needs: the datum, whether it is required, the
          values it takes and why it is asked, in words; the type and the raw
          predicate were for whoever wrote the schema (UX round 2026-11-02) */}
      <table className="dcf-table dcf-table-fields">
        <thead>
          <tr>
            <th>{t('dcf.viewer.colField')}</th>
            <th>{t('dcf.viewer.colRequired')}</th>
            <th>{t('dcf.viewer.colValues')}</th>
            <th>{t('dcf.viewer.colWhy')}</th>
          </tr>
        </thead>
        <tbody>
          {section.fields.map((f) => {
            const values = f.enum_labels
              ? Object.values(f.enum_labels)
              : f.enum_values ?? null
            return (
              <tr key={f.id}>
                <td>
                  <strong>{f.label || f.label_en}</strong>
                  {f.derived ? (
                    <span className="dcf-derived"> · {t('dcf.derivedField')}</span>
                  ) : null}
                  {f.filled_by === 'analyst' ? (
                    <span className="dcf-derived"> · {t('dcf.viewer.forAnalyst')}</span>
                  ) : null}
                  {f.help || f.description_en ? (
                    <>
                      <br />
                      <span className="dcf-field-help">{f.help || f.description_en}</span>
                    </>
                  ) : null}
                  {guided ? null : (
                    <>
                      <br />
                      <code className="dcf-field-id">{f.id}</code>
                    </>
                  )}
                </td>
                <td data-label={t('dcf.viewer.colRequired')}>{f.required ? t('common.yes') : t('common.no')}</td>
                <td data-label={t('dcf.viewer.colValues')}>{values ? <span className="dcf-enum-values">{values.join('; ')}</span> : '—'}</td>
                <td data-label={t('dcf.viewer.colWhy')}>{f.reason || t('dcf.viewer.always')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
