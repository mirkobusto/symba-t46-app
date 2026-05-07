# SYMBA T4.6 — IS Assessment App

Web application that operationalises the SYMBA T4.6 LCA / LCC / S-LCA
guidelines into a scoping tool for Industrial Symbiosis case studies.
See [`coordination/master-plan/MASTER_PLAN.md`](coordination/master-plan/MASTER_PLAN.md)
for the full vision; per-sprint specs and reports live under
[`coordination/`](coordination/).

This repository is a public monorepo. As of Sprint 2, the backend ships
the LCSA decision engine (10 questions → 10 pathways), session persistence
on SQLite, and a REST API under `/api/`. The frontend questionnaire is the
target of Sprint 3.

## Stack

- **Frontend** — React 19 + TypeScript + Vite, Vitest + React Testing Library
- **Backend** — Python 3.12 + FastAPI + SQLAlchemy 2 + SQLite + Pydantic v2,
  pytest + ruff
- **CI** — GitHub Actions (per-area workflows under `.github/workflows/`)

## Quickstart — Docker (recommended for dev)

```bash
docker compose up --build
```

- Frontend: <http://localhost:5173>
- Backend:  <http://localhost:8000>
- Health:   <http://localhost:8000/health>

The compose file mounts the source directories into the containers so that
hot-reload (Vite) and auto-reload (uvicorn) work without rebuilding.

## Quickstart — without Docker

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run lint
npm run test
npm run build
```

### Backend

```bash
cd backend
uv venv --python 3.12        # or: python3.12 -m venv .venv
source .venv/bin/activate
uv pip install -e ".[dev]"   # or: pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
ruff check .
pytest
```

The SQLite file is created lazily under `backend/data/app.db` (gitignored).

## Repository layout

```
.
├── frontend/                # React + TS + Vite app
├── backend/                 # FastAPI app
├── coordination/
│   ├── master-plan/         # Long-term vision
│   ├── current-state/       # Snapshot of where we are
│   ├── specs/               # Per-sprint SPECs
│   ├── reports/             # Per-sprint REPORTs
│   ├── reviews/             # Cross-sprint reviews
│   └── ADRs/                # Architecture Decision Records
├── .github/workflows/       # CI pipelines (frontend + backend)
├── docker-compose.yml       # Dev-only stack
└── README.md
```

## Coordination

All planning and post-mortem material lives in
[`coordination/`](coordination/). Sprint flow:

1. SPEC under `coordination/specs/SPRINT_<N>_SPEC_*.md`
2. Implementation on a `sprint/<N>-...` branch (or harness-assigned branch)
3. REPORT under `coordination/reports/SPRINT_<N>_REPORT.md`
4. Manual QA gate — see the SPEC's "Manual QA gate" section
