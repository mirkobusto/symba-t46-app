"""Tests for engine.pathway.derive — Sprint 4 Step 3 commit 1.

Covers the 5×4 Q1×Q2 → IS-01..IS-05 matrix (option γ), the
is_01_extended side flag, invalid-input handling, and the
mutation contract that pipeline.run() relies on.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, PathwayId
from app.domain.models import Case
from app.engine.pathway import derive

# ---------------------------------------------------------------------------
# 1. Matrix coverage — all 20 cells
# ---------------------------------------------------------------------------

_MATRIX_CELLS = [
    (Q1.A, Q2.A, PathwayId.IS_01),
    (Q1.A, Q2.B, PathwayId.IS_01),
    (Q1.A, Q2.C, PathwayId.IS_04),
    (Q1.A, Q2.D, PathwayId.IS_01),
    (Q1.B, Q2.A, PathwayId.IS_01),
    (Q1.B, Q2.B, PathwayId.IS_01),
    (Q1.B, Q2.C, PathwayId.IS_04),
    (Q1.B, Q2.D, PathwayId.IS_01),
    (Q1.C, Q2.A, PathwayId.IS_02),
    (Q1.C, Q2.B, PathwayId.IS_02),
    (Q1.C, Q2.C, PathwayId.IS_02),
    (Q1.C, Q2.D, PathwayId.IS_02),
    (Q1.D, Q2.A, PathwayId.IS_03),
    (Q1.D, Q2.B, PathwayId.IS_03),
    (Q1.D, Q2.C, PathwayId.IS_03),
    (Q1.D, Q2.D, PathwayId.IS_03),
    (Q1.E, Q2.A, PathwayId.IS_05),
    (Q1.E, Q2.B, PathwayId.IS_05),
    (Q1.E, Q2.C, PathwayId.IS_05),
    (Q1.E, Q2.D, PathwayId.IS_05),
]


@pytest.mark.parametrize("q1,q2,expected", _MATRIX_CELLS,
                         ids=[f"{q1.value}-{q2.value}" for q1, q2, _ in _MATRIX_CELLS])
def test_pathway_matrix_5x4(q1, q2, expected, schemas):
    case = Case(q1=q1, q2=q2)
    result = derive(case, schemas)
    assert result.pathway_id == expected


# ---------------------------------------------------------------------------
# 2. is_01_extended flag — only IS-01 with Q2=D carries it
# ---------------------------------------------------------------------------


def test_is_01_extended_true_for_A_D(schemas):
    case = Case(q1=Q1.A, q2=Q2.D)
    derive(case, schemas)
    assert case.pathway_id == PathwayId.IS_01
    assert case.is_01_extended is True


def test_is_01_extended_true_for_B_D(schemas):
    case = Case(q1=Q1.B, q2=Q2.D)
    derive(case, schemas)
    assert case.pathway_id == PathwayId.IS_01
    assert case.is_01_extended is True


def test_is_01_extended_false_for_A_A(schemas):
    """IS-01 without Q2=D must not raise the extended flag."""
    case = Case(q1=Q1.A, q2=Q2.A)
    derive(case, schemas)
    assert case.pathway_id == PathwayId.IS_01
    assert case.is_01_extended is False


def test_is_01_extended_false_for_C_D(schemas):
    """Q2=D alone is not enough; pathway must also be IS-01."""
    case = Case(q1=Q1.C, q2=Q2.D)
    derive(case, schemas)
    assert case.pathway_id == PathwayId.IS_02
    assert case.is_01_extended is False


# ---------------------------------------------------------------------------
# 3. Invalid inputs — None Q1 or Q2 raises (questionnaire incomplete)
# ---------------------------------------------------------------------------


def test_q1_none_raises(schemas):
    case = Case(q2=Q2.A)  # q1 left as None
    with pytest.raises(ValueError, match="Invalid Q1"):
        derive(case, schemas)


def test_q2_none_raises(schemas):
    case = Case(q1=Q1.A)  # q2 left as None
    with pytest.raises(ValueError, match="Invalid Q2"):
        derive(case, schemas)


# ---------------------------------------------------------------------------
# 4. Mutation contract — derive mutates and returns the same instance
# ---------------------------------------------------------------------------


def test_derive_mutates_and_returns_same_instance(schemas):
    """pipeline.run() relies on in-place mutation. The return value is
    the same object that was passed in (fluent style)."""
    case = Case(q1=Q1.B, q2=Q2.D)
    assert case.pathway_id is None
    assert case.is_01_extended is False

    result = derive(case, schemas)

    assert result is case
    assert case.pathway_id == PathwayId.IS_01
    assert case.is_01_extended is True


# ---------------------------------------------------------------------------
# 5. 12-paper benchmark — superseded by tests/test_12_papers_regression.py
#    (Sprint 4 Step 3 commit 7). Removed from this module to avoid duplication.
# ---------------------------------------------------------------------------
