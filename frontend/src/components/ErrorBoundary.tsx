// Global error boundary. Catches uncaught render errors anywhere in
// the React tree and renders a friendly fallback instead of a blank
// page. Mounted at the app root in App.tsx.
//
// React error boundaries must be class components (no functional
// equivalent in current React).

import { AlertTriangle, RotateCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console for debugging; in production we'd ship this to a
    // telemetry endpoint (Sentry, etc.). Out of scope for the MVP.
    console.error('Uncaught render error:', error, info)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <AlertTriangle size={32} className="error-boundary-icon" />
          <h1>Something went wrong</h1>
          <p className="muted">
            An unexpected error occurred while rendering the page. Your draft
            is preserved in local storage; reloading should recover it.
          </p>
          {this.state.error?.message ? (
            <details className="error-boundary-details">
              <summary>Error details</summary>
              <pre>{this.state.error.message}</pre>
              {this.state.error.stack ? (
                <pre className="muted">{this.state.error.stack}</pre>
              ) : null}
            </details>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleReload}
          >
            <RotateCw size={16} />
            Reload page
          </button>
        </div>
      </div>
    )
  }
}
