# REPORT Sprint 2 — Domain layer backend

| | |
|---|---|
| **Data** | 2026-05-07 |
| **Branch codice** | `claude/domain-layer-backend-06JH4` (per harness; PR da aprire) |
| **Branch coordination** | stesso branch (report aggiunto in singolo PR) |
| **Tempo effettivo** | ~2h |
| **Owner** | Claude Code on the web |

## Contesto

Sprint 1 ha consegnato lo scaffold (FastAPI + React + CI). Sprint 2
implementa il domain layer del backend: il motore decisionale LCSA, la
persistenza SQLite delle sessioni, e l'API REST. Il file
`lcsa_decision_engine.v2.json` è stato copiato dal coordination
(read-only, PATCH-01..07 già applicate) in
`backend/app/data/lcsa_decision_engine.v2.json` come fonte di verità
unica. Nessuna logica decisionale è hard-coded.

## Implementazione

- **Domain layer** (`backend/app/domain/`):
  - `models_domain.py`: 14 modelli Pydantic che mirrorano lo schema del JSON
    (`QuestionMetadata`, `PathwayMetadata`, `BlockedCombination`,
    `PostProcessingRule`, `GlobalInvariant`, `PathwayResolution`, …).
    `extra="allow"` per essere robusti a future estensioni del JSON.
  - `engine.py`: classe `DecisionEngine` con caricamento lazy del JSON e
    cache di processo via `@lru_cache`. API: `get_questions`,
    `get_question`, `list_pathways`, `get_pathway`, `validate_answer`,
    `check_blocked`, `resolve_pathway`. Algoritmo `resolve_pathway`
    implementa gli 8 step della SPEC §3.5: completezza → validazione
    risposte → blocked check → exact-match → fallback Hamming pesato →
    post-processing rules → invariants → trace consolidato.
  - `validators.py`: matcher dei trigger (`q1`, `q3_contains`, `q5_in`,
    `q7_neq`); check delle blocked combinations (HARD vs warning); check
    degli invariants programmabili (INV-01 transport_modeling, INV-02
    functional_unit, INV-04 boundary E-LCC).

- **SQLAlchemy models** (`backend/app/models/`):
  - `Session` (UUID + status + case_name/notes + relationship verso
    answers e pathway_resolution),
  - `Answer` (FK session + question_id + value JSON-encoded + unique
    constraint su `(session_id, question_id)`),
  - `PathwayResolutionRecord` (1-to-1 con Session, blob JSON per
    configuration / applied_rules / warnings / trace, campi blocked).

- **Pydantic API schemas** (`backend/app/schemas/`):
  - `session_schemas.py`: SessionCreate/Update/Response/Detail,
    AnswerSubmitRequest/Bulk, AnswersSubmitResponse;
  - `pathway_schemas.py`: QuestionsListResponse, PathwaysListResponse,
    PathwayResolutionResponse.

- **REST endpoints** (`backend/app/routers/`):
  - `GET  /api/decision-engine/questions`
  - `GET  /api/decision-engine/pathways`
  - `GET  /api/decision-engine/pathways/{id}`
  - `POST /api/sessions`
  - `GET  /api/sessions/{id}`
  - `PATCH /api/sessions/{id}`
  - `DELETE /api/sessions/{id}` (soft delete → archived)
  - `POST /api/sessions/{id}/answers` (parziali OK; upsert; rejected
    riportati con reason)
  - `POST /api/sessions/{id}/resolve` (400 se incomplete/invalid)
  - `GET  /api/sessions/{id}/pathway` (404 se non ancora risolto)
  - `GET  /api/sessions/{id}/protocol` → 501 (Sprint 5)
  - `GET  /api/sessions/{id}/data-template` → 501 (Sprint 6)

- **Wiring** (`backend/app/main.py`): include dei nuovi router con
  prefix `/api`, CORS configurabile via `BACKEND_CORS_ORIGINS`,
  `Base.metadata.create_all` chiamato dal lifespan handler. Mantenuto
  l'endpoint `/health` non prefissato per compatibilità con la smoke
  test Sprint 1 e con la healthcheck Docker.

- **Test suite**: 51 test totali (vedi sezione Test).

## File toccati

**Nuovi (16)**:

```
backend/app/data/lcsa_decision_engine.v2.json
backend/app/domain/__init__.py
backend/app/domain/engine.py
backend/app/domain/models_domain.py
backend/app/domain/validators.py
backend/app/models/answer.py
backend/app/models/pathway_resolution.py
backend/app/models/session.py
backend/app/routers/decision_engine.py
backend/app/routers/sessions.py
backend/app/schemas/pathway_schemas.py
backend/app/schemas/session_schemas.py
backend/tests/conftest.py
backend/tests/test_decision_engine_api.py
backend/tests/test_engine.py
backend/tests/test_sessions_api.py
backend/tests/test_validators.py
coordination/reports/SPRINT_2_REPORT.md
```

**Modificati (6)**:

```
backend/app/main.py             # wiring router + CORS env var + lifespan
backend/app/models/__init__.py  # export ORM models
backend/app/routers/__init__.py # export decision_engine + sessions
backend/app/schemas/__init__.py # export session/pathway schemas
backend/pyproject.toml          # ruff per-file-ignores per test
backend/README.md               # endpoint API documentati
README.md                       # sintesi stato post-Sprint-2
```

## Test

| Suite                           | Test |
| ------------------------------- | ----:|
| `test_engine.py`                | 17 |
| `test_validators.py`            | 11 |
| `test_decision_engine_api.py`   |  4 |
| `test_sessions_api.py`          | 18 |
| `test_health.py` (Sprint 1)     |  1 |
| **Totale**                      | **51** |

Risultato: **51 pass / 0 fail / 0 skip**, eseguito in ~0.5s.

Coverage (`coverage run -m pytest`):

| Modulo                                | Coverage |
| ------------------------------------- | --------:|
| `app/domain/engine.py`                |     96%  |
| `app/domain/models_domain.py`         |     99%  |
| `app/domain/validators.py`            |     99%  |
| `app/routers/decision_engine.py`      |    100%  |
| `app/routers/sessions.py`             |     94%  |
| `app/models/*`                        |    100%  |
| `app/schemas/*`                       |    100%  |
| **Totale `app/`**                     |   **95%** |

Sopra entrambe le soglie target della SPEC (≥70% domain, ≥60% routers).

Ruff: **All checks passed!** (configurazione con `B008` ignorato — pattern
canonico FastAPI per `Depends` in default — e `N802/N806` ignorati nei
test, dove i nomi delle funzioni includono ID di pathway/block per
tracciabilità).

## Decisioni autonome prese

1. **`PostProcessingRule.modifications` reso opzionale.** Il JSON
   `RULE-04-Q1-C2-force-allocation` non ha il campo `modifications`: usa
   invece `action: "BLOCK_AND_ASK_USER"` + `user_message`. La SPEC §3.4
   assume tutte le rules abbiano `modifications`. Decisione: rendere
   `modifications` opzionale (default `{}`) e trattare le rules
   interactive (con `user_message`) emettendo un warning con il messaggio
   senza mutare la configuration. La rule è comunque registrata in
   `applied_rules` (così che il frontend Sprint 3 possa mostrare il
   prompt all'utente). Da rivedere: probabilmente in Sprint 3 questo
   diventerà un endpoint interattivo che chiede all'utente di confermare.
   Vedi anche "Domande/dubbi emersi".

2. **Naming `PathwayResolutionRecord` (SQLAlchemy) vs `PathwayResolution`
   (Pydantic).** Per evitare il name clash menzionato in SPEC §4.2.

3. **`Answer.value` salvato come JSON-encoded string** (`String(256)`).
   Questo preserva il tipo nativo (bool per Q6/Q8, str altrove) senza
   richiedere una colonna boolean separata o un type tag aggiuntivo.
   Decodifica con `json.loads` in lettura.

4. **`@lru_cache(maxsize=1)` per `get_decision_engine()`** invece di un
   modulo-level singleton, perché si compone meglio con la dependency
   injection di FastAPI (`Depends(get_decision_engine)`) e permette di
   resettarlo nei test (anche se non lo facciamo qui — i test usano
   l'engine reale, lettura sola).

5. **Lifespan handler** invece dello startup-hook deprecato in FastAPI
   recente, per chiamare `Base.metadata.create_all(get_engine())`.

6. **Mantenuto `/health` non prefissato** insieme al nuovo `/api/health`,
   per non rompere la smoke test Sprint 1 e l'eventuale healthcheck
   Docker. Decisione minimamente invasiva.

7. **`InvariantViolation` solo come WARNING**, mai bloccante. Coerente
   con la SPEC §3.5 step 7 ("Log warning ma non bloccare").
   Implementazione programmatica solo per INV-01, INV-02, INV-04 — le
   regole INV-03 e INV-05 sono natural-language e richiederebbero un
   linguaggio di regole più sofisticato (out of scope Sprint 2). Le
   altre invariants restano documentarie.

8. **Hamming distance pesato** come da SPEC §3.6, con soglia di warning
   di 10 (un fallback distance > 10 emette un warning aggiuntivo "weak
   match").

## Smoke test endpoint

Eseguito manualmente con `uvicorn app.main:app --port 8765` su SQLite
in-memory, e via `pytest`:

```text
GET  /api/health                                → 200 {"status":"ok",...}
GET  /api/decision-engine/questions             → 200, count=10, q1.key=ilcd_context
POST /api/sessions {}                           → 201, status=draft
POST /api/sessions/{sid}/answers (Sunflower)    → 200, accepted=10, status=answers_complete
POST /api/sessions/{sid}/resolve                → 200, pathway_id=LCSA-P1,
                                                  applied_rules=[RULE-01-Q8-public-assertion],
                                                  lca.weighting=no-weighting,
                                                  lca.critical_review=panel
POST /api/sessions/{sid2}/resolve (BLOCKED)     → 200, blocked=true, block_id=BLOCK-01
```

Il caso Sunflower-Compost-Park risolve esattamente alla configurazione
attesa dalla SPEC §8 punto 6.

## Domande/dubbi emersi durante l'implementazione (OBBLIGATORIA)

1. **RULE-04 ha schema diverso dalle altre post-processing rules.** Usa
   `action: "BLOCK_AND_ASK_USER"` + `user_message` invece di
   `modifications`. Nello Sprint 2 l'engine la tratta come una rule
   "interactive" che emette un warning ma non muta la configurazione (e
   non chiede nulla all'utente — non c'è UI). In Sprint 3 il frontend
   dovrà gestire questo flow specificamente: probabilmente serve un
   campo nel response (`pending_user_actions: [{rule_id, message,
   suggested_action}]`) o un endpoint dedicato. **Da chiarire con
   Architect**: RULE-04 dovrebbe essere classificata come
   blocked_combination (con un suggested_resolution che propone
   l'auto-fix di Q7), oppure è semantica interattiva legittima?

2. **Invariants INV-03 e INV-05 non sono programmabili dal JSON.**
   Sono regole natural-language ("If lca.modeling = 'consequential',
   substitution_data MUST be 'marginal-technology'", e "S-LCA must
   NEVER produce a single aggregated score across stakeholders"). La
   prima sarebbe meccanizzabile con un piccolo DSL ("if-then" su path
   dotted), la seconda richiede un check sul payload S-LCA che non
   esiste ancora in MVP. **Suggerimento**: in un futuro JSON v3,
   convertire le invariants in formato strutturato (es. `{"if":
   {"lca.modeling": "consequential"}, "then": {"lca.substitution_data":
   "marginal-technology"}}`) per poterle valutare automaticamente.
   Per ora INV-03/INV-05 restano documentarie.

3. **Soglia Hamming fallback warning (10) è arbitraria.** Scelta come
   placeholder. Andrebbe calibrata empiricamente quando avremo dati di
   utilizzo reali: oggi il pathway con peggior fit ha distanza ~12 sui
   primi sample. **Da rivedere in Sprint 7** (galleria benchmark).

4. **Trace consolidato non include trace delle blocked_combinations.**
   Quando una sessione è bloccata, il `block_info` espone il proprio
   trace, ma il campo `trace` generale del response è vuoto perché non
   c'è un pathway. Se si vuole un trace unificato anche nel caso
   blocked, va aggiunto separatamente (decisione minore).

## Manual QA gate post-fix per Mirko

Dopo il merge della PR Sprint 2 (e `git pull origin main`):

1. `cd backend && uv pip install -e ".[dev]"` (o equivalente pip)
2. `pytest -v` — devono passare 51 test (43 nuovi + 1 Sprint 1 + 7
   facoltativi extra).
3. `ruff check .` — `All checks passed!`
4. `docker compose up --build` — backend e frontend devono partire.
5. `curl http://localhost:8000/api/decision-engine/questions | jq '.questions | length'`
   → `10`.
6. `curl -X POST http://localhost:8000/api/sessions` → ritorna
   `{"id":"...","status":"draft", ...}`.
7. **Caso Sunflower** (vedi §8 SPEC): submit dei 10 answers, poi POST
   resolve → `pathway_id=LCSA-P1`, `applied_rules` contiene
   `RULE-01-Q8-public-assertion`, `configuration.lca.weighting ==
   "no-weighting"`, `configuration.lca.critical_review == "panel"`.
8. **Caso BLOCKED** (`q1=C2`, `q3=C+E-LCC`): submit + resolve →
   `blocked=true`, `block_info.block_id="BLOCK-01"`,
   `block_info.suggested_resolutions` non vuoto.
9. CI verde su entrambi i job (frontend + backend).
10. Lo `/health` Sprint 1 continua a rispondere 200.

## Carry-over

- **RULE-04 interactive flow**: definire il contratto API con Architect
  (vedi Domande #1) e implementare in Sprint 3.
- **INV-03 / INV-05 mechanization**: opzionale; valutare con Architect.
- **Alembic**: introdurre quando lo schema cambia in modo significativo
  (probabile Sprint 5/6 quando si aggiungeranno protocol/template
  artefatti).

## Commit

- Codice: vedi commit su branch `claude/domain-layer-backend-06JH4`.
- Coordination: questo report è committato nello stesso branch (Mirko
  approverà manualmente; nessun PR separato per il report).
