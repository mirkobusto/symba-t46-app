import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Non-default port to avoid clashing with other dev servers on this
  // machine. Override with `--port <N>` on the CLI if needed.
  server: {
    port: 5180,
    strictPort: true,
  },
  preview: {
    port: 5180,
    strictPort: true,
    // `vite preview` serves a production build, whose API base is the same origin
    // (see services/api.ts): forward /api and /health to the backend run locally.
    proxy: {
      '/api': 'http://localhost:8088',
      '/health': 'http://localhost:8088',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
  },
})
