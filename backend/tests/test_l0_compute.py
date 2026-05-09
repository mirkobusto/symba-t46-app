"""Tests for engine.l0_compute.run — Sprint 4 Step 3 commit 2.

Covers the 3 L0 trigger nodes (lca_t1, lcc_trig_01, slca_t_01),
their per-Q1 / per-Q3.eco / per-Q3.soc tables, the Q1=None
failure path, and the mutation contract that pipeline.run() relies on.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, IlcdSituation, LccType, SlcaActivationState
from app.domain.models import Q3, Case
from app.engine.l0_compute import run

# ---------------------------------------------------------------------------
# 1. lca_t1 — ILCD situation per Q1
# ---------------------------------------------------------------------------

_ILCD_CELLS = [
    (Q1.A, IlcdSituation.SITUATION_A),
    (Q1.B, IlcdSituation.SITUATION_A_MULTI),
    (Q1.C, IlcdSituation.SITUATION_B),
    (Q1.D, IlcdSituation.SITUATION_C2),
    (Q1.E, IlcdSituation.SITUATION_C1),
]


@pytest.mark.parametrize("q1,expected", _ILCD_CELLS,
                         ids=[q1.value for q1, _ in _ILCD_CELLS])
def test_ilcd_situation_per_q1(q1, expected, schemas):
    case = Case(q1=q1)
    run(case, schemas)
    assert case.ilcd_situation is expected


# ---------------------------------------------------------------------------
# 2. lcc_trig_01 — LCC type per (Q1, Q3.eco)
# ---------------------------------------------------------------------------


def test_lcc_deactivated_when_eco_false_overrides_any_q1(schemas):
    """eco=false short-circuits Q1: LCC pillar is off."""
    case = Case(q1=Q1.A, q3=Q3(eco=False))
    run(case, schemas)
    assert case.lcc_type is LccType.DEACTIVATED


@pytest.mark.parametrize("q1", [Q1.A, Q1.B, Q1.E],
                         ids=lambda q: q.value)
def test_lcc_C_plus_E_for_q1_in_ABE_with_eco(q1, schemas):
    case = Case(q1=q1, q3=Q3(eco=True))
    run(case, schemas)
    assert case.lcc_type is LccType.C_LCC_PLUS_E_LCC


def test_lcc_C_plus_E_plus_S_for_q1_C_with_eco(schemas):
    case = Case(q1=Q1.C, q3=Q3(eco=True))
    run(case, schemas)
    assert case.lcc_type is LccType.E_LCC_PLUS_S_LCC_PLUS_NTF


def test_lcc_C_only_for_q1_D_with_eco(schemas):
    case = Case(q1=Q1.D, q3=Q3(eco=True))
    run(case, schemas)
    assert case.lcc_type is LccType.C_LCC_ONLY


# ---------------------------------------------------------------------------
# 3. slca_t_01 — S-LCA activation per Q3.soc (independent of Q1)
# ---------------------------------------------------------------------------


def test_slca_active_when_soc_true(schemas):
    case = Case(q1=Q1.A, q3=Q3(soc=True))
    run(case, schemas)
    assert case.slca_activation_state is SlcaActivationState.ACTIVE


def test_slca_deactivated_when_soc_false(schemas):
    case = Case(q1=Q1.A, q3=Q3(soc=False))
    run(case, schemas)
    assert case.slca_activation_state is SlcaActivationState.DEACTIVATED


# ---------------------------------------------------------------------------
# 4. Invalid input — Q1 None raises (pipeline must collect Q1 first)
# ---------------------------------------------------------------------------


def test_q1_none_raises(schemas):
    case = Case()  # q1 left as None
    with pytest.raises(ValueError, match="Invalid Q1"):
        run(case, schemas)


# ---------------------------------------------------------------------------
# 5. Mutation contract — run mutates and returns the same instance
# ---------------------------------------------------------------------------


def test_run_mutates_and_returns_same_instance(schemas):
    case = Case(q1=Q1.B, q3=Q3(env=True, eco=True, soc=True))
    assert case.ilcd_situation is None
    assert case.lcc_type is None
    assert case.slca_activation_state is None

    result = run(case, schemas)

    assert result is case
    assert case.ilcd_situation is IlcdSituation.SITUATION_A_MULTI
    assert case.lcc_type is LccType.C_LCC_PLUS_E_LCC
    assert case.slca_activation_state is SlcaActivationState.ACTIVE


# ---------------------------------------------------------------------------
# 6. End-to-end — all 3 triggers populated together for a realistic case
# ---------------------------------------------------------------------------


def test_all_three_triggers_for_q1D_eco_only_case(schemas):
    """Q1=D (corporate) + ECO-only Q3 → C-LCC, no S-LCA, ILCD C2."""
    case = Case(q1=Q1.D, q3=Q3(env=True, eco=True, soc=False))
    run(case, schemas)
    assert case.ilcd_situation is IlcdSituation.SITUATION_C2
    assert case.lcc_type is LccType.C_LCC_ONLY
    assert case.slca_activation_state is SlcaActivationState.DEACTIVATED
