"""L3 — Reporting-time enforcement and CDP surfacing.

Runs at result-interpretation time, AFTER L2. Two responsibilities:

1. **Enforce IR-04 (Parallel Interpretation) and IR-10 (Anti-Aggregation)**.
   Both are L3 IR rules with assertion-bearing semantics; on violation a
   structured entry is appended to `case.rule_violations` (same shape as
   l2_validate violations).

2. **Surface the 12 CDPs** (Critical Decision Points) into
   `case.cdp_flags`. CDPs are informational — they describe cross-method
   tensions and how the engine resolves them at L3. Each surfaced entry
   carries `{cdp_id, name, tension, severity, methods, resolution_at_l3}`.

CDP filter policy (option α from commit-6 plan): a CDP surfaces only
when **all of its `methods` are active** in Q3 (LCA→env, LCC→eco,
S-LCA→soc). CDPs describe cross-method tensions, so they have no
meaning if one of the participating methods is inactive.

Conventions (consistent with l0/l1/pathway/activate/l2_validate):
- Mutation contract: `case` mutated in place and returned.
- Q1=None defensive raise.
- Missing pillar value = inconclusive (no violation).
- Reuses `_q3_dims_active`, `_q4_intersects`, `_get` from l2_validate.
"""
from __future__ import annotations

from collections.abc import Callable
from typing import Any

from app.domain.enums import Q1
from app.domain.models import Case
from app.engine.l2_validate import _get, _q3_dims_active, _q4_intersects
from app.engine.loader import LoadedSchemas

# ---------------------------------------------------------------------------
# IR-04 + IR-10 — L3 assertion rules
# ---------------------------------------------------------------------------


def _trigger_ir_04(case: Case) -> bool:
    return _q3_dims_active(case) >= 2


def _assert_ir_04(case: Case) -> bool:
    """report.aggregation_method != 'single_score'.
    Missing value → inconclusive (True)."""
    method = _get(case, "report.aggregation_method")
    if method is None:
        return True
    return method != "single_score"


def _trigger_ir_10(case: Case) -> bool:
    return _q4_intersects(case, {"B", "C", "D"})


def _assert_ir_10(case: Case) -> bool:
    """report.public_disclosure.aggregation == null.
    Missing value (i.e. None) is the desired state → assertion holds."""
    aggregation = _get(case, "report.public_disclosure.aggregation")
    return aggregation is None


_L3_IR_RULES: dict[str, tuple[Callable[[Case], bool], Callable[[Case], bool]]] = {
    "IR-04": (_trigger_ir_04, _assert_ir_04),
    "IR-10": (_trigger_ir_10, _assert_ir_10),
}


# ---------------------------------------------------------------------------
# CDP surfacing
# ---------------------------------------------------------------------------

# Map CDP method-string → Case.q3 attribute that gates it.
_METHOD_TO_Q3: dict[str, str] = {
    "LCA": "env",
    "LCC": "eco",
    "S-LCA": "soc",
    "SLCA": "soc",  # tolerate either spelling
}


def _cdp_methods_active(case: Case, methods: list[str]) -> bool:
    """True iff every method listed on the CDP corresponds to a Q3
    dimension that is active. Methods not in _METHOD_TO_Q3 are ignored
    (defensive: future CDPs may reference MFCA/CBA/etc.)."""
    if not methods:
        return False
    for m in methods:
        attr = _METHOD_TO_Q3.get(m)
        if attr is None:
            continue  # unknown method — don't gate on it
        if not getattr(case.q3, attr):
            return False
    return True


def _build_cdp_entry(cdp: dict[str, Any]) -> dict[str, Any]:
    return {
        "cdp_id": cdp["id"],
        "name": cdp.get("name"),
        "tension": cdp.get("tension"),
        "severity": cdp.get("severity"),
        "methods": list(cdp.get("methods", [])),
        "resolution_at_l3": cdp.get("resolution_at_l3"),
    }


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Enforce IR-04 + IR-10 and append surfaced CDPs to `case.cdp_flags`.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention).

    For IR-04 / IR-10:
      - if trigger fires AND assertion fails, append
        `{rule_id, message}` to `case.rule_violations`.

    For each of the 12 CDPs:
      - if all of the CDP's `methods` are active in Q3, append a
        full CDP entry to `case.cdp_flags`.
    """
    if case.q1 not in {Q1.A, Q1.B, Q1.C, Q1.D, Q1.E}:
        raise ValueError(f"Invalid Q1: {case.q1!r}")

    # 1. IR-04 + IR-10
    for rule_id, (trigger, assertion) in _L3_IR_RULES.items():
        rule = schemas.rules_by_id.get(rule_id)
        if rule is None:
            continue
        if rule.get("lifecycle_layer") != "L3":
            continue
        if not trigger(case):
            continue
        if not assertion(case):
            case.rule_violations.append({
                "rule_id": rule_id,
                "message": rule.get("violation_message",
                                    f"{rule_id} assertion failed"),
            })

    # 2. CDP surfacing
    cdps = schemas.cross_method_rules.get("critical_decision_points", [])
    for cdp in cdps:
        if cdp.get("lifecycle_layer") != "L3":
            continue
        if _cdp_methods_active(case, cdp.get("methods", [])):
            case.cdp_flags.append(_build_cdp_entry(cdp))

    return case
