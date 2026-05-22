# Deployment guide — SYMBA T4.6

This document describes how to deploy the SYMBA T4.6 web application as a
single Docker container exposing the React/Vite frontend + the FastAPI
backend on the same port.

The deployment target for **D4.6** (Public dissemination level per the
Grant Agreement) is a publicly reachable URL — see `docs/implementation/
DATA_COLLECTION_FILE_v1.md` and the consortium internal docs for
hosting details.

---

## Prerequisites

- Docker ≥ 24.0 and Docker Compose v2 (the `docker compose` plugin).
- ~2 GB of free disk for the build (multi-stage discards Node deps
  after the frontend bundle).
- A persistent location for the SQLite database (a Docker volume by
  default; can be a host bind-mount).

## Quick start

```bash
# 1. Copy the example env file and adjust if needed
cp .env.example .env

# 2. Build + run
docker compose -f docker-compose.prod.yml up -d --build

# 3. Verify
curl http://localhost:8088/health
# -> {"status":"ok","version":"0.0.1"}

# 4. Open in browser
open http://localhost:8088
```

The application is now reachable on `http://localhost:8088`. The
SQLite database persists in the named volume `symba-data`.

## Behind a reverse proxy (recommended for public deployment)

The container does not terminate TLS — front it with a reverse proxy
(Caddy / Traefik / nginx). Example Caddy config:

```caddyfile
symba.example.eu {
    reverse_proxy symba:8088
}
```

When fronting the app, **also set `BACKEND_CORS_ORIGINS`** in the
`.env` file so the in-app fetch() calls from the browser hit the same
origin without CORS errors:

```env
BACKEND_CORS_ORIGINS=https://symba.example.eu
```

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `SYMBA_PUBLIC_PORT` | 8088 | Host port to publish |
| `BACKEND_CORS_ORIGINS` | (defaults to localhost ports) | Comma-separated allowed CORS origins for the API |
| `SYMBA_DB_URL` | `sqlite:////app/backend/data/app.db` | SQLAlchemy URL for the database (production = SQLite; can point to PostgreSQL once auth + multi-tenant land in Phase D) |

## Data backup

The application writes to a single SQLite file. Backup is a file copy:

```bash
docker compose -f docker-compose.prod.yml exec symba \
    sh -c 'sqlite3 /app/backend/data/app.db ".backup /tmp/backup.db"'
docker cp symba-t46:/tmp/backup.db ./symba-backup-$(date +%F).db
```

## Upgrades

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
# The container restarts; the SQLite volume is preserved.
```

If the data model changes (new ORM tables / columns), the app currently
uses `Base.metadata.create_all` on startup — new tables are added
automatically, **but new columns on existing tables are NOT**. A
proper Alembic migration setup is on the Phase D / post-MVP roadmap
(see `CLAUDE.md` § Lavoro deferito noto).

## Logs & monitoring

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Built-in health check: the container declares a `HEALTHCHECK` hitting
`/health` every 30s. `docker ps` shows `(healthy)` once it passes.

External monitoring / telemetry: out-of-scope for the MVP — see
CLAUDE.md. For a production deployment add an APM (e.g. Sentry)
behind a feature-flag.

## What the container bundles

- **Backend**: FastAPI + SQLAlchemy + 5 JSON schema files + DCF schema
  + procedural-mandate census + scripts.
- **Frontend**: pre-built static bundle served by FastAPI via
  `StaticFiles` mount (no Node runtime in the production image).
- **Database**: SQLite at `/app/backend/data/app.db`, persisted in a
  Docker volume.

## Production hardening checklist (Phase D / post-MVP)

- [ ] Auth + role-based access control (Phase D)
- [ ] Switch to PostgreSQL via `SYMBA_DB_URL` (Phase D)
- [ ] Alembic migrations (post-MVP)
- [ ] Sentry / APM (post-MVP)
- [ ] Rate limiting on `/api/scoring` ingest endpoint (post-MVP)
- [ ] Backup automation (cron) — see "Data backup" above
- [ ] HTTPS via reverse proxy (Caddy / Traefik / nginx) — see above

---

This Project has received funding from the European Union's Horizon
Europe Research and Innovation Programme under Grant Agreement N.
101135562 — www.symbaproject.eu.
