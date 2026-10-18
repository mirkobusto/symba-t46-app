# SYMBA T4.6 — Backend

FastAPI + SQLAlchemy 2 + Pydantic v2 + SQLite. Python 3.12.

## Local development

We use [uv](https://docs.astral.sh/uv/) for dependency and venv management
(any pip-compatible workflow works too).

```bash
# from the backend/ directory
uv venv --python 3.12
source .venv/bin/activate
uv pip install -e ".[dev]"

uvicorn app.main:app --reload --port 8088    # dev server
PYTHONPATH=. pytest tests/ -q                # tests
ruff check app tests scripts                 # lint
```

Healthcheck: `curl http://localhost:8088/health`.

Schema checks, expected to pass before every commit that touches `app/schemas/`:

```bash
python scripts/validate_phase1_artifacts.py --schema-dir app/schemas --out-dir coordination
PYTHONPATH=. python scripts/validate_dcf_schema.py
```

`scripts/engine_snapshot.py` runs the pipeline on the paper fixtures and a grid
of answers, and diffs two snapshots: use it to see what an engine or schema
change moves.

## Layout

```
app/
├── main.py            FastAPI app, CORS, static frontend in production
├── db.py              SQLAlchemy engine / session factory
├── schemas/           the methodology as data: 186 nodes, cross-method rules,
│                      system / computed / CIR output fields, DCF schema,
│                      D4.1 Part 2 sector overlays
├── domain/            Case, Flow and the answer enums (Q0-Q12), DCF data, scoring
├── engine/            pipeline: L0 → L1 blocks → node activation → sector rules
│                      → L2 rules → L3 report; branch keys, answer phrases,
│                      DCF predicates and composition
├── services/          .docx report, DCF .xlsx / .docx writers, narrative, slugs
├── auth/              JWT + bcrypt, ownership checks
├── models/            ORM: cases, DCF data, scoring, users
└── routers/           health, auth, pipeline, cases, dcf, scoring, public
scripts/               validators, snapshot, one-shot migrations, rerun of saved cases
tests/                 pytest suite
```

The SQLite file is created on demand under `backend/data/app.db` and is
gitignored. There are no Alembic migrations: one-shot scripts in `scripts/`
are run after a deploy that needs them.

## Configuration

| Env var | Default | Notes |
| --- | --- | --- |
| `DATABASE_URL` / `SYMBA_DB_URL` | `sqlite:///backend/data/app.db` | Any SQLAlchemy URL; `DATABASE_URL` wins. |
| `BACKEND_CORS_ORIGINS` | local dev origins | Comma-separated allowlist. |
| `SYMBA_JWT_SECRET` | per-process random | Set it in production, or tokens die on restart. |
| `SYMBA_REGISTRATION_OPEN` | `true` | `false` closes registration. |
| `SYMBA_ADMIN_EMAIL` | — | This account is admin; otherwise the first registered user is. |
| `SYMBA_FRONTEND_DIST` | `/app/frontend/dist` | Built frontend served in production. |

## REST API

All endpoints are under `/api`, except `/health`.

| Area | Endpoints |
| --- | --- |
| Pipeline | `POST /api/pipeline/run`, `POST /api/pipeline/report` (.docx), `POST /api/pipeline/run-scenarios` |
| Cases | `GET/POST /api/cases`, `GET/PUT/DELETE /api/cases/{id}`, `GET /api/cases/aggregate/breakdown` |
| Data Collection File | `POST /api/dcf/preview`, `POST /api/dcf/export/{xlsx,docx}`, `GET/PUT/DELETE /api/dcf/{id}/data`, `GET /api/dcf/{id}/export/{xlsx,docx}` |
| Scoring | `GET/PUT/DELETE /api/scoring/{case_id}` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Public | `GET /api/public/report/{key}`, `GET /api/public/region/{code}` |

The authorization model is tabled in [`docs/DEPLOY.md`](../docs/DEPLOY.md).

```bash
curl -s -X POST http://localhost:8088/api/pipeline/run \
  -H 'Content-Type: application/json' \
  -d '{"q1":"B","q2":"A","q3":{"env":true,"eco":true,"soc":false},"q4":["B"],
       "decision_context":"none","flows":[{"id":"f1","name":"steam","q5":"c"}]}'
```
