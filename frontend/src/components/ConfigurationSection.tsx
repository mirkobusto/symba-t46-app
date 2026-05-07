import { formatValue, humanizeKey, isPrimitive } from '../utils/format'

interface ConfigurationSectionProps {
  title: string
  config: Record<string, unknown> | null | undefined
}

export default function ConfigurationSection({
  title,
  config,
}: ConfigurationSectionProps) {
  if (!config || Object.keys(config).length === 0) {
    return (
      <section className="config-section">
        <h3>{title}</h3>
        <p className="config-empty">No configuration for this dimension.</p>
      </section>
    )
  }

  const entries = Object.entries(config)

  return (
    <section className="config-section">
      <h3>{title}</h3>
      <dl className="config-dl">
        {entries.map(([key, value]) => (
          <div key={key} className="config-row">
            <dt>{humanizeKey(key)}</dt>
            <dd>
              {isPrimitive(value) ? (
                <span>{formatValue(value)}</span>
              ) : Array.isArray(value) ? (
                <ul className="config-list">
                  {value.map((v, idx) => (
                    <li key={idx}>{formatValue(v)}</li>
                  ))}
                </ul>
              ) : (
                <pre className="config-json">{formatValue(value)}</pre>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
