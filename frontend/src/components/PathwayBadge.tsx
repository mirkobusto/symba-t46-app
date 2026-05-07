interface PathwayBadgeProps {
  pathwayId: string | null
  pathwayName?: string | null
}

export default function PathwayBadge({
  pathwayId,
  pathwayName,
}: PathwayBadgeProps) {
  if (!pathwayId) {
    return <span className="pathway-badge pathway-badge-unknown">Unresolved</span>
  }
  return (
    <span className="pathway-badge" title={pathwayName ?? undefined}>
      <span className="pathway-badge-id">{pathwayId}</span>
      {pathwayName ? (
        <span className="pathway-badge-name">{pathwayName}</span>
      ) : null}
    </span>
  )
}
