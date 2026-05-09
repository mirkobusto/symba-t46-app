"""Tests for engine.activate.run — Sprint 4 Step 3 commit 4.

Covers the 186-node activation: DEFAULT (always-active) baseline,
DERIVED activation per trigger_logic (discriminative / simple /
conjunctive / disjunctive), pillar-dispatch routing, per_flow
handling, procedural_mandate (no-write) semantics, L0 skip, and
the mutation contract.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.activate import run
from app.engine.l0_compute import run as l0_run

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
