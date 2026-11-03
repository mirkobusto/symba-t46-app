"""Two notes from the agent UX round of 2026-11-02, notes only (nothing derived
changes): exchanges said to run today in a system that operates in the future,
and a design study modelled as Situation A without the ILCD market screening."""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, OperatingStart, Q6b, StudyPurpose
from app.domain.models import Q3, Case
from app.engine.pipeline import run


def _codes(**kw) -> list[str]:
    base = dict(q1=Q1.B, q3=Q3(env=True), decision_context="micro", q2=Q2.A)
    base.update(kw)
    return [w["code"] for w in run(Case(**base)).warnings]


@pytest.mark.parametrize("kw", [dict(operating_start=OperatingStart.FUTURE, operating_start_year=2030),
                                dict(q6b=Q6b.TRL5_6)])
def test_running_exchanges_in_a_future_system_are_noted(kw):
    assert "running_but_future" in _codes(**kw)


def test_running_exchanges_today_are_not_noted():
    assert "running_but_future" not in _codes(operating_start=OperatingStart.NOW, q6b=Q6b.TRL9)
    assert "running_but_future" not in _codes(q2=Q2.B, q6b=Q6b.TRL5_6)


@pytest.mark.parametrize("purpose", [StudyPurpose.DESIGN, StudyPurpose.EXPANSION, StudyPurpose.RESTRUCTURING])
def test_a_design_study_in_situation_a_is_pointed_to_the_screening(purpose):
    assert "design_without_screening" in _codes(study_purpose=purpose, q2=Q2.B)


def test_the_screening_note_needs_a_shaping_purpose_and_situation_a():
    assert "design_without_screening" not in _codes(study_purpose=StudyPurpose.ANALYSIS)
    assert "design_without_screening" not in _codes(study_purpose=StudyPurpose.DESIGN, q2=Q2.B,
                                                    decision_context="none")


def test_the_freedom_to_act_note_says_what_the_configuration_keeps():
    case = run(Case(q1=Q1.B, q2=Q2.A, q3=Q3(env=True), decision_context="micro",
                    flows=[{"id": "f1", "name": "heat", "q5": "b", "sellable_elsewhere": False}]))
    note = next(w for w in case.warnings if w["code"] == "flow_freedom_to_act_settles")
    assert "keeps the economic value test" in note["message"] and "do not change who pays whom" in note["message"]
    assert "set Q5" not in note["message"]
    assert case.lca["zero_burden_classification"]["f1"] == "EVT+sensitivity"
