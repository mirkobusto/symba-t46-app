"""L1 — BLOCK cells.

Evaluates the 4 BLOCK cells from `cross_method_rules.json` against the
case. If any BLOCK fires, its ID is appended to `case.blocked_by`. The
pipeline orchestrator short-circuits on non-empty `blocked_by` (see
`engine/pipeline.py`); no L2/L3 logic runs in that case.

The 4 BLOCKs (ordered as in the JSON):

    block_C2_plus_E-LCC          Q1=D AND lcc_type ∈ {C+E, C+E+S}
    block_anyQ1_plus_AbsoluteSLCA Q3.soc=true AND advanced override='absolute'
    block_Q3_emptySelection      Q3 = no selection (env=eco=soc=false)
    block_Q1A_plus_Q5e           Q1=A AND ≥1 flow AND all flows Q5=e

Note on `block_anyQ1_plus_AbsoluteSLCA`: requires `case.advanced.
slca_framework_override` which is part of the Step 4 advanced-overrides
layer; `Case` does not yet expose `advanced` so this BLOCK is
structurally inert today (the defensive `getattr` returns None). When
Sprint 4 Step 4 wires `advanced`, the BLOCK activates without changes
to this module.

Note on `block_C2_plus_E-LCC`: under natural L0 derivation Q1=D maps
to `LccType.C_LCC_ONLY` or `LccType.DEACTIVATED`, so this BLOCK never
fires in the current pipeline. It remains as a safety net for the
future advanced-override path that lets users force a non-natural
lcc_type.

The JSON `trigger_condition` strings are documentation; the typed
predicates below are the source of truth (same convention as
`l0_compute.py`).
"""
from __future__ import annotations

from collections.abc import Callable

from app.domain.enums import Q1, Q5, LccType
from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def _check_c2_plus_e_lcc(case: Case) -> bool:
    return case.q1 == Q1.D and case.lcc_type in {
        LccType.C_LCC_PLUS_E_LCC,
        LccType.E_LCC_PLUS_S_LCC_PLUS_NTF,
    }


def _check_q1_absolute_slca(case: Case) -> bool:
    if not case.q3.soc:
        return False
    advanced = getattr(case, "advanced", None)
    if not advanced:
        return False
    return advanced.get("slca_framework_override") == "absolute"


def _check_q3_empty_selection(case: Case) -> bool:
    return not (case.q3.env or case.q3.eco or case.q3.soc)


def _check_q1a_plus_q5e(case: Case) -> bool:
    if case.q1 != Q1.A:
        return False
    if not case.flows:
        # Empty flows = incomplete questionnaire, not a violation.
        return False
    return all(f.q5 == Q5.e for f in case.flows)


_BLOCK_CHECKS: list[tuple[str, Callable[[Case], bool]]] = [
    ("block_C2_plus_E-LCC", _check_c2_plus_e_lcc),
    ("block_anyQ1_plus_AbsoluteSLCA", _check_q1_absolute_slca),
    ("block_Q3_emptySelection", _check_q3_empty_selection),
    ("block_Q1A_plus_Q5e", _check_q1a_plus_q5e),
]


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Run all 4 L1 BLOCK checks. Append fired block IDs to `case.blocked_by`.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention; see app/engine/pipeline.py).

    The `schemas` argument is reserved for future schema-driven L1 logic
    (e.g., loading user_message from `schemas.rules_by_id[block_id]` in
    a separate reporting stage); it is not consulted in this commit.

    Order of evaluation matches the JSON enumeration order. All 4 checks
    run unconditionally (no early-exit on first fire) so the user sees
    every triggered constraint at once.
    """
    for block_id, predicate in _BLOCK_CHECKS:
        if predicate(case):
            case.blocked_by.append(block_id)
    return case
