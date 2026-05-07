# SYMBA T4.6 — Frontend

React 19 + TypeScript + Vite SPA for the SYMBA T4.6 IS Assessment App. Talks
to the FastAPI backend over `/api/*` and walks the user through the
ten-question decision-engine flow.

## Stack

- React 19 + TypeScript (Vite 8)
- `react-router-dom` v7 for routing
- `zustand` v5 for global session state (with `localStorage` persistence of
  the active `sessionId` + `currentQuestionIndex`)
- Native `fetch` wrapped in `src/services/api.ts` (no axios)
- `lucide-react` for icons
- Plain CSS in `src/App.css` (palette: indigo-600 primary, slate neutrals,
  amber warnings, red errors). No Tailwind dependency.
- Vitest + React Testing Library for unit tests

## Pages and routing

| Path                          | Page              | Purpose                                          |
| ----------------------------- | ----------------- | ------------------------------------------------ |
| `/`                           | `HomePage`        | Landing + "Start new assessment" CTA             |
| `/questionnaire/:sessionId`   | `QuestionnairePage` | Step-by-step 10-question flow                  |
| `/result/:sessionId`          | `ResultPage`      | Resolved pathway + LCA/LCC/S-LCA configuration   |
| `/error/:sessionId`           | `ErrorPage`       | BLOCKED case with `block_info` and resolutions   |
| `/about`                      | `AboutPage`       | Short project blurb                              |

The router is wrapped in a shared `Layout` providing the header (brand +
About link), the main content area (max-width 768px) and a footer with the
backend `HealthCheck` indicator.

## State

`useSessionStore` (`src/store/sessionStore.ts`):

- `sessionId`, `caseName`, `status` mirror the server-side session
- `answers: Record<questionId, value>` is a client-side accumulator,
  rehydrated from `GET /api/sessions/:id` on cold-load of `/questionnaire`
- `questions` is cached after the first `GET /api/decision-engine/questions`
- `pathway` holds the latest `PathwayResolutionResponse` (resolved or
  blocked)
- `currentQuestionIndex` drives `QuestionnairePage`

Only `sessionId` + `currentQuestionIndex` are persisted to `localStorage`
(SPEC §3.7). Answers are always re-fetched from the backend.

## Components

`Layout`, `HealthCheck`, `QuestionCard`, `ProgressIndicator`,
`PathwayBadge`, `ConfigurationSection`, `TraceList`, `AppliedRulesList`,
`WarningsBanner`, `BlockedMessage`.

## Scripts

```bash
npm install
npm run dev       # Vite dev server on :5173
npm run build     # tsc -b && vite build
npm run lint
npm test          # Vitest
```

The dev server expects the backend at `VITE_BACKEND_URL` (default
`http://localhost:8001`). Override via `.env.local` if needed:

```
VITE_BACKEND_URL=http://localhost:8001
```

## Out of scope (carry-over)

- Protocol `.docx` export (Sprint 5)
- Data-template `.xlsx` export (Sprint 6)
- Literature benchmark gallery (Sprint 7)
- Playwright E2E (Sprint 8)
- Multi-session "my past sessions" UI, auth, dark mode, multilingua
