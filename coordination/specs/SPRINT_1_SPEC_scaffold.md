# SPEC Sprint 1 — Repo scaffold (frontend + backend + coordination + CI)

| | |
|---|---|
| **Sprint ID** | sprint/01-scaffold |
| **Branch codice** | `sprint/01-scaffold` |
| **Branch coordination** | `sprint/01-scaffold-report` |
| **Base** | `main` (vuoto o solo README iniziale) |
| **Lingua** | Italiano nei commenti SPEC; inglese nel codice e nei file utente |
| **Stima** | ~1.5h (single-shot OK, ma se sfori >1h committa parziale e segnala) |
| **Owner** | Claude Code on the web |

---

## §0 Override harness — istruzione esplicita

Hai full control sul repo `https://github.com/mirkobusto/symba-t46-app`. Crea branch, commit, push, apri PR. Mirko approva manualmente i merge dopo manual QA. Niente test environment esterno richiesto: lavora solo sul repo. Se trovi inconsistenze nella SPEC, **non assumere** — segnala in summary di chiusura sessione (sezione "Domande/dubbi emersi"), implementa la versione minima ragionevole, marca come decisione autonoma.

## §1 Contesto

Progetto **SYMBA T4.6 IS Assessment App**: web app che operazionalizza guideline LCA/LCC/S-LCA in un tool di scoping per casi di simbiosi industriale. Vedi `coordination/master-plan/MASTER_PLAN.md` per vision completa.

Stack confermato (ADR-001):
- **Frontend**: React 18 + TypeScript + Vite + ESLint + Vitest + React Testing Library
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy + SQLite + Pydantic v2 + pytest + ruff
- **Repo**: monorepo pubblico, tre cartelle top-level

**Stato attuale**: greenfield. Repo creato vuoto da Mirko (potrebbe contenere solo un README iniziale o `.gitignore`). Tu sei il primo a pushare struttura.

## §2 Diagnostica preliminare — cosa NON re-investigare

- **NON** discutere lo stack — è deciso (ADR-001).
- **NON** introdurre Docker production setup, deploy CI/CD, autenticazione, multi-tenant — out of scope MVP.
- **NON** scrivere logica business (questionario, pathway, generazione template) — solo scaffold strutturale.
- **NON** importare il JSON logic table Kimi nel codice — è bloccato fino a chiusura Sprint 0 (review).

## §3 Decisioni di design già concordate

1. **Monorepo struttura**:
   ```
   /
   ├── frontend/            # React + TS + Vite
   ├── backend/             # FastAPI + Python
   ├── coordination/        # SPEC, REPORT, MASTER_PLAN, CURRENT_STATE
   ├── docker-compose.yml   # dev only (frontend hot reload + backend uvicorn reload + sqlite volume)
   ├── README.md            # root, istruzioni dev setup
   └── .gitignore           # node_modules, __pycache__, *.db, .venv, dist, etc.
   ```

2. **Frontend**: bootstrap con `npm create vite@latest frontend -- --template react-ts`, poi configurazione manuale ESLint + Vitest + React Testing Library. Niente UI library nello sprint scaffold (Tailwind, MUI, etc. — decisione rimandata a SPEC Sprint 3).

3. **Backend**: layout `backend/app/` con `main.py` (FastAPI app), `db.py` (SQLAlchemy engine/session), `models/` (vuoto, placeholder), `routers/` (vuoto, placeholder con un health router come esempio), `schemas/` (vuoto). `pyproject.toml` con dipendenze (preferisci uv o pip-tools — scelta autonoma).

4. **Coordination**: cartella vuota con sotto-cartelle `master-plan/`, `current-state/`, `specs/`, `reports/`, `reviews/`, `ADRs/`. Ognuna con un `.gitkeep` o un README placeholder. **Importante**: i file `MASTER_PLAN.md`, `_CURRENT_STATE.md`, `SPRINT_1_SPEC_scaffold.md` saranno copiati da Mirko (te li passa via paste); tu non li generi.

5. **CI**: GitHub Actions minimale (`.github/workflows/ci.yml`). Due job:
   - `frontend-lint-test`: triggera su modifiche a `frontend/**`, esegue `npm ci && npm run lint && npm run test`
   - `backend-lint-test`: triggera su modifiche a `backend/**`, esegue `pip install -e .[dev] && ruff check . && pytest`
   - Path filter: usa `paths:` nel trigger
   - Niente deploy, niente E2E nello scaffold

6. **README root**: istruzioni dev quickstart (clone → `docker-compose up` o setup manuale → URL frontend dev + backend dev + healthcheck).

7. **Health endpoint**: `GET /health` su backend che ritorna `{"status": "ok", "version": "0.0.1"}`. Test pytest che verifica.

8. **Frontend pagina di default**: una sola pagina vuota con titolo "SYMBA T4.6 — IS Assessment App" e un fetch del `/health` backend per mostrare "Backend reachable: OK / FAIL". Test Vitest che verifica il render del titolo.

## §4 Implementazione richiesta

### Step 4.1 — Branch + struttura cartelle root

```bash
git checkout -b sprint/01-scaffold
mkdir -p frontend backend coordination/{master-plan,current-state,specs,reports,reviews,ADRs}
touch coordination/master-plan/.gitkeep coordination/current-state/.gitkeep coordination/specs/.gitkeep coordination/reports/.gitkeep coordination/reviews/.gitkeep coordination/ADRs/.gitkeep
```

### Step 4.2 — Frontend scaffold

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Configura:
- `vite.config.ts` con `test` block per Vitest (jsdom environment, setupFiles)
- `src/setupTests.ts` con `import '@testing-library/jest-dom'`
- `package.json` script `"test": "vitest run"`, `"test:watch": "vitest"`, `"lint": "eslint . --ext .ts,.tsx"`
- ESLint config base (Vite ne crea uno default; verifica e completa)
- `src/App.tsx` con titolo "SYMBA T4.6 — IS Assessment App" + componente `<HealthCheck />` che fa `fetch('http://localhost:8000/health')` e mostra "Backend: OK" / "Backend: unreachable"
- `src/components/HealthCheck.tsx` componente isolato
- `src/__tests__/App.test.tsx` test Vitest che verifica render del titolo (mock fetch)

### Step 4.3 — Backend scaffold

```bash
cd backend
# usa uv o pip-tools, scelta autonoma documentata
```

Layout:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app + CORS middleware (allow localhost:5173)
│   ├── db.py            # SQLAlchemy engine + SessionLocal + Base
│   ├── models/__init__.py    # vuoto, placeholder
│   ├── routers/
│   │   ├── __init__.py
│   │   └── health.py    # GET /health
│   └── schemas/__init__.py   # vuoto, placeholder
├── tests/
│   ├── __init__.py
│   └── test_health.py   # pytest + httpx TestClient verifica /health
├── pyproject.toml       # dipendenze + ruff config + pytest config
└── README.md            # istruzioni avvio locale
```

Dipendenze runtime: `fastapi`, `uvicorn[standard]`, `sqlalchemy>=2.0`, `pydantic>=2`, `python-multipart`.
Dipendenze dev: `pytest`, `httpx`, `ruff`.

`db.py` con SQLite path `./data/app.db` (cartella `data/` in `.gitignore`), engine creato lazy.

### Step 4.4 — docker-compose.yml (dev only)

Due servizi:
- `backend`: build da `backend/`, command `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`, mount `./backend:/app`, expose 8000
- `frontend`: build da `frontend/`, command `npm run dev -- --host 0.0.0.0`, mount `./frontend:/app`, expose 5173

Volume per SQLite: `./backend/data:/app/data`.

Dockerfile minimali in entrambe le cartelle (alpine per backend, node:20 per frontend).

### Step 4.5 — CI GitHub Actions

`.github/workflows/ci.yml`:
- Trigger: push su qualsiasi branch + PR su main
- Job `frontend`: paths `frontend/**`, ubuntu-latest, setup Node 20, install, lint, test
- Job `backend`: paths `backend/**`, ubuntu-latest, setup Python 3.12, install, ruff check, pytest

### Step 4.6 — README root

Sezioni:
1. Cos'è (1 paragrafo, link a `coordination/master-plan/MASTER_PLAN.md` per vision)
2. Stack
3. Quickstart dev (docker-compose up + URL)
4. Quickstart dev senza Docker (frontend + backend separati)
5. Struttura repo (albero)
6. Link a coordination

### Step 4.7 — .gitignore root

Standard per Node + Python + macOS + IDE: `node_modules/`, `dist/`, `__pycache__/`, `*.pyc`, `.venv/`, `data/*.db`, `.DS_Store`, `.idea/`, `.vscode/` (eccetto `settings.json` se usato).

## §5 File toccati attesi

**Range orientativo: 25-40 file nuovi.**

```
.gitignore
README.md
docker-compose.yml
.github/workflows/ci.yml

frontend/package.json
frontend/tsconfig.json
frontend/vite.config.ts
frontend/.eslintrc.cjs
frontend/index.html
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/setupTests.ts
frontend/src/components/HealthCheck.tsx
frontend/src/__tests__/App.test.tsx
frontend/Dockerfile
frontend/.gitignore  (può essere root-level only, scelta tua)

backend/pyproject.toml
backend/Dockerfile
backend/app/__init__.py
backend/app/main.py
backend/app/db.py
backend/app/models/__init__.py
backend/app/routers/__init__.py
backend/app/routers/health.py
backend/app/schemas/__init__.py
backend/tests/__init__.py
backend/tests/test_health.py
backend/README.md

coordination/{master-plan,current-state,specs,reports,reviews,ADRs}/.gitkeep
```

**NON toccare** (non esistono ancora, ma per chiarezza futura): qualsiasi cosa relativa al questionario, alla logic table Kimi, alla generazione template. Sprint successivi.

## §6 Decisioni autonome consentite

- Scelta tra `uv`, `pip-tools`, `requirements.txt` plain per dipendenze backend (preferisci uv se disponibile, altrimenti pyproject standard pip-installabile).
- Versioni esatte delle dipendenze (usa latest stable a 2026-05-07).
- Configurazione esatta ESLint (parti dal default Vite e adatta).
- Configurazione esatta ruff (linea 100, target py312, regole standard).
- Eventuale uso di `taskipy` o Makefile per script comuni — opzionale.
- Nome esatto dei test file (purché siano scoperti automaticamente da pytest e vitest).
- Aggiunte minori al README se utili (badges CI, license note, contributing).

**Documenta ogni decisione autonoma nella sezione "Decisioni autonome prese" del REPORT.**

## §7 Workflow ordinato (paste-ready)

```bash
# 1. Setup branch codice
git clone https://github.com/mirkobusto/symba-t46-app.git
cd symba-t46-app
git checkout -b sprint/01-scaffold

# 2. Setup branch coordination (stesso repo, branch dedicato per il report)
# Lavorerai sullo stesso clone; il branch coordination è solo per il report.
# Per ora resta su sprint/01-scaffold.

# 3. Implementazione
#    Esegui Step 4.1 → 4.7 in ordine
#    Commit logici intermedi se sensato (es. "frontend scaffold", "backend scaffold", "ci+docker", "readme")

# 4. Test locale
cd frontend && npm run lint && npm run test && cd ..
cd backend && ruff check . && pytest && cd ..
docker-compose config  # verifica syntax

# 5. Build verifica frontend
cd frontend && npm run build && cd ..

# 6. Commit finale + push
git add -A
git commit -m "Sprint 1: repo scaffold (frontend + backend + coordination + CI)"
git push origin sprint/01-scaffold

# 7. Apri PR codice
gh pr create --title "Sprint 1: repo scaffold" --body "Vedi coordination/reports/SPRINT_1_REPORT.md"

# 8. Append report al coordination
git checkout -b sprint/01-scaffold-report
# Crea coordination/reports/SPRINT_1_REPORT.md (template sotto)
git add coordination/reports/SPRINT_1_REPORT.md
git commit -m "Sprint 1 report"
git push origin sprint/01-scaffold-report
gh pr create --title "Sprint 1 report" --body "Report di chiusura Sprint 1"

# 9. Summary di chiusura sessione (in chat con Mirko)
#    Vedi §9 sotto
```

### Template REPORT (`coordination/reports/SPRINT_1_REPORT.md`)

```markdown
# REPORT Sprint 1 — Repo scaffold

**Data**: YYYY-MM-DD
**Branch codice**: sprint/01-scaffold (PR #X)
**Branch coordination**: sprint/01-scaffold-report (PR #Y)
**Tempo effettivo**: ~Xh

## Contesto
(1 paragrafo: cosa è stato fatto)

## Implementazione
(elenco cose fatte, sezione per sezione: frontend, backend, CI, docker, readme)

## File toccati
(albero file aggiunti/modificati)

## Test
- Vitest: X test, X pass
- Pytest: X test, X pass
- ESLint: X warnings/errors
- Ruff: X warnings/errors
- Frontend build: OK / FAIL (size: XKB)

## Decisioni autonome prese
(elenco numerato, ognuna con razionale)

## Domande/dubbi emersi durante l'implementazione (OBBLIGATORIA)
(anche se vuota, scrivere "Nessuno" esplicito)

## Manual QA gate post-fix per Mirko
(checklist concreta — vedi §8 sotto)

## Carry-over
(nulla atteso per scaffold; se emerge qualcosa, elencare con priorità)

## Commit
- Codice: <hash> su sprint/01-scaffold
- Coordination: <hash> su sprint/01-scaffold-report
```

## §8 Manual QA gate post-fix (per Mirko)

Dopo merge della PR Sprint 1, Mirko esegue questi step:

1. `git pull origin main` su clone locale
2. `docker-compose up --build` — verifica entrambi i servizi partono senza errori
3. Apri browser su `http://localhost:5173` — vedi titolo "SYMBA T4.6 — IS Assessment App" e "Backend: OK"
4. `curl http://localhost:8000/health` — risposta `{"status": "ok", ...}`
5. `cd frontend && npm run test` — tutti pass
6. `cd backend && pytest` — tutti pass
7. Verifica struttura `coordination/` esiste con tutte le sotto-cartelle e `.gitkeep`
8. Verifica CI passa su entrambi i job (GitHub UI)

**Ground-truth regression**: nessuna (è il primo sprint, non c'è regressione possibile).

Se uno qualsiasi degli step fallisce, Mirko apre issue, scriviamo SPEC hotfix.

## §9 Out-of-scope esplicito (carry-over confermati per sprint successivi)

- **Logica business**: questionario, pathway resolution, generazione template → Sprint 2-7
- **Import JSON logic table Kimi**: bloccato fino a chiusura Sprint 0 review → Sprint 2
- **UI library / styling sistematico**: decisione rimandata a Sprint 3
- **State management frontend**: decisione rimandata a Sprint 3
- **Auth, multi-utente, deploy prod**: fuori MVP
- **E2E test (Playwright)**: Sprint 8

## §10 Definition of Done

- [ ] Repo `https://github.com/mirkobusto/symba-t46-app` ha branch `sprint/01-scaffold` e `sprint/01-scaffold-report` pushed
- [ ] Frontend builda senza warning critici (`npm run build`)
- [ ] Backend importa senza errori (`python -c "from app.main import app"`)
- [ ] Vitest e pytest passano al 100% (anche se solo 1-2 test ciascuno)
- [ ] `docker-compose config` valida (yaml ben formato)
- [ ] CI workflow `.github/workflows/ci.yml` esiste e ha entrambi i job
- [ ] README root contiene istruzioni dev quickstart funzionanti
- [ ] Cartella `coordination/` esiste con tutte le sotto-cartelle attese
- [ ] PR codice e PR coordination aperte (non necessariamente mergeate — Mirko fa merge dopo manual QA)
- [ ] Report `coordination/reports/SPRINT_1_REPORT.md` completato con TUTTE le sezioni del template, inclusa "Domande/dubbi emersi" (anche se "Nessuno")
- [ ] Summary di chiusura sessione in chat con Mirko (vedi §11)

## §11 Summary di chiusura sessione

Al termine, scrivi a Mirko in chat un summary breve con:

1. Sprint chiuso? (sì / parziale / fallito)
2. PR aperte (link)
3. Test results sintetici
4. Decisioni autonome chiave (se più di 2-3, menzionale)
5. Domanda QA esplicita: "Mirko, esegui i punti del manual QA gate post-fix in §8 della SPEC e confermami quando hai fatto. Se qualcosa fallisce, riportami output esatto del comando."

**Non chiudere il task Claude Code prima del summary in chat.**

---

**Fine SPEC Sprint 1.**
