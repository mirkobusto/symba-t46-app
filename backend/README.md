# SYMBA T4.6 — Backend

FastAPI + SQLAlchemy + SQLite. Python 3.12.

## Local development

We use [uv](https://docs.astral.sh/uv/) for dependency and venv management
(any pip-compatible workflow works too).

```bash
# from the backend/ directory
uv venv --python 3.12
source .venv/bin/activate
uv pip install -e ".[dev]"

# run dev server (auto-reload)
uvicorn app.main:app --reload --port 8000

# run tests
pytest

# lint
ruff check .
```

The dev server listens on `http://localhost:8000`. Healthcheck:

```bash
curl http://localhost:8000/health
# {"status":"ok","version":"0.0.1"}
```

## Layout

```
app/
├── main.py                # FastAPI app + CORS + lifespan
├── db.py                  # SQLAlchemy engine / session factory
├── data/                  # decision engine JSON (frozen, committed)
│   └── lcsa_decision_engine.v2.json
├── domain/                # pure business logic (no DB, no HTTP)
│   ├── engine.py          # DecisionEngine (loader + resolver)
│   ├── models_domain.py   # Pydantic models mirroring the JSON
│   └── validators.py      # trigger matcher + invariant checks
├── models/                # SQLAlchemy ORM models
│   ├── session.py
│   ├── answer.py
│   └── pathway_resolution.py
├── routers/               # FastAPI routers
│   ├── health.py
│   ├── decision_engine.py # /api/decision-engine/*
│   └── sessions.py        # /api/sessions/*
└── schemas/               # Pydantic request/response schemas
tests/                     # pytest suite
```

The SQLite file is created on demand under `backend/data/app.db` and is
gitignored.

## Configuration

| Env var                   | Default                                                            | Notes                                |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| `DATABASE_URL`            | `sqlite:///backend/data/app.db`                                    | Any SQLAlchemy URL.                  |
| `BACKEND_CORS_ORIGINS`    | `http://localhost:5173,http://127.0.0.1:5173,http://192.168.1.146:5174` | Comma-separated origin allowlist. |

## REST API

All app endpoints are mounted under `/api`. The legacy `/health` endpoint is
also kept for the Sprint 1 smoke test and the Docker healthcheck.

### Decision engine (read-only)

```bash
# List the 10 questions with options + trace
curl http://localhost:8000/api/decision-engine/questions

# List the 10 terminal pathways (LCSA-P1..P10)
curl http://localhost:8000/api/decision-engine/pathways

# Inspect one pathway's full configuration
curl http://localhost:8000/api/decision-engine/pathways/LCSA-P1
```

### Sessions

```bash
# Create a session
SID=$(curl -s -X POST http://localhost:8000/api/sessions \
  -H 'Content-Type: application/json' -d '{"case_name":"Sunflower-Compost-Park"}' \
  | python -c 'import json,sys; print(json.load(sys.stdin)["id"])')

# Submit answers (partial OK; values per the question schemas)
curl -X POST "http://localhost:8000/api/sessions/$SID/answers" \
  -H 'Content-Type: application/json' \
  -d '{
        "answers": [
          {"question_id":"q1","value":"A"},
          {"question_id":"q2","value":"ex-ante"},
          {"question_id":"q3","value":"C+E-LCC"},
          {"question_id":"q4","value":"function-oriented"},
          {"question_id":"q5","value":"design"},
          {"question_id":"q6","value":false},
          {"question_id":"q7","value":"system-expansion"},
          {"question_id":"q8","value":true},
          {"question_id":"q9","value":"single-site"},
          {"question_id":"q10","value":"standard"}
        ]
      }'

# Resolve the pathway (errors 400 if answers are incomplete or invalid)
curl -X POST "http://localhost:8000/api/sessions/$SID/resolve"

# Re-fetch the persisted pathway
curl http://localhost:8000/api/sessions/$SID/pathway

# Read the session detail (incl. answers list)
curl http://localhost:8000/api/sessions/$SID

# Update metadata (case_name / notes)
curl -X PATCH http://localhost:8000/api/sessions/$SID \
  -H 'Content-Type: application/json' -d '{"notes":"reviewed"}'

# Soft-delete (status -> archived)
curl -X DELETE http://localhost:8000/api/sessions/$SID
```

For the Sunflower-Compost-Park canonical case the response should include
`pathway_id: "LCSA-P1"`, `applied_rules: ["RULE-01-Q8-public-assertion"]`,
`configuration.lca.weighting: "no-weighting"`, and
`configuration.lca.critical_review: "panel"`.

For the BLOCKED canonical case (`q1=C2`, `q3=C+E-LCC`), the resolve endpoint
returns `blocked: true` with `block_info.block_id: "BLOCK-01"` and a list of
`suggested_resolutions`.

### Endpoints reserved for later sprints

`GET /api/sessions/{id}/protocol` (Sprint 5) and
`GET /api/sessions/{id}/data-template` (Sprint 6) currently return
`501 Not Implemented`.
