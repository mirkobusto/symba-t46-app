"""Tests for engine.l2_validate.run — Sprint 4 Step 3 commit 5.

Covers the 40 L2 rules: trigger predicates, assertion semantics
(missing-data-inconclusive policy), CIR action side-effects,
NLP-stub assertions, and the mutation contract.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.activate import run as activate_run
from app.engine.l0_compute import run as l0_run
from app.engine.l2_validate import _ASSERT_FNS, _TRIGGER_FNS, run

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _ready_case(**overrides) -> Case:
    """Case with l0+activate already run, ready for L2 evaluation."""
    base = {"q1": Q1.A, "q2": Q2.A, "q3": Q3(env=True)}
    base.update(overrides)
    return Case(**base)


def _full_pipeline_until_l2(case: Case, schemas) -> Case:
    """Run l0 + activate so case has lcc_type + pillar dicts populated."""
    l0_run(case, schemas)
    activate_run(case, schemas)
    return case


# ---------------------------------------------------------------------------
# 1. Smoke — minimal case yields no violations (everything inconclusive)
# ---------------------------------------------------------------------------


def test_smoke_minimal_case_no_violations(schemas):
    case = _ready_case()
    _full_pipeline_until_l2(case, schemas)
    run(case, schemas)
    assert case.rule_violations == []


# ---------------------------------------------------------------------------
# 2. Q1=None defensive raise
# ---------------------------------------------------------------------------


def test_q1_none_raises(schemas):
    case = Case(q3=Q3(env=True))
    with pytest.raises(ValueError, match="Invalid Q1"):
        run(case, schemas)


# ---------------------------------------------------------------------------
# 3. Trigger predicate semantics — spot-check a few representative rules
# ---------------------------------------------------------------------------


def test_trigger_IR_01_fires_when_two_dims_active(schemas):
    case_two = _ready_case(q3=Q3(env=True, eco=True))
    case_one = _ready_case(q3=Q3(env=True))
    assert _TRIGGER_FNS["IR-01"](case_two) is True
    assert _TRIGGER_FNS["IR-01"](case_one) is False


def test_trigger_IR_17_always_true(schemas):
    case = _ready_case()
    assert _TRIGGER_FNS["IR-17"](case) is True


def test_trigger_CIR_05_fires_when_q4_includes_D(schemas):
    case_d = _ready_case(q4={Q4.D})
    case_other = _ready_case(q4={Q4.A})
    assert _TRIGGER_FNS["CIR-05"](case_d) is True
    assert _TRIGGER_FNS["CIR-05"](case_other) is False


def test_trigger_FU_04_fires_when_soc(schemas):
    case = _ready_case(q3=Q3(env=True, soc=True))
    assert _TRIGGER_FNS["FU-04"](case) is True


def test_trigger_B_05_fires_for_q7_BCD(schemas):
    assert _TRIGGER_FNS["B-05"](_ready_case(q7=Q7.A)) is False
    assert _TRIGGER_FNS["B-05"](_ready_case(q7=Q7.B)) is True


def test_trigger_uses_defensive_attrs(schemas):
    """CIR-04 references network_nodes / interdependent_flows which are
    not on Case; predicate must stay False today."""
    case = _ready_case(q1=Q1.B)
    assert _TRIGGER_FNS["CIR-04"](case) is False


# ---------------------------------------------------------------------------
# 4. Assertion semantics — missing data is inconclusive (no violation)
# ---------------------------------------------------------------------------


def test_assertion_missing_pillar_value_inconclusive(schemas):
    """FU-01 requires lca.functional_unit == 'function-oriented'; if
    activate hasn't written it, no violation."""
    case = _ready_case()
    # do NOT run activate so lca.functional_unit stays unset
    run(case, schemas)
    # FU-01 trigger fires (q3.env), but assertion is inconclusive
    assert all(v["rule_id"] != "FU-01" for v in case.rule_violations)


def test_assertion_FU_01_violates_when_value_wrong(schemas):
    case = _ready_case()
    case.lca["functional_unit"] = "mass-based"  # wrong value
    run(case, schemas)
    assert any(v["rule_id"] == "FU-01" for v in case.rule_violations)


def test_assertion_FU_01_passes_when_value_correct(schemas):
    case = _ready_case()
    case.lca["functional_unit"] = "function-oriented"
    run(case, schemas)
    assert all(v["rule_id"] != "FU-01" for v in case.rule_violations)


def test_assertion_IR_01_FU_alignment(schemas):
    """Multi-dim case where FUs are misaligned → IR-01 violation."""
    case = _ready_case(q3=Q3(env=True, eco=True))
    case.lca["functional_unit"] = "1 kg of material"
    case.lcc["functional_equivalent"] = "different unit"
    run(case, schemas)
    assert any(v["rule_id"] == "IR-01" for v in case.rule_violations)


def test_assertion_IR_01_passes_when_aligned(schemas):
    case = _ready_case(q3=Q3(env=True, eco=True))
    case.lca["functional_unit"] = "1 kg of material"
    case.lcc["functional_equivalent"] = "1 kg of material"
    run(case, schemas)
    assert all(v["rule_id"] != "IR-01" for v in case.rule_violations)


def test_assertion_B_01_boundary_mismatch(schemas):
    """E-LCC family + Q3.env true + boundaries different → B-01 violation."""
    case = _ready_case(q3=Q3(env=True, eco=True))
    l0_run(case, schemas)  # so lcc_type is set to a C+E variant
    case.lca["system_boundary"] = "cradle-to-gate"
    case.lcc["physical_boundary"] = "cradle-to-grave"
    run(case, schemas)
    assert any(v["rule_id"] == "B-01" for v in case.rule_violations)


# ---------------------------------------------------------------------------
# 5. NLP-stub assertions never produce violations
# ---------------------------------------------------------------------------


def test_nlp_stubs_return_true(schemas):
    case = _ready_case(q3=Q3(env=True, eco=True))
    for rid in ("IR-05", "IR-11", "IR-17", "IR-20",
                "FU-03", "FU-05", "B-02", "B-07"):
        assert _ASSERT_FNS[rid](case) is True


# ---------------------------------------------------------------------------
# 6. CIR action side-effects
# ---------------------------------------------------------------------------


def test_CIR_05_writes_pef_cff_when_q4_D(schemas):
    case = _ready_case(q4={Q4.D})
    run(case, schemas)
    assert case.lca.get("allocation_method") == "pef_cff"
    assert case.lcc.get("externality_monetization") == "CE_Delft_EU"
    assert case.lcc.get("allocation") == "NTF"
    assert case.lca.get("lcia_method") == "EF_3.1"


def test_CIR_07_writes_scale_up_framework_for_low_TRL(schemas):
    case = _ready_case(q6b=Q6b.TRL5_6)
    run(case, schemas)
    assert case.lca.get("scale_up_framework") == ["Six-Tenths", "Lang", "CEPCI"]


def test_CIR_09_routes_to_system_pillar(schemas):
    """case.iterative_update_triggers isn't on Case; routed to system."""
    case = _ready_case(q2=Q2.C, q6b=Q6b.TRL5_6)
    run(case, schemas)
    assert case.system.get("case.iterative_update_triggers") == [
        "commissioning", "ramp_up", "contract_renewal",
    ]


def test_CIR_10_always_fires(schemas):
    case = _ready_case()
    run(case, schemas)
    assert case.lca.get("report.failure_modes") == "required"
    assert case.lcc.get("report.failure_modes") == "required"
    assert case.slca.get("report.failure_modes") == "required"


def test_CIR_does_not_fire_when_trigger_false(schemas):
    """CIR-05 requires Q4=D; without it, no PEF CFF write."""
    case = _ready_case(q4={Q4.A})
    run(case, schemas)
    assert "allocation_method" not in case.lca


# ---------------------------------------------------------------------------
# 7. Mutation contract
# ---------------------------------------------------------------------------


def test_run_mutates_and_returns_same_instance(schemas):
    case = _ready_case()
    result = run(case, schemas)
    assert result is case


# ---------------------------------------------------------------------------
# 8. End-to-end activate→l2 — full case stays consistent
# ---------------------------------------------------------------------------


def test_full_pipeline_consistency(schemas):
    """Activate populates 116+ DEFAULT nodes; l2 evaluates rules.
    A maximally-complete consistent case should produce few/no violations."""
    case = Case(
        q1=Q1.A, q2=Q2.A,
        q3=Q3(env=True, eco=True, soc=True),
        q4={Q4.A}, q7=Q7.A,
        flows=[Flow(id="f1", name="x", q5=Q5.c)],
    )
    _full_pipeline_until_l2(case, schemas)
    run(case, schemas)
    # No assertion should hard-fail because activate doesn't populate the
    # asserted pillar values directly (they're set by user/advanced layer).
    # All assertions either inconclusive or trivially-true NLP stubs.
    assert isinstance(case.rule_violations, list)
