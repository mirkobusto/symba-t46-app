"""Situation C2 on a worked case (phase A, step 4, 2026-10-15).

No study in the corpus is a corporate report of an IS partner, so Situation C2
had never been run on a case. This one is built for the purpose and checked by
hand against D4.1 §4.2.3 (Table 1), §6.1, §7.2.3, §11.3.1 and D4.2 §2.3, §4.1,
§11.2-§11.3: a sugar mill reports the 2025 footprint and costs of its own
operations (CSRD); it sells bagasse to a neighbouring CHP plant (Q5=c, a market
exists) and gives defecation lime to farmers for free (Q5=b, no one else would
pay for it).
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, DecisionContext, OperatingStart, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.pipeline import run


def _sugar_mill(q4: set[Q4]) -> Case:
    case = Case(
        q1=Q1.D, q2=Q2.A, q3=Q3(env=True, eco=True), q4=q4,
        q6a=Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES, q6b=Q6b.TRL9, q7=Q7.A,
        operating_start=OperatingStart.NOW, analysis_period_years=1,
        decision_context=DecisionContext.CORPORATE_REPORT, policy_objective=False,
        flows=[
            Flow(id="bagasse", name="Bagasse to CHP plant", q5=Q5.c, sellable_elsewhere=True),
            Flow(id="lime", name="Defecation lime to farmers", q5=Q5.b, sellable_elsewhere=False),
            Flow(id="filter_cake", name="Filter cake taken away for a gate fee", q5=Q5.a),
        ],
    )
    return run(case)


@pytest.fixture(params=[{Q4.B}, {Q4.D}], ids=["external-report", "eu-policy"])
def case(request) -> Case:
    return _sugar_mill(request.param)


def test_situation_and_paradigm(case):
    assert case.ilcd_situation.value == "ILCD Situation C2"          # Q9 corporate report
    assert case.lca["modeling_framework"] == "attributional"          # Table 1, C


def test_allocation_and_no_substitution_credits_even_with_q4_d(case):
    """D4.1 L00868: 'use Allocation (Step 3). Do not apply substitution credits'."""
    assert case.lca["allocation_method"] == "allocation"
    treatment = case.lca["zero_burden_classification"]
    assert treatment["bagasse"].startswith("allocation (Situation C2")   # a co-product: Step 3
    assert treatment["filter_cake"] == "zero-burden"                     # a waste keeps Step 4 (L01016)
    assert treatment["lime"] == "EVT+sensitivity"
    assert case.lca["reference_scenario.content"].startswith("Allocation, no substitution credits")


def test_q4_d_is_told_why_the_cff_is_not_applied():
    eu = _sugar_mill({Q4.D})
    assert "c2_allocation_over_pef" in {w["code"] for w in eu.warnings}
    plain = _sugar_mill({Q4.B})
    assert "c2_allocation_over_pef" not in {w["code"] for w in plain.warnings}


def test_boundaries_are_the_company(case):
    assert case.lca["system_boundary"].startswith("company: the reporting company's own processes")
    assert case.lcc["economic_boundary"] == "Gate-to-gate around the company (D4.2 §4.1)"


def test_costing_is_the_company_alone(case):
    assert case.lcc_type.value == "C-LCC"                             # T4.6 choice, declared
    assert case.lcc["discount_rate"].startswith("C-LCC: the company's WACC")
    assert case.lcc["eco_efficiency_indicator"].startswith("No eco-efficiency indicator: a gate-to-gate C-LCC")


def test_no_eu_prices_or_net_tax_factor_on_a_company_lcc(case):
    """A C-LCC keeps to the firm's own cash flows, Q4=D included (D4.2 §11.2,
    §2.2): no monetised externalities, no Net Tax Factor (review 2026-10-18)."""
    assert case.lcc["externality_monetization"].startswith("None: a company-level LCC")
    assert "allocation" not in case.lcc


def test_no_facilitator_between_partners_for_one_company(case):
    """IR-06 excludes C2: one company pools no data between partners (D4.2 §2.3)."""
    assert case.governance["facilitator"].startswith("Not needed: one company's own accounts")
    assert case.governance["ndas_signed"].startswith("Only where data from suppliers or customers")


def test_background_is_the_average_mix(case):
    assert case.lca["background_database"].startswith("Average market mixes")


def test_free_flow_with_no_other_buyer_reads_as_waste(case):
    assert "flow_freedom_to_act_settles" in {w["code"] for w in case.warnings}


def test_situation_c2_comes_from_q9_not_from_q1():
    """Q9 decides the situation (#114): a corporate report keeps C2 rules with Q1=A too."""
    case = run(Case(
        q1=Q1.A, q2=Q2.A, q3=Q3(env=True, eco=True), q4={Q4.D}, q6b=Q6b.TRL9, q7=Q7.A,
        decision_context=DecisionContext.CORPORATE_REPORT,
        flows=[Flow(id="f1", name="Bagasse", q5=Q5.c)],
    ))
    assert case.ilcd_situation.value == "ILCD Situation C2"
    assert case.lca["allocation_method"] == "allocation"
    assert case.lca["system_boundary"].startswith("company:")
    assert "c2_allocation_over_pef" in {w["code"] for w in case.warnings}
