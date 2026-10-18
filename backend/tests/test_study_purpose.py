"""Q0 — purpose of the study, D4.1 §4.3.2 (after Mattila et al. 2012), added
2026-10-18 as a charter answer: it derives nothing, notes the two answers whose
definition fixes the timing when Q2 contradicts them, and appears in the report
and on the DCF cover."""
from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

import pytest
from docx import Document

from app.domain.enums import Q1, Q2, StudyPurpose
from app.domain.models import Q3, Case
from app.engine.dcf_compose import compose_dcf
from app.engine.pipeline import run
from app.services.reports import generate_case_report_bytes


def _run(**kw) -> Case:
    base = dict(q1=Q1.B, q3=Q3(env=True), decision_context="micro")
    base.update(kw)
    return run(Case(**base))


def _codes(case: Case) -> list[str]:
    return [w["code"] for w in case.warnings if w["code"] == "study_purpose_vs_q2"]


@pytest.mark.parametrize("purpose, fits, misfits", [
    (StudyPurpose.ANALYSIS, Q2.A, Q2.B),
    (StudyPurpose.DESIGN, Q2.B, Q2.A),
])
def test_a_purpose_that_fixes_the_timing_is_checked_against_q2(purpose, fits, misfits):
    assert _codes(_run(study_purpose=purpose, q2=fits)) == []
    noted = _run(study_purpose=purpose, q2=misfits)
    assert _codes(noted) == ["study_purpose_vs_q2"]
    assert noted.warnings[-1]["params"] == {"variant": purpose.value}


@pytest.mark.parametrize("purpose", [StudyPurpose.IMPROVEMENT, StudyPurpose.EXPANSION, StudyPurpose.RESTRUCTURING])
def test_purposes_that_fit_either_timing_leave_no_note(purpose):
    """The running exchanges can be measured with the change as a scenario, or the
    change itself (review 2026-10-18)."""
    for q2 in (Q2.A, Q2.B):
        assert _codes(_run(study_purpose=purpose, q2=q2)) == []


def test_no_double_note_with_the_documentation_one():
    case = _run(study_purpose=StudyPurpose.ANALYSIS, q2=Q2.B, decision_context="none")
    codes = [w["code"] for w in case.warnings]
    assert "documentation_vs_ex_ante" in codes and "study_purpose_vs_q2" not in codes


def test_the_purpose_changes_no_derived_state():
    for purpose in (None, *StudyPurpose):
        case = _run(study_purpose=purpose, q2=Q2.A)
        assert (case.ilcd_situation.value, case.lcc_type.value) == ("ILCD Situation A", "deactivated")
        assert case.lca == _run(q2=Q2.A).lca


def test_report_and_dcf_cover_carry_the_purpose():
    case = _run(study_purpose=StudyPurpose.DESIGN, q2=Q2.B, reference_market_region="Italy",
                reference_market_scope="sub_national")
    text = "\n".join(p.text for p in Document(BytesIO(generate_case_report_bytes(case))).paragraphs)
    assert "Q0 study purpose (D4.1 §4.3.2): design" in text
    root = Path(__file__).resolve().parents[1]
    payload = compose_dcf(case, json.loads((root / "app/schemas/dcf_schema.json").read_text()),
                          json.loads((root / "coordination/dcf_mandates_census.json").read_text()))
    assert (payload.study_purpose, payload.reference_market) == ("Design", "Italy (sub-national)")
