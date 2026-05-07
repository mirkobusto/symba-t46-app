# REPORT Sprint 1 — Repo scaffold

**Data**: 2026-05-07
**Branch codice**: `claude/project-scaffold-setup-DPIW9` (vedi nota in "Decisioni autonome prese", §1)
**Branch coordination**: stesso branch (report committato insieme allo scaffold — vedi §1)
**Tempo effettivo**: ~1h

## Contesto

Setup completo del monorepo SYMBA T4.6 secondo SPEC `coordination/specs/SPRINT_1_SPEC_scaffold.md`:
struttura cartelle, scaffold frontend (Vite/React/TS + Vitest), scaffold backend (FastAPI + SQLAlchemy + pytest), docker-compose dev-only, CI GitHub Actions, README root e cartella `coordination/` con sotto-cartelle aggiuntive (`reports/`, `reviews/`, `ADRs/`). Nessuna logica di business introdotta.

## Implementazione

### Frontend (`frontend/`)
- Bootstrap con `npm create vite@latest . -- --template react-ts` (Vite 8, React 19, TS 6 — versioni latest stable a 2026-05-07).
- Aggiunti Vitest 4, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- `vite.config.ts` riscritto importando `defineConfig` da `vitest/config` per ottenere il typing corretto del blocco `test` (jsdom + setupFiles).
- `src/setupTests.ts` con `import '@testing-library/jest-dom'`.
- `src/App.tsx` riscritto: titolo "SYMBA T4.6 — IS Assessment App" + componente `<HealthCheck />`.
- `src/components/HealthCheck.tsx`: fetch isolato di `/health`, stato `loading | ok | unreachable`, URL backend configurabile via `VITE_BACKEND_URL` (default `http://localhost:8000`).
- `src/__tests__/App.test.tsx`: render del titolo, fetch mocked via `vi.stubGlobal`.
- Script `package.json`: `test`, `test:watch` aggiunti; `lint` e `build` invariati.
- ESLint config (flat) generato da Vite — usato così com'è (regole React + TS).

### Backend (`backend/`)
- Layout `app/{main.py, db.py, models/, routers/, schemas/}` + `tests/`.
- `pyproject.toml`: deps runtime (`fastapi`, `uvicorn[standard]`, `sqlalchemy>=2`, `pydantic>=2`, `python-multipart`), deps dev (`pytest`, `httpx`, `ruff`); ruff target `py312`, line-length 100, regole `E,F,W,I,B,UP,N`.
- `app/main.py`: factory `create_app()`, CORS aperto a `http://localhost:5173` (e `127.0.0.1:5173`), include router health.
- `app/db.py`: SQLAlchemy 2 con `DeclarativeBase`, engine + sessionmaker creati lazy, default SQLite path `backend/data/app.db` (override via env `DATABASE_URL`). `data/` gitignorato.
- `app/routers/health.py`: `GET /health` → `{"status": "ok", "version": "0.0.1"}`.
- `tests/test_health.py`: pytest + `fastapi.testclient.TestClient`.
- `models/__init__.py` e `schemas/__init__.py`: placeholder con docstring.
- Setup locale via `uv venv --python 3.12` + `uv pip install -e ".[dev]"`.

### Docker (dev-only)
- `backend/Dockerfile`: `python:3.12-alpine`, `pip install -e ".[dev]"`, `uvicorn ... --reload`.
- `frontend/Dockerfile`: `node:20-alpine`, `npm install`, `npm run dev -- --host 0.0.0.0`.
- `docker-compose.yml`: due servizi (`backend`, `frontend`), bind-mount per hot-reload, volume nominato `/app/node_modules` per il frontend, env `VITE_BACKEND_URL=http://localhost:8000`. `docker compose config` valida.
- `.dockerignore` in entrambe le cartelle.

### CI (`.github/workflows/`)
- Due workflow separati per ottenere il path-filter richiesto dalla SPEC §3.5:
  - `ci.yml` → frontend (lint + test + build) su `frontend/**`.
  - `ci-backend.yml` → backend (ruff + pytest) su `backend/**`.
- Trigger: `push` su qualsiasi branch + `pull_request` su `main`.
- Node 20, Python 3.12. Cache npm via `actions/setup-node`.

### Root
- `README.md` riscritto: vision (link a master plan), stack, quickstart Docker, quickstart manuale (frontend + backend), albero repo, link a coordination.
- `.gitignore` standard Node + Python + macOS + IDE + `data/*.db`.
- `coordination/`: aggiunte sotto-cartelle `reports/`, `reviews/`, `ADRs/` con `.gitkeep`. Le sotto-cartelle preesistenti (`master-plan/`, `current-state/`, `specs/`) e i loro contenuti sono stati lasciati intatti.

## File toccati

```
.gitignore                                                 (new)
README.md                                                  (rewrite)
docker-compose.yml                                         (new)
.github/workflows/ci.yml                                   (new — frontend)
.github/workflows/ci-backend.yml                           (new — backend)

frontend/                                                  (Vite scaffold + extras)
├── .dockerignore                                          (new)
├── Dockerfile                                             (new)
├── eslint.config.js                                       (Vite default)
├── index.html                                             (Vite default)
├── package.json                                           (test scripts added)
├── package-lock.json                                      (new)
├── public/                                                (Vite default)
├── src/
│   ├── App.css                                            (Vite default)
│   ├── App.tsx                                            (rewritten)
│   ├── assets/                                            (Vite default)
│   ├── components/HealthCheck.tsx                         (new)
│   ├── index.css                                          (Vite default)
│   ├── main.tsx                                           (Vite default)
│   ├── setupTests.ts                                      (new)
│   ├── vite-env.d.ts                                      (Vite default)
│   └── __tests__/App.test.tsx                             (new)
├── tsconfig*.json                                         (Vite default; types augmented)
└── vite.config.ts                                         (extended for vitest)

backend/
├── .dockerignore                                          (new)
├── Dockerfile                                             (new)
├── README.md                                              (new)
├── pyproject.toml                                         (new)
├── app/
│   ├── __init__.py                                        (new)
│   ├── main.py                                            (new)
│   ├── db.py                                              (new)
│   ├── models/__init__.py                                 (new)
│   ├── routers/__init__.py                                (new)
│   ├── routers/health.py                                  (new)
│   └── schemas/__init__.py                                (new)
└── tests/
    ├── __init__.py                                        (new)
    └── test_health.py                                     (new)

coordination/
├── ADRs/.gitkeep                                          (new)
├── reports/.gitkeep                                       (new)
├── reports/SPRINT_1_REPORT.md                             (new — questo file)
└── reviews/.gitkeep                                       (new)
```

(I file `coordination/master-plan/MASTER_PLAN.md`, `coordination/current-state/_CURRENT_STATE.md`, `coordination/specs/SPRINT_1_SPEC_scaffold.md` erano già nel repo: non toccati.)

## Test

- **Vitest**: 1 test, 1 pass (`App.test.tsx` — render del titolo)
- **Pytest**: 1 test, 1 pass (`tests/test_health.py` — `/health` 200 + payload)
- **ESLint**: 0 warnings, 0 errors
- **Ruff**: 0 warnings, 0 errors
- **Frontend build**: OK (`vite build` → `dist/assets/index-*.js` 191 KB / gzip 60 KB; `index-*.css` 4.1 KB / gzip 1.5 KB)
- **Backend import**: OK (`python -c "from app.main import app"` → "SYMBA T4.6 — IS Assessment App")
- **`docker compose config`**: OK (yaml valido)

## Decisioni autonome prese

1. **Branch utilizzato**: `claude/project-scaffold-setup-DPIW9` (assegnato dall'harness) anziché `sprint/01-scaffold` come da SPEC §0/§7. L'istruzione harness "NEVER push to a different branch without explicit permission" ha la precedenza; segnalato a Mirko in chat. Mirko può rinominare il branch lato remoto, oppure rebase su `sprint/01-scaffold` post-merge.
2. **Branch coordination**: per la stessa ragione del punto 1, il `SPRINT_1_REPORT.md` è committato nello stesso branch dello scaffold invece che su un branch dedicato `sprint/01-scaffold-report`. Una sola PR invece di due.
3. **Dipendenze backend**: scelto `pyproject.toml` con setuptools + extras `[dev]`, gestito localmente con `uv` (più veloce, già installato), ma installabile anche con `pip install -e ".[dev]"` puro. Niente `requirements.txt` separato — la SPEC §6 lo permetteva.
4. **CI in due workflow** invece di uno con due job: necessario per applicare il `paths:` filter al trigger come richiesto dalla SPEC §3.5 (i path filter al trigger valgono per l'intero workflow; un workflow singolo con due job non distingue per path senza azioni esterne tipo `dorny/paths-filter`).
5. **Versioni Vite/React/TS più recenti** di quanto la SPEC implicasse: lo scaffolder `npm create vite` ha generato Vite 8 / React 19 / TS 6 / ESLint 10. Non ho fatto downgrade — sono le latest stable a 2026-05-07.
6. **`vite.config.ts`** importa `defineConfig` da `vitest/config` (non `vite`) per type-safety del blocco `test`. Senza questo cambio `tsc -b` falliva durante `npm run build`.
7. **`VITE_BACKEND_URL`**: aggiunta env var con fallback `http://localhost:8000` per rendere il frontend usabile sia in docker-compose (dove il backend è raggiungibile via host) sia in dev nudo. La SPEC chiedeva fetch hard-coded; questa è una piccolissima estensione difensiva.
8. **CORS**: incluso anche `http://127.0.0.1:5173` oltre a `localhost:5173`, dato che alcuni browser/configurazioni differenziano i due.
9. **Dockerfile backend**: alpine + `apk add build-base libffi-dev` per evitare problemi con wheel native (es. `uvloop`). Non production-ready ma sufficiente per dev.

## Domande/dubbi emersi durante l'implementazione (OBBLIGATORIA)

1. **Branch naming**: la SPEC è esplicita su `sprint/01-scaffold` ma l'harness istruisce esplicitamente a usare `claude/project-scaffold-setup-DPIW9` con vincolo "NEVER push to a different branch". Decisione presa autonomamente (vedi §1 sopra) ma vale conferma per gli sprint successivi: dobbiamo allineare le SPEC al naming harness, oppure rinominare lato GitHub dopo il merge?
2. **Coordination su branch separato**: la SPEC §7 prescriveva `sprint/01-scaffold-report` come branch dedicato per il report. Per coerenza con il vincolo harness ho committato il report sullo stesso branch dello scaffold. Va bene così o vuoi un workflow a due PR anche da Sprint 2 in poi?
3. **Versioni latest stable vs. pinning**: nessun pin esatto in `package.json` (`^` ranges generati dallo scaffolder Vite) né in `pyproject.toml` (`>=` mins). Per uno scaffold va bene; se vuoi reproducibility forte servirà `package-lock.json` committato (lo è) + per Python qualcosa tipo `uv lock`/`pip-tools`. Decidiamolo prima di Sprint 2 o quando emerge un primo bug da version drift.

## Manual QA gate post-fix per Mirko

Esegui da clone pulito post-merge su `main`:

- [ ] `git pull origin main`
- [ ] `docker compose up --build` — entrambi i servizi partono senza errore
- [ ] Browser su `http://localhost:5173` → vedi titolo "SYMBA T4.6 — IS Assessment App" e riga "Backend: OK"
- [ ] `curl http://localhost:8000/health` → `{"status":"ok","version":"0.0.1"}`
- [ ] `cd frontend && npm install && npm run lint && npm run test && npm run build` — tutti pass
- [ ] `cd backend && uv venv --python 3.12 && source .venv/bin/activate && uv pip install -e ".[dev]" && ruff check . && pytest` — tutti pass
- [ ] `ls coordination/` mostra `master-plan current-state specs reports reviews ADRs` (più i `.gitkeep`)
- [ ] GitHub Actions: i workflow CI partono sulla PR/branch e passano (eventualmente solo uno dei due se la PR successiva tocca solo un sotto-progetto — è il comportamento atteso dato il `paths:` filter)

**Ground-truth regression**: nessuna (primo sprint).

## Carry-over

Nessuno per lo scaffold. Punti aperti rimandati a sprint futuri (riferimento SPEC §9):
- Logica business (questionario, pathway, template) → Sprint 2-7
- Import JSON logic table Kimi → Sprint 2 (sblocco post Sprint 0 review)
- UI library / styling → Sprint 3
- State management frontend → Sprint 3
- Auth, multi-utente, deploy prod → fuori MVP
- E2E (Playwright) → Sprint 8

## Commit

- Codice + report: branch `claude/project-scaffold-setup-DPIW9` (hash registrato al push).
