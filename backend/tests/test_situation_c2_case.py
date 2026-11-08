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
    """D4.1 L00899: 'use Allocation (Step 3). Do not apply substitution credits'."""
    assert case.lca["allocation_method"] == "allocation"
    treatment = case.lca["zero_burden_classification"]
    assert treatment["bagasse"].startswith("allocation (Situation C2")   # a co-product: Step 3
    assert treatment["filter_cake"] == "zero-burden"                     # a waste keeps Step 4 (L01047)
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


def test_network_mandates_are_dormant_for_one_company(case):
    """UX round 5, Fable D1: one company's accounts have no network level
    (D4.1 §7.2.3 L00899)."""
    dormant = {"lca_hc_02", "lca_hc_11", "lca_mc_31", "lca_mc_34", "lcc_hc_01", "lcc_hc_09", "lcc_hc_19"}
    assert not dormant & set(case.activated_nodes)


def test_the_dcf_asks_no_substitution_data_and_the_reference_is_optional(case):
    import json
    from pathlib import Path

    from app.engine.dcf_compose import compose_dcf

    root = Path(__file__).resolve().parents[1]
    schema = json.loads((root / "app/schemas/dcf_schema.json").read_text())
    census = json.loads((root / "coordination/dcf_mandates_census.json").read_text())
    payload = compose_dcf(case, schema, census)
    sections = {s.id: s for s in payload.sections}
    classif = {f.id for f in sections["flow_classification"].fields}
    assert not classif & {"classif.quality_factor_q", "classif.quality_factor_basis",
                          "classif.substituted_lci_dataset", "classif.substituted_product"}
    ref = {f.id: f for f in sections["reference_scenario"].fields}
    assert ref["ref.without_symbiosis"].required is False
    assert payload.situation_c2 is True


def test_flow_treatment_in_c2_is_allocation_except_for_waste(case):
    """lca_hc_17 in C2: allocation for a co-product, a waste keeps its zero-burden
    point (UX round 5, Fable D1; #130; round 6 wording)."""
    import json
    from pathlib import Path

    from app.engine.dcf_compose import compose_dcf

    root = Path(__file__).resolve().parents[1]
    payload = compose_dcf(
        case,
        json.loads((root / "app/schemas/dcf_schema.json").read_text()),
        json.loads((root / "coordination/dcf_mandates_census.json").read_text()),
    )
    [stmt] = [o.statement for o in payload.obligations if o.id == "lca_hc_17"]
    assert "Bagasse to CHP plant: allocation in place of substitution: no substitution credits" in stmt
    assert "Filter cake taken away for a gate fee: zero burden: modelled as a waste" in stmt


def test_no_network_level_rules_for_one_company(case):
    """IR-16 (entity-first calculation) and IR-20 (three levels) ask for the
    network level a C2 study does not have (Fable review of #209)."""
    fired = {r["rule_id"] for r in case.applicable_rules}
    assert not {"IR-16", "IR-20"} & fired


def test_no_substitution_asks_in_c2(case):
    """C2 allocates and takes no substitution credits (D4.1 §7.2.3 L00899): no
    quality factor Q, no rule aligning it (IR-09), no choice of displaced
    products (CDP-01), although the bagasse is Q5=c (Kimi test 2026-11-04,
    A2-06, A2-09; decided by Fable, owner OK)."""
    assert case.lca["q_factor"].startswith("Not applied: Situation C2 uses allocation")
    assert case.lcc["q_factor"].startswith("Not applied to the firm's own cash flows")
    assert "IR-09" not in {r["rule_id"] for r in case.applicable_rules}
    assert "CDP-01" not in {c["cdp_id"] for c in case.cdp_flags}
