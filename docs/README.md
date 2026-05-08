# SYMBA T4.6 â€” Design and Implementation Documentation

This folder contains the design artifacts and implementation-ready schema for the
SYMBA Task 4.6 Industrial Symbiosis Methodological Assessment Tool.

## Structure

- `design/` â€” validation reports, stress tests, methodology proposals.
  Read-only historical record of the design phase.

- `implementation/` â€” Sprint 4 ingestion-ready artifacts.
  - `PHASE1_NODE_MAPPING_v2.md` is the **schema source of truth**.
  - `SYMBA_T46_Validation_WorkingDoc_v1.md` contains the 12-paper validation
    ground truth used as regression test suite.
  - `SPRINT4_BOOTSTRAP.md` is the entry point for any new chat / contributor
    starting Sprint 4 implementation work.

- `archive/` â€” superseded versions kept for traceability.

## Quick start for a new contributor

1. Read `implementation/SPRINT4_BOOTSTRAP.md`
2. Read `implementation/PHASE1_NODE_MAPPING_v2.md` Section 9 (JSON schema)
3. Read `implementation/SYMBA_T46_Validation_WorkingDoc_v1.md` Section 3
   (12 paper Q1-Q7 compilations as regression fixtures)
4. Start coding the backend per the schema and regression fixtures.

## Status (as of 8 maggio 2026)

- Methodology design: 100% complete
- Architectural design: 100% complete
- Backend implementation: 0%
- Frontend refactor: 0%
- End-to-end validation reports: 0%

The design phase is closed; do not re-debate methodology. Implementation phase
is what comes next.
