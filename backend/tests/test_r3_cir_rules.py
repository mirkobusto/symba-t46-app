"""R3 (2026-10-18): every L2 rule reads a real answer or is retired, and no CIR
action writes over a value a node wrote: the rule stays among the obligations."""
from __future__ import annotations

import itertools

import pytest

from app.domain.enums import Q1, Q2, Q4, Q7, ComparisonGoal, Q6b
from app.domain.models import Q3, Case
from app.engine import activate, l0_compute, l1_blocks, sector_rules
from app.engine.l2_validate import _TRIGGER_FNS
from app.engine.l2_validate import run as l2_run
from app.engine.loader import load_schemas

SCHEMAS = load_schemas()


def _until_activate(case: Case) -> Case:
    l0_compute.run(case, SCHEMAS)
    l1_blocks.run(case, SCHEMAS)
    activate.run(case, SCHEMAS)
    sector_rules.run(case, SCHEMAS)
    return case


@pytest.mark.parametrize("q4, q6b, q2, dims", list(itertools.product(
    [set(), {Q4.D}, {Q4.C, Q4.E}], [Q6b.TRL9, Q6b.TRL5_6], [Q2.A, Q2.B],
    [Q3(env=True), Q3(env=True, eco=True), Q3(env=True, eco=True, soc=True)])))
def test_no_cir_action_writes_over_a_node(q4, q6b, q2, dims):
    case = _until_activate(Case(q1=Q1.B, q2=q2, q3=dims, q4=q4, q6b=q6b, q7=Q7.B, decision_context="micro",
                                policy_objective=False, analysis_period_years=25,
                                dedicated_shared_assets=True))
    before = {p: dict(getattr(case, p)) for p in ("lca", "lcc", "slca")}
    l2_run(case, SCHEMAS)
    for pillar, values in before.items():
        after = getattr(case, pillar)
        for key, value in values.items():
            assert after[key] == value, (pillar, key)


@pytest.mark.parametrize("rule", ["CIR-03", "CIR-04", "CIR-06"])
def test_retired_rules_never_fire(rule):
    case = Case(q1=Q1.B, q3=Q3(env=True, eco=True, soc=True), q7=Q7.C, advanced={
        "transport_sensitive": True, "network_nodes": 5, "interdependent_flows": True,
        "frontier_categories_active": True})
    assert _TRIGGER_FNS[rule](case) is False


def test_ir_06_governance_follows_the_situation_not_q1():
    two = Q3(env=True, eco=True)
    network = l0_compute.run(Case(q1=Q1.D, q3=two, decision_context="micro"), SCHEMAS)
    company = l0_compute.run(Case(q1=Q1.B, q3=two, decision_context="corporate_report"), SCHEMAS)
    assert _TRIGGER_FNS["IR-06"](network) is True        # Q1 = D no longer excludes a network study
    assert _TRIGGER_FNS["IR-06"](company) is False       # one company in isolation has no partners


def test_fu_02_follows_the_co_primary_comparison():
    assert _TRIGGER_FNS["FU-02"](Case(q3=Q3(env=True), comparison_goal=ComparisonGoal.CO_PRIMARY)) is True
    assert _TRIGGER_FNS["FU-02"](Case(q3=Q3(eco=True), comparison_goal=ComparisonGoal.CO_PRIMARY)) is False
    assert _TRIGGER_FNS["FU-02"](Case(q1=Q1.B, advanced={"multi_actor": True})) is False


def test_cir_08_no_longer_reads_q1():
    soc = Q3(env=True, soc=True)
    assert _TRIGGER_FNS["CIR-08"](Case(q1=Q1.A, q3=soc, dedicated_shared_assets=True)) is True
    assert _TRIGGER_FNS["CIR-08"](Case(q1=Q1.B, q3=Q3(env=True), dedicated_shared_assets=True)) is False


def test_cir_02_writes_a_statement_where_no_node_writes():
    from app.engine.pipeline import run
    case = run(Case(q1=Q1.A, q2=Q2.B, q3=Q3(env=True, eco=True), decision_context="micro",
                    policy_objective=False))
    assert case.lcc["uncertainty.pedigree"].startswith("Pedigree Matrix")


def test_obligation_cards_name_only_live_questions():
    """trigger_condition_raw is shown on the obligation cards: no history in it."""
    import json
    from pathlib import Path
    rules = json.loads((Path(__file__).resolve().parents[1] / "app/schemas/cross_method_rules.json").read_text())
    for group in ("integration_rules", "conditional_integration_rules", "fu_rules", "boundary_rules"):
        for rule in rules[group]:
            if rule["trigger_condition"] == "false":
                continue
            raw = rule["trigger_condition_raw"]
            assert "R3" not in raw and "was " not in raw and "dropped" not in raw, rule["id"]
