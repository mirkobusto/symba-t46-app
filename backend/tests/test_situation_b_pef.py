"""Situation B with EU policy alignment (Q4 = D), decided by Fable on the UX
round of 2026-11-03 (P2-01): the consequential model governs, the PEF Circular
Footprint Formula runs as a sensitivity (D4.1 Table 1, §7.3.3; D4.2 §2.2)."""
from __future__ import annotations

from app.domain.models import Case
from app.engine.pipeline import run


def _case(q4: list[str], decision: str = "structural") -> Case:
    return run(Case(q1="C", decision_context=decision, market_screening_documented=True, q2="B",
                    q3={"env": True, "eco": True, "soc": False}, q4=q4, policy_objective=False,
                    flows=[{"id": "f1", "name": "sludge", "q5": "c"}]))


def test_b_with_d_keeps_the_consequential_model_and_notes_the_cff():
    case = _case(["D", "E"])
    assert case.lca["allocation_method"].startswith("consequential expansion against the long-term marginal")
    assert "sensitivity" in case.lca["allocation_method"]
    assert "b_consequential_over_pef" in [w["code"] for w in case.warnings]


def test_b_without_d_is_unchanged():
    case = _case(["E"])
    assert case.lca["allocation_method"] == "consequential expansion"
    assert "b_consequential_over_pef" not in [w["code"] for w in case.warnings]


def test_a_with_d_still_applies_the_cff():
    assert _case(["D"], decision="micro").lca["allocation_method"] == "PEF CFF"


def test_interdependent_flow_follows_the_lca_partition_in_the_e_lcc():
    case = run(Case(q1="B", decision_context="micro", q2="A", q3={"env": True, "eco": True, "soc": False},
                    q4=["E"], policy_objective=False, flows=[{"id": "f1", "name": "lignin", "q5": "d"}]))
    texts = " ".join(str(v) for v in case.lcc.values())
    assert "same partition as the LCA" in texts
    assert "a physical or economic allocation key in the E-LCC" not in texts
