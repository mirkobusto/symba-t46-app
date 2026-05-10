import { Link, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const err = useRouteError() as { statusText?: string; message?: string } | null
  const detail = err?.statusText ?? err?.message ?? 'Unexpected error'
  return (
    <div className="error-page">
      <h1>Something went wrong</h1>
      <p className="error-text">{detail}</p>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
    </div>
  )
}
