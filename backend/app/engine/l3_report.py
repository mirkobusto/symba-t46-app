"""L3 — Reporting-time enforcement and CDP surfacing.

Runs at result-interpretation time, AFTER L2. Two responsibilities:

1. **IR-04 (Parallel Interpretation) and IR-10 (Anti-Aggregation)**. When
   they trigger they join `case.applicable_rules`, the obligations shown to
   the user (R4, 2026-10-18); a failed assertion still goes to
   `case.rule_violations`, an internal diagnostic that no view shows.

2. **Surface the 12 CDPs** (Critical Decision Points) into
   `case.cdp_flags`. CDPs are informational — they describe cross-method
   tensions and how the engine resolves them at L3. Each surfaced entry
   carries `{cdp_id, name, tension, severity, methods, resolution_at_l3}`.

CDP filter policy (option α from commit-6 plan): a CDP surfaces only
when **all of its `methods` are active** in Q3 (LCA→env, LCC→eco,
S-LCA→soc). CDPs describe cross-method tensions, so they have no
meaning if one of the participating methods is inactive.

Conventions (consistent with l0/l1/activate/l2_validate):
- Mutation contract: `case` mutated in place and returned.
- Q1=None defensive raise.
- Missing pillar value = inconclusive (no violation).
- Reuses `_q3_dims_active`, `_q4_intersects`, `_get` from l2_validate.
"""
from __future__ import annotations

from collections.abc import Callable
from typing import Any

from app.domain.enums import Q1, IlcdSituation
from app.domain.models import Case
from app.engine.activate import needs_future_background
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


# How a decision point is resolved when the branch its schema text describes does
# not apply to the case: CDP-01 speaks of Situation B, CDP-08 of Q4 = D (P6-08,
# P7-24; decided by Fable, UX round 6). The schema keeps the full text; page, Word
# and DCF show the variant (the page and the Word translate it by `variant`).
_DEFAULT_RESOLUTION: dict[str, tuple[Callable[[Case], bool], str]] = {
    "CDP-01": (lambda c: c.ilcd_situation != IlcdSituation.SITUATION_B,
               "Identical reference scenario and quality factor Q in the LCA and in the E-LCC: the same "
               "displaced products on the same market (IR-07, IR-09; D4.2 §5.1)."),
    "CDP-08": (lambda c: "D" not in {q.value for q in c.q4},
               "No weighted or single score in public disclosure (IR-10); internally, three dashboards "
               "kept apart (IR-04)."),
}


def _build_cdp_entry(cdp: dict[str, Any], case: Case | None = None) -> dict[str, Any]:
    resolution, variant = cdp.get("resolution_at_l3"), None
    rule = _DEFAULT_RESOLUTION.get(cdp["id"])
    if case is not None and rule is not None and rule[0](case):
        resolution, variant = rule[1], "default"
    return {
        "cdp_id": cdp["id"],
        "name": cdp.get("name"),
        "tension": cdp.get("tension"),
        "severity": cdp.get("severity"),
        "methods": list(cdp.get("methods", [])),
        "resolution_at_l3": resolution,
        "variant": variant,
    }


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------


# CDP-10 describes computational effort and surfaces no choice: it stays in the
# schema (closure) but is not listed to the user (decided by Fable, UX round 4, P2-09)
_NOT_A_DECISION = {"CDP-10"}
# CDP-01 asks which products are displaced, for the substitution IR-09 aligns:
# one company in isolation (C2) allocates and takes no substitution credits
# (D4.1 §7.2.3), so there is nothing to decide (Kimi test 2026-11-04, decided by Fable)
# CDP-05 asks how the E-LCC follows the LCA classification; one company in
# isolation (C2) has no E-LCC and prices its flows as agreed (D4.2 §5.1, §6.3;
# UX round 6, decided by Fable)
_NOT_IN_C2 = {"CDP-01", "CDP-05"}
# CDP-09 (futurisation asymmetry) arises only with a future background: with a
# present-day one there is nothing to decide, as for CDP-10 (P7-24, Fable)
_ONLY_WHEN: dict[str, Callable[[Case], bool]] = {"CDP-09": needs_future_background}


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
        # An obligation to document like the L2 rules (R4, 2026-10-18): the
        # assertion below stays an internal diagnostic, never shown.
        case.applicable_rules.append({
            "rule_id": rule_id,
            "name": rule.get("name"),
            "statement": rule.get("violation_message", f"{rule_id} applies to this case"),
            "trigger": rule.get("trigger_condition_raw"),
            "fields": list(rule.get("fields") or []),
            "fields_not_applicable": [],
            "source_nodes": list(rule.get("source_nodes") or []),
        })
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
        if (cdp.get("cdp_id") or cdp.get("id")) in _NOT_A_DECISION:
            continue
        if (case.ilcd_situation == IlcdSituation.SITUATION_C2
                and (cdp.get("cdp_id") or cdp.get("id")) in _NOT_IN_C2):
            continue
        gate = _ONLY_WHEN.get(cdp.get("cdp_id") or cdp.get("id"))
        if gate is not None and not gate(case):
            continue
        if _cdp_methods_active(case, cdp.get("methods", [])):
            case.cdp_flags.append(_build_cdp_entry(cdp, case))

    return case
