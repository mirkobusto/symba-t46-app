"""Domain model smoke tests — Sprint 4 Step 2.

Verifies that the Pydantic shell models instantiate, reject typos at the
outer level (extra='forbid'), and accept arbitrary keys inside pillar
dicts (the dict[str, Any] flexibility).
"""
from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.domain.enums import (
    Q1,
    Q2,
    Q4,
    Q5,
    StudyPhase,
)
from app.domain.models import (
    Q3,
    AlternativeScenario,
    Case,
    Flow,
    Site,
)


def test_empty_case_validates():
    case = Case()
    assert case.id is not None
    assert case.q1 is None
    assert case.q3 == Q3()  # all three booleans default false
    assert case.flows == []
    assert case.lca == {}
    assert case.study_phase is StudyPhase.SCREENING
    assert case.activated_nodes == []
    assert case.blocked_by == []


def test_case_outer_extra_forbid():
    """Outer level rejects unknown attributes (catches typos like q8, flow)."""
    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        Case(q8="A")  # type: ignore[call-arg]
    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        Case(flow=[])  # type: ignore[call-arg]


def test_case_q1_q2_accept_valid_enum_values():
    case = Case(q1=Q1.B, q2=Q2.D)
    assert case.q1 is Q1.B
    assert case.q2 is Q2.D


def test_case_q1_rejects_invalid_value():
    with pytest.raises(ValidationError):
        Case(q1="Z")  # type: ignore[arg-type]


def test_case_q3_multi_checkbox():
    case = Case(q3=Q3(env=True, eco=True, soc=False))
    assert case.q3.env is True
    assert case.q3.eco is True
    assert case.q3.soc is False


def test_case_q4_is_a_set():
    case = Case(q4={Q4.A, Q4.D})
    assert case.q4 == {Q4.A, Q4.D}


def test_case_q4_set_dedupes():
    case = Case(q4={Q4.A, Q4.A, Q4.D})
    assert case.q4 == {Q4.A, Q4.D}


def test_pillar_dicts_accept_arbitrary_keys():
    """Inside each pillar, dict[str, Any] is intentionally flexible.

    The validator (CI) ensures every dotted-path the engine writes is
    declared somewhere; runtime doesn't type-check pillar contents.
    """
    case = Case()
    case.lca["functional_unit"] = "1 kg of recycled aluminum at gate"
    case.lca["capital_goods"] = {"included": True, "amortization_period": 20}
    case.report["framing"] = "comparative_outcomes"
    case.governance["facilitator"] = "ACME Consulting Srl"

    assert case.lca["functional_unit"].startswith("1 kg")
    assert case.lca["capital_goods"]["amortization_period"] == 20
    assert case.report["framing"] == "comparative_outcomes"


def test_flow_model_accepts_valid_q5():
    flow = Flow(id="f1", name="spent solvent", q5=Q5.c)
    assert flow.q5 is Q5.c
    assert flow.physical_quantity is None


def test_flow_outer_extra_forbid():
    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        Flow(id="f1", name="x", q5=Q5.a, mystery_field=42)  # type: ignore[call-arg]


def test_site_optional_coordinates():
    site = Site(id="s1", name="Plant Milano")
    assert site.latitude is None
    assert site.longitude is None


def test_alternative_scenario_overrides_dict():
    alt = AlternativeScenario(id="alt1", label="High-TRL counterfactual",
                              overrides={"q6b": "TRL9"})
    assert alt.overrides["q6b"] == "TRL9"


def test_case_with_flows_and_sites():
    case = Case(
        q1=Q1.B,
        flows=[Flow(id="f1", name="heat", q5=Q5.c),
               Flow(id="f2", name="CO2", q5=Q5.a)],
        sites=[Site(id="s1", name="Plant A"),
               Site(id="s2", name="Plant B")],
    )
    assert len(case.flows) == 2
    assert len(case.sites) == 2
    assert case.flows[0].id == "f1"
