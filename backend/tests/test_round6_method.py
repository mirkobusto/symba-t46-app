"""Method decisions of UX round 6 (2026-11-08, decided by Fable; P6-03..P6-09,
P6-16, P6-20, P7-24): Situation C2 without network or comparative obligations,
the avoidability test left to the E-LCC, CIR-09 on every ex-ante study, CDPs
worded for the case, no dated development notes in the node values."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, DecisionContext, OperatingStart, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.pipeline import run

NODES = Path(__file__).resolve().parents[1] / "app/schemas/phase1_nodes.json"


def _case(**kw) -> Case:
    kw.setdefault("q1", Q1.B)
    kw.setdefault("q2", Q2.A)
    kw.setdefault("q3", Q3(env=True, eco=True))
    kw.setdefault("q7", Q7.A)
    kw.setdefault("decision_context", DecisionContext.MICRO)
    kw.setdefault("flows", [Flow(id="f1", name="whey", q5=Q5.c), Flow(id="f2", name="sludge", q5=Q5.a)])
    return run(Case(**kw))


def _rules(case: Case) -> set[str]:
    return {r["rule_id"] for r in case.applicable_rules}


def _cdps(case: Case) -> dict[str, dict]:
    return {c["cdp_id"]: c for c in case.cdp_flags}


@pytest.fixture()
def c2() -> Case:
    return _case(q1=Q1.D, decision_context=DecisionContext.CORPORATE_REPORT, policy_objective=False)


def test_one_company_account_is_absolute_and_has_no_network_level(c2):
    assert c2.ilcd_situation.value == "ILCD Situation C2"
    assert not {"IR-19", "IR-07", "FU-05"} & _rules(c2)
    assert "CDP-05" not in _cdps(c2)
    assert not {"lcc_mc_02", "lca_hc_04", "lca_hc_10", "lcc_hc_28"} & set(c2.activated_nodes)
    assert "lcc_hc_11" in c2.activated_nodes          # the C-LCC's own avoided costs (D4.2 §5.3)
    assert c2.lcc["kpi_suite"].endswith("(D4.2 §8.2; reporting rule §8.3)")
    assert "for the one company and for each of its exchanges" in c2.lcc["kpi_suite"]
    assert "percolation" not in c2.lcc["counterparty_risk"].split("no network percolation")[0]
    assert "eco_efficiency_metric" not in c2.lcc


def test_a_network_keeps_them():
    case = _case()
    assert {"IR-19", "IR-07", "FU-05"} <= _rules(case)
    ir19 = next(r for r in case.applicable_rules if r["rule_id"] == "IR-19")
    assert ir19["statement"].startswith("Results are reported relative to the reference scenario")
    assert {"lcc_mc_02", "lca_hc_04", "lca_hc_10", "lcc_hc_28"} <= set(case.activated_nodes)
    assert case.lcc["eco_efficiency_metric"].startswith("Eco-efficiency indicators (ECOF, IEE) take annualised")


def test_fu05_needs_two_methods():
    assert "FU-05" not in _rules(_case(q3=Q3(env=True)))


@pytest.mark.parametrize("q2, q6b, fires", [
    (Q2.B, Q6b.TRL9, True),      # a planned project is ex ante whatever its TRL (D4.2 §7.1, P6-09)
    (Q2.A, Q6b.TRL9, False),
    (Q2.A, Q6b.TRL7_8, True),    # a technology below TRL 9 has no industrial-scale data either
    (Q2.B, Q6b.TRL5_6, True),
])
def test_cir09_fires_on_every_ex_ante_study(q2, q6b, fires):
    case = _case(q2=q2, q6b=q6b, operating_start=OperatingStart.NOW)
    assert ("CIR-09" in _rules(case)) is fires
    assert ("lcc_hc_37" in case.activated_nodes) is fires


def test_the_avoidability_test_belongs_to_the_costing():
    node = next(n for n in json.loads(NODES.read_text())["nodes"] if n["id"] == "lca_hc_17")
    assert "avoidab" not in node["default_value"]["q5=a"]
    assert node["default_value"]["q5=a"].startswith("zero burden: modelled as a waste")


def test_decision_points_follow_the_case():
    full = Q3(env=True, eco=True, soc=True)   # CDP-08 needs the S-LCA
    a = _cdps(_case(q3=full))
    assert a["CDP-01"]["variant"] == "default" and "Situation B" not in a["CDP-01"]["resolution_at_l3"]
    assert a["CDP-08"]["variant"] == "default" and "Q4 = D" not in a["CDP-08"]["resolution_at_l3"]
    assert "CDP-09" not in a                         # present-day background: nothing to decide (P7-24)
    b = _cdps(_case(q3=full, decision_context=DecisionContext.STRUCTURAL, market_screening_documented=True,
                    q4={Q4.D}, operating_start=OperatingStart.FUTURE, operating_start_year=2035))
    assert b["CDP-01"]["variant"] is None and "in Situation B" in b["CDP-01"]["resolution_at_l3"]
    assert b["CDP-08"]["variant"] is None and "Q4 = D" in b["CDP-08"]["resolution_at_l3"]
    assert "CDP-09" in b


def test_no_dated_development_notes_in_the_values():
    for n in json.loads(NODES.read_text())["nodes"]:
        values = n["default_value"] if isinstance(n["default_value"], dict) else {"": n["default_value"]}
        for v in values.values():
            assert "2026-" not in str(v), n["id"]
