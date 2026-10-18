# SYMBA T4.6 — IS Assessment App

Web application of the Horizon Europe project SYMBA (GA 101135562), task T4.6,
deliverable D4.6. It makes the SYMBA guidelines for Industrial Symbiosis
assessment, D4.1 (LCA) and D4.2 (LCC), applicable to a case: a questionnaire
on the variables the deliverables use (Q0-Q12: the study, the exchanges, the
case) gives the methodological configuration (ILCD situation, LCC structure,
study horizon, reference scenario, functional unit, regionalisation, D4.1
Part 2 sector rules), the obligations to document, and a Data Collection File
calibrated on it. It computes no LCA, LCC or S-LCA numbers: scoring comes
from the project partners.

Documentation index: [`docs/README.md`](docs/README.md). Deployment:
[`docs/DEPLOY.md`](docs/DEPLOY.md).

## Stack

- **Frontend** — React 19 + TypeScript + Vite, Vitest + React Testing Library
- **Backend** — Python 3.12 + FastAPI + SQLAlchemy 2 + SQLite + Pydantic v2,
  pytest + ruff
- **CI** — GitHub Actions (per-area workflows under `.github/workflows/`)

## Quickstart — Docker (recommended for dev)

```bash
docker compose up --build
```

- Frontend: <http://localhost:5180>
- Backend:  <http://localhost:8088>
- Health:   <http://localhost:8088/health>

The compose file mounts the source directories into the containers so that
hot-reload (Vite) and auto-reload (uvicorn) work without rebuilding.

## Quickstart — without Docker

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5180
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
uvicorn app.main:app --reload --port 8088
ruff check .
PYTHONPATH=. pytest tests/
```

The SQLite file is created lazily under `backend/data/app.db` (gitignored).

## Repository layout

```
.
├── frontend/                # React + TS + Vite app (questionnaire, result, DCF, audience views)
├── backend/                 # FastAPI app: schema-driven engine, DCF, reports, auth
│   └── app/schemas/         # the methodology as data: nodes, cross-method rules, DCF, Part 2 overlays
├── docs/                    # documentation (index in docs/README.md)
├── deploy/                  # Caddy and construction-mode files for production
├── .github/workflows/       # CI pipelines (frontend + backend)
├── docker-compose.yml       # dev stack
└── docker-compose.prod.yml  # production stack (see docs/DEPLOY.md)
```

`coordination/` holds the planning record of the early sprints and is historical.
