# app/_legacy/

Code archived during Sprint 4 refactor (`SPRINT4_BOOTSTRAP_v2.md` §6).

**Deprecated:** 2026-05-08 (Sprint 4 Step 2 commit 1)
**Delete condition:** after 12-paper regression suite passes with the new
engine in `app/engine/` and no production code imports from this package.
**Background:** see `docs/design/PHASE4_5_INSPECTION.md` for the inspection
that determined the v2 JSON-driven Hamming-distance engine was incompatible
with the IS-case methodology.

## Contents

- `engine.py` — Hamming-distance pathway resolver based on
  `lcsa_decision_engine.v2.json`. Replaced by the activation-based
  engine in `app/engine/`.
- `validators.py` — `BlockedCombination` / `GlobalInvariant` validators.
  Replaced by `l1_blocks.py` + `l2_validate.py` driven by
  `app/schemas/cross_method_rules.json`.
- `models_domain.py` — Pydantic models for the v2 JSON shape. Replaced
  by `app/domain/models.py` driven by the new schemas.

The two shim modules (`app/domain/engine.py`, `app/domain/validators.py`,
`app/domain/models_domain.py`) re-export from this package so existing
routers keep importing while the new engine is built. Shims will be
removed in a later sprint when `app/api/` replaces `app/routers/`.
