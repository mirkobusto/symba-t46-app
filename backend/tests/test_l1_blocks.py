"""Tests for engine.l1_blocks.run — Sprint 4 Step 3 commit 3.

Covers the 4 L1 BLOCK cells (block_C2_plus_E-LCC,
block_anyQ1_plus_AbsoluteSLCA, block_Q3_emptySelection,
block_Q1A_plus_Q5e), their fire and no-fire paths, multi-block
accumulation, and the mutation contract.
"""
from __future__ import annotations

from app.domain.enums import Q1, Q5, LccType
from app.domain.models import Q3, Case, Flow
from app.engine.l1_blocks import run

# ---------------------------------------------------------------------------
# 1. Empty initial state — fresh case has no blocked_by entries
# ---------------------------------------------------------------------------


def test_blocked_by_empty_on_fresh_case(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True))
    assert case.blocked_by == []
    run(case, schemas)
    # Q1=A + env-only Q3, no flows → no block should fire
    assert case.blocked_by == []


# ---------------------------------------------------------------------------
# 2. block_C2_plus_E-LCC — Q1=D + lcc_type C+E or C+E+S
# ---------------------------------------------------------------------------


def test_block_C2_plus_ELCC_fires_when_lcc_includes_E(schemas):
    """L0 won't naturally produce this combo, but defensive check fires
    if someone (advanced-override layer) sets lcc_type to C+E with Q1=D."""
    case = Case(q1=Q1.D, q3=Q3(env=True), lcc_type=LccType.C_LCC_PLUS_E_LCC)
    run(case, schemas)
    assert "block_C2_plus_E-LCC" in case.blocked_by


def test_block_C2_plus_ELCC_no_fire_for_natural_q1D(schemas):
    """Q1=D with the natural C-LCC-only lcc_type does NOT fire."""
    case = Case(q1=Q1.D, q3=Q3(eco=True), lcc_type=LccType.C_LCC_ONLY)
    run(case, schemas)
    assert "block_C2_plus_E-LCC" not in case.blocked_by


# ---------------------------------------------------------------------------
# 3. block_anyQ1_plus_AbsoluteSLCA — defensive (Case.advanced not yet wired)
# ---------------------------------------------------------------------------


def test_block_AbsoluteSLCA_inactive_when_advanced_empty(schemas):
    """Default empty `case.advanced` dict means no override → block dormant."""
    case = Case(q1=Q1.A, q3=Q3(soc=True))
    assert case.advanced == {}
    run(case, schemas)
    assert "block_anyQ1_plus_AbsoluteSLCA" not in case.blocked_by


def test_block_AbsoluteSLCA_fires_when_advanced_override_set(schemas):
    """Q3.soc=true AND advanced['slca_framework_override']='absolute' → fire."""
    case = Case(
        q1=Q1.A, q3=Q3(soc=True),
        advanced={"slca_framework_override": "absolute"},
    )
    run(case, schemas)
    assert "block_anyQ1_plus_AbsoluteSLCA" in case.blocked_by


def test_block_AbsoluteSLCA_no_fire_without_soc_even_with_override(schemas):
    """The override alone is not enough; Q3.soc must also be true."""
    case = Case(
        q1=Q1.A, q3=Q3(env=True, soc=False),
        advanced={"slca_framework_override": "absolute"},
    )
    run(case, schemas)
    assert "block_anyQ1_plus_AbsoluteSLCA" not in case.blocked_by


# ---------------------------------------------------------------------------
# 4. block_Q3_emptySelection — all three Q3 booleans false
# ---------------------------------------------------------------------------


def test_block_Q3_emptySelection_fires_on_default_q3(schemas):
    """Default Q3 has env=eco=soc=False → block fires."""
    case = Case(q1=Q1.A)  # q3 defaults to all-false
    run(case, schemas)
    assert "block_Q3_emptySelection" in case.blocked_by


def test_block_Q3_emptySelection_no_fire_with_any_dim_selected(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True))
    run(case, schemas)
    assert "block_Q3_emptySelection" not in case.blocked_by


# ---------------------------------------------------------------------------
# 5. block_Q1A_plus_Q5e — Q1=A + ≥1 flow + ALL flows Q5=e
# ---------------------------------------------------------------------------


def test_block_Q1A_Q5e_fires_when_all_flows_aggregated(schemas):
    case = Case(
        q1=Q1.A, q3=Q3(env=True),
        flows=[Flow(id="f1", name="heat", q5=Q5.e),
               Flow(id="f2", name="CO2", q5=Q5.e)],
    )
    run(case, schemas)
    assert "block_Q1A_plus_Q5e" in case.blocked_by


def test_block_Q1A_Q5e_no_fire_when_one_flow_is_specific(schemas):
    """If at least one flow is non-e, the block does NOT fire."""
    case = Case(
        q1=Q1.A, q3=Q3(env=True),
        flows=[Flow(id="f1", name="heat", q5=Q5.c),
               Flow(id="f2", name="CO2", q5=Q5.e)],
    )
    run(case, schemas)
    assert "block_Q1A_plus_Q5e" not in case.blocked_by


def test_block_Q1A_Q5e_no_fire_on_empty_flows(schemas):
    """Empty flows list = incomplete questionnaire, not a violation."""
    case = Case(q1=Q1.A, q3=Q3(env=True), flows=[])
    run(case, schemas)
    assert "block_Q1A_plus_Q5e" not in case.blocked_by


def test_block_Q1A_Q5e_no_fire_when_q1_not_A(schemas):
    case = Case(
        q1=Q1.B, q3=Q3(env=True),
        flows=[Flow(id="f1", name="heat", q5=Q5.e)],
    )
    run(case, schemas)
    assert "block_Q1A_plus_Q5e" not in case.blocked_by


# ---------------------------------------------------------------------------
# 6. Multi-block accumulation — both Q3-empty and Q1A+Q5e fire together
# ---------------------------------------------------------------------------


def test_multiple_blocks_accumulate(schemas):
    """Q1=A + Q3 empty + all flows Q5=e → both blocks fire."""
    case = Case(
        q1=Q1.A,  # q3 defaults to all-false
        flows=[Flow(id="f1", name="heat", q5=Q5.e)],
    )
    run(case, schemas)
    assert "block_Q3_emptySelection" in case.blocked_by
    assert "block_Q1A_plus_Q5e" in case.blocked_by
    assert len(case.blocked_by) == 2


# ---------------------------------------------------------------------------
# 7. Mutation contract — run mutates and returns the same instance
# ---------------------------------------------------------------------------


def test_run_mutates_and_returns_same_instance(schemas):
    case = Case(q1=Q1.A)  # default Q3 → block_Q3_emptySelection fires
    assert case.blocked_by == []

    result = run(case, schemas)

    assert result is case
    assert case.blocked_by == ["block_Q3_emptySelection"]


# ---------------------------------------------------------------------------
# 8. Order — block IDs appear in JSON enumeration order
# ---------------------------------------------------------------------------


def test_block_order_matches_enumeration(schemas):
    """When multiple blocks fire, their IDs appear in the order
    declared in _BLOCK_CHECKS (matches JSON `blocks` array order)."""
    case = Case(
        q1=Q1.D, q3=Q3(),  # eco=False → block_Q3_emptySelection fires
        lcc_type=LccType.C_LCC_PLUS_E_LCC,  # → block_C2_plus_E-LCC fires
    )
    run(case, schemas)
    # block_C2_plus_E-LCC is declared FIRST in _BLOCK_CHECKS, then Q3-empty
    assert case.blocked_by == ["block_C2_plus_E-LCC", "block_Q3_emptySelection"]
