# Legacy removal plan — `backend/app/_legacy/`

**Status:** scoping doc, not yet executed.
**Owner:** TBD (one focused PR sequence).
**Generated:** 2026-05-11 from a read-only investigation.

---

## Why this plan exists

`backend/app/_legacy/` was deprecated on 2026-05-08 (Sprint 4 Step 2) when
the Hamming-distance v2 engine was replaced by the activation-based engine
in `app/engine/`. The deletion condition stated in
`backend/app/_legacy/README.md` is:

> "after 12-paper regression suite passes with the new engine in
> `app/engine/` and no production code imports from this package."

The first half is satisfied (Sprint 4 Step 3 closed the regression).
The second half is **not yet satisfied** — three shim modules in
`app/domain/` still re-export legacy code, and two production routers
(`/api/decision-engine`, `/api/sessions`) still use it.

This doc maps the remaining dependencies so the cleanup can be done in
one self-contained PR sequence without surprises.

---

## Current dependency map

### Three legacy files

- `backend/app/_legacy/engine.py` (12.5 KB) — `DecisionEngine`,
  Hamming-distance pathway resolver based on
  `lcsa_decision_engine.v2.json`.
- `backend/app/_legacy/validators.py` (7.6 KB) —
  `BlockedCombination` / `GlobalInvariant` predicate logic.
- `backend/app/_legacy/models_domain.py` (6.2 KB) — Pydantic models for
  the v2 JSON shape (`BlockInfo`, `InvariantViolation`,
  `PathwayMetadata`, `QuestionMetadata`, `TraceEntry`, etc.).

### Three pure re-export shims (one-liners)

- `backend/app/domain/engine.py:10` — `from app._legacy.engine import *`
- `backend/app/domain/validators.py:3` — `from app._legacy.validators import *`
- `backend/app/domain/models_domain.py:3` — `from app._legacy.models_domain import *`

### Two production routers using the shims

Both mounted in `backend/app/main.py:62-66`.

- **`backend/app/routers/decision_engine.py`** — prefix `/api/decision-engine`.
  Endpoints (all legacy-dependent):
  - `GET /questions` — returns Q1-Q10 metadata.
  - `GET /pathways` — returns LCSA-P1..P10.
  - `GET /pathways/{pathway_id}` — single pathway detail.

- **`backend/app/routers/sessions.py`** — prefix `/api/sessions`.
  9 endpoints; only the resolution ones touch legacy:
  - `POST /` (create), `GET /{id}`, `PATCH /{id}`, `DELETE /{id}`,
    `GET /{id}/pathway` — **DB-only, no legacy dependency**.
  - `POST /{id}/answers` — uses `DecisionEngine.validate_answer()`.
  - `POST /{id}/resolve` — uses `DecisionEngine.resolve_pathway()`.
  - `GET /{id}/protocol`, `GET /{id}/data-template` — 501 stubs.

### Wire layer leak

`backend/app/wire/pathway_schemas.py:10-15` imports six legacy types
from `app.domain.models_domain`:

```python
from app.domain.models_domain import (
    BlockInfo, InvariantViolation, PathwayMetadata,
    QuestionMetadata, TraceEntry,
)
```

These are **only defined in legacy**. Removing the shim breaks the HTTP
contract for any endpoint that returns a `PathwayMetadata` payload.
Cleanup must extract or re-home these types first.

### Tests

- `backend/tests/test_engine.py` — 17 functions, **pure-legacy**.
- `backend/tests/test_validators.py` — 11 functions, **pure-legacy**.
- `backend/tests/conftest.py` — mixed:
  - Legacy-only: the `engine` session-scoped fixture, the
    `sample_answers_*` constants.
  - Reused by new tests: `sqlite_engine`, `db_session`, `client`,
    `schemas`, `schemas_dir`.

### Frontend reality check

Grep on `frontend/src/` shows the live frontend hits **only** these
endpoints:

- `/health`
- `/api/pipeline/run`, `/api/pipeline/report`, `/api/pipeline/run-scenarios`
- `/api/cases/*`

**Zero calls to `/api/decision-engine` or `/api/sessions`.** The legacy
routers exist for backward compat with hypothetical external clients
that don't currently exist.

---

## Recommended removal sequence

Five small commits in one PR (or one commit per step in a stack — your
call).

### Commit 1 — Extract wire-layer types

Move the six `BlockInfo`-style classes out of legacy into a new
permanent home. Two acceptable options:

- **(a) Inline into `wire/pathway_schemas.py`.** Simpler if these types
  are only used by that one wire file. Confirm with grep first.
- **(b) New module `app/domain/pathway_types.py`.** Use this if other
  files also depend on the types.

Update `wire/pathway_schemas.py:10-15` to import from the new home.
Run backend tests; they should still pass with shims still in place.

### Commit 2 — Delete legacy routers

Remove `backend/app/routers/decision_engine.py` and `sessions.py`.
Unmount them from `backend/app/main.py:62-66`. Update any OpenAPI doc
references.

Frontend doesn't call these so no client-side change needed; if you
want a soft-removal first, return `410 Gone` for one release before
deleting.

### Commit 3 — Delete legacy tests

Remove `tests/test_engine.py` and `tests/test_validators.py` entirely.
Strip the `engine` fixture and `sample_answers_*` constants from
`conftest.py` (keep `sqlite_engine` / `db_session` / `client` /
`schemas` / `schemas_dir`).

Backend test count goes from 240 to roughly 240 − 28 = 212.

### Commit 4 — Delete the shims

Remove the three one-liner files in `app/domain/`:

- `app/domain/engine.py`
- `app/domain/validators.py`
- `app/domain/models_domain.py`

At this point nothing should import from `_legacy/` except `_legacy/`
itself.

### Commit 5 — Delete `_legacy/` and update CLAUDE.md

```
rm -r backend/app/_legacy/
```

Then update `CLAUDE.md`:
- Remove `_legacy/` from the engine architecture block.
- Remove the "Lavoro deferito noto" entry that mentions it.

Final sanity check: full test suite green, no `_legacy` matches in a
repo-wide grep.

---

## Removal effort estimate

**Medium.** ~6 files touched in commit 1 (extract + repoint), ~3 file
deletions in commits 2-4, plus test cleanup. The hard part is the
wire-layer type extraction — get that wrong and HTTP responses change
shape.

Roughly 1-2 hours of focused work, most of it verification (run tests
after every commit, grep for stragglers, eyeball OpenAPI diff).

---

## What this plan deliberately does NOT cover

- Deprecation announcement / external-client communication. The legacy
  endpoints have no known external consumers, so just delete.
- Database migration. The `sessions` table is independent of the legacy
  engine and can stay or be dropped in a separate decision.
- Re-homing the existing `tests/conftest.py` schemas fixture into a
  fixture module — out of scope, that's a separate refactor.
