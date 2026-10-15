"""Tests for engine.activate.run — Sprint 4 Step 3 commit 4.

Covers the 186-node activation: DEFAULT (always-active) baseline,
DERIVED activation per trigger_logic (discriminative / simple /
conjunctive / disjunctive), pillar-dispatch routing, per_flow
handling, procedural_mandate (no-write) semantics, L0 skip, and
the mutation contract.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, LccType, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.activate import _resolve_discriminative, run
from app.engine.branch_keys import BranchKeyError
from app.engine.l0_compute import run as l0_run
from app.engine.pipeline import run as pipeline_run

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _baseline_case(**overrides) -> Case:
    """Minimal valid case: Q1=A, Q3.env=True (so no L1 BLOCK fires).
    activate.run requires Q1 set; L0 should run first to populate
    derived state used by some predicates (lcc_type, etc.)."""
    base = {"q1": Q1.A, "q3": Q3(env=True)}
    base.update(overrides)
    return Case(**base)


# ---------------------------------------------------------------------------
# 1. DEFAULT activation — 116 nodes always activate on any case
# ---------------------------------------------------------------------------


def test_all_default_nodes_activate(schemas):
    case = _baseline_case()
    run(case, schemas)
    default_ids = {n["id"] for n in schemas.phase1_nodes if n.get("category") == "DEFAULT"}
    assert default_ids.issubset(set(case.activated_nodes))
    # 116 + lca_hc_21 and lcc_hc_06, made unconditional (audit I-08), minus lca_mc_06,
    # which branches on the ILCD situation since 2026-10-15 (D4.1 Table 1)
    assert len(default_ids) == 117


def test_l0_nodes_skipped(schemas):
    case = _baseline_case()
    run(case, schemas)
    l0_ids = {n["id"] for n in schemas.phase1_nodes if n.get("lifecycle_layer") == "L0"}
    assert l0_ids.isdisjoint(set(case.activated_nodes))
    assert len(l0_ids) == 3


# ---------------------------------------------------------------------------
# 2. Pillar dispatcher — each prefix routes to the correct dict
# ---------------------------------------------------------------------------


def test_lca_default_field_lands_in_lca_pillar(schemas):
    """lca_hc_16 (DEFAULT, fielded `methodological_charter.signed`)
    writes into case.methodological_charter."""
    case = _baseline_case()
    run(case, schemas)
    assert case.methodological_charter.get("signed") is not None


def test_lcc_pillar_populated_when_eco_active(schemas):
    """lcc_mc_03 / lcc_mc_etc are LCC DEFAULT nodes — write to case.lcc."""
    case = _baseline_case(q3=Q3(env=True, eco=True))
    l0_run(case, schemas)  # so lcc_type is set
    run(case, schemas)
    # at least one LCC field must have been written by a DEFAULT LCC node
    assert len(case.lcc) > 0


def test_review_pillar_when_q4_C(schemas):
    """lca_hc_08 fires for Q4=C and writes review.panel.experts."""
    case = _baseline_case(q4={Q4.C})
    run(case, schemas)
    assert "lca_hc_08" in case.activated_nodes
    assert case.review.get("panel.experts") is not None


# ---------------------------------------------------------------------------
# 3. Discriminative trigger logic
# ---------------------------------------------------------------------------


def test_discriminative_match_q4_C(schemas):
    case = _baseline_case(q4={Q4.C})
    run(case, schemas)
    # lca_hc_08 default_value: q4=C → "Panel review (3+ experts...) mandatory"
    assert "lca_hc_08" in case.activated_nodes
    assert "mandatory" in case.review["panel.experts"]


def test_discriminative_match_q4_D(schemas):
    case = _baseline_case(q4={Q4.D})
    run(case, schemas)
    assert "lca_hc_08" in case.activated_nodes
    assert "recommended" in case.review["panel.experts"]


def test_discriminative_no_match_node_dormant(schemas):
    """Q4={A,B} doesn't satisfy q4=C or q4=D → lca_hc_08 dormant."""
    case = _baseline_case(q4={Q4.A, Q4.B})
    run(case, schemas)
    assert "lca_hc_08" not in case.activated_nodes
    assert "panel.experts" not in case.review


# ---------------------------------------------------------------------------
# 4. Boolean predicate trigger logic
# ---------------------------------------------------------------------------


def test_simple_predicate_q7_geographic(schemas):
    """lca_mc_29 (a Q7-conditioned node) fires when Q7 in {C,D}."""
    case = _baseline_case(q7=Q7.C)
    run(case, schemas)
    assert "lca_mc_29" in case.activated_nodes


def test_simple_predicate_q7_no_fire_for_A(schemas):
    case = _baseline_case(q7=Q7.A)
    run(case, schemas)
    assert "lca_mc_29" not in case.activated_nodes


def test_conjunctive_predicate_q3_eco_and_env(schemas):
    """lca_mc_03 fires when Q3.eco AND Q3.env both true."""
    case = _baseline_case(q3=Q3(env=True, eco=True))
    l0_run(case, schemas)
    run(case, schemas)
    assert "lca_mc_03" in case.activated_nodes
    assert case.lca.get("lcc_integration_mode") is not None


def test_conjunctive_predicate_no_fire_when_only_env(schemas):
    case = _baseline_case(q3=Q3(env=True))
    run(case, schemas)
    assert "lca_mc_03" not in case.activated_nodes


def test_disjunctive_predicate_q4_or_q6b(schemas):
    """lca_hc_14 fires when Q4 ∩ {C,D,E} non-empty OR Q6b != TRL9."""
    case = _baseline_case(q4={Q4.A}, q6b=Q6b.TRL5_6)
    run(case, schemas)
    assert "lca_hc_14" in case.activated_nodes


def test_disjunctive_predicate_no_fire_when_neither_branch(schemas):
    case = _baseline_case(q4={Q4.A}, q6b=Q6b.TRL9)
    run(case, schemas)
    assert "lca_hc_14" not in case.activated_nodes


# ---------------------------------------------------------------------------
# 5. Per-flow handling
# ---------------------------------------------------------------------------


def test_per_flow_discriminative_writes_dict(schemas):
    """lca_mc_17 (per_flow discriminative on Q5) writes
    {flow_id: branch_value}."""
    case = _baseline_case(
        flows=[Flow(id="f1", name="heat", q5=Q5.a),
               Flow(id="f2", name="solvent", q5=Q5.c)],
    )
    run(case, schemas)
    assert "lca_mc_17" in case.activated_nodes
    classification = case.lca["zero_burden_classification"]
    assert classification == {"f1": "zero-burden", "f2": "substitution+Q-correction"}


def test_per_flow_predicate_writes_only_matching_flows(schemas):
    """lcc_hc_12 (per_flow simple `flow.q5 != e`) activates only when
    at least one flow has q5 != e. The pillar field
    `lcc.avoidable_unavoidable_classification` is shared with lcc_hc_13
    (always-default discriminative), so we verify the predicate
    behaviour directly via _PREDICATES + activation flag."""
    from app.engine.activate import _PREDICATES
    pred = _PREDICATES["lcc_hc_12"]
    case = _baseline_case(q3=Q3(env=True, eco=True))
    f_match = Flow(id="f1", name="x", q5=Q5.a)
    f_no = Flow(id="f2", name="y", q5=Q5.e)
    assert pred(case, f_match) is True
    assert pred(case, f_no) is False

    # And end-to-end: with both flows, lcc_hc_12 still activates because
    # at least one flow matches.
    case_full = _baseline_case(
        q3=Q3(env=True, eco=True), flows=[f_match, f_no])
    l0_run(case_full, schemas)
    run(case_full, schemas)
    assert "lcc_hc_12" in case_full.activated_nodes


def test_per_flow_no_flows_means_no_per_flow_activation(schemas):
    """With case.flows=[], no per_flow predicate node activates."""
    case = _baseline_case(q3=Q3(env=True, eco=True), flows=[])
    l0_run(case, schemas)
    run(case, schemas)
    # lcc_hc_12 needs at least one matching flow; no flows → not activated
    assert "lcc_hc_12" not in case.activated_nodes


# ---------------------------------------------------------------------------
# 6. Procedural mandates — activate without writing field
# ---------------------------------------------------------------------------


def test_procedural_mandate_activates_without_field_write(schemas):
    """lca_hc_01 is DEFAULT + procedural_mandate (field=null).
    It must appear in activated_nodes but write nothing."""
    case = _baseline_case()
    snapshot_lca = dict(case.lca)
    run(case, schemas)
    assert "lca_hc_01" in case.activated_nodes
    # No new key under "Goal-driven" or anywhere; lca pillar grew only
    # via fielded DEFAULTs (lca_mc_*), not via this procedural one
    assert all("Goal-driven" not in str(v) for v in case.lca.values())
    # Sanity: the pillar may grow due to other fielded defaults; that's
    # fine — what matters is no key was created FROM this node
    assert snapshot_lca.keys() <= case.lca.keys()


# ---------------------------------------------------------------------------
# 7. future background: one study horizon for LCA and LCC
# ---------------------------------------------------------------------------
# Owner decision 2026-10-15: the deliverables require one time horizon for LCA and
# LCC (D4.2 L01261, L01277; D4.1 L01521). Future background when the system
# operates in a future year (Q8a; unanswered: Q2=D), when the key technology is
# below TRL 7 (Q6b), or when the study horizon (Q8b analysis period, else Q8c asset
# lifetime) exceeds 15 years. Lifetime tests use Q2=A, no TRL, Q8a unanswered.


def _lifetime_case(schemas, lifetime=None, q2=Q2.A):
    """ENV+ECO case (LCC active), ex-post by default, with an optional advanced asset_lifetime."""
    advanced = {} if lifetime is None else {"asset_lifetime": lifetime}
    case = _baseline_case(q2=q2, q3=Q3(env=True, eco=True), advanced=advanced)
    l0_run(case, schemas)
    run(case, schemas)
    return case


def _future(case):
    return "lca_mc_21" in case.activated_nodes, "lcc_hc_23" in case.activated_nodes


def _horizon_case(schemas, **kw):
    case = _baseline_case(q3=Q3(env=True, eco=True), **kw)
    l0_run(case, schemas)
    run(case, schemas)
    return case


@pytest.mark.parametrize("q2", [Q2.A, Q2.B, Q2.C, Q2.D])
def test_future_operating_year_gives_future_background_whatever_q2(schemas, q2):
    assert _future(_horizon_case(schemas, q2=q2, operating_start="future")) == (True, True)


def test_unanswered_operating_year_reads_q2_d_as_future(schemas):
    assert _future(_horizon_case(schemas, q2=Q2.D)) == (True, True)
    for q2 in (Q2.A, Q2.B, Q2.C):
        assert _future(_horizon_case(schemas, q2=q2)) == (False, False), q2


def test_explicit_now_wins_over_q2_d(schemas):
    assert _future(_horizon_case(schemas, q2=Q2.D, operating_start="now")) == (False, False)


@pytest.mark.parametrize("q6b, expected", [(Q6b.TRL9, False), (Q6b.TRL7_8, False), (Q6b.TRL5_6, True), (Q6b.TRL_LT_5, True)])
def test_technology_below_trl7_gives_future_background(schemas, q6b, expected):
    assert _future(_horizon_case(schemas, q2=Q2.A, q6b=q6b)) == (expected, expected)


def test_either_analysis_period_or_asset_lifetime_beyond_threshold(schemas):
    """D4.2 L01131 names the asset lifetime, the study its analysis period:
    either one beyond 15 years is enough (owner decision 2026-10-15)."""
    assert _future(_horizon_case(schemas, q2=Q2.A, analysis_period_years=20)) == (True, True)
    short = _horizon_case(schemas, q2=Q2.A, analysis_period_years=10, asset_lifetime_years=40)
    assert _future(short) == (True, True)
    long_period = _horizon_case(schemas, q2=Q2.A, analysis_period_years=25, asset_lifetime_years=10)
    assert _future(long_period) == (True, True)
    both_short = _horizon_case(schemas, q2=Q2.A, analysis_period_years=10, asset_lifetime_years=12)
    assert _future(both_short) == (False, False)


@pytest.mark.parametrize("lifetime, expected", [(25, 25.0), (None, None)])
def test_q8_asset_lifetime_is_the_amortisation_period(schemas, lifetime, expected):
    """Same period in LCA and LCC (D4.1 §14.2.2); no Q8 answer, no number written."""
    case = _horizon_case(schemas, q2=Q2.A, q6b=Q6b.TRL9, asset_lifetime_years=lifetime)
    assert case.lca.get("capital_goods.amortization_period") == expected
    assert case.lcc.get("capital_goods.amortization_period") == expected


def test_amortisation_period_stays_out_of_a_switched_off_pillar(schemas):
    case = _baseline_case(q2=Q2.A, q3=Q3(env=True), q6b=Q6b.TRL9, asset_lifetime_years=25)
    l0_run(case, schemas)
    run(case, schemas)
    assert case.lca["capital_goods.amortization_period"] == 25.0
    assert "capital_goods.amortization_period" not in case.lcc


def test_ex_post_study_without_lifetime_stays_static(schemas):
    assert _future(_lifetime_case(schemas)) == (False, False)


def test_ex_post_study_with_long_lived_assets_gets_future_background(schemas):
    assert _future(_lifetime_case(schemas, 30)) == (True, True)


def test_lca_and_lcc_follow_the_same_rule(schemas):
    for q2 in (Q2.A, Q2.B, Q2.C, Q2.D):
        for lifetime in (None, 10, 16):
            lca, lcc = _future(_lifetime_case(schemas, lifetime, q2=q2))
            assert lca == lcc, (q2, lifetime)


def test_asset_lifetime_threshold_is_strictly_greater_than_15(schemas):
    assert _future(_lifetime_case(schemas, 15)) == (False, False)
    assert _future(_lifetime_case(schemas, 16)) == (True, True)


def test_threshold_is_one_named_parameter():
    from app.engine.activate import FUTURE_BACKGROUND_LIFETIME_YEARS, LOW_TRL
    assert FUTURE_BACKGROUND_LIFETIME_YEARS == 15.0
    assert LOW_TRL == {Q6b.TRL5_6, Q6b.TRL_LT_5}


@pytest.mark.parametrize(
    "threshold, lifetime, fires",
    [(None, 16, True), (None, 15, False), (20, 16, False), (20, 21, True), ("10", 12, True),
     # unusable values fall back on D4.2's 15 years
     (0, 16, True), (-5, 16, True), ("abc", 15, False), (True, 16, True), (float("inf"), 16, True)],
)
def test_threshold_is_the_analysts_to_change(threshold, lifetime, fires):
    """D4.2 §9.3 L01131 gives 15 years without a source: a default, not a constant."""
    from app.engine.activate import THRESHOLD_KEY, needs_future_background
    advanced = {} if threshold is None else {THRESHOLD_KEY: threshold}
    case = _baseline_case(q2=Q2.A, q3=Q3(env=True, eco=True), advanced=advanced)
    case.asset_lifetime_years = lifetime
    case.q6b = Q6b.TRL9
    assert needs_future_background(case) is fires


def test_asset_lifetime_lcc_node_off_when_lcc_deactivated(schemas):
    """The method gate still wins: no economic dimension, no lcc_hc_23."""
    case = _baseline_case(q2=Q2.A, q3=Q3(env=True), advanced={"asset_lifetime": 30})
    l0_run(case, schemas)
    run(case, schemas)
    assert "lca_mc_21" in case.activated_nodes
    assert "lcc_hc_23" not in case.activated_nodes


def test_asset_lifetime_accepts_numeric_string(schemas):
    """A case posted straight to the API may carry "20"; it must not raise."""
    assert "lca_mc_21" in _lifetime_case(schemas, "20").activated_nodes


def _lifetime_case_q8(schemas, years, advanced=None, q2=Q2.A):
    case = _baseline_case(q2=q2, q3=Q3(env=True, eco=True), asset_lifetime_years=years,
                          advanced=advanced or {})
    l0_run(case, schemas)
    run(case, schemas)
    return case


def test_q8_asset_lifetime_over_15_activates_both_nodes(schemas):
    case = _lifetime_case_q8(schemas, 20)
    assert "lca_mc_21" in case.activated_nodes and "lcc_hc_23" in case.activated_nodes


def test_q8_threshold_is_strictly_greater_than_15(schemas):
    assert "lca_mc_21" not in _lifetime_case_q8(schemas, 15).activated_nodes
    assert "lca_mc_21" in _lifetime_case_q8(schemas, 15.5).activated_nodes


def test_q8_answer_wins_over_the_advanced_override(schemas):
    short = _lifetime_case_q8(schemas, 10, advanced={"asset_lifetime": 40})
    assert "lca_mc_21" not in short.activated_nodes
    long = _lifetime_case_q8(schemas, 40, advanced={"asset_lifetime": 5})
    assert "lca_mc_21" in long.activated_nodes


def test_q8_unanswered_falls_back_to_the_advanced_override(schemas):
    assert "lca_mc_21" in _lifetime_case_q8(schemas, None, advanced={"asset_lifetime": 30}).activated_nodes
    assert "lca_mc_21" not in _lifetime_case_q8(schemas, None).activated_nodes


@pytest.mark.parametrize("bad", [-1, 501, "abc"])
def test_q8_rejects_out_of_range_or_non_numeric_values(bad):
    with pytest.raises(ValueError):
        Case(q1=Q1.A, asset_lifetime_years=bad)


@pytest.mark.parametrize("junk", ["", "abc", True, False, [], {}, "nan", "inf", -5])
def test_asset_lifetime_junk_values_read_as_zero(schemas, junk):
    case = _lifetime_case(schemas, junk)
    assert "lca_mc_21" not in case.activated_nodes
    assert "lcc_hc_23" not in case.activated_nodes


# ---------------------------------------------------------------------------
# 7b. lca_mc_30 (AWARE) — canonical wastewater id and legacy alias both fire
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "sector", [Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, Q6a.WASTEWATER_BIOFACTORIES]
)
def test_lca_mc_30_fires_for_wastewater_sector_and_its_alias(schemas, sector):
    case = _baseline_case(q6a=sector)
    run(case, schemas)
    assert "lca_mc_30" in case.activated_nodes
    assert "AWARE" in case.lca["water_stress_method"]


@pytest.mark.parametrize(
    "sector", [None, Q6a.PLASTICS_PACKAGING, Q6a.WASTE_VALORIZATION, Q6a.AGRI_FOOD]
)
def test_lca_mc_30_dormant_for_other_sectors(schemas, sector):
    case = _baseline_case(q6a=sector)
    run(case, schemas)
    assert "lca_mc_30" not in case.activated_nodes
    assert "water_stress_method" not in case.lca


# ---------------------------------------------------------------------------
# 7c. Discriminative branch keys — every notation the schema uses
#     (grammar: engine/branch_keys.py; the schema-wide checks are in
#     test_branch_keys.py). Before the grammar these keys were skipped.
# ---------------------------------------------------------------------------


def _activated(schemas, **kw):
    """Run L0 + activation (LCC needs L0 for its gate) on a case built from `kw`."""
    case = _baseline_case(**kw)
    l0_run(case, schemas)
    run(case, schemas)
    return case


def _flows(*qs):
    return [Flow(id=f"f{i}", name=f"flow{i}", q5=q) for i, q in enumerate(qs)]


def test_unknown_branch_key_raises_instead_of_being_skipped():
    with pytest.raises(BranchKeyError):
        _resolve_discriminative(_baseline_case(), {"q9=A": "x", "default": "y"}, [])


def test_q4_in_set_and_includes(schemas):
    """lca_hc_13 `q4 in {C,D,E}`, lca_mc_25 `q4 includes 'D'`."""
    c = _activated(schemas, q4={Q4.E})
    assert c.lca["uncertainty.pedigree"].startswith("Pedigree Matrix mandatory")
    assert c.lca["lcia_method"].startswith("Midpoint methods chosen per impact category")   # D4.1 L01399
    d = _activated(schemas, q4={Q4.D})
    assert d.lca["lcia_method"].startswith("EF method, the PEF reference")
    a = _activated(schemas, q4={Q4.A})
    assert a.lca["uncertainty.pedigree"].startswith("Pedigree Matrix recommended: T4.6 divergence")
    # lcc_hc_29: D4.2 §12 asks for the three reporting layers "without
    # exception", so they are mandatory whatever Q4 says (audit item I-12a).
    layers = lambda case: _activated(schemas, q3=Q3(env=True, eco=True), **case).report["layers"]  # noqa: E731
    assert layers({"q4": {Q4.C}}) == "3-layer reporting mandatory"
    assert layers({"q4": {Q4.A}}) == "3-layer reporting mandatory"


def test_gsa_tier_was_dead_and_now_follows_q4(schemas):
    """lca_mc_32 had only unreadable keys and no default: it never activated."""
    morris_sobol = "Morris screening, then Sobol on the reduced set"     # D4.1 L01471
    assert morris_sobol in _activated(schemas, q4={Q4.A}).lca["gsa_tier"]
    assert "T4.6 tightening" in _activated(schemas, q4={Q4.E}).lca["gsa_tier"]
    assert "lca_mc_32" not in _activated(schemas, q4=set()).activated_nodes


def test_strictest_q4_branch_comes_first_when_branches_overlap(schemas):
    """First match wins (branch_keys.py), so the schema lists the strictest Q4
    branch first (PHASE1_NODE_MAPPING_v2 §5.2.3: the more specific Q wins):
    {A,E} gets the full Sobol cascade; for the review a public comparative
    assertion (C) wins, since D4.1 §15.3.4 makes its panel mandatory (L01599).
    The exhaustive version of this is in test_branch_keys.py."""
    assert "T4.6 tightening" in _activated(schemas, q4={Q4.A, Q4.E}).lca["gsa_tier"]
    mandatory = "Independent panel of at least three experts, mandatory"
    assert _activated(schemas, q4={Q4.C, Q4.D}).review["scope"].startswith(mandatory)
    assert _activated(schemas, q4={Q4.B, Q4.C}).review["scope"].startswith(mandatory)
    for q4 in ({Q4.D}, {Q4.A, Q4.D}, {Q4.D, Q4.E}):
        assert _activated(schemas, q4=q4).review["scope"].startswith("Independent panel review, as for")
    assert _activated(schemas, q4={Q4.E}).review["scope"].startswith("Journal peer review: T4.6 reading")


def test_q6b_set_and_ordinal_keys(schemas):
    """lca_hc_18 / lca_mc_10: capital goods included and amortised at every TRL
    (D4.1 §6.3.3, L00798); below TRL 7 the Lang-factor estimate is added (§9.3.5)."""
    included = "Significant capital goods and infrastructure unique to the IS scenario should be included"
    for q6b in (Q6b.TRL9, Q6b.TRL7_8):
        case = _activated(schemas, q6b=q6b)
        assert {"lca_hc_18", "lca_mc_10"} <= set(case.activated_nodes)
        assert case.lca["capital_goods.included"].startswith(included)
        assert "Lang" not in case.lca["capital_goods.included"]
    low = _activated(schemas, q6b=Q6b.TRL5_6)
    assert "Lang-factor multipliers" in low.lca["capital_goods.included"]


@pytest.mark.parametrize(
    "q7, expected",
    [(Q7.A, "explicit"), (Q7.B, "explicit"), (Q7.C, "GIS-coupled"), (Q7.D, "GIS-coupled")],   # A was "minimal" (I-08)
)
def test_q7_in_set(schemas, q7, expected):
    assert _activated(schemas, q7=q7).lca["transport.foreground"] == expected


def test_lca_boundary_is_organizational_and_coverage_a_declared_choice(schemas):
    """lca_mc_05: the boundary follows the network (D4.1 §6.1, L00734) and the life-cycle
    coverage is a goal-and-scope choice (§6, L00728), not a cradle-to-gate default."""
    assert _activated(schemas, q1=Q1.A).lca["system_boundary"].startswith("exchange-only: the two partners")
    monitoring = _activated(schemas, q1=Q1.E, q3=Q3(env=True, eco=True)).lca["system_boundary"]
    assert monitoring.startswith("network: all participating entities")
    assert "goal-and-scope choice" in monitoring
    # Q1=D with Q9 unanswered is Situation C2: one partner in isolation (L00868)
    company = _activated(schemas, q1=Q1.D, q3=Q3(env=True, eco=True)).lca["system_boundary"]
    assert company.startswith("company: the reporting company's own processes")


def test_q3_env_plus_eco_and_eco_only_branches(schemas):
    """lcc_mc_18: ECOF and IEE both need the LCA impact (D4.2 §11.3, L01327, L01333),
    and a C-LCC cannot be integrated with the LCA (§11.2, L01285)."""
    ind = lambda q1=Q1.A, **q3: _activated(schemas, q1=q1, q3=Q3(**q3))  # noqa: E731
    assert ind(env=True, eco=True).lcc["eco_efficiency_indicator"].startswith("ECOF and IEE")
    assert ind(env=True, eco=True, soc=True).lcc["eco_efficiency_indicator"].startswith("ECOF and IEE")
    for no_lca in (ind(eco=True), ind(eco=True, soc=True)):
        assert no_lca.lcc["eco_efficiency_indicator"].startswith("No eco-efficiency indicator: ECOF and IEE")
    c_lcc = ind(q1=Q1.D, env=True, eco=True)
    assert c_lcc.lcc_type.value == "C-LCC"
    assert c_lcc.lcc["eco_efficiency_indicator"].startswith("No eco-efficiency indicator: a gate-to-gate C-LCC")
    # a C-LCC without an LCA is told there is no LCA, not to show its results "alongside the LCA"
    c_lcc_alone = ind(q1=Q1.D, eco=True)
    assert c_lcc_alone.lcc_type.value == "C-LCC"
    assert c_lcc_alone.lcc["eco_efficiency_indicator"].startswith("No eco-efficiency indicator: ECOF and IEE")
    assert c_lcc_alone.lcc["functional_equivalent"].startswith("No parallel LCA")
    # lcc_mc_05: one boundary per LCC type (D4.2 §4.1, L00547-L00555)
    boundary = lambda q1, **q3: _activated(schemas, q1=q1, q3=Q3(**q3)).lcc["economic_boundary"]  # noqa: E731
    assert "E-LCC: identical to the LCA boundary" in boundary(Q1.A, env=True, eco=True)
    assert "S-LCC: cradle-to-grave" in boundary(Q1.C, env=True, eco=True)
    assert boundary(Q1.D, env=True, eco=True) == "Gate-to-gate around the company (D4.2 §4.1)"
    assert "E-LCC" not in boundary(Q1.A, eco=True)                     # no LCA, no E-LCC
    c_n_s = boundary(Q1.C, eco=True)                                    # C+N+S
    assert "S-LCC: cradle-to-grave" in c_n_s and "E-LCC" not in c_n_s


def test_q3_eco_false_branch_leaves_lcc_off(schemas):
    """lcc_mc_01 `q3.eco=false`: no economic dimension, the whole LCC method is
    off and the node is skipped by the method gate."""
    off = _activated(schemas, q1=Q1.B, q3=Q3(env=True))
    assert "lcc_mc_01" not in off.activated_nodes
    on = _activated(schemas, q1=Q1.B, q3=Q3(env=True, eco=True))
    assert on.lcc["lcc_type"] == "C-LCC entity + E-LCC network"
    assert _activated(schemas, q1=Q1.E, q3=Q3(eco=True)).lcc["lcc_type"].startswith(
        "C-LCC entity + network consolidation")          # no LCA, no E-LCC


def test_no_lca_switches_off_the_e_lcc_rules(schemas):
    """Without env the type is C+N / C+N+S: the E-LCC nodes stay off by themselves."""
    eco = _activated(schemas, q1=Q1.A, q3=Q3(eco=True, soc=True))
    assert eco.lcc_type.value == "C+N"
    assert not {"lcc_hc_04", "lcc_hc_05"} & set(eco.activated_nodes)
    assert eco.lcc["allocation_method"].startswith("C-LCC: negotiated transfer price, which cancels out")
    pol = _activated(schemas, q1=Q1.C, q3=Q3(eco=True))
    assert pol.lcc_type.value == "C+N+S"
    assert pol.lcc["discount_rate"].endswith("S-LCC: social discount rate (D4.2 §9.3)")


def test_q1_q2_q7_in_set_on_lcc_nodes(schemas):
    eco = Q3(env=True, eco=True)
    assert _activated(schemas, q1=Q1.A, q3=eco).lcc["discount_rate"].startswith("C-LCC: each partner's WACC")
    # lcc_mc_16: a node-removal scenario for every critical node, whatever Q1 (D4.2 §10.3, L01237)
    assert _activated(schemas, q1=Q1.A, q3=eco).lcc["counterparty_risk"].startswith(
        "Node-removal scenario for the exchange partner")
    for q1 in (Q1.B, Q1.C, Q1.D, Q1.E):
        assert _activated(schemas, q1=q1, q3=eco).lcc["counterparty_risk"].startswith(
            "Counterparty risk by structural scenarios")
    # lcc_mc_13 no longer reads Q2: the study horizon decides through CIR-01 (L2)
    assert _activated(schemas, q2=Q2.C, q3=eco).lcc["background_dynamic"].startswith("Static; dynamic")
    assert _activated(schemas, q7=Q7.A, q3=eco).lcc["transport_costs"] == "single break-even"
    assert _activated(schemas, q7=Q7.D, q3=eco).lcc["transport_costs"] == "GIS-coupled"


def test_lcc_functional_equivalent_follows_the_lca(schemas):
    """lcc_mc_03: the LCC takes the LCA's functional unit (D4.2 §3.1, L00493). With an
    E-LCC lcc_hc_04 writes it; lcc_mc_03 covers the C-LCC and the case without an LCA."""
    eco = Q3(env=True, eco=True)
    for q1 in (Q1.A, Q1.B, Q1.C):
        case = _activated(schemas, q1=q1, q3=eco, q6a=Q6a.TEXTILE_LEATHER)
        assert case.lcc["functional_equivalent"] == "aligned_to_lca"
        assert "lcc_mc_03" not in case.activated_nodes
    assert _activated(schemas, q1=Q1.D, q3=eco).lcc["functional_equivalent"] == "aligned_to_lca"
    no_lca = _activated(schemas, q1=Q1.A, q3=Q3(eco=True))
    assert no_lca.lcc["functional_equivalent"].startswith("No parallel LCA: the functional equivalent")


def test_per_flow_in_set_key(schemas):
    """lcc_hc_13: every secondary flow is classified before any valuation (D4.2 §6.3,
    L00751); an interdependent flow is a deliberate co-product (L00741); aggregated
    flows cannot take zero cost untested (`q5 in {a,b,c}` is an in-set key)."""
    c = _activated(schemas, q3=Q3(env=True, eco=True), flows=_flows(Q5.c, Q5.a, Q5.d, Q5.e))
    classification = c.lcc["avoidable_unavoidable_classification"]
    assert classification["f0"] == classification["f1"]
    assert classification["f0"].startswith("Classify the flow as avoidable or unavoidable")
    assert classification["f2"].startswith("Deliberately co-produced")
    assert classification["f3"].startswith("Aggregated flows cannot be tested one by one")


def test_mfca_only_for_contested_flows_and_monetisation_only_with_an_lca(schemas):
    """lcc_hc_38: MFCA for Q5=b flows (D4.2 §5.3, L00689), no longer for every eco-only
    study. lcc_mc_19 and CIR-05: no LCA, nothing to monetise (D4.2 §11.2)."""
    eco_only = _activated(schemas, q3=Q3(eco=True), flows=_flows(Q5.a))
    assert "lcc_hc_38" not in eco_only.activated_nodes
    contested = _activated(schemas, q3=Q3(env=True, eco=True), flows=_flows(Q5.b))
    assert "lcc_hc_38" in contested.activated_nodes
    s_lcc = _activated(schemas, q1=Q1.C, q3=Q3(env=True, eco=True))
    assert s_lcc.lcc["externality_monetization"].startswith("Mandatory")
    no_lca = _activated(schemas, q1=Q1.A, q3=Q3(eco=True), q4={Q4.D})
    assert no_lca.lcc["externality_monetization"].startswith("None: without a parallel LCA")


def test_flow_valuation_names_each_lcc_level(schemas):
    """lcc_mc_04 / lcc_mc_08: the key stays Q5, per flow, and the value says what each
    LCC level uses (D4.2 §3.2, §6.2-§6.3). A Q5=e flow gets no entry."""
    c = _activated(schemas, q3=Q3(env=True, eco=True), flows=_flows(Q5.c, Q5.b, Q5.e, Q5.d))
    valuation = c.lcc["flow_valuation_method"]
    assert set(valuation) == {"f0", "f1", "f3"}
    assert valuation["f0"].startswith("C-LCC: negotiated price paid by the receiver; E-LCC and S-LCC")
    assert valuation["f1"].startswith("C-LCC: actual transfer price, zero")
    assert "the acquisition cost of the flow follows lcc_mc_08" in valuation["f0"]   # L00513 vs L00759
    cost = c.lcc["secondary_flow_valuation"]
    assert set(cost) == {"f0", "f1", "f3"}
    assert "zero cost only if the residual is unavoidable" in cost["f1"]   # L00729
    assert cost["f3"].startswith("Zero cost does not apply")              # L00741
    assert "if the flow has no independent market" in cost["f0"]          # D4.1 L00994
    waste = _activated(schemas, q3=Q3(env=True, eco=True), flows=_flows(Q5.a))
    assert waste.lcc["flow_valuation_method"]["f0"].startswith("C-LCC: actual transfer price, here a gate fee")
    assert waste.lcc["secondary_flow_valuation"]["f0"].startswith("C-LCC: the gate fee as negotiated")


# ---------------------------------------------------------------------------
# 7d. lca.allocation_method — five writers, one field (audit item I-02)
#
# lca_mc_08 -> lca_mc_12 (Q1-driven), lca_mc_13 -> lca_mc_14 (Q4=D), then
# CIR-05 at L2. The last two used to carry a `default` branch, so they always
# ran and overwrote the Q1 result: every Q1 ended on "substitution", Q1=D
# included, where D4.1 §7.2.3 says "use Allocation (Step 3). Do not apply
# substitution credits". PHASE1_NODE_MAPPING_v2 §5.2 settles the order: the
# more specific Q wins (Q4=D for PEF CFF) and a generic default does not.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "q1, expected",
    [
        (Q1.A, "system expansion"),
        (Q1.B, "system expansion"),
        (Q1.E, "system expansion"),
        (Q1.C, "consequential expansion"),
        (Q1.D, "allocation"),
    ],
)
def test_allocation_method_follows_q1_when_q4_is_not_pef(schemas, q1, expected):
    case = _baseline_case(q1=q1, q2=Q2.A, q4={Q4.A})
    pipeline_run(case, schemas)
    assert case.lca["allocation_method"] == expected


def test_pef_nodes_write_only_when_q4_includes_d(schemas):
    plain = _activated(schemas, q4={Q4.A})
    assert "lca_mc_13" not in plain.activated_nodes
    assert "lca_mc_14" not in plain.activated_nodes
    pef = _activated(schemas, q4={Q4.D})
    assert "lca_mc_13" in pef.activated_nodes and "lca_mc_14" in pef.activated_nodes
    assert pef.lca["allocation_method"] == "PEF CFF"  # activation only; CIR-05 comes at L2


@pytest.mark.parametrize("q1", list(Q1))
def test_q4_d_ends_on_pef_cff_except_in_situation_c2(schemas, q1):
    """CIR-05 writes 'pef_cff' last, except in Situation C2 (here Q1=D with Q9
    unanswered), where D4.1 §7.2.3 is explicit: "use Allocation (Step 3). Do not
    apply substitution credits". Until 2026-10-15 Q4=D won there too, on D4.1
    calling the CFF both "mandatory" for EU-policy studies (§7.3.2) and a "valid
    alternative" (§7.3.3); Mirko chose allocation for C2 (phase A, step 4).
    `advanced.allocation_method_override` is documented on Case but no engine
    module reads it, so the analyst cannot override this today."""
    case = _baseline_case(q1=q1, q2=Q2.A, q4={Q4.D})
    pipeline_run(case, schemas)
    expected = "allocation" if q1 == Q1.D else "pef_cff"
    assert case.lca["allocation_method"] == expected


# ---------------------------------------------------------------------------
# 7e. lca_mc_27 — reference scenario content per Q1 (audit item I-07)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "q1, expected",
    [
        (Q1.A, "Average market consumption mix"),
        (Q1.B, "Average market consumption mix"),   # parks are Situation A since 2026-10-15
        # D4.1 §11.3.1 L01293: Situation B models the marginal technology, not the average mix
        (Q1.C, "Marginal technology mix"),
        (Q1.D, "Allocation, no substitution credits"),   # C2, L00868
        (Q1.E, "Average market mix, as in Situation A"),   # C1, L00866
    ],
)
def test_reference_scenario_content_follows_the_situation(schemas, q1, expected):
    assert _activated(schemas, q1=q1).lca["reference_scenario.content"].startswith(expected)


def test_background_database_follows_the_situation(schemas):
    """lca_mc_06: background mixes per ILCD situation (D4.1 Table 1, §11.3.1); no
    database version is prescribed."""
    a = _activated(schemas, q1=Q1.A).lca["background_database"]
    b = _activated(schemas, q1=Q1.C).lca["background_database"]
    assert a.startswith("Average market consumption mixes") and b.startswith("Marginal processes")
    assert "3.10" not in a and "none prescribed" in a


# ---------------------------------------------------------------------------
# 7f. Scale-up frameworks below TRL 7 only (audit item I-11a)
#
# D4.1 and D4.2 say "below TRL 7". lcc_hc_15 already stopped at TRL5-6; the LCA
# node lca_mc_20 and rule CIR-07 also took TRL7-8, so the two methods disagreed.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "q6b, active",
    [(Q6b.TRL9, False), (Q6b.TRL7_8, False), (Q6b.TRL5_6, True), (Q6b.TRL_LT_5, True)],
)
def test_scale_up_frameworks_only_below_trl_7(schemas, q6b, active):
    case = _activated(schemas, q6b=q6b, q3=Q3(env=True, eco=True))
    assert ("lca_mc_20" in case.activated_nodes) is active
    assert ("lcc_hc_15" in case.activated_nodes) is active  # the two methods agree


# ---------------------------------------------------------------------------
# 7g. slca.boundary mirrors the LCA boundary for sector-wide studies
#     (audit item I-13; D4.3 §4.1 wants the S-LCA boundary aligned with LCA/LCC)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "q1, q7, expected",
    [
        (Q1.A, Q7.B, "exchange-only"),
        (Q1.B, Q7.B, "eco-park"),
        (Q1.C, Q7.B, "sector-wide"),   # lca_mc_05 says "sector-wide" for Q1=C too
        (Q1.C, Q7.D, "sector-wide"),   # used to become "multi-scale" through q7=D
        (Q1.D, Q7.D, "multi-scale"),   # q7=D keeps working for the other Q1 values
    ],
)
def test_slca_boundary_follows_the_lca_boundary(schemas, q1, q7, expected):
    case = _activated(schemas, q1=q1, q7=q7, q3=Q3(env=True, soc=True))
    assert case.slca["boundary"] == expected


# ---------------------------------------------------------------------------
# 7h. Transport and break-even are not optional (audit I-08)
#
# D4.1 §13.3.1: "All transport links ... must be modeled as distinct unit
# processes" and a sensitivity on distance finds the break-even point; D4.2 §4.3:
# the break-even distance is "a sensitivity parameter, not a fixed assumption".
# Neither is conditioned on how spread out the network is, so the two mandates
# apply to every case and Q7 only changes how logistics are asked for.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("q7", [None, Q7.A, Q7.B, Q7.C, Q7.D])
def test_break_even_mandates_apply_whatever_q7_says(schemas, q7):
    case = _activated(schemas, q7=q7, q3=Q3(env=True, eco=True))
    assert "lca_hc_21" in case.activated_nodes
    assert "lcc_hc_06" in case.activated_nodes


def test_the_lcc_break_even_mandate_follows_the_economic_dimension(schemas):
    assert "lcc_hc_06" not in _activated(schemas, q7=Q7.B, q3=Q3(env=True)).activated_nodes
    assert "lca_hc_21" in _activated(schemas, q7=Q7.B, q3=Q3(env=True)).activated_nodes


def test_transport_is_explicit_for_a_co_located_network(schemas):
    case = _activated(schemas, q7=Q7.A)
    assert case.lca["transport.foreground"] == "explicit"       # was "minimal"


def test_lcc_transport_costs_now_has_a_single_writer(schemas):
    """lcc_hc_06 used to write a prose sentence into lcc.transport_costs; it is a
    pure mandate now, so the value is lcc_mc_14's alone."""
    eco = Q3(env=True, eco=True)
    assert _activated(schemas, q7=Q7.B, q3=eco).lcc["transport_costs"] == "single break-even"
    assert _activated(schemas, q7=Q7.C, q3=eco).lcc["transport_costs"] == "GIS-coupled"
    assert "transport_costs" not in _activated(schemas, q7=None, q3=eco).lcc


# ---------------------------------------------------------------------------
# 8. Q1=None → ValueError (matches pathway / l0_compute convention)
# ---------------------------------------------------------------------------


def test_q1_none_raises(schemas):
    case = Case(q3=Q3(env=True))  # q1 left as None
    with pytest.raises(ValueError, match="Invalid Q1"):
        run(case, schemas)


# ---------------------------------------------------------------------------
# 9. Mutation contract
# ---------------------------------------------------------------------------


def test_run_mutates_and_returns_same_instance(schemas):
    case = _baseline_case()
    assert case.activated_nodes == []
    result = run(case, schemas)
    assert result is case
    assert len(case.activated_nodes) >= 116  # at least all DEFAULTs


# ---------------------------------------------------------------------------
# 10. Total activation count for a maximally-complete case
# ---------------------------------------------------------------------------


def test_full_activation_count_for_complete_case(schemas):
    """A case with Q3 all-on, multiple flows of varied Q5, Q4 panel,
    etc. activates substantially more than the 116 DEFAULT baseline."""
    case = Case(
        q1=Q1.A, q2=Q2.D,
        q3=Q3(env=True, eco=True, soc=True),
        q4={Q4.C, Q4.D},
        q6b=Q6b.TRL5_6, q7=Q7.C,
        flows=[Flow(id="f1", name="x", q5=Q5.a),
               Flow(id="f2", name="y", q5=Q5.c),
               Flow(id="f3", name="z", q5=Q5.d)],
    )
    l0_run(case, schemas)
    run(case, schemas)
    # 116 DEFAULTs + a healthy chunk of the 70 DERIVED
    assert len(case.activated_nodes) >= 130
    # No L0 node leaked through
    assert "lca_t1" not in case.activated_nodes
    assert "lcc_trig_01" not in case.activated_nodes
    assert "slca_t_01" not in case.activated_nodes


# ---------------------------------------------------------------------------
# Q9 — the nodes that read the situation follow the derived situation
# ---------------------------------------------------------------------------


def _q9_case(schemas, q1, decision, q2=Q2.A):
    from app.domain.enums import DecisionContext
    case = _baseline_case(q1=q1, q2=q2, decision_context=DecisionContext(decision) if decision else None)
    l0_run(case, schemas)
    run(case, schemas)
    return case


def test_q9_structural_decision_makes_the_framework_consequential(schemas):
    """Q1=A is Situation A (attributional) until Q9 says the consequences are
    structural: then every node that reads the situation moves together, not
    only the label."""
    before = _q9_case(schemas, Q1.A, None)
    after = _q9_case(schemas, Q1.A, "structural")
    assert before.lca["modeling_framework"] == "attributional"
    assert after.lca["modeling_framework"] == "consequential"
    assert after.lca["allocation_method"] == "consequential expansion"
    assert after.lca["reference_scenario.content"].startswith("Marginal technology mix")
    assert after.lca["ilcd_situation"] == "ILCD B"


def test_q9_no_decision_on_a_sector_study_is_situation_c1_and_attributional(schemas):
    case = _q9_case(schemas, Q1.C, "none")
    assert case.lca["modeling_framework"] == "attributional"
    assert case.lca["allocation_method"] == "system expansion"
    assert case.lca["reference_scenario.content"].startswith("Average market mix, as in Situation A")  # L00866


@pytest.mark.parametrize(
    "q1, decision, background, content",
    [
        # Q9 decides the situation, whatever Q1 says (D4.1 Table 1, §7.2.3, §11.3.1)
        (Q1.C, "none", "Average market mixes", "Average market mix, as in Situation A"),          # C1
        (Q1.A, "corporate_report", "Average market mixes", "Allocation, no substitution credits"),  # C2
        (Q1.A, "structural", "Marginal processes", "Marginal technology mix"),                   # B
    ],
)
def test_q9_situation_drives_background_and_reference_content(schemas, q1, decision, background, content):
    case = _q9_case(schemas, q1, decision)
    assert case.lca["background_database"].startswith(background)
    assert case.lca["reference_scenario.content"].startswith(content)


def test_q9_unanswered_keeps_every_q1_result(schemas):
    expected = {
        Q1.A: ("attributional", "system expansion", "ILCD A"),
        Q1.B: ("attributional", "system expansion", "ILCD A"),
        Q1.C: ("consequential", "consequential expansion", "ILCD B"),
        Q1.D: ("attributional", "allocation", "ILCD C2"),
        Q1.E: ("attributional", "system expansion", "ILCD C1"),
    }
    for q1, (framework, allocation, ilcd) in expected.items():
        case = _q9_case(schemas, q1, None)
        assert (case.lca["modeling_framework"], case.lca["allocation_method"], case.lca["ilcd_situation"]) == (
            framework, allocation, ilcd)


# ---------------------------------------------------------------------------
# Q10 — the LCC nodes that read the type follow the derived type
# ---------------------------------------------------------------------------


# LCC rules keyed on the LCC type (D4.2 §5.1, §9.3), not on Q1 (2026-10-15)
_TYPE_CE = "C-LCC entity + E-LCC network"
_TYPE_CES = "C-LCC entity + E-LCC network + S-LCC + NTF"
_TYPE_C = "C-LCC only (one company, no network level: T4.6 design choice)"
_RATE_CE = "C-LCC: each partner's WACC; network level: blended WACC weighted by investment share (D4.2 §9.3)"
_RATE_CES = "C-LCC: each partner's WACC; network level: blended WACC; S-LCC: social discount rate (D4.2 §9.3)"
_RATE_C = "C-LCC: the company's WACC or hurdle rate (D4.2 §9.3)"
_ALLOC_CE = ("C-LCC: negotiated transfer price; E-LCC: system expansion at the market price of the displaced "
             "material, mirroring the CFF if the LCA follows PEF (D4.2 §5.1)")
_ALLOC_CES = ("C-LCC: negotiated transfer price; E-LCC: system expansion at the market price of the displaced "
              "material; S-LCC: the same, with net tax factor and monetised externalities (D4.2 §5.1)")
_ALLOC_C = "C-LCC: negotiated transfer price (D4.2 §5.1)"


def _q10_case(schemas, q1, policy):
    case = _baseline_case(q1=q1, q3=Q3(env=True, eco=True), policy_objective=policy)
    l0_run(case, schemas)
    run(case, schemas)
    return case


def test_q10_policy_purpose_moves_the_whole_lcc_not_only_the_label(schemas):
    """Q1=A is conventional C+E costing until Q10 says the study serves a public
    policy: then the type, the discount rate and the allocation all follow."""
    before = _q10_case(schemas, Q1.A, None)
    after = _q10_case(schemas, Q1.A, True)
    assert before.lcc_type == LccType.C_LCC_PLUS_E_LCC
    assert (before.lcc["lcc_type"], before.lcc["discount_rate"], before.lcc["allocation_method"]) == (
        _TYPE_CE, _RATE_CE, _ALLOC_CE)
    assert after.lcc_type == LccType.E_LCC_PLUS_S_LCC_PLUS_NTF
    assert (after.lcc["lcc_type"], after.lcc["discount_rate"], after.lcc["allocation_method"]) == (
        _TYPE_CES, _RATE_CES, _ALLOC_CES)


def test_q10_no_policy_on_a_sector_study_drops_the_social_costing(schemas):
    case = _q10_case(schemas, Q1.C, False)
    assert case.lcc_type == LccType.C_LCC_PLUS_E_LCC
    assert case.lcc["lcc_type"] == "C-LCC entity + E-LCC network"
    assert case.lcc["discount_rate"] == _RATE_CE      # no social rate without the S-LCC
    assert case.lcc["allocation_method"] == _ALLOC_CE


def test_q10_unanswered_keeps_every_q1_result(schemas):
    expected = {   # Q9 and Q10 unanswered: Q1 is the fallback for situation and policy
        Q1.A: (_TYPE_CE, _RATE_CE, _ALLOC_CE),
        Q1.B: (_TYPE_CE, _RATE_CE, _ALLOC_CE),
        Q1.C: (_TYPE_CES, _RATE_CES, _ALLOC_CES),
        Q1.D: (_TYPE_C, _RATE_C, _ALLOC_C),
    }
    for q1, (type_text, rate, allocation) in expected.items():
        case = _q10_case(schemas, q1, None)
        assert (case.lcc["lcc_type"], case.lcc["discount_rate"], case.lcc["allocation_method"]) == (
            type_text, rate, allocation)


# ---------------------------------------------------------------------------
# lca_mc_26 — reference scenario type follows the study timing (D4.1 §11.1)
# ---------------------------------------------------------------------------
# Aissani et al. 2019 / D4.1 §11.1: existing network -> HNSRS, prospective -> CNSRS.
# Q2=B counts as ex-ante (owner decision 2026-10-15); Q2=D pairs an operating
# baseline (HNSRS) with future alternatives (CNSRS).


def _reference_type(schemas, q2):
    case = _baseline_case(q2=q2, q3=Q3(env=True))
    l0_run(case, schemas)
    run(case, schemas)
    return case.lca.get("reference_scenario.type", "")


@pytest.mark.parametrize("q2, starts", [(Q2.A, "HNSRS"), (Q2.B, "CNSRS"), (Q2.C, "CNSRS"), (Q2.D, "HNSRS for the operating baseline")])
def test_reference_scenario_type_follows_the_study_timing(schemas, q2, starts):
    value = _reference_type(schemas, q2)
    assert value.startswith(starts), value
    assert "§11.3.3" in value   # best, worst and most-likely variants for every study


def test_reference_scenario_ex_ante_is_aligned_with_the_time_horizon(schemas):
    for q2 in (Q2.B, Q2.C, Q2.D):
        assert "CNSRS aligned with the" in _reference_type(schemas, q2)


def test_aware_follows_water_flows_and_integration_needs_an_e_lcc(schemas):
    """lca_mc_30: D4.1 L01401 keys AWARE on water exchanges, so a flow declared in the
    wastewater chapter switches it on whatever the case sector. lca_mc_03 / lcc_mc_17:
    an LCI-based E-LCC (D4.1 §14.3.2) needs an E-LCC, which a C-LCC alone (C2) lacks."""
    water = Flow(id="w", name="Process water", q5=Q5.c, sector=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES)
    assert "lca_mc_30" in _activated(schemas, q6a=Q6a.CEMENT_CONSTRUCTION, flows=[water]).activated_nodes
    assert "lca_mc_30" not in _activated(schemas, q6a=Q6a.CEMENT_CONSTRUCTION).activated_nodes
    network = _activated(schemas, q1=Q1.A, q3=Q3(env=True, eco=True))
    assert network.lca["lcc_integration_mode"].startswith("LCI-based E-LCC")
    company = _activated(schemas, q1=Q1.D, q3=Q3(env=True, eco=True))
    assert not {"lca_mc_03", "lcc_mc_17"} & set(company.activated_nodes)
