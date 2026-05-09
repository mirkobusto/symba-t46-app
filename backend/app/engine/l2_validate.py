"""L2 — Cross-method rule validation.

Runs the 40 L2 rules (18 IR — i.e. all 20 IRs minus IR-04/IR-10 which
are L3 — plus 10 CIR + 5 FU + 7 B) against the activated case. Each
rule has:

    trigger_condition  — when to evaluate (Python-like expr referencing case.*)
    assertion          — what must hold (IR/FU/B) — strict equality / membership
    actions            — what to set (CIR only) — imperative side effects
    fields             — fields read or written (used by the field cross-check)

For IR/FU/B rules (assertion-bearing): when trigger fires AND assertion
fails, append a structured violation entry to `case.rule_violations`.

For CIR rules (action-bearing): when trigger fires, execute the actions
(write the LHS fields to the configured RHS values). CIR rules never
"fail"; they enforce configuration coherence.

Implementation deferred to Sprint 4 Step 3.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Evaluate all L2 rules (18 IR + 10 CIR + 5 FU + 7 B = 40 total).

    Mutates and returns `case`. Appends violations to
    `case.rule_violations` (assertion rules) and writes CIR action
    side-effects directly to the appropriate pillar dicts.
    """
    raise NotImplementedError("Sprint 4 Step 3 — not yet implemented")
