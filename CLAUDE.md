# CLAUDE.md — Working agreement con Claude Code

Questo file viene letto automaticamente da Claude Code all'inizio di ogni sessione.
Definisce vincoli permanenti, convenzioni del progetto e regole di workflow.

---

## Lingua

Rispondi **sempre in italiano** salvo richiesta esplicita di passare ad altra lingua.
Codice, commenti nel codice, commit message, e nomi di file restano in inglese.

---

## Contesto del progetto

Il progetto è **SYMBA T4.6**: un'app web che assiste analisti di sostenibilità
nel definire metodologie LCSA (LCA + LCC + S-LCA) per casi di Industrial Symbiosis.
È parte di un PhD su simbiosi industriale.

Stack:
- Backend: FastAPI (Python 3.12) + SQLAlchemy 2.0 + Pydantic v2
- Frontend: React 19 + TypeScript + Vite 8 + Zustand 5 + react-router-dom v7 + react-i18next (in `frontend/`, stesso repo)
- Engine decisionale: schema-driven (5 JSON files) + activation pipeline + sector overlays
- Persistence: SQLite via SQLAlchemy (server-side cases) + localStorage via Zustand persist (client-side draft)
- Dev ports: backend 8088, frontend 5180

Sprint corrente: **MVP completo, in attesa di prossima direzione**.

Cronologia sintetica (tutto su `main`):
- Sprint 4 Step 2 (scaffold) chiuso 2026-05-08
- Sprint 4 Step 3 (engine) chiuso: 7 commit + regression suite 12-paper, tutti i moduli phase implementati
- Step 4 (frontend Q1-Q7 + reasoning panel) chiuso
- Step 5 (12 .docx validation reports) chiuso
- 6 round di UX polish + i18n 5 lingue (en/it/fr/de/es)
- Features A-D + Follow-ups E-G (export/report, Q6a 14 settori, scenarios runner, cases CRUD, JSON overrides editor, port change, rich help & rationale)

---

## Documenti autoritative

**NON modificare senza esplicita approvazione**:

- `docs/implementation/SPRINT4_BOOTSTRAP_v2.md` — il piano Sprint 4 (auto-contenuto)
- `docs/implementation/PHASE1_NODE_MAPPING_v2.md` — il design metodologico Phase 1
- `backend/app/schemas/phase1_nodes.json` — 186 nodi atomici
- `backend/app/schemas/cross_method_rules.json` — 4 BLOCK + 54 regole
- `backend/app/schemas/system_fields.json` — 16 system fields
- `backend/app/schemas/computed_fields.json` — 12 computed fields
- `backend/app/schemas/cir_output_fields.json` — 20 cir_output fields

I 5 JSON sono **closure ufficiale** post-round-2 (vedi `field_gaps.md`):
- 96 nodi FIELDED + 90 procedural_mandate = 186
- 0 unknown fields nelle cross-method rules
- Schema engineering CLOSED.

---

## Workflow git

- **Una branch per ogni feature/follow-up** (`feature-X-…`, `followup-X-…`).
- **Mai commit diretto su main**.
- Branch → push → PR → merge.
- Stile commit: `chore(area):`, `feat(area):`, `test(area):`, `docs(area):`.
- Body 1-2 paragrafi, riferimenti a doc autoritative dove applicabile.
- Mai squash silenzioso — un commit = una unità logica.
- Stacked PR ammessi (base = branch precedente). Attenzione: GitHub non cascata sul merge di main — al termine dello stack, retargetare l'ultimo PR aperto direttamente su `main` per flush in un colpo.

## Workflow di sviluppo

- Prima di modificare un file in `backend/app/schemas/` chiedi conferma con un breve diff.
- Test devono sempre passare prima del commit. Baseline corrente: **240 backend (pytest) + 14 frontend (vitest)**.
- Comando test backend: `cd backend && PYTHONPATH=. python -m pytest tests/ -q` (su Windows: `$env:PYTHONPATH = "."` prima del comando).
- Comando test frontend: `cd frontend && npm test -- --run`.
- Lint frontend: `cd frontend && npm run lint` (eslint).
- Build frontend: `cd frontend && npm run build` (tsc + vite).
- Validation script: `python backend/scripts/validate_phase1_artifacts.py --schema-dir backend/app/schemas --out-dir backend/coordination`
  Atteso: 0 critical / 0 warning / 0 UNKNOWN / status PASS.

---

## Architettura engine (per orientarsi nel codebase)

```
backend/app/
├── schemas/                    5 JSON schema files (data, NOT Python) + sector_overlays.json
├── domain/
│   ├── enums.py               Q1-Q7 + derived states (IlcdSituation, LccType, ecc.)
│   ├── models.py              Case, Flow, Site (Pydantic v2 con extra='forbid')
│   └── case_state.py          StudyPhase reference (no FSM, design call 4)
├── engine/
│   ├── loader.py              Carica i 5 JSON in LoadedSchemas
│   ├── pipeline.py            Orchestrator L0→L1→pathway→activate→L2→L3 + mutation contract
│   ├── l0_compute.py          3 trigger nodes deterministici
│   ├── l1_blocks.py           4 BLOCK cells
│   ├── pathway.py             γ matrix Q1×Q2 → IS-01..IS-05 (ADR-005)
│   ├── activate.py            186 nodi, dotted-path → pillar dict, per_flow handling
│   ├── l2_validate.py         40 regole (trigger / assertion / actions parsing)
│   └── l3_report.py           IR-04 + IR-10 enforcement + 12 CDP surfacing
├── api/                       FastAPI routers (pipeline run/report/scenarios + cases CRUD)
├── services/                  reports.py (.docx generation)
├── _legacy/                   Engine vecchio v2 JSON-driven (deprecato — cleanup deferito)
└── wire/                      Pydantic DTOs HTTP

frontend/src/
├── pages/                     Home, Questionnaire, Result, ScenariosResult, CasesList, About, Error
├── components/                QuestionCard, FlowsEditor, ScenariosEditor, AdvancedEditor,
│                              PresetLoader, LoadingOverlay, …
├── store/caseStore.ts         Zustand store con persist middleware (localStorage)
├── i18n/locales/              en.ts (source of truth) + it/fr/de/es
├── presets/papers.ts          13 fixture (12 papers + Leiva Escombreras/Frövi)
└── types/api.ts               TS mirror dei DTO Pydantic
```

Tutti i moduli engine sono implementati. Endpoint HTTP: `/api/pipeline/run`, `/api/pipeline/report`, `/api/pipeline/run-scenarios`, `/api/cases` (CRUD).

---

## Vincoli metodologici (importanti)

- **Schema engineering è CLOSED**. Non inventare nuovi field paths senza approvazione.
- Il validation script è la fonte autoritativa di "cosa è coerente".
- I 24 NEW field paths approvati sono in `field_gaps.md` round 2 closure log.
- I 90 nodi `procedural_mandate` non hanno un valore da settare — sono mandati di pratica metodologica, NON cercare di assegnare loro un field.
- La rule normalization usa Kimi naming verbatim (IR-XX, CIR-XX, FU-XX, B-XX, CDP-XX, block_*) — mai INV-XX o RULE-NN.

---

## Quando fermarsi e chiedere

- Dubbi sul field naming → STOP e chiedi.
- Edge case nei JSON che `field_gaps.md` non copre → STOP e chiedi.
- Discrepanze v1↔v2↔Kimi atomic_nodes → STOP e chiedi.
- Scelte architetturali che richiedono più strade non equivalenti (es. parsing di trigger_condition raw string: regex vs eval-sicuro vs mini-DSL) → STOP, descrivi le opzioni con pro/contro, aspetta decisione.
- Codice che richiede una dipendenza esterna nuova → STOP, motiva la scelta della libreria.

---

## Lavoro deferito noto

- `backend/app/_legacy/`: engine v2 deprecato. Da rimuovere/archiviare in PR dedicata, non in mezzo ad altro lavoro.
- Production deployment fuori scope MVP (`docker-compose.yml` è dev-only).
- Monitoring / telemetry non presenti — da aggiungere quando il tool entrerà in uso reale.

---

## Stile di lavoro

- Onestà sul livello di confidenza: se non sei sicuro di una scelta metodologica, dillo invece di tirare a indovinare.
- Niente sicofantia: se Mirko propone un approccio che ha problemi tecnici, segnalali prima di procedere.
- Conciso. Niente "Great question!" né preamboli decorativi.
- Quando proponi codice esteso, mostra prima un piano breve (file da toccare, struttura), aspetta OK, poi scrivi il codice.
