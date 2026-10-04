import { describe, expect, it } from 'vitest'

import { resolveApiBase } from '../services/api'

describe('resolveApiBase', () => {
  it('uses the same origin in a production build, so the image works behind any domain', () => {
    expect(resolveApiBase({ PROD: true })).toBe('')
  })

  it('uses the backend on localhost in development', () => {
    expect(resolveApiBase({ PROD: false })).toBe('http://localhost:8088')
  })

  it('lets VITE_BACKEND_URL win, an empty string included', () => {
    expect(resolveApiBase({ VITE_BACKEND_URL: 'https://api.example.org', PROD: true })).toBe(
      'https://api.example.org',
    )
    expect(resolveApiBase({ VITE_BACKEND_URL: '', PROD: false })).toBe('')
  })
})
