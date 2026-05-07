# _CURRENT_STATE — SYMBA T4.6 IS Assessment App

**Ultimo aggiornamento**: 2026-05-07 (genesi)
**Sprint corrente**: Sprint 0 (review Kimi) + Sprint 1 (scaffold) in parallelo
**Ramo principale**: `main`

---

## Sprint chiusi

(nessuno — progetto in genesi)

## Sprint in corso

### Sprint 0 — Review critica logic table Kimi
- **Owner**: Architect chat
- **Branch**: n/a (output diretto in `coordination/reviews/kimi_logic_table_review.md`)
- **Status**: in corso
- **Output atteso**: verdict (OK / OK-con-patch / da-rifare) + eventuale patch al JSON logic table
- **Gate**: nessuno sprint codifica della logic table (Sprint 4 in poi) può iniziare prima della chiusura di Sprint 0

### Sprint 1 — Repo scaffold
- **Owner**: Claude Code on the web (SPEC: `coordination/specs/SPRINT_1_SPEC_scaffold.md`)
- **Branch codice**: `sprint/01-scaffold`
- **Branch coordination**: `sprint/01-scaffold-report`
- **Status**: SPEC pronta, in attesa di esecuzione
- **Output atteso**: repo con `frontend/` + `backend/` + `coordination/` + CI minimale

## Test baseline

- Vitest (frontend): non ancora configurato
- Pytest (backend): non ancora configurato
- ESLint / ruff: non ancora configurati
- E2E (Playwright): non in MVP fino a Sprint 8
- Bundle size frontend: n/a

## ADR cumulativi

- **ADR-001** Stack: React + FastAPI + SQLite (vedi MASTER_PLAN §3)
- **ADR-002** Repo monorepo pubblico (vedi MASTER_PLAN §3)
- **ADR-003** Logic table Kimi gating (vedi MASTER_PLAN §3)

## Carry-over priorità ordinata

- **ALTA**: nessuno (progetto in genesi)
- **MEDIA**: nessuno
- **BASSA**: nessuno

## Note aperte

- Repo `https://github.com/mirkobusto/symba-t46-app` da creare (Mirko, stato a 2026-05-07: TBD)
- Decisione su deploy produzione rimandata post-MVP
- Decisione su libreria state management frontend (zustand vs Context API vs Redux Toolkit) rimandata a SPEC Sprint 3
