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
├── main.py        # FastAPI app + CORS
├── db.py          # SQLAlchemy engine / session
├── models/        # ORM models (placeholder)
├── routers/       # API routers
└── schemas/       # Pydantic schemas (placeholder)
tests/             # pytest suite
```

The SQLite file is created on demand under `backend/data/app.db` and is
gitignored.
