// Renders one DcfSection as a table of active fields.
//
// For data sections (actors / flow_matrix / logistics / infrastructure)
// this shows the field labels, types, enum values, and the activation
// predicate that selected them. For derived sections
// (methodological_choices / network_diagram) the parent page renders a
// different component; this viewer just shows a "see below" note.

import type { DcfMandate, DcfSection } from '../types/dcf'

interface Props {
  section: DcfSection
  // For methodological_choices, pass the activated mandates; otherwise undefined.
  mandatesByCategory?: Record<string, DcfMandate[]>
}

export default function DcfSectionViewer({ section, mandatesByCategory }: Props) {
  if (!section.active) {
    return (
      <div className="dcf-section dcf-section-inactive">
        <h3>{section.title_en}</h3>
        <p className="dcf-section-description">{section.description_en}</p>
        <p className="dcf-inactive-banner">
          <strong>Not active</strong> for this case configuration
          (applies_when: <code>{section.applies_when}</code>).
        </p>
      </div>
    )
  }

  if (section.id === 'methodological_choices' && mandatesByCategory) {
    return (
      <div className="dcf-section">
        <h3>{section.title_en}</h3>
        <p className="dcf-section-description">{section.description_en}</p>
        {Object.entries(mandatesByCategory).map(([category, mandates]) => (
          <div key={category} className="dcf-mandate-category">
            <h4>
              {category} <span className="dcf-count">({mandates.length})</span>
            </h4>
            <table className="dcf-table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Method</th>
                  <th>Statement</th>
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
        <h3>{section.title_en}</h3>
        <p className="dcf-section-description">{section.description_en}</p>
        <p className="dcf-see-below">See the interactive diagram above.</p>
      </div>
    )
  }

  return (
    <div className="dcf-section">
      <h3>
        {section.title_en}{' '}
        <span className="dcf-count">({section.fields.length} fields)</span>
      </h3>
      <p className="dcf-section-description">{section.description_en}</p>
      <table className="dcf-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Required</th>
            <th>Enum values / ref</th>
            <th>Activated by</th>
          </tr>
        </thead>
        <tbody>
          {section.fields.map((f) => (
            <tr key={f.id}>
              <td>
                <strong>{f.label_en}</strong>
                <br />
                <code className="dcf-field-id">{f.id}</code>
              </td>
              <td>{f.type}</td>
              <td>{f.required ? 'yes' : 'no'}</td>
              <td>
                {f.enum_values ? (
                  <span className="dcf-enum-values">
                    {f.enum_values.join(', ')}
                  </span>
                ) : f.enum_ref ? (
                  <code>{f.enum_ref}</code>
                ) : (
                  '—'
                )}
              </td>
              <td>
                <code className="dcf-predicate">{f.activation_predicate}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
