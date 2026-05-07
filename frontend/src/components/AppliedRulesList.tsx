interface AppliedRulesListProps {
  rules: string[]
}

export default function AppliedRulesList({ rules }: AppliedRulesListProps) {
  if (!rules || rules.length === 0) {
    return (
      <section className="rules-section">
        <h3>Applied rules</h3>
        <p className="rules-empty">No post-processing rules triggered.</p>
      </section>
    )
  }
  return (
    <section className="rules-section">
      <h3>Applied rules</h3>
      <ul className="rules-list">
        {rules.map((id) => (
          <li key={id}>
            <code>{id}</code>
          </li>
        ))}
      </ul>
    </section>
  )
}
