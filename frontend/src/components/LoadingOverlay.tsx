// Full-screen translucent backdrop with a spinner. Mounted only while
// `loading === true`; blocks pointer events on the underlying form.

interface Props {
  message?: string
}

export default function LoadingOverlay({ message = 'Running pipeline…' }: Props) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="spinner" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>
  )
}
