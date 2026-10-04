"""Tests for engine.activate.run — Sprint 4 Step 3 commit 4.

Covers the 186-node activation: DEFAULT (always-active) baseline,
DERIVED activation per trigger_logic (discriminative / simple /
conjunctive / disjunctive), pillar-dispatch routing, per_flow
handling, procedural_mandate (no-write) semantics, L0 skip, and
the mutation contract.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
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
    assert len(default_ids) == 116


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
    """lca_hc_21 fires when Q7 in {B,C,D}."""
    case = _baseline_case(q7=Q7.B)
    run(case, schemas)
    assert "lca_hc_21" in case.activated_nodes


def test_simple_predicate_q7_no_fire_for_A(schemas):
    case = _baseline_case(q7=Q7.A)
    run(case, schemas)
    assert "lca_hc_21" not in case.activated_nodes


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
# 7. asset_lifetime defensive (predicate stays False today)
# ---------------------------------------------------------------------------


def test_asset_lifetime_defensive_predicates_inert(schemas):
    """lca_mc_21 and lcc_hc_23 reference case.asset_lifetime which is
    not on the Case model. They must NOT activate today."""
    case = _baseline_case(q2=Q2.D, q3=Q3(env=True, eco=True))
    l0_run(case, schemas)
    run(case, schemas)
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
    assert c.lca["uncertainty.pedigree"] == "Pedigree Matrix mandatory"
    assert c.lca["lcia_method"] == "ReCiPe 2016 hierarchic + EF 3.1 backup"
    d = _activated(schemas, q4={Q4.D})
    assert d.lca["lcia_method"] == "EF 3.1 + ReCiPe backup"
    a = _activated(schemas, q4={Q4.A})
    assert a.lca["uncertainty.pedigree"] == "Pedigree Matrix recommended"
    # lcc_hc_29: D4.2 §12 asks for the three reporting layers "without
    # exception", so they are mandatory whatever Q4 says (audit item I-12a).
    layers = lambda case: _activated(schemas, q3=Q3(env=True, eco=True), **case).report["layers"]  # noqa: E731
    assert layers({"q4": {Q4.C}}) == "3-layer reporting mandatory"
    assert layers({"q4": {Q4.A}}) == "3-layer reporting mandatory"


def test_gsa_tier_was_dead_and_now_follows_q4(schemas):
    """lca_mc_32 had only unreadable keys and no default: it never activated."""
    assert _activated(schemas, q4={Q4.A}).lca["gsa_tier"] == "Morris first"
    assert _activated(schemas, q4={Q4.E}).lca["gsa_tier"] == "full Sobol cascade"
    assert "lca_mc_32" not in _activated(schemas, q4=set()).activated_nodes


def test_first_matching_branch_wins_when_q4_branches_overlap(schemas):
    """Convention (branch_keys.py): dict order decides. {A,E} gets the A branch
    and {C,D} the C branch even though D is the stricter one; see the pinned
    overlaps in test_branch_keys.py."""
    assert _activated(schemas, q4={Q4.A, Q4.E}).lca["gsa_tier"] == "Morris first"
    assert _activated(schemas, q4={Q4.C, Q4.D}).review["scope"] == "panel ISO"
    assert _activated(schemas, q4={Q4.D}).review["scope"] == "panel + EU compliance"


def test_q6b_set_and_ordinal_keys(schemas):
    """lca_hc_18 `q6b in {TRL7-8, TRL5-6, TRL<5}`; lca_mc_10 `q6b<TRL7`."""
    mid = _activated(schemas, q6b=Q6b.TRL7_8)
    assert "lca_hc_18" in mid.activated_nodes and "lca_mc_10" not in mid.activated_nodes
    assert mid.lca["capital_goods.included"] == "Capital goods full inclusion + scale-up frameworks"
    low = _activated(schemas, q6b=Q6b.TRL5_6)
    assert "lca_mc_10" in low.activated_nodes
    assert low.lca["capital_goods.included"] == "full + scale-up frameworks"  # lca_mc_10 writes last
    mature = _activated(schemas, q6b=Q6b.TRL9)
    assert "lca_hc_18" in mature.activated_nodes  # q6b=TRL9 already worked
    assert mature.lca["capital_goods.included"] == "amortized"


@pytest.mark.parametrize(
    "q7, expected",
    [(Q7.A, "minimal"), (Q7.B, "explicit"), (Q7.C, "GIS-coupled"), (Q7.D, "GIS-coupled")],
)
def test_q7_in_set(schemas, q7, expected):
    assert _activated(schemas, q7=q7).lca["transport.foreground"] == expected


def test_q3_env_only_branch(schemas):
    """lca_mc_05: Q1 branches first, `q3.env-only` for the other Q1 values."""
    assert _activated(schemas, q1=Q1.D).lca["system_boundary"] == "cradle-to-gate default"
    assert _activated(schemas, q1=Q1.A).lca["system_boundary"] == "exchange-only"
    both = _activated(schemas, q1=Q1.D, q3=Q3(env=True, eco=True))
    assert "lca_mc_05" not in both.activated_nodes  # env+eco is not env-only


def test_q3_env_plus_eco_and_eco_only_branches(schemas):
    """lcc_mc_18: `q3.env+eco` ignores soc; `q3.eco-only` is strict."""
    ind = lambda **q3: _activated(schemas, q3=Q3(**q3))  # noqa: E731
    assert ind(env=True, eco=True).lcc["eco_efficiency_indicator"] == "Both ECOF+IEE"
    assert ind(env=True, eco=True, soc=True).lcc["eco_efficiency_indicator"] == "Both ECOF+IEE"
    assert ind(eco=True).lcc["eco_efficiency_indicator"] == "IEE only"
    assert "lcc_mc_18" not in ind(eco=True, soc=True).activated_nodes
    # lcc_mc_05: Q1 branches first, `q3.env+eco` for the rest
    assert _activated(schemas, q1=Q1.C, q3=Q3(env=True, eco=True)).lcc["economic_boundary"] == "aligned with LCA"
    assert _activated(schemas, q1=Q1.A, q3=Q3(env=True, eco=True)).lcc["economic_boundary"] == "Gate-to-Gate"


def test_q3_eco_false_branch_leaves_lcc_off(schemas):
    """lcc_mc_01 `q3.eco=false`: no economic dimension, the whole LCC method is
    off and the node is skipped by the method gate."""
    off = _activated(schemas, q1=Q1.B, q3=Q3(env=True))
    assert "lcc_mc_01" not in off.activated_nodes
    on = _activated(schemas, q1=Q1.B, q3=Q3(env=True, eco=True))
    assert on.lcc["lcc_type"] == "C-LCC entity + E-LCC network"
    assert _activated(schemas, q1=Q1.E, q3=Q3(eco=True)).lcc["lcc_type"] == "C-LCC entity + E-LCC network"


def test_q1_q2_q7_in_set_on_lcc_nodes(schemas):
    eco = Q3(env=True, eco=True)
    assert _activated(schemas, q1=Q1.A, q3=eco).lcc["discount_rate"] == "partner-specific"
    assert _activated(schemas, q1=Q1.B, q3=eco).lcc["counterparty_risk"] == "Percolation theory"
    assert "lcc_mc_16" not in _activated(schemas, q1=Q1.D, q3=eco).activated_nodes
    assert _activated(schemas, q2=Q2.C, q3=eco).lcc["background_dynamic"] == "Dynamic SSP/RCP"
    assert _activated(schemas, q7=Q7.A, q3=eco).lcc["transport_costs"] == "single break-even"
    assert _activated(schemas, q7=Q7.D, q3=eco).lcc["transport_costs"] == "GIS-coupled"


def test_sector_key_is_an_alias_of_q6a(schemas):
    """lcc_mc_03: `q1=A` first, then `sector=textile_leather`."""
    eco = Q3(env=True, eco=True)
    textile = _activated(schemas, q1=Q1.C, q3=eco, q6a=Q6a.TEXTILE_LEATHER)
    assert textile.lcc["functional_equivalent"] == "PSS variant"
    assert "lcc_mc_03" not in _activated(schemas, q1=Q1.C, q3=eco, q6a=Q6a.PULP_PAPER).activated_nodes
    first = _activated(schemas, q1=Q1.A, q3=eco, q6a=Q6a.TEXTILE_LEATHER)
    assert first.lcc["functional_equivalent"] == "Single"  # first match wins


def test_per_flow_in_set_key(schemas):
    """lcc_hc_13 `q5 in {c,d}` used to give every flow the default."""
    c = _activated(schemas, q3=Q3(env=True, eco=True), flows=_flows(Q5.c, Q5.a, Q5.d))
    assert c.lcc["avoidable_unavoidable_classification"] == {
        "f0": "price = negotiated transfer",
        "f1": "C-LCC: zero-cost not default",
        "f2": "price = negotiated transfer",
    }


def test_contested_branch_is_inert_per_flow(schemas):
    """lcc_mc_04: `contested` never matches, so a Q5=e flow gets no entry and
    Q5=b keeps its explicit branch."""
    c = _activated(schemas, q3=Q3(env=True, eco=True), flows=_flows(Q5.c, Q5.b, Q5.e))
    assert c.lcc["flow_valuation_method"] == {"f0": "Transfer Price", "f1": "Market Proxy"}


# ---------------------------------------------------------------------------
# 7d. lca.allocation_method — five writers, one field (audit item I-02)
#
# lca_mc_08 -> lca_mc_12 (Q1-driven), lca_mc_13 -> lca_mc_14 (Q4=D), then
# CIR-05 at L2. The last two used to carry a `default` branch, so they always
# ran and overwrote the Q1 result: every Q1 ended on "substitution", Q1=D
# included, where D4.1 §8.2.3 says "use Allocation (Step 3). Do not apply
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
def test_q4_d_ends_on_pef_cff_for_every_q1_through_cir_05(schemas, q1):
    """CIR-05 writes 'pef_cff' last. That includes Q1=D, against the "use
    Allocation, no substitution credits" of D4.1 §8.2.3: D4.1 itself calls the
    CFF both "mandatory" for EU-policy studies (§7.3.2) and a "valid
    alternative" (§7.3.3), so the engine keeps the Q4=D reading on purpose.
    `advanced.allocation_method_override` is documented on Case but no engine
    module reads it, so the analyst cannot override this today."""
    case = _baseline_case(q1=q1, q2=Q2.A, q4={Q4.D})
    pipeline_run(case, schemas)
    assert case.lca["allocation_method"] == "pef_cff"


# ---------------------------------------------------------------------------
# 7e. lca_mc_27 — reference scenario content per Q1 (audit item I-07)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "q1, expected",
    [
        (Q1.A, "alt disposal+virgin market"),
        (Q1.B, "hypothetical no-IS"),
        # D4.1 §8.3.1 / §12.3.1: Situation B models the marginal technology,
        # identified through a market analysis, not the national average mix.
        (Q1.C, "marginal technology mix (market analysis)"),
    ],
)
def test_reference_scenario_content_follows_q1(schemas, q1, expected):
    assert _activated(schemas, q1=q1).lca["reference_scenario.content"] == expected


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
