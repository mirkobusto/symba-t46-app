import { AlertTriangle } from 'lucide-react'

interface WarningsBannerProps {
  warnings: string[]
  title?: string
  variant?: 'warning' | 'error' | 'info'
}

export default function WarningsBanner({
  warnings,
  title = 'Warnings',
  variant = 'warning',
}: WarningsBannerProps) {
  if (!warnings || warnings.length === 0) return null
  return (
    <section className={`banner banner-${variant}`} role="status">
      <div className="banner-icon">
        <AlertTriangle size={20} />
      </div>
      <div className="banner-content">
        <h4>{title}</h4>
        <ul>
          {warnings.map((w, idx) => (
            <li key={idx}>{w}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
