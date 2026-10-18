# SYMBA T4.6 — Documentation

Documentation of the SYMBA Task 4.6 Monitoring & Reporting System (Horizon Europe
SYMBA, GA 101135562, deliverable D4.6). The current state of the project, its
decisions and its open points are in the repository's `CLAUDE.md`; the engine's
behaviour is defined by the schemas in `backend/app/schemas/`. Where a document
here disagrees with them, the code and the schemas win.

## What is where

| Folder / file | What it is | Status |
|---|---|---|
| `presentation/` | Deck material for the consortium: theory document (IT), speaker track (EN), slide script, deck builder, screenshots | current (rewritten 2026-10-18) |
| `DEPLOY.md`, `GUIDA_DEPLOY_PASSO_PASSO.md` | Production deployment (Docker, Caddy, authorization model) | current |
| `implementation/PHASE1_NODE_MAPPING_v2.md` | May 2026 design of the 186 Phase 1 nodes and the cross-method rules; **§0 lists every change since**, up to the rebuild of October 2026 | historical design, kept up to date in §0 |
| `implementation/SPRINT4_BOOTSTRAP_v2.md` | Sprint 4 implementation plan (May 2026) | historical |
| `implementation/SYMBA_T46_Validation_WorkingDoc_v1.md` | 12-paper validation ground truth, used by the regression tests | historical, see its header |
| `implementation/DATA_COLLECTION_FILE_v1.md` | Design of the Data Collection File | historical; `dcf_schema.json` is current |
| `design/` | Validation reports, stress tests and question-set proposals of the design phase | historical record |
| `archive/` | Superseded versions and completed plans | archive |

## The app in one paragraph

A questionnaire built on the variables that D4.1 (LCA) and D4.2 (LCC) actually
use: the study (kind of study, subject, dimensions, decision and scale, timing,
horizon, TRL, public objective, use of results, what is compared), the exchanges
(each flow, concentration of the interactions and reference market, shared
assets) and a description of the case. A schema-driven engine derives the
configuration (ILCD situation, LCC structure, study horizon, reference scenario,
functional unit, regionalisation, D4.1 Part 2 sector rules), lists the
obligations to document and the critical decision points, and composes the Data
Collection File. It computes no LCA, LCC or S-LCA numbers: scoring comes from the
partners. See `presentation/SYMBA_T46_teoria.md` for the full narrative.
