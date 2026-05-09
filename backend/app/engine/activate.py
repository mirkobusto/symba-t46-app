"""Phase 1 node activation.

Iterates the 186 Phase 1 nodes; for each, evaluates its trigger condition
against the case (DEFAULT nodes always activate; DERIVED nodes activate
when their `trigger_q` answers match `trigger_condition`).

Activated nodes write their `field` (and any `additional_fields`) into
the appropriate pillar dict on `case`:

    field starting with 'lca.'    → case.lca[<rest>]
    field starting with 'lcc.'    → case.lcc[<rest>]
    field starting with 'slca.'   → case.slca[<rest>]
    field starting with 'report.' → case.report[<rest>]
    field 'governance.X'          → case.governance[X]
    field 'review.X'              → case.review[X]
    field 'study.X'               → case.system[study.X]   # study.phase lives here
    field 'methodological_charter.X' → case.methodological_charter[X]
    field 'system.X'              → case.system[X]

Per-flow nodes (the 11 nodes flagged `per_flow=true` in v1 §5.4) iterate
over `case.flows` and write per-flow into the pillar dict using a list
or dict-of-flow-id structure (TBD when implemented).

Pathway derivation lives in `app/engine/pathway.py` (separate module).

Implementation deferred to Sprint 4 Step 3.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Activate Phase 1 nodes and write their field values onto `case`.

    Mutates and returns `case`. Appends activated node IDs to
    `case.activated_nodes` (for the "Show reasoning" trace).
    """
    raise NotImplementedError("Sprint 4 Step 3 — not yet implemented")
