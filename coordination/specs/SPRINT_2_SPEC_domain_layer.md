# SPEC Sprint 2 — Domain layer backend (decision engine + persistence + REST API)

| | |
|---|---|
| **Sprint ID** | sprint/02-domain-layer |
| **Branch codice** | `sprint/02-domain-layer` |
| **Branch coordination** | `sprint/02-domain-layer-report` |
| **Base** | `main` (post merge Sprint 1) |
| **Lingua** | Italiano nei commenti SPEC; inglese in codice e docstrings |
| **Stima** | ~3-4h (split possibile in 2 sotto-sprint, vedi §11) |
| **Owner** | Claude Code on the web |

---

## §0 Override harness — istruzione esplicita

Hai full control sul repo `https://github.com/mirkobusto/symba-t46-app` (branch dedicato). Crea branch da `main`, commit, push, apri PR. Mirko approva manualmente i merge dopo manual QA. Niente test environment esterno richiesto: lavora solo sul repo.

Se trovi inconsistenze nella SPEC o nel JSON v2 (file `backend/app/data/lcsa_decision_engine.v2.json`), **non assumere** — segnala in summary di chiusura sessione (sezione "Domande/dubbi emersi"), implementa la versione minima ragionevole, marca come decisione autonoma.

**Se durante l'implementazione superi 2.5h di lavoro effettivo**, fermati e committa parziale con stato chiaro nel REPORT — non spingere oltre rischiando code di bassa qualità. Vedi §11 per istruzioni di split.

## §1 Contesto

Progetto **SYMBA T4.6 IS Assessment App**. Sprint 1 ha consegnato lo scaffold (frontend + backend + CI). Ora dobbiamo implementare il **domain layer del backend**: il motore decisionale che, dato un set di risposte alle 10 domande del questionario, classifica il caso IS in uno dei 10 pathway terminali (LCSA-P1..P10) e produce una configurazione metodologica completa.

**Asset critico in input**: `coordination/data/lcsa_decision_engine.v2.json` — il decision engine validato durante Sprint 0 (Architect chat). Questo file è la **fonte di verità** della logica business. Niente logica decisionale può essere hard-codata in Python — tutto deve venire dal JSON.

## §2 Diagnostica preliminare — cosa NON re-investigare

- **NON** discutere lo schema del JSON v2 — è autoritative (deciso ADR-003 + ADR-004).
- **NON** modificare il file `lcsa_decision_engine.v2.json` (read-only per Sprint 2). Se trovi bug nel JSON, segnalali nel REPORT, NON fixare in autonomia.
- **NON** implementare logica frontend in questo sprint (Sprint 3).
- **NON** implementare generazione protocollo docx (Sprint 5) né template xlsx (Sprint 6).
- **NON** introdurre autenticazione utente — sessioni anonime via UUID.
- **NON** introdurre database diversi da SQLite (deciso ADR-001).

## §3 Decisioni di design già concordate

### 3.1 Setup file JSON

Prima di tutto, copia il file JSON dal coordination al backend:

```bash
mkdir -p backend/app/data
cp coordination/data/lcsa_decision_engine.v2.json backend/app/data/
```

Il file diventa parte del package backend (committato). Quando Architect aggiorna il JSON in `coordination/data/`, lo sprint successivo aggiorna anche la copia in `backend/app/data/`. Per Sprint 2, il JSON è frozen.

### 3.2 Architettura del domain layer

```
backend/app/
├── data/
│   └── lcsa_decision_engine.v2.json    # source of truth
├── domain/
│   ├── __init__.py
│   ├── engine.py                        # DecisionEngine class (loader + resolver)
│   ├── models_domain.py                 # Pydantic models (Question, Pathway, Configuration, etc.)
│   └── validators.py                    # blocked_combinations + global_invariants checks
├── models/
│   ├── __init__.py
│   ├── session.py                       # SQLAlchemy Session model
│   ├── answer.py                        # SQLAlchemy Answer model
│   └── pathway_resolution.py            # SQLAlchemy PathwayResolution model
├── schemas/
│   ├── __init__.py
│   ├── session_schemas.py               # Pydantic request/response schemas
│   └── pathway_schemas.py               # Pydantic schemas per pathway output
├── routers/
│   ├── health.py                        # esistente
│   ├── sessions.py                      # NEW: sessions endpoints
│   └── decision_engine.py               # NEW: questions metadata endpoint
└── ... (db.py, main.py invariati salvo wiring nuovi router)
```

**Separazione chiara**:
- `domain/` = pure Python business logic (no DB, no FastAPI). Testabile in isolamento.
- `models/` = SQLAlchemy ORM models (DB).
- `schemas/` = Pydantic request/response (API).
- `routers/` = FastAPI routers (HTTP layer).

### 3.3 Modelli SQLAlchemy

**`Session`** (sessione assessment dell'utente):
- `id: UUID` (primary key, default uuid4)
- `created_at: datetime` (default now)
- `updated_at: datetime` (auto-update on change)
- `status: enum` (`draft`, `answers_complete`, `pathway_resolved`, `archived`)
- `case_name: str | None` (nome opzionale del caso, es. "Sunflower-Compost-Park")
- `notes: str | None` (note utente)
- relationships: `answers` (1-to-many), `pathway_resolution` (1-to-1)

**`Answer`** (singola risposta a una domanda):
- `id: int` (primary key autoincrement)
- `session_id: UUID` (foreign key)
- `question_id: str` (es. "q1", "q2", ..., "q10")
- `value: str` (JSON-serialized se necessario per booleani; valori delle option)
- `created_at: datetime`
- `updated_at: datetime`
- unique constraint su `(session_id, question_id)` — una risposta per domanda per sessione

**`PathwayResolution`** (output del motore decisionale per una sessione):
- `id: int` (primary key autoincrement)
- `session_id: UUID` (foreign key, unique — 1-to-1 con Session)
- `pathway_id: str | None` (es. "LCSA-P1"; None se BLOCKED)
- `pathway_name: str | None`
- `configuration_json: str` (JSON-serialized config completa LCA+LCC+S-LCA, dopo post-processing)
- `applied_rules: str` (JSON list di rule_id applicate)
- `warnings: str` (JSON list di warning)
- `blocked: bool` (True se la combinazione è bloccata)
- `block_id: str | None` (es. "BLOCK-01" se bloccata)
- `block_message: str | None` (user_message della regola di blocco)
- `block_resolutions: str | None` (JSON list di suggested_resolutions)
- `resolved_at: datetime`

### 3.4 DecisionEngine class

Classe singola in `domain/engine.py`. Carica il JSON una volta sola (cached singleton via `lru_cache` o module-level `_engine` instance).

API pubblica:

```python
class DecisionEngine:
    def __init__(self, json_path: Path): ...
    
    # Metadata access
    def get_questions(self) -> list[QuestionMetadata]: ...
    def get_question(self, q_id: str) -> QuestionMetadata: ...
    
    # Validation
    def validate_answer(self, q_id: str, value: Any) -> ValidationResult: ...
    def check_blocked(self, answers: dict[str, Any]) -> BlockedCheckResult: ...
    
    # Resolution
    def resolve_pathway(self, answers: dict[str, Any]) -> PathwayResolution: ...
    
    # Helpers
    def list_pathways(self) -> list[PathwayMetadata]: ...
    def get_pathway(self, pathway_id: str) -> PathwayMetadata: ...
```

`PathwayResolution` (Pydantic, non SQLAlchemy — è il valore di ritorno dell'engine, separato dal modello DB):

```python
class PathwayResolution(BaseModel):
    pathway_id: str | None             # None se BLOCKED
    pathway_name: str | None
    configuration: dict | None         # LCA + LCC + S-LCA dopo post-processing
    applied_rules: list[str]           # ["RULE-01", "RULE-02"]
    warnings: list[str]
    blocked: bool = False
    block_info: BlockInfo | None = None  # populato se blocked=True
    trace: list[TraceEntry]            # consolidato pathway-level + question-level
```

### 3.5 Algoritmo di resolve_pathway

```python
def resolve_pathway(self, answers: dict) -> PathwayResolution:
    # Step 1: Validate completeness — devono esserci tutte le 10 risposte
    if not self._all_answered(answers):
        raise IncompleteAnswersError(missing=...)
    
    # Step 2: Validate individual answers vs question schemas
    for q_id, value in answers.items():
        result = self.validate_answer(q_id, value)
        if not result.valid:
            raise InvalidAnswerError(q_id=q_id, ...)
    
    # Step 3: Check blocked_combinations
    block_result = self.check_blocked(answers)
    if block_result.blocked:
        return PathwayResolution(
            blocked=True,
            block_info=block_result.block_info,
            ...
        )
    
    # Step 4: Match exact answer fingerprint to a pathway
    matched_pathway = self._find_exact_match(answers)
    
    # Step 5: If no exact match, find closest pathway by Hamming distance
    if matched_pathway is None:
        matched_pathway = self._find_closest_pathway(answers)
    
    # Step 6: Apply post_processing_rules sequentially
    config = deepcopy(matched_pathway.configuration)
    applied_rules = []
    for rule in self.post_processing_rules:
        if self._rule_triggers(rule, answers):
            config = self._apply_rule(rule, config, answers)
            applied_rules.append(rule.id)
    
    # Step 7: Validate global_invariants
    invariant_violations = self._check_invariants(config)
    if invariant_violations:
        # Log warning ma non bloccare — invariants sono safety net
        warnings.extend([...])
    
    # Step 8: Consolidate trace (pathway-level + question-level + rule-level)
    trace = self._consolidate_trace(matched_pathway, answers, applied_rules)
    
    return PathwayResolution(
        pathway_id=matched_pathway.id,
        pathway_name=matched_pathway.name,
        configuration=config,
        applied_rules=applied_rules,
        warnings=matched_pathway.warnings + warnings,
        trace=trace
    )
```

### 3.6 Hamming distance per fallback matching

Quando nessun pathway ha exact match (caso comune dato il bug Q8 documentato in Sprint 0), trova il pathway con minore Hamming distance. Pesi:
- Q1 (ILCD), Q3 (LCC type), Q7 (multifunctionality): peso 5 (sono dominant variables)
- Q2 (temporal), Q5 (typology), Q9 (spatial): peso 3
- Q4 (FU), Q6 (Low-TRL), Q8 (public), Q10 (uncertainty): peso 1

Il pathway con minor distanza pesata vince. Se distanza > soglia (es. 10), ritorna warning "no good match found, closest is LCSA-Px with caveats".

Implementazione semplice in `domain/engine.py` come metodo privato.

### 3.7 Endpoint REST

| Metodo | Path | Descrizione |
|---|---|---|
| `GET` | `/api/decision-engine/questions` | Ritorna lista delle 10 domande con metadata (per il frontend) |
| `GET` | `/api/decision-engine/pathways` | Ritorna lista pathway disponibili (utile per debug + galleria esempi futura) |
| `POST` | `/api/sessions` | Crea nuova sessione, ritorna `{id, status}` |
| `GET` | `/api/sessions/{id}` | Ritorna stato sessione + answers + (eventuale) pathway |
| `PATCH` | `/api/sessions/{id}` | Aggiorna metadata sessione (case_name, notes) |
| `POST` | `/api/sessions/{id}/answers` | Submit risposte (parziali OK; salva quelle valide, ritorna stato) |
| `POST` | `/api/sessions/{id}/resolve` | Forza resolve pathway su answers correnti; salva PathwayResolution. Errore 400 se incomplete/invalid. |
| `GET` | `/api/sessions/{id}/pathway` | Ritorna PathwayResolution (404 se non risolto) |
| `DELETE` | `/api/sessions/{id}` | Soft delete (status → archived) |

**Endpoint stub per sprint successivi** (definiti ma con 501 Not Implemented):
- `GET /api/sessions/{id}/protocol` (Sprint 5)
- `GET /api/sessions/{id}/data-template` (Sprint 6)

### 3.8 CORS configuration

Il backend deve accettare richieste da `localhost:5173` (frontend Vite dev server). Aggiungere CORS middleware in `main.py` con `allow_origins=["http://localhost:5173"]`. Configuration via env var `BACKEND_CORS_ORIGINS` per flessibilità futura, default a `["http://localhost:5173"]`.

### 3.9 Database initialization

All'avvio dell'app FastAPI: creare tabelle se non esistono (`Base.metadata.create_all(engine)`). Per MVP non usiamo Alembic — quando Sprint successivi richiederanno migration, introdurremo Alembic. Per ora, schema versioning via codice.

Path SQLite: `./data/app.db` (cartella `backend/data/`, gitignored, creata al primo avvio).

## §4 Implementazione richiesta

### Step 4.1 — Setup branch + struttura

```bash
git checkout main && git pull
git checkout -b sprint/02-domain-layer

mkdir -p backend/app/data backend/app/domain
cp coordination/data/lcsa_decision_engine.v2.json backend/app/data/
```

### Step 4.2 — Modelli Pydantic domain (`domain/models_domain.py`)

Definisci modelli per il decision engine basati sullo schema del JSON v2:

- `QuestionOption` (value, label)
- `TraceEntry` (deliverable, section, node_id, node_type)
- `QuestionMetadata` (id, key, label, description, options, trace, post_processing_trigger?)
- `BlockedCombination` (id, trigger, user_message, suggested_resolutions, severity, blocking, violated_constraints, trace)
- `PathwayConfiguration` con sub-models `LCAConfig`, `LCCConfig`, `SLCAConfig` (dict permissivo per MVP — i campi sono ~15-20 per ciascuno, e non tutti i pathway li usano tutti)
- `PathwayMetadata` (id, name, description, answer_fingerprint, configuration, trace, warnings, use_cases_examples)
- `PostProcessingRule` (id, patch_origin, trigger, modifications, rationale, trace)
- `GlobalInvariant` (id, rule, rationale, violation_severity)
- `BlockInfo` (block_id, message, suggested_resolutions, violated_constraints)
- `PathwayResolution` (modello finale ritornato dall'engine; separato dal SQLAlchemy model con stesso nome — disambiguare nei moduli)

Per chiarezza naming: rinominare il SQLAlchemy model in `models/pathway_resolution.py` come `PathwayResolutionRecord` se il name clash è problematico. Decisione autonoma di Claude Code.

### Step 4.3 — DecisionEngine class (`domain/engine.py`)

Implementa la classe `DecisionEngine` come specificato in §3.4 + §3.5.

Lazy loading: il JSON è caricato la prima volta che si istanzia l'engine. Singleton per il processo backend (un'istanza condivisa via dependency injection in FastAPI):

```python
@lru_cache(maxsize=1)
def get_decision_engine() -> DecisionEngine:
    json_path = Path(__file__).parent.parent / "data" / "lcsa_decision_engine.v2.json"
    return DecisionEngine(json_path=json_path)
```

In FastAPI, usa `Depends(get_decision_engine)` nei router.

### Step 4.4 — Validators (`domain/validators.py`)

Estrai logica di validazione dal `DecisionEngine` per testabilità:

```python
def check_blocked_combinations(
    answers: dict[str, Any], 
    blocked_rules: list[BlockedCombination]
) -> BlockedCheckResult:
    """Itera sulle blocked rules. Ritorna prima HARD block trovata, oppure
    accumula warnings (severity=warning, blocking=False) e ritorna lista."""
    ...

def check_global_invariants(
    config: dict, 
    invariants: list[GlobalInvariant]
) -> list[InvariantViolation]:
    """Verifica invarianti post-config. Logga violations."""
    ...
```

Il matching dei trigger (`{"q1": "C2", "q3_contains": "E-LCC"}`) richiede un piccolo matcher:
- Chiavi semplici (`q1`): match esatto
- Chiavi con suffisso `_contains`: il valore della risposta contiene la stringa
- Chiavi con suffisso `_in`: il valore della risposta è in una lista
- Chiavi con suffisso `_neq`: il valore della risposta è diverso

Documenta le convenzioni con docstring esplicito + 3-4 unit test su edge cases.

### Step 4.5 — SQLAlchemy models (`models/`)

Ognuno in file dedicato. Usa SQLAlchemy 2.0 declarative style (`Mapped[...]`, `mapped_column(...)`).

UUID handling: SQLite non ha tipo UUID nativo. Usa `String(36)` con default `lambda: str(uuid4())`. La conversione UUID/str è gestita da Pydantic schemas.

Enum status: usa `String` con validazione lato Pydantic (più portabile di SQLAlchemy Enum su SQLite).

### Step 4.6 — Pydantic schemas (`schemas/`)

Request/response schemas per API. Convertono tra HTTP layer (JSON) e SQLAlchemy/domain layer (Python objects).

Esempi:
- `SessionCreateRequest` (vuoto, sessione auto-generata)
- `SessionResponse` (id, created_at, status, case_name, notes, answers_count, pathway_resolved)
- `AnswerSubmitRequest` (question_id, value)
- `AnswersBulkSubmitRequest` (list di AnswerSubmitRequest, atomico)
- `PathwayResolutionResponse` (pathway_id, pathway_name, configuration, applied_rules, warnings, blocked, block_info, trace)

### Step 4.7 — Routers (`routers/sessions.py`, `routers/decision_engine.py`)

Implementa endpoint come da §3.7. Tutti i router sotto `/api/...`.

Dependency injection per:
- `get_db()` (SQLAlchemy session)
- `get_decision_engine()` (DecisionEngine singleton)

Error handling: HTTP 400 per bad request, 404 per not found, 422 per validation errors (Pydantic auto-handles), 500 per server errors (logga con stack trace).

### Step 4.8 — Wiring in main.py

```python
from app.routers import health, sessions, decision_engine
app.include_router(health.router, prefix="/api")
app.include_router(decision_engine.router, prefix="/api/decision-engine")
app.include_router(sessions.router, prefix="/api/sessions")
```

CORS middleware come da §3.8.

### Step 4.9 — Test pytest

**Test domain layer** (`backend/tests/test_engine.py`):
- `test_engine_loads_json()` — engine si istanzia senza errori
- `test_get_questions()` — ritorna 10 questions
- `test_validate_answer_valid()` — q1=A è valida
- `test_validate_answer_invalid()` — q1=Z è invalida
- `test_check_blocked_C2_ELCC()` — combinazione (C2, E-LCC) blocca con BLOCK-01
- `test_resolve_pathway_LCSA_P1()` — caso happy path → match P1
- `test_resolve_pathway_LCSA_P3()` — caso B macro → match P3
- `test_resolve_pathway_post_processing_Q8()` — Q8=true triggera RULE-01 → weighting=no-weighting
- `test_resolve_pathway_no_exact_match()` — caso Sunflower (P1 + Q8=true) → P1 + RULE-01
- `test_resolve_pathway_blocked()` — caso D (C2+E-LCC) → blocked, no pathway

**Test API** (`backend/tests/test_sessions_api.py`):
- `test_create_session()` — POST /api/sessions ritorna 201 + UUID
- `test_get_session_not_found()` — GET /api/sessions/random-uuid ritorna 404
- `test_submit_answers_partial()` — POST answers con 5/10 risposte salva, status rimane draft
- `test_submit_answers_invalid_question_id()` — POST con q11 ritorna 400
- `test_resolve_pathway_complete_session()` — flow completo: create → submit 10 answers → resolve → GET pathway
- `test_resolve_pathway_blocked()` — flow con C2+E-LCC → resolve ritorna blocked=true
- `test_get_questions_endpoint()` — GET /api/decision-engine/questions ritorna 10 domande

**Coverage atteso**: 70%+ per `domain/`, 60%+ per `routers/`. Non blocking se sotto, ma segnalare.

## §5 File toccati attesi

**Range orientativo: 25-35 file.**

**File nuovi**:
```
backend/app/data/lcsa_decision_engine.v2.json (copy da coordination)
backend/app/domain/__init__.py
backend/app/domain/engine.py
backend/app/domain/models_domain.py
backend/app/domain/validators.py
backend/app/models/session.py
backend/app/models/answer.py
backend/app/models/pathway_resolution.py
backend/app/schemas/session_schemas.py
backend/app/schemas/pathway_schemas.py
backend/app/routers/sessions.py
backend/app/routers/decision_engine.py
backend/tests/test_engine.py
backend/tests/test_validators.py
backend/tests/test_sessions_api.py
backend/tests/test_decision_engine_api.py
backend/tests/conftest.py (fixtures: in-memory SQLite DB, test_client, sample_answers)
```

**File modificati**:
```
backend/app/main.py (wiring router + CORS)
backend/app/db.py (eventuali aggiunte se serve session factory)
backend/app/models/__init__.py (export nuovi modelli)
backend/app/routers/__init__.py (export nuovi router)
backend/pyproject.toml (eventuali nuove dipendenze: pydantic, già presente; nessuna prevista)
backend/README.md (aggiornare con istruzioni per nuovi endpoint)
README.md root (aggiornare struttura repo se cambia)
```

**NON toccare**:
- `coordination/data/lcsa_decision_engine.v2.json` (read-only per Sprint 2; modifiche solo da Architect chat)
- Frontend (Sprint 3 lo gestirà)
- `frontend/src/components/HealthCheck.tsx` (rimane invariato)
- CI workflow (Sprint 1 ha lo scaffold; non cambia per Sprint 2)

## §6 Decisioni autonome consentite

- Naming convenzioni interne (es. `PathwayResolutionRecord` SQLAlchemy vs `PathwayResolution` Pydantic).
- Struttura esatta dei test fixtures.
- Implementazione esatta del Hamming distance matcher (purché segua i pesi indicati in §3.6).
- Eventuali helper functions / private methods nel `DecisionEngine`.
- Decisione tra `lru_cache` e module-level singleton per il caching dell'engine.
- Formato exact di error responses (ma rispettare Pydantic standard se possibile).
- Gestione esatta dei booleani Q6/Q8 nel JSON (sono `bool` nel JSON — nel DB salva come `"true"`/`"false"` string per consistenza con altri valori string-based, oppure usa boolean column).

**Documenta ogni decisione autonoma significativa nella sezione "Decisioni autonome prese" del REPORT.**

## §7 Workflow ordinato (paste-ready)

```bash
# 1. Setup
cd /path/to/symba-t46-app
git checkout main && git pull
git checkout -b sprint/02-domain-layer

# 2. Copy JSON v2
mkdir -p backend/app/data
cp coordination/data/lcsa_decision_engine.v2.json backend/app/data/

# 3. Implementazione (in ordine logico)
#    a. domain/models_domain.py (Pydantic models)
#    b. domain/engine.py (DecisionEngine class)
#    c. domain/validators.py (helpers)
#    d. tests/test_engine.py (TDD: scrivi test poi raffina engine)
#    e. models/* (SQLAlchemy)
#    f. schemas/* (Pydantic API)
#    g. routers/* (FastAPI endpoints)
#    h. main.py wiring + CORS
#    i. tests/test_*_api.py
#    j. README updates

# 4. Test locale
cd backend
ruff check .
pytest -v --cov=app --cov-report=term
# se coverage < 60% domain o < 50% routers, aggiungi test mirati

# 5. Verifica integrazione manuale
uvicorn app.main:app --reload --port 8000
# in altro terminale:
curl http://localhost:8000/api/decision-engine/questions | jq .
curl -X POST http://localhost:8000/api/sessions | jq .
# (annota UUID ritornato)
curl -X POST http://localhost:8000/api/sessions/{uuid}/answers \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"question_id":"q1","value":"A"},{"question_id":"q2","value":"ex-ante"}]}'
# eccetera...

# 6. Verifica Docker
cd ..
docker-compose up --build
# verifica frontend → /api/health → backend
# (frontend ancora non chiama gli altri endpoint, OK per Sprint 2)

# 7. Commit + push
git add -A
git commit -m "Sprint 2: domain layer (decision engine + persistence + REST API)"
git push origin sprint/02-domain-layer

# 8. Apri PR
gh pr create --title "Sprint 2: domain layer" --body "Vedi coordination/reports/SPRINT_2_REPORT.md"

# 9. Branch coordination per report
git checkout main && git pull
git checkout -b sprint/02-domain-layer-report
# Crea coordination/reports/SPRINT_2_REPORT.md (template sotto)
git add coordination/reports/
git commit -m "Sprint 2 report"
git push origin sprint/02-domain-layer-report
gh pr create --title "Sprint 2 report" --body "Report di chiusura Sprint 2"

# 10. Summary di chiusura sessione
#     Vedi §10
```

### Template REPORT (`coordination/reports/SPRINT_2_REPORT.md`)

```markdown
# REPORT Sprint 2 — Domain layer backend

**Data**: YYYY-MM-DD
**Branch codice**: sprint/02-domain-layer (PR #X)
**Branch coordination**: sprint/02-domain-layer-report (PR #Y)
**Tempo effettivo**: ~Xh

## Contesto
(1 paragrafo)

## Implementazione
- Domain layer: ...
- SQLAlchemy models: ...
- Pydantic schemas: ...
- REST endpoints: ...
- Test suite: ...

## File toccati
(albero file aggiunti/modificati)

## Test
- Pytest: X test, X pass, X fail
- Coverage domain: X%
- Coverage routers: X%
- Ruff: X warnings/errors

## Decisioni autonome prese
(elenco numerato, ognuna con razionale)

## Smoke test endpoint
(elenco curl + risposte verificate manualmente)

## Domande/dubbi emersi durante l'implementazione (OBBLIGATORIA)
(anche se vuota, scrivere "Nessuno")

## Manual QA gate post-fix per Mirko
(checklist concreta — vedi §8 sotto)

## Carry-over
(eventuali punti rimandati a sprint successivi)

## Commit
- Codice: <hash>
- Coordination: <hash>
```

## §8 Manual QA gate post-fix (per Mirko)

Dopo merge della PR Sprint 2:

1. `git pull origin main` su clone locale
2. `cd backend && pytest` — tutti pass
3. `docker-compose up --build` — entrambi i servizi partono
4. `curl http://localhost:8000/api/decision-engine/questions | jq .questions | jq length` → ritorna 10
5. `curl -X POST http://localhost:8000/api/sessions` → ritorna `{id: "...", status: "draft"}`
6. Submit di una sequenza completa di risposte (caso happy path Sunflower-Compost-Park):
   ```json
   q1=A, q2=ex-ante, q3=C+E-LCC, q4=function-oriented, q5=design,
   q6=false, q7=system-expansion, q8=true, q9=single-site, q10=standard
   ```
   Aspettato: `pathway_id=LCSA-P1`, `applied_rules=["RULE-01-Q8-public-assertion"]`, `lca.weighting=no-weighting`, `lca.critical_review=panel`
7. Submit caso BLOCKED: `q1=C2, q3=E-LCC` (parziale OK) → POST resolve → ritorna `blocked=true, block_info.block_id="BLOCK-01"`
8. CI verde su entrambi i job

**Ground-truth regression**: i test Sprint 1 (health endpoint, frontend render) devono continuare a passare.

## §9 Out-of-scope esplicito (carry-over confermati)

- **Frontend questionario**: Sprint 3
- **Generazione protocollo docx**: Sprint 5
- **Generazione template xlsx**: Sprint 6
- **Galleria benchmark letteratura**: Sprint 7
- **Auth, multi-utente, deploy prod**: fuori MVP
- **E2E test Playwright**: Sprint 8
- **Alembic migrations**: introdurre quando lo schema DB cambierà significativamente (probabilmente Sprint 5 o 6)

## §10 Definition of Done

- [ ] PR codice + PR report aperte e cleanly mergeable
- [ ] Tutti gli endpoint elencati in §3.7 implementati e testati
- [ ] DecisionEngine carica `lcsa_decision_engine.v2.json` correttamente
- [ ] Hamming distance fallback funziona (test_resolve_pathway_no_exact_match passa)
- [ ] BLOCKED combinations tornano correttamente block_info (test_resolve_pathway_blocked passa)
- [ ] Post-processing rule RULE-01 (Q8 public assertion) funziona end-to-end
- [ ] Pytest passa al 100% (≥18 test totali tra engine + API)
- [ ] Coverage domain ≥ 70%, routers ≥ 60% (target, non blocking)
- [ ] Ruff check pulito (0 errori; warning OK se documentati)
- [ ] CI verde su entrambi i job
- [ ] README backend aggiornato con esempi curl per nuovi endpoint
- [ ] Report `coordination/reports/SPRINT_2_REPORT.md` con TUTTE le sezioni del template, inclusa "Domande/dubbi emersi"
- [ ] Summary in chat con Mirko (vedi §11)

## §11 Strategia split (se sfori 2.5h)

Se durante l'implementazione superi 2.5h e vedi che la chiusura completa è oltre 4h, **fermati e committa parziale** con questo split:

**Sprint 2a — Engine + tests (priorità ALTA)**:
- domain/* completo
- tests/test_engine.py + tests/test_validators.py
- NESSUN router, NESSUN SQLAlchemy model
- Definition of Done: engine.resolve_pathway() funziona via test pytest

**Sprint 2b — Persistence + API (priorità ALTA, sprint successivo)**:
- models/* SQLAlchemy
- schemas/*
- routers/sessions.py + routers/decision_engine.py
- main.py wiring
- tests/test_*_api.py

In caso di split:
1. Branch corrente diventa `sprint/02a-engine`
2. Apri PR codice + PR report parziale (chiarendo che è 2a, 2b a seguire)
3. Nel summary chat Mirko, segnala lo split + dimensione 2b stimata

## §12 Summary di chiusura sessione

Al termine, scrivi a Mirko in chat:

1. Sprint 2 chiuso? (sì / parziale 2a / fallito)
2. PR aperte (link)
3. Test results sintetici (X/Y pass, coverage, ruff)
4. Decisioni autonome chiave (max 3-4)
5. Smoke test endpoint passati? (almeno il flow completo del caso Sunflower)
6. **Domanda QA esplicita**: "Mirko, esegui i punti del manual QA gate §8 e confermami quando hai fatto. Se qualcosa fallisce, riportami output esatto del comando."

**Non chiudere il task Claude Code prima del summary in chat.**

---

**Fine SPEC Sprint 2.**
