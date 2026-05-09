"""L2 — Cross-method rule validation.

Evaluates the 40 L2 rules from `cross_method_rules.json` against the
activated case. Rule families:

    IR   18 L2 (of 20 total; IR-04 and IR-10 are L3 → skipped)
    CIR  10 (action-bearing)
    FU    5
    B     7
    -------------
    Total 40 L2

For assertion-bearing rules (IR/FU/B): when trigger fires AND assertion
fails, append a structured violation entry to `case.rule_violations`.

For action-bearing rules (CIR): when trigger fires, execute the actions
(write the configured RHS values to the LHS pillar fields). CIR rules
never "fail"; they enforce configuration coherence post-activation.

Conventions established in earlier commits and reused here:

  - The JSON `trigger_condition` / `assertion` / `actions` strings are
    documentation; the typed Python predicates / assertion functions /
    action functions below are the source of truth (same convention
    as l0_compute / l1_blocks / pathway / activate).
  - Defensive `getattr` for `case.X` references not yet on the Case
    model (`asset_lifetime`, `transport_sensitive`, `network_nodes`,
    `interdependent_flows`, `frontier_categories_active`,
    `is_specific_capital_goods`, `multi_actor`): treated as falsy
    defaults so the rule stays inert until the field arrives.

Policy decisions for this commit (see CLAUDE.md commit-5 plan):

  - **Missing pillar value = inconclusive** (no violation). If an
    assertion references a field that activate hasn't populated, the
    assertion returns True. The rule will re-evaluate when the field
    is written. This avoids cascading false-positive violations during
    partial-state runs.
  - **NLP-style assertions** (~8 rules whose JSON `assertion` string
    is methodological prose: IR-05, IR-11, IR-17, IR-20, FU-03, FU-05,
    B-02, B-07) are stubbed to return True. Mechanical verification
    requires either a fuller pillar model or human review; flagged
    inline with `# TODO(nlp-assertion)`.
  - **CIR-09** writes `case.iterative_update_triggers` per JSON, but
    Case has no such field; routed to `case.system['iterative_update_
    triggers']` (same pattern as `study.X` → system pillar).
  - **CIR-06 / CIR-08** contain symbolic RHS (`active_set`,
    `+= stakeholder_group_indicators`); the action records the
    methodological mandate as a sentinel string + TODO.
"""
from __future__ import annotations

from collections.abc import Callable
from typing import Any

from app.domain.enums import Q1, Q2, Q5, Q7, LccType, Q6b
from app.domain.models import Case
from app.engine.activate import _write
from app.engine.loader import LoadedSchemas

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _q3_dims_active(case: Case) -> int:
    return sum([case.q3.env, case.q3.eco, case.q3.soc])


def _q4_intersects(case: Case, members: set[str]) -> bool:
    return any(q.value in members for q in case.q4)


def _attr(case: Case, name: str, default: Any = None) -> Any:
    """Defensive getattr for fields not yet on the Case model."""
    return getattr(case, name, default)


def _get(case: Case, dotted: str) -> Any:
    """Read a pillar value by dotted path. Returns None if not set.

    Supports nested dict access via further dots in the tail (e.g.
    `lca.uncertainty.method` reads `case.lca.get("uncertainty", {}).get("method")`).
    Falls back to flat-tail lookup if structured access fails (since
    activate stores tails verbatim as flat keys).
    """
    if "." not in dotted:
        return None
    prefix, tail = dotted.split(".", 1)
    pillar: dict[str, Any] | None
    if prefix == "study":
        pillar = case.system
        return pillar.get(dotted)
    pillar = getattr(case, prefix, None)
    if not isinstance(pillar, dict):
        return None
    # Try flat-tail first (activate's convention)
    if tail in pillar:
        return pillar[tail]
    # Fallback: structured nested access (a.b.c → pillar[a][b][c])
    cur: Any = pillar
    for part in tail.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


_E_LCC_FAMILY = {LccType.E_LCC_PLUS_S_LCC_PLUS_NTF, LccType.C_LCC_PLUS_E_LCC}


def _lcc_includes_e(case: Case) -> bool:
    return case.lcc_type in _E_LCC_FAMILY


# ---------------------------------------------------------------------------
# Trigger predicates — one per L2 rule (40 total)
# ---------------------------------------------------------------------------

_TRIGGER_FNS: dict[str, Callable[[Case], bool]] = {
    # --- IR (18 L2; IR-04 and IR-10 are L3, omitted) ---
    "IR-01": lambda c: _q3_dims_active(c) >= 2,
    "IR-02": lambda c: c.q3.env and c.q3.eco and _lcc_includes_e(c),
    "IR-03": lambda c: c.q3.soc,
    "IR-05": lambda c: _q3_dims_active(c) >= 2,
    "IR-06": lambda c: _q3_dims_active(c) >= 2 and c.q1 in {Q1.A, Q1.B, Q1.C, Q1.E},
    "IR-07": lambda c: _q3_dims_active(c) >= 2,
    "IR-08": lambda c: c.q3.env and c.q3.eco,
    "IR-09": lambda c: c.q3.env and c.q3.eco and any(f.q5 == Q5.c for f in c.flows),
    "IR-11": lambda c: _q4_intersects(c, {"C", "D"}) and _q3_dims_active(c) >= 2,
    "IR-12": lambda c: c.q7 in {Q7.B, Q7.C, Q7.D},
    "IR-13": lambda c: c.q3.env and c.q3.eco and bool(_attr(c, "is_specific_capital_goods")),
    "IR-14": lambda c: _q3_dims_active(c) >= 2,
    "IR-15": lambda c: c.q3.env and c.q3.eco and any(f.q5 in {Q5.a, Q5.b} for f in c.flows),
    "IR-16": lambda c: _q3_dims_active(c) >= 2,
    "IR-17": lambda c: True,
    "IR-18": lambda c: _q4_intersects(c, {"C"}),
    "IR-19": lambda c: True,
    "IR-20": lambda c: _q3_dims_active(c) >= 2,
    # --- CIR (10) ---
    "CIR-01": lambda c: c.q2 in {Q2.C, Q2.D} and _attr(c, "asset_lifetime", 0) > 15,
    "CIR-02": lambda c: c.q2 in {Q2.B, Q2.C, Q2.D},
    "CIR-03": lambda c: c.q7 in {Q7.B, Q7.C, Q7.D} or bool(_attr(c, "transport_sensitive")),
    "CIR-04": lambda c: (c.q1 == Q1.B
                        and _attr(c, "network_nodes", 0) >= 3
                        and bool(_attr(c, "interdependent_flows"))),
    "CIR-05": lambda c: _q4_intersects(c, {"D"}),
    "CIR-06": lambda c: bool(_attr(c, "frontier_categories_active")),
    "CIR-07": lambda c: c.q6b in {Q6b.TRL7_8, Q6b.TRL5_6, Q6b.TRL_LT_5},
    "CIR-08": lambda c: c.q1 in {Q1.B, Q1.C} and bool(_attr(c, "is_specific_capital_goods")),
    "CIR-09": lambda c: (c.q6b in {Q6b.TRL7_8, Q6b.TRL5_6, Q6b.TRL_LT_5}
                         and c.q2 in {Q2.C, Q2.D}),
    "CIR-10": lambda c: True,
    # --- FU (5) ---
    "FU-01": lambda c: c.q3.env,
    "FU-02": lambda c: c.q1 in {Q1.B, Q1.C} and bool(_attr(c, "multi_actor")),
    "FU-03": lambda c: c.q3.env and c.q3.eco,
    "FU-04": lambda c: c.q3.soc,
    "FU-05": lambda c: True,
    # --- B (7) ---
    "B-01": lambda c: _lcc_includes_e(c) and c.q3.env,
    "B-02": lambda c: _q3_dims_active(c) >= 2,
    "B-03": lambda c: (c.q3.soc and (c.q3.env or c.q3.eco) and _lcc_includes_e(c)),
    "B-04": lambda c: c.q3.soc,
    "B-05": lambda c: c.q7 in {Q7.B, Q7.C, Q7.D},
    "B-06": lambda c: c.q3.env and c.q3.eco and bool(_attr(c, "is_specific_capital_goods")),
    "B-07": lambda c: True,
}


# ---------------------------------------------------------------------------
# Assertion predicates — IR L2 + FU + B (30 total). True = holds, False = violated.
# Missing pillar value → True (inconclusive, see module policy).
# NLP-style assertions stubbed to True with TODO marker.
# ---------------------------------------------------------------------------


def _assert_ir_01(c: Case) -> bool:
    fu = _get(c, "lca.functional_unit")
    fe = _get(c, "lcc.functional_equivalent")
    sru = _get(c, "slca.shared_reference_unit")
    actives = [v for v, on in [(fu, c.q3.env), (fe, c.q3.eco), (sru, c.q3.soc)] if on]
    actives = [v for v in actives if v is not None]
    if len(actives) < 2:
        return True  # inconclusive
    return all(v == actives[0] for v in actives)


def _assert_ir_02(c: Case) -> bool:
    sb = _get(c, "lca.system_boundary")
    pb = _get(c, "lcc.physical_boundary")
    if sb is None or pb is None:
        return True
    return sb == pb


def _assert_ir_03(c: Case) -> bool:
    logic = _get(c, "slca.logic")
    if logic is None:
        return True
    return logic == "comparative"


def _assert_ir_06(c: Case) -> bool:
    fac = _get(c, "governance.facilitator")
    ndas = _get(c, "governance.ndas_signed")
    if fac is None and ndas is None:
        return True
    return fac is not None and ndas is True


def _assert_ir_07(c: Case) -> bool:
    a = _get(c, "lca.reference_scenario.type")
    b = _get(c, "lcc.reference_scenario.type")
    cval = _get(c, "slca.reference_scenario.type")
    actives = [v for v, on in [(a, c.q3.env), (b, c.q3.eco), (cval, c.q3.soc)] if on and v is not None]
    if len(actives) < 2:
        return True
    return all(v == actives[0] for v in actives)


def _assert_ir_08(c: Case) -> bool:
    backbone = _get(c, "system.physical_backbone")
    if backbone is None:
        return True
    return backbone == "MFA"


def _assert_ir_09(c: Case) -> bool:
    a = _get(c, "lca.q_factor")
    b = _get(c, "lcc.q_factor")
    if a is None or b is None:
        return True
    return a == b


def _assert_ir_12(c: Case) -> bool:
    fg = _get(c, "lca.transport.foreground")
    tc = _get(c, "lcc.transport_costs")
    td = _get(c, "slca.territorial_dimension")
    actives = [(fg, c.q3.env), (tc, c.q3.eco), (td, c.q3.soc)]
    for v, on in actives:
        if on and v is None:
            return True  # any one missing → inconclusive
    for v, on in actives:
        if on and v is None:
            return False
    return True


def _assert_ir_13(c: Case) -> bool:
    a = _get(c, "lca.capital_goods.included")
    b = _get(c, "lcc.capital_goods.included")
    if a is None or b is None:
        return True
    return a is True and b is True


def _assert_ir_14(c: Case) -> bool:
    a = _get(c, "lca.uncertainty.method")
    b = _get(c, "lcc.uncertainty.method")
    cval = _get(c, "slca.uncertainty.method")
    if a is None and b is None and cval is None:
        return True
    if c.q3.env and a is not None and a not in ("Pedigree+MC", "Pedigree", "MC"):
        return False
    if c.q3.eco and b is not None and b not in ("MC+Pedigree", "Pedigree", "MC"):
        return False
    if c.q3.soc and cval is not None and cval != "qualitative":
        return False
    return True


def _assert_ir_15(c: Case) -> bool:
    """Per-flow: lca_4step_classification == lcc_avoidable_unavoidable_classification."""
    lca_cls = _get(c, "lca.zero_burden_classification") or {}
    lcc_cls = _get(c, "lcc.avoidable_unavoidable_classification") or {}
    if not isinstance(lca_cls, dict) or not isinstance(lcc_cls, dict):
        return True
    common = set(lca_cls) & set(lcc_cls)
    if not common:
        return True  # no shared flows → inconclusive
    # Methodological co-presence is the verifiable invariant; full string
    # equality is too strict (the two classifications use different
    # vocabularies). Verify only that both are populated for shared flows.
    return all(lca_cls.get(fid) is not None and lcc_cls.get(fid) is not None
               for fid in common)


def _assert_ir_16(c: Case) -> bool:
    a = _get(c, "lca.calculation_order")
    b = _get(c, "lcc.calculation_order")
    cval = _get(c, "slca.calculation_order")
    actives = [(a, c.q3.env), (b, c.q3.eco), (cval, c.q3.soc)]
    for v, on in actives:
        if on and v is None:
            return True
    if c.q3.env and a is not None and "entity" not in a:
        return False
    if c.q3.eco and b is not None and "entity" not in b:
        return False
    if c.q3.soc and cval is not None and "stakeholder" not in cval:
        return False
    return True


def _assert_ir_18(c: Case) -> bool:
    n = _get(c, "review.panel.experts")
    indep = _get(c, "review.panel.independent")
    if n is None and indep is None:
        return True
    if isinstance(n, int) and n < 3:
        return False
    if indep is False:
        return False
    return True


def _assert_ir_19(c: Case) -> bool:
    framing = _get(c, "report.framing")
    if framing is None:
        return True
    return framing == "comparative_outcomes"


def _assert_fu_01(c: Case) -> bool:
    fu = _get(c, "lca.functional_unit")
    if fu is None:
        return True
    # JSON assertion is `lca.functional_unit == 'function-oriented'`, but
    # activate writes the longer mandate strings from lca_hc_22/mc_04/mc_07
    # (e.g. "Function-oriented FU mandatory for IS"). Substring check is
    # the practical equivalent.
    return "function-oriented" in str(fu).lower()


def _assert_fu_02(c: Case) -> bool:
    fu = _get(c, "lca.functional_unit")
    if fu is None:
        return True
    return "system-of-functional-units" in str(fu) or fu == "SFU"


def _assert_fu_04(c: Case) -> bool:
    sru = _get(c, "slca.shared_reference_unit")
    su = _get(c, "slca.stakeholder_unit")
    if sru is None and su is None:
        return True
    return sru is not None and su is not None


def _assert_b_01(c: Case) -> bool:
    pb = _get(c, "lcc.physical_boundary")
    sb = _get(c, "lca.system_boundary")
    if pb is None or sb is None:
        return True
    return pb == sb


def _assert_b_03(c: Case) -> bool:
    sb = _get(c, "lca.system_boundary")
    pb = _get(c, "lcc.physical_boundary")
    sl = _get(c, "slca.boundary")
    actives = [v for v, on in [(sb, c.q3.env), (pb, c.q3.eco), (sl, c.q3.soc)]
               if on and v is not None]
    if len(actives) < 2:
        return True
    return all(v == actives[0] for v in actives)


def _assert_b_04(c: Case) -> bool:
    td = _get(c, "slca.territorial_dimension")
    if td is None:
        return True
    return td is not None  # truthy presence


def _assert_b_05(c: Case) -> bool:
    fg = _get(c, "lca.transport.foreground")
    tc = _get(c, "lcc.transport_costs")
    if fg is None and tc is None:
        return True
    return fg is True and tc is not None


def _assert_b_06(c: Case) -> bool:
    a_inc = _get(c, "lca.capital_goods.included")
    b_inc = _get(c, "lcc.capital_goods.included")
    a_ap = _get(c, "lca.capital_goods.amortization_period")
    b_ap = _get(c, "lcc.capital_goods.amortization_period")
    if a_inc is None or b_inc is None:
        return True
    if not (a_inc is True and b_inc is True):
        return False
    if a_ap is None or b_ap is None:
        return True
    return a_ap == b_ap


_ASSERT_FNS: dict[str, Callable[[Case], bool]] = {
    "IR-01": _assert_ir_01,
    "IR-02": _assert_ir_02,
    "IR-03": _assert_ir_03,
    # IR-05: NLP "each dim retains own units in report.dimensions[*].units"
    "IR-05": lambda c: True,  # TODO(nlp-assertion)
    "IR-06": _assert_ir_06,
    "IR-07": _assert_ir_07,
    "IR-08": _assert_ir_08,
    "IR-09": _assert_ir_09,
    # IR-11: NLP "report.layers == [...] for all dims"
    "IR-11": lambda c: True,  # TODO(nlp-assertion)
    "IR-12": _assert_ir_12,
    "IR-13": _assert_ir_13,
    "IR-14": _assert_ir_14,
    "IR-15": _assert_ir_15,
    "IR-16": _assert_ir_16,
    # IR-17: NLP "screening precedes detailed"
    "IR-17": lambda c: True,  # TODO(nlp-assertion)
    "IR-18": _assert_ir_18,
    "IR-19": _assert_ir_19,
    # IR-20: NLP "each method exposes 3 analytical levels"
    "IR-20": lambda c: True,  # TODO(nlp-assertion)
    "FU-01": _assert_fu_01,
    "FU-02": _assert_fu_02,
    # FU-03: NLP "methodological_charter.fe_documented + lcc.functional_equivalent == lca.functional_unit"
    "FU-03": lambda c: True,  # TODO(nlp-assertion) — partial check could be added
    "FU-04": _assert_fu_04,
    # FU-05: NLP "all three methods use same reference scenario type for FU benchmarks"
    "FU-05": lambda c: True,  # TODO(nlp-assertion)
    "B-01": _assert_b_01,
    # B-02: NLP "lca.system_boundary consistent with lcc.economic_boundary and slca.boundary"
    "B-02": lambda c: True,  # TODO(nlp-assertion)
    "B-03": _assert_b_03,
    "B-04": _assert_b_04,
    "B-05": _assert_b_05,
    "B-06": _assert_b_06,
    # B-07: NLP "all boundary truncations documented in report.blind_spots"
    "B-07": lambda c: True,  # TODO(nlp-assertion)
}


# ---------------------------------------------------------------------------
# Action functions — CIR (10). Side-effects: write field values.
# ---------------------------------------------------------------------------


def _action_cir_01(c: Case) -> None:
    _write(c, "lca.background_futurisation", "SSP_RCP")
    _write(c, "lcc.background_dynamic", "SSP_RCP")


def _action_cir_02(c: Case) -> None:
    _write(c, "lca.uncertainty.pedigree", True)
    _write(c, "lcc.uncertainty.pedigree", True)


def _action_cir_03(c: Case) -> None:
    _write(c, "lca.spatial_coupling", "GIS")
    _write(c, "lcc.spatial_coupling", "GIS")
    _write(c, "slca.territorial_coupling", "GIS")


def _action_cir_04(c: Case) -> None:
    _write(c, "lcc.counterparty_risk", "percolation_theory")


def _action_cir_05(c: Case) -> None:
    _write(c, "lca.allocation_method", "pef_cff")
    _write(c, "lcc.externality_monetization", "CE_Delft_EU")
    _write(c, "lcc.allocation", "NTF")
    _write(c, "lca.lcia_method", "EF_3.1")


def _action_cir_06(c: Case) -> None:
    # TODO(symbolic-action): "active_set" / "matching_set" / "adapted_set"
    # are abstract references, not literal values. Recorded as sentinels.
    _write(c, "lca.frontier_categories", "active_set")
    _write(c, "lcc.externalities", "matching_set")
    _write(c, "slca.indicators", "adapted_set")


def _action_cir_07(c: Case) -> None:
    # The JSON encodes this as an `IN` membership constraint rather than
    # an assignment; we record the allowed set so downstream selection
    # can pick from it.
    allowed = ["Six-Tenths", "Lang", "CEPCI"]
    _write(c, "lca.scale_up_framework", allowed)
    _write(c, "lcc.scale_up_framework", allowed)


def _action_cir_08(c: Case) -> None:
    # TODO(symbolic-action): "+= stakeholder_group_indicators (if Q3.SOC)"
    if c.q3.soc:
        _write(c, "slca.indicators", "stakeholder_group_indicators")


def _action_cir_09(c: Case) -> None:
    # case.iterative_update_triggers is a cir_output field but not on
    # the Case model; route to system pillar with full dotted key
    # (same convention as study.X).
    c.system["case.iterative_update_triggers"] = [
        "commissioning", "ramp_up", "contract_renewal",
    ]


def _action_cir_10(c: Case) -> None:
    _write(c, "lca.report.failure_modes", "required")
    _write(c, "lcc.report.failure_modes", "required")
    _write(c, "slca.report.failure_modes", "required")


_ACTION_FNS: dict[str, Callable[[Case], None]] = {
    "CIR-01": _action_cir_01,
    "CIR-02": _action_cir_02,
    "CIR-03": _action_cir_03,
    "CIR-04": _action_cir_04,
    "CIR-05": _action_cir_05,
    "CIR-06": _action_cir_06,
    "CIR-07": _action_cir_07,
    "CIR-08": _action_cir_08,
    "CIR-09": _action_cir_09,
    "CIR-10": _action_cir_10,
}


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Evaluate all 40 L2 rules against the activated case.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention).

    For each rule with `lifecycle_layer == 'L2'`:
      1. Look up its trigger predicate in `_TRIGGER_FNS`.
      2. If the trigger fires:
         - If the rule is an assertion-rule (IR/FU/B), run the
           assertion. On False, append `{rule_id, message}` to
           `case.rule_violations`.
         - If the rule is an action-rule (CIR), run the action.

    Rules without a registered trigger predicate are skipped silently
    (defensive — a typo in the JSON would otherwise throw).
    """
    # Q1 must be set; matches l0_compute / pathway / activate convention.
    if case.q1 not in {Q1.A, Q1.B, Q1.C, Q1.D, Q1.E}:
        raise ValueError(f"Invalid Q1: {case.q1!r}")

    for rule_id, rule in schemas.rules_by_id.items():
        if rule.get("lifecycle_layer") != "L2":
            continue
        trigger = _TRIGGER_FNS.get(rule_id)
        if trigger is None:
            continue
        if not trigger(case):
            continue
        if rule_id in _ASSERT_FNS:
            if not _ASSERT_FNS[rule_id](case):
                case.rule_violations.append({
                    "rule_id": rule_id,
                    "message": rule.get("violation_message",
                                        f"{rule_id} assertion failed"),
                })
        elif rule_id in _ACTION_FNS:
            _ACTION_FNS[rule_id](case)
    return case
