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
- Backend: FastAPI (Python 3.12) + SQLAlchemy + Pydantic v2
- Frontend: React (separato, non in questo repo)
- Engine decisionale: schema-driven (5 JSON files) + activation pipeline

Sprint corrente: **Sprint 4 Step 3** (engine implementation).
Sprint 4 Step 2 (scaffold) chiuso il 2026-05-08, branch `sprint4-step2-scaffold`
mergeato in `main`.

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

- **Una branch per ogni Step** (`sprint4-step3-commit1-pathway`, `sprint4-step3-commit2-l0-compute`, ecc.).
- **Mai commit diretto su main**.
- Branch → push → PR → merge.
- Stile commit: `chore(area):`, `feat(area):`, `test(area):`, `docs(area):`.
- Body 1-2 paragrafi, riferimenti a SPRINT4_BOOTSTRAP_v2.md §X dove applicabile.
- Mai squash silenzioso — un commit = una unità logica.

## Workflow di sviluppo

- Prima di modificare un file in `backend/app/schemas/` chiedi conferma con un breve diff.
- Test devono sempre passare prima del commit (baseline post-Step 2: **77 passed**).
- Comando test: `cd backend && python -m pytest tests/ -q` (su Windows aggiungere `$env:PYTHONPATH = "."` prima).
- Validation script: `python backend/scripts/validate_phase1_artifacts.py --schema-dir backend/app/schemas --out-dir backend/coordination`
  Atteso: 0 critical / 0 warning / 0 UNKNOWN / status PASS.

---

## Architettura engine (per orientarsi nel codebase)

```
backend/app/
├── schemas/                    5 JSON schema files (data, NOT Python)
├── domain/
│   ├── enums.py               Q1-Q7 + derived states (IlcdSituation, LccType, ecc.)
│   ├── models.py              Case, Flow, Site (Pydantic v2 con extra='forbid')
│   └── case_state.py          StudyPhase reference (no FSM, design call 4)
├── engine/
│   ├── loader.py              Carica i 5 JSON in LoadedSchemas (impl. completa)
│   ├── pipeline.py            Orchestrator L0→L1→pathway→activate→L2→L3 (impl. completa)
│   ├── l0_compute.py          STUB — Sprint 4 Step 3 commit 2
│   ├── l1_blocks.py           STUB — Sprint 4 Step 3 commit 3
│   ├── pathway.py             STUB — Sprint 4 Step 3 commit 1 (next)
│   ├── activate.py            STUB — Sprint 4 Step 3 commit 4
│   ├── l2_validate.py         STUB — Sprint 4 Step 3 commit 5
│   └── l3_report.py           STUB — Sprint 4 Step 3 commit 7
├── _legacy/                   Engine vecchio v2 JSON-driven (deprecato, vedi README.md)
└── wire/                      Pydantic DTOs HTTP (era app/schemas/*.py prima del rename)
```

L'orchestrator in `pipeline.py` è già completo (chiama in ordine i 6 phase modules).
Il lavoro Step 3 = riempire i 6 stub con logica reale + test.

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

## Sprint 4 Step 3 — piano commit (l'attuale obiettivo)

Ordine concordato:

1. `engine/pathway.py` — banale, deriva IS-01..IS-05 da Q1×Q2 (next)
2. `engine/l0_compute.py` — 3 trigger nodes deterministici
3. `engine/l1_blocks.py` — 4 BLOCK cells
4. `engine/activate.py` — 186 nodi, dotted-path → pillar dict, per_flow handling
5. `engine/l2_validate.py` — 40 regole (trigger / assertion / actions parsing)
6. `engine/pipeline.py` — già scaffoldato in Step 2, qui si rifinisce dopo che le 5 phase sono complete
7. Test 12-paper regression suite

Ogni step un commit con test associati. **Nessuno step può saltare in avanti senza il precedente** — l2_validate richiede activate, activate richiede l0_compute. Disciplina.

---

## Stile di lavoro

- Onestà sul livello di confidenza: se non sei sicuro di una scelta metodologica, dillo invece di tirare a indovinare.
- Niente sicofantia: se Mirko propone un approccio che ha problemi tecnici, segnalali prima di procedere.
- Conciso. Niente "Great question!" né preamboli decorativi.
- Quando proponi codice esteso, mostra prima un piano breve (file da toccare, struttura), aspetta OK, poi scrivi il codice.
