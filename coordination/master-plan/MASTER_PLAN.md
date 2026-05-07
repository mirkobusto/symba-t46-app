# MASTER_PLAN — SYMBA T4.6 IS Assessment App

**Versione**: 0.1 (genesi progetto)
**Ultimo aggiornamento**: 2026-05-07
**Owner**: Mirko Busto
**Architect chat**: in corso (Claude Opus 4.7)

---

## 1. Vision

App web che operazionalizza i tre deliverable SYMBA WP4 (D4.1 LCA, D4.2 LCC, D4.3 S-LCA) in uno strumento di **scoping metodologico per casi di simbiosi industriale (IS)**.

L'utente (assessor LCA/LCC/S-LCA che lavora su un caso IS bio-based) compila un **questionario di 10 domande chiave**. L'app restituisce:

1. La **classificazione dello scenario IS** (uno tra IS-01 Standard / IS-02 Strategic Policy / IS-03 Corporate Reporting / IS-04 Emerging Network / IS-05 Monitoring Existing) e il **pathway LCSA-Pn** terminale (P1-P10).
2. Un **protocollo metodologico** (PDF/docx) che specifica per ogni metodo (LCA, LCC, S-LCA): situation ILCD, modeling (attributional/consequential), multifunctionality (allocation/system expansion), FU, LCIA method, LCC type, S-LCA logic, allocation rules, boundary, integration mode, stakeholder engagement, riferimenti puntuali alle sezioni dei deliverable.
3. Un **template di raccolta dati** strutturato e coerente con la configurazione (CSV per LCI, xlsx per LCC con tre livelli, docx per griglia S-LCA stakeholder).
4. Una **galleria di benchmark indicativi** da letteratura (range tipici per categoria di impatto, NPV ranges, indicatori sociali) con disclaimer chiaro: "valori indicativi, non sostituiscono studio reale".

L'app **non esegue calcoli LCSA**, non valida dati inseriti, non sostituisce software professionali (SimaPro, OpenLCA, Brightway). È un **tool di scoping + reporting** che riduce errori di setup e standardizza l'operazionalizzazione delle guideline SYMBA.

## 2. Stakeholder & utenti

- **Utenti primari**: ricercatori e consulenti che applicano la metodologia SYMBA su un nuovo caso IS bio-based
- **Utenti secondari**: project officer / authority che ricevono il protocollo come allegato a report SYMBA
- **Owner deliverable T4.6**: ENCO (lead), CIRCE + CET (support)

## 3. Architecture decisions (ADR runtime)

### ADR-001 — Stack: React + FastAPI + SQLite
**Status**: accepted (2026-05-07)
**Context**: l'analisi Kimi ha prodotto un JSON logic table deterministico (10 Q → 10 pathway). Tutto l'output è generabile, ma il task description menziona "monitoring system" suggerendo persistenza di sessioni assessment per audit/reporting nel tempo.
**Decision**: backend Python (FastAPI + SQLAlchemy + SQLite) per gestire sessioni utente, generare template lato server (python-docx, openpyxl), salvare audit trail. Frontend React + TypeScript + Vite per il questionario stateful.
**Alternatives considered**:
- Vanilla HTML/JS statico (rifiutato: niente persistenza, scaling utenti zero)
- React puro client-side con LocalStorage (rifiutato: niente audit trail aggregato, generazione docx lato client fragile)
**Consequences**: deploy con container (Docker compose dev, target prod TBD). Maggiore complessità di setup, ma copertura completa requirement T4.6.

### ADR-002 — Repo monorepo pubblico
**Status**: accepted (2026-05-07)
**Context**: Mirko vuole un singolo repo pubblico (`mirkobusto/symba-t46-app`) per semplicità e per permettere all'Architect chat di leggere coordination via `git clone` diretto.
**Decision**: monorepo con tre cartelle top-level: `frontend/`, `backend/`, `coordination/`.
**Consequences**: CI deve gestire path-based filters (modifica solo frontend → solo lint+test frontend). Coordination è pubblico (le SPEC e i report sono leggibili da chiunque).

### ADR-003 — Logic table Kimi come **input critico da validare prima di codifica**
**Status**: accepted (2026-05-07)
**Context**: Kimi ha prodotto IS_Decision_Engine_UNIFIED.md con 10 domande, 10 pathway, 39 conflitti risolti. Mirko ha richiesto esplicitamente review prima di costruire codice sopra (rischio di propagare errori).
**Decision**: Sprint 0 = review critica della logic table Kimi (a campione, contro i 3 deliverable). Output `coordination/reviews/kimi_logic_table_review.md` con verdict OK / OK con patch / da rifare. Gate: senza Sprint 0 chiuso, non si scrive logica business sopra al JSON logic table.
**Consequences**: ritardo di 1 turno, ma riduce rischio rework massivo.

## 4. Roadmap MVP (alto livello, sprint pianificati)

| Sprint | Nome | Obiettivo | Stima | Status |
|--------|------|-----------|-------|--------|
| 0 | Kimi logic table review | Verifica critica del decision engine prima di codifica | ~2h Architect | in corso |
| 1 | Repo scaffold | Frontend + backend + coordination + CI minimale | ~1.5h Claude Code | in corso |
| 2 | Domain layer backend | Modelli SQLAlchemy: Session, Answer, Pathway. Importer del JSON logic table validato. Endpoint POST /sessions, POST /sessions/{id}/answers, GET /sessions/{id}/pathway | ~1.5h | pianificato |
| 3 | Frontend questionario | 10 domande condizionali, state management (zustand o context), routing tra le domande, validazione client | ~1.5-2h | pianificato (split possibile) |
| 4 | Pathway resolution + display | Dato un set di risposte, classificazione scenario IS + pathway LCSA-Pn. Display protocollo metodologico testuale (no export ancora) | ~1.5h | pianificato |
| 5 | Generazione protocollo (PDF/docx) | Endpoint backend `/sessions/{id}/protocol.docx` con python-docx, traceability a sezioni deliverable | ~1.5h | pianificato |
| 6 | Generazione template raccolta dati | Endpoint backend `/sessions/{id}/data-template.xlsx` (LCI + LCC + S-LCA grid) con openpyxl | ~1.5-2h | pianificato (split possibile) |
| 7 | Galleria benchmark letteratura | Curated dataset (JSON statico) di range tipici per categoria, filtrabile per pathway | ~1.5h | pianificato |
| 8 | Hardening MVP | E2E test (Playwright), error handling, UX polish, README utente | ~2h | pianificato (split obbligatorio) |

**Stima totale MVP**: ~14-18h Claude Code + 4-6h Architect (Sprint 0 + review/QA)

## 5. ADR cumulativi (uno per decisione architetturale significativa)

(vuoto, popolato progressivamente)

## 6. Out-of-scope MVP

- Autenticazione utente / multi-tenant (sessione anonima via UUID, persistenza solo in SQLite locale)
- Integrazione con software LCA esterni (SimaPro, OpenLCA, Brightway)
- Calcolo effettivo di indicatori LCIA / NPV / indicatori sociali
- Validazione automatica dei dati raccolti
- Multilingua (solo inglese MVP)
- Mobile-first responsive (desktop-first, tablet OK)
- Deployment produzione (solo docker-compose dev MVP)

## 7. Riferimenti progetto

- **Task description**: SYMBA Grant Agreement 101135562, T4.6 (M22-M36, lead ENCO)
- **Deliverable input**: D4.1 LCA Guidelines, D4.2 LCC Guidelines, D4.3 S-LCA Guidelines
- **Decision engine**: `IS_Decision_Engine_UNIFIED.md` (output analisi Kimi 5-fasi)
- **Mockup**: `symba_4.6_app_mockup.html` (HTML vanilla, riferimento UX)
- **File fase Kimi**: phase1_lca_atomic_nodes.md, phase1_lcc_atomic_nodes.md, phase1_slca_atomic_nodes.md, phase2_compatibility_matrix.md, phase3_pathway_space.md, phase4_logic_table.md, phase4_mermaid_tree.md, phase4_traceability.md, phase5_clash_table.md
