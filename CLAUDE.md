# CLAUDE.md — Working agreement con Claude Code

Questo file viene letto automaticamente da Claude Code all'inizio di ogni sessione.
Definisce vincoli permanenti, convenzioni del progetto e regole di workflow.

---

## Lingua

Rispondi **sempre in italiano** salvo richiesta esplicita di passare ad altra lingua.
Codice, commenti nel codice, commit message, e nomi di file restano in inglese.

---

## Contesto del progetto

Il progetto è **SYMBA T4.6 — Monitoring & Reporting System for Industrial Symbiosis**:
applicazione web multi-stakeholder del progetto Horizon Europe **SYMBA** (GA 101135562,
HORIZON-CL6-2023-CIRCBIO-01), task T4.6 (M22–M36), deliverable **D4.6** (PU). Lead ENCO,
contribuiscono CIRCE e CET.

Mandato GA (verbatim Annex 1): *"a monitoring system supporting all the actors along the
biobased value chain (biomass producers; industries, local communities, local authorities,
end-users, etc.) to evaluate the environmental, social and economic benefits of using SYMBA
IS methodology"*. È parte di un PhD su simbiosi industriale di Mirko Busto (ENCO).

**Audience layered** (decisione di framing 2026-05-22, Opzione B):
- **Layer 1 (MVP corrente)** — IS practitioner / sustainability analyst / reviewer:
  configura il pathway metodologico via Q1-Q7, ottiene attivazione pipeline (5 JSON
  schema-driven) e Data Collection File (DCF) calibrato sul pathway IS-01..IS-05.
- **Layer 2 (in costruzione, Fasi A-C della roadmap T4.6)** — full stakeholder spectrum
  (industrie, comunità locali, autorità, end-users): viste report dedicate per tipologia
  di stakeholder, accessibilità non-specialista (wizard), deployment pubblico.

**Cosa il tool NON fa**: le analisi numeriche LCSA (kg CO2eq, NPV, social indicators
quantitativi) **non sono calcolate dal tool**. Lo scoring system è prodotto esternamente
(CIRCE/altri partner T4.1–T4.3 via SimaPro/OpenLCA/strumenti dedicati). Il tool integra
i risultati scoring nel reporting multi-stakeholder ma non li computa. **Specifica I/O
scoring CIRCE: TBD** (in attesa documento CIRCE — punto aperto).

**Auth multi-utente: TBD** — MVP single-user pubblico per Fase A-C; auth/ruoli rinviati
a Fase D opzionale post-MVP (rivedere se demo regions inseriranno dati sensibili → GDPR).

**D4.3 S-LCA Guidelines (CIRCE/Leiva)**: V1 esiste, contenuto assumiamo già integrato
nei nodi `slca_*` dei 5 JSON (verifica posticipata a Fase B quando disegneremo le viste
S-LCA del reporting multi-stakeholder).

Project context legale/funding: vedi `~/.claude/projects/.../memory/project_symba_context.md`.
Visual identity (palette white/blue/green, EU footer obbligatorio, struttura deliverable V3):
vedi `~/.claude/projects/.../memory/project_visual_identity.md`.

Stack:
- Backend: FastAPI (Python 3.12) + SQLAlchemy 2.0 + Pydantic v2
- Frontend: React 19 + TypeScript + Vite 8 + Zustand 5 + react-router-dom v7 + react-i18next (in `frontend/`, stesso repo)
- Engine decisionale: schema-driven (6 JSON files dopo dcf_schema, separato namespace) + activation pipeline + sector overlays
- Persistence: SQLite via SQLAlchemy (server-side cases) + localStorage via Zustand persist (client-side draft)
- Dev ports: backend 8088, frontend 5180

Stato al **2026-08-29**: roadmap T4.6 Fasi A-D **tutta mergiata su `main`**, incluso il
rework di visual identity (PR #42, "Data Dashboard"). Nessuna PR aperta.

Cronologia sintetica (tutto su `main`):
- Sprint 4 Step 2 (scaffold) chiuso 2026-05-08
- Sprint 4 Step 3 (engine) chiuso: 7 commit + regression suite 12-paper, tutti i moduli phase implementati
- Step 4 (frontend Q1-Q7 + reasoning panel) chiuso
- Step 5 (12 .docx validation reports) chiuso
- 6 round di UX polish + i18n 5 lingue (en/it/fr/de/es)
- Features A-D + Follow-ups E-G (export/report, Q6a 14 settori, scenarios runner, cases CRUD, JSON overrides editor, port change, rich help & rationale)
- Rimozione `backend/app/_legacy/` + superficie engine v2 (PR #34-35)
- DCF Phase 1-4 (PR #36-39): schema engineering, predicate DSL + `dcf_compose` + writer xlsx/docx + API, DataCollectionPage + NetworkDiagram, reporting multi-stakeholder + placeholder scoring + aggregate
- Fase C (PR #40): wizard mode + deployment produzione (`Dockerfile.prod`, `docker-compose.prod.yml`, `docs/DEPLOY.md`)
- Fase D (PR #41): auth JWT + bcrypt, cases ownership-aware (primo utente registrato = admin)
- Visual identity "Data Dashboard" (PR #42, merge 2026-08-29): design token `--dd-*`, AdminShell, libreria `dd/*`, wizard `/welcome`, reader shell + rotte pubbliche `/r/*`, ShareReportModal, slug leggibili dei case

**Lavoro aperto (nessuno bloccante sul codice)**:
- Filtro region reale su `/api/public/region/{code}` (oggi echo del codice)
- i18n: `en.ts` è la source of truth; `de`/`es` indietro di ~50 chiavi sui namespace `reader.*` / `share.*`, `it` di ~20
- Network Builder: completo (persistenza, editor drag-drop, round-trip su xlsx/docx + diagramma reale, guidance in-app con esempio caricabile)
- Pagina admin per la coda scoring CIRCE — bloccata sulla specifica I/O CIRCE (TBD)
- Deploy pubblico D4.6 (PU): immagine e guida pronte, manca l'URL reale
- Screenshot in `docs/presentation/screenshots/` da rifare (sono pre-PR #42)

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
- Test devono sempre passare prima del commit. Baseline corrente: **340 backend (pytest) + 51 frontend (vitest)**.
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
│   ├── predicate.py           DSL dei predicati DCF (Phase 2)
│   └── dcf_compose.py         Composizione del Data Collection File
├── auth/
│   ├── security.py            JWT + bcrypt (Fase D)
│   ├── deps.py                get_current_user / get_current_user_optional
│   └── ownership.py           can_view / can_modify su CaseRecord (condiviso cases+scoring)
├── routers/                   health, auth, pipeline, cases, dcf, scoring, public
└── services/                  reports.py (.docx), dcf_excel.py, dcf_docx.py, naming.py (slug)

frontend/src/
├── pages/                     Welcome, Home, Questionnaire, Result, ScenariosResult, CasesList,
│                              DataCollection, StakeholderReport, Aggregate, Login, About, Error
│                              + pages/reader/ (viste pubbliche /r/*)
├── components/                QuestionCard, FlowsEditor, ScenariosEditor, AdvancedEditor,
│                              NetworkDiagram (view), NetworkBuilder + DcfRowFields (editor),
│                              StakeholderView, DcfSectionViewer, …
│                              + admin/ · dd/ (design system) · reader/ (shell pubblica)
├── store/                     caseStore.ts (Zustand + persist) + preferenceStore (ruolo/task/onboarding)
│                              + dcfDataStore (bozza Network Builder, sync su /api/dcf/{id}/data)
├── i18n/locales/              en.ts (source of truth) + it/fr/de/es
├── presets/papers.ts          13 fixture (12 papers + Leiva Escombreras/Frövi)
└── types/api.ts               TS mirror dei DTO Pydantic
```

Tutti i moduli engine sono implementati. Endpoint HTTP: `/api/pipeline/*` (run / report /
run-scenarios), `/api/cases` (CRUD + `/aggregate/breakdown`), `/api/dcf/*`, `/api/scoring/{case_id}`
(GET/PUT/DELETE), `/api/auth/*` (register / login / me), `/api/public/*` (share link reader).
Il modello di autorizzazione è tabellato in `docs/DEPLOY.md` § Authorization model.

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

- **Scenari di rete** (deciso 2026-08-30, "entrambi in due tempi"): oggi uno scenario può variare solo le risposte Q1-Q7 tramite `overrides`, quindi non può esprimere "flusso in discarica vs flusso al partner" — il confronto che un analista cerca quando sceglie Q2=D. Fase 1 fatta: l'editor lo dice esplicitamente invece di promettere un confronto che non fa. Fase 2 da progettare: uno scenario come variante della rete disegnata (stessi attori, flussi/distanze/quantità diverse), il che sposta gli scenari dal Case al DCF e richiede di ripensare il runner.

- Monitoring / telemetry non presenti — da aggiungere quando il tool entrerà in uso reale.
- Tabelle DB legacy (`Session`, `Answer`, `PathwayResolutionRecord`) ancora registrate in `app/models/` ma senza endpoint che le usano. Da decidere se droppare in migrazione futura.
- **I nodi di un metodo spento non si attivano** (fix 2026-08-30): `lcc_trig_01` dichiara "q3.eco=false → all LCC nodes deactivated" e `slca_t_01` l'analogo per il sociale, ma l'engine attivava comunque tutti i 61 nodi LCC e 66 SLCA. Ora `activate._method_is_off` salta il metodo e `_write` scarta le scritture nei pilastri spenti (coprendo anche le azioni CIR dell'L2). Conseguenza: il numero di nodi attivati e i mandati del DCF **dipendono da Q3** — l'invariante "almeno 116 nodi DEFAULT" non vale più ed è stato sostituito nei test da asserzioni method-aware.
- **Le 40 regole L2 sono presentate come obblighi metodologici da documentare, non come errori** (decisione 2026-08-30). `case.applicable_rules` è emesso sul *trigger* ed è ciò che app e report mostrano; `case.rule_violations` (assertion fallita) resta per i validation report ma non è affidabile: le assertion confrontano valori che l'engine scrive come prosa (`lca.transport.foreground` = `'explicit'`, mai il booleano testato), quindi B-05 scattava sul 100% dei casi con Q7∈{B,C,D} e IR-01 su ogni caso con ≥2 dimensioni. Renderle controlli veri richiede un posto dove l'analista dichiari quelle scelte — non esiste oggi.
- 13 assertion "NLP-style" in `l2_validate.py` sono stub `True` con `# TODO(nlp-assertion)` (IR-05/11/17/20, FU-03/05, B-02/07, …) + 2 `TODO(symbolic-action)`. Il gap è metodologicamente noto, non un bug.
- Nessuna migrazione Alembic: le migrazioni sono script one-shot in `backend/scripts/` (es. `migrate_add_case_slug.py`, idempotente, da eseguire dopo il deploy).
- Bundle frontend ~674 kB senza code-splitting (warning Vite, non bloccante).
- `coordination/current-state/_CURRENT_STATE.md` è storico (fermo a Sprint 0/1): lo stato corrente è **questo file**.

---

## Stile di lavoro

- Onestà sul livello di confidenza: se non sei sicuro di una scelta metodologica, dillo invece di tirare a indovinare.
- Niente sicofantia: se Mirko propone un approccio che ha problemi tecnici, segnalali prima di procedere.
- Conciso. Niente "Great question!" né preamboli decorativi.
- Quando proponi codice esteso, mostra prima un piano breve (file da toccare, struttura), aspetta OK, poi scrivi il codice.
