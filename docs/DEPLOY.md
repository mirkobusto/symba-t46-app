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
biobasedisadvisor.symbaproject.eu {
    reverse_proxy symba:8088
}
```

The frontend is built to call the API on **the same origin** it was loaded from (an empty
`VITE_BACKEND_URL` in a production build), so behind any domain no CORS configuration is
needed. Set `BACKEND_CORS_ORIGINS` only if the page is served from a different origin than the API.

## The public domain: biobasedisadvisor.symbaproject.eu

The tool is to live on a subdomain of the project website. Host names are case-insensitive: write it
in lowercase in every configuration (`biobasedisadvisor.symbaproject.eu`). What has to happen, and who does it:

1. **DNS** (whoever manages `symbaproject.eu`, which is the website's administrator): an `A` record (and
   `AAAA` if the server has IPv6) for `biobasedisadvisor` pointing at the public address of the server
   that runs this container, or a `CNAME` to the host name of the hosting provider. Until it exists the
   name does not resolve.
2. **A server with a public address** where ports 80 and 443 reach the reverse proxy. A machine reachable
   only through Tailscale (as the development one) is not publicly reachable under a custom domain; Tailscale
   Funnel serves `*.ts.net` names, not this one.
3. **TLS**: Caddy obtains and renews the certificate by itself (Let's Encrypt) once the DNS record points
   at the server and ports 80/443 are open; with nginx or Traefik use certbot or their ACME support.
4. **Secrets and data**: set `SYMBA_JWT_SECRET` (see below) before the first start, put the SQLite volume on
   disk that is backed up, and decide the hosting and retention details that the privacy notice
   (`/privacy`, currently a draft) leaves as placeholders.
5. **After the first start**, check from outside: `https://biobasedisadvisor.symbaproject.eu/health`,
   `/brand/logo.png` (image/png), `/fonts/pt-sans-latin-400.woff2` (font/woff2), `/privacy`, and that
   `/api/...` calls from the page succeed (open the browser's network tab once).
6. **Existing saved cases**: after an upgrade run `scripts/rerun_saved_cases.py` (see CLAUDE.md) so they show the
   current engine's output.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `SYMBA_PUBLIC_PORT` | 8088 | Host port to publish |
| `BACKEND_CORS_ORIGINS` | (defaults to localhost ports) | Comma-separated allowed CORS origins; only needed when the page and the API are on different origins |
| `SYMBA_JWT_SECRET` | (random per process) | Signing secret of the sign-in tokens. **Set it** (for instance `openssl rand -hex 32`) for any public deployment: without it every restart signs everybody out and the secret is not under your control |
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

- [x] Auth + role-based access control (Phase D — JWT + bcrypt, first
      registered user becomes admin)
- [x] `/api/scoring/*` restricted to the owner of the scored case (admins
      included); see "Authorization model" below
- [ ] Switch to PostgreSQL via `SYMBA_DB_URL` (Phase D)
- [ ] Alembic migrations (post-MVP)
- [ ] Sentry / APM (post-MVP)
- [ ] Rate limiting on `/api/scoring` ingest endpoint (post-MVP)
- [ ] Backup automation (cron) — see "Data backup" above
- [ ] HTTPS via reverse proxy (Caddy / Traefik / nginx) — see above

## Authorization model (what is open, what is not)

| Surface | Anonymous | Authenticated analyst | Admin |
|---|---|---|---|
| `/api/pipeline/*`, `/api/dcf/*` | open | open | open |
| `/api/cases` (legacy rows, `owner_id IS NULL`) | read + write | read + write | read + write |
| `/api/cases` (owned rows) | hidden (404) | own rows only | all rows |
| `/api/scoring/{case_id}` | follows the owning case | follows the owning case | all |
| `/api/public/*` (share links) | open by design | open | open |

Two deliberate gaps to keep in mind before announcing a public URL:

1. **Cases saved without a token have no owner**, so they stay
   world-writable — that is the pre-Phase-D MVP flow. If the deployment
   is public and the data is not demo data, require login in front of
   the app (reverse-proxy basic auth, or make the frontend hide the
   anonymous save path).
2. **Share links are unlisted, not private.** `/r/:slug/:audience`
   and the `/api/public/*` endpoints behind them resolve for anyone who
   has the URL, including for owned cases — that is the point of the
   Phase 7 share modal. Do not put confidential demo-region data behind
   a share link.

The pipeline and DCF endpoints are stateless computations over the body
the caller posts, so they carry no data of other users; they are left
open on purpose.

---

This Project has received funding from the European Union's Horizon
Europe Research and Innovation Programme under Grant Agreement N.
101135562 — www.symbaproject.eu.
