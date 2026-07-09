"""Tests for the DCF activation-predicate mini-DSL evaluator.

Covers:
- 'always' shortcut
- equality, inequality, in / not in
- and / or / not / parentheses
- attribute access (q3.env)
- set membership (q4)
- error cases: empty, None, unknown identifier, disallowed construct
"""
from __future__ import annotations

import pytest

from app.domain.enums import (
    Q1, Q2, Q4, Q5, Q7,
    IlcdSituation, LccType, PathwayId, Q6a, Q6b, SlcaActivationState,
)
from app.domain.models import Case, Flow, Q3
from app.engine.loader import load_schemas
from app.engine.pipeline import run as pipeline_run
from app.engine.predicate import (
    PredicateError,
    Q3Proxy,
    build_context_from_case,
    evaluate,
)


# ---------------------------------------------------------------------------
# Context fixture — a representative post-pipeline Case
# ---------------------------------------------------------------------------


@pytest.fixture()
def ctx_wiktor(schemas):
    """Wiktor 2018 fixture context: q1=B, q2=D, q3=ENV+ECO, q6a=wastewater,
    q7=B. Post-pipeline yields pathway IS-01 + is_01_extended=True,
    ilcd_situation=A_MULTI, lcc_type=C_LCC_PLUS_E_LCC."""
    case = Case(
        q1=Q1.B, q2=Q2.D, q3=Q3(env=True, eco=True), q4={Q4.E},
        q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
        flows=[Flow(id="f1", name="flow1", q5=Q5.a),
               Flow(id="f2", name="flow2", q5=Q5.c)],
    )
    pipeline_run(case, schemas)
    return build_context_from_case(case)


@pytest.fixture()
def ctx_arce(schemas):
    """Arce Bastias fixture context: q1=B, q2=A (ex-post), q3=ENV-only,
    q7=A (single site). Yields IS-01, is_01_extended=False, A_MULTI."""
    case = Case(
        q1=Q1.B, q2=Q2.A, q3=Q3(env=True), q4={Q4.E},
        q6a=Q6a.PLASTICS_PACKAGING, q6b=Q6b.TRL9, q7=Q7.A,
        flows=[Flow(id="f1", name="flow1", q5=Q5.b),
               Flow(id="f2", name="flow2", q5=Q5.c)],
    )
    pipeline_run(case, schemas)
    return build_context_from_case(case)


# ---------------------------------------------------------------------------
# always
# ---------------------------------------------------------------------------


def test_always_true(ctx_wiktor):
    assert evaluate("always", ctx_wiktor) is True


def test_always_with_whitespace(ctx_wiktor):
    assert evaluate("  always  ", ctx_wiktor) is True


# ---------------------------------------------------------------------------
# Equality / inequality
# ---------------------------------------------------------------------------


def test_eq_string_match(ctx_wiktor):
    assert evaluate('q1 == "B"', ctx_wiktor) is True


def test_eq_string_no_match(ctx_wiktor):
    assert evaluate('q1 == "A"', ctx_wiktor) is False


def test_neq_string(ctx_wiktor):
    assert evaluate('q1 != "C"', ctx_wiktor) is True


def test_eq_with_none(ctx_wiktor):
    # q5 is None at Case level
    assert evaluate("q5 == None", ctx_wiktor) is True


# ---------------------------------------------------------------------------
# Membership (in / not in)
# ---------------------------------------------------------------------------


def test_in_list(ctx_wiktor):
    assert evaluate('q2 in ["C", "D"]', ctx_wiktor) is True


def test_not_in_list(ctx_arce):
    # Arce has q2=A; not in [C,D]
    assert evaluate('q2 not in ["C", "D"]', ctx_arce) is True


def test_q4_set_membership(ctx_wiktor):
    assert evaluate('"E" in q4', ctx_wiktor) is True


def test_q4_set_non_membership(ctx_wiktor):
    assert evaluate('"D" in q4', ctx_wiktor) is False


# ---------------------------------------------------------------------------
# Attribute access (q3.env, q3.eco, q3.soc)
# ---------------------------------------------------------------------------


def test_attribute_truthy(ctx_wiktor):
    assert evaluate("q3.env", ctx_wiktor) is True


def test_attribute_false(ctx_wiktor):
    # Wiktor has q3.soc = False
    assert evaluate("q3.soc", ctx_wiktor) is False


def test_attribute_negation(ctx_wiktor):
    assert evaluate("not q3.soc", ctx_wiktor) is True


# ---------------------------------------------------------------------------
# Boolean composition
# ---------------------------------------------------------------------------


def test_and(ctx_wiktor):
    assert evaluate('q1 == "B" and q3.env', ctx_wiktor) is True


def test_and_short_circuit_false(ctx_wiktor):
    assert evaluate('q1 == "A" and q3.env', ctx_wiktor) is False


def test_or(ctx_arce):
    assert evaluate('q1 == "A" or q1 == "B"', ctx_arce) is True


def test_nested_parens(ctx_wiktor):
    pred = '(q1 == "B" or q1 == "A") and q2 in ["C", "D"]'
    assert evaluate(pred, ctx_wiktor) is True


def test_complex_q7_overlay(ctx_arce):
    # Arce: q7=A → should be False for "q7 in [B,C,D]"
    assert evaluate('q7 in ["B", "C", "D"]', ctx_arce) is False


# ---------------------------------------------------------------------------
# Derived state (pathway_id, ilcd_situation, is_01_extended)
# ---------------------------------------------------------------------------


def test_pathway_id(ctx_wiktor):
    assert evaluate('pathway_id == "IS-01"', ctx_wiktor) is True


def test_is_01_extended(ctx_wiktor):
    assert evaluate("is_01_extended", ctx_wiktor) is True


def test_is_01_extended_false(ctx_arce):
    # Arce has q2=A so is_01_extended is False
    assert evaluate("is_01_extended", ctx_arce) is False


def test_ilcd_situation(ctx_wiktor):
    assert evaluate('ilcd_situation == "ILCD Situation A multi-actor"', ctx_wiktor) is True


# ---------------------------------------------------------------------------
# Sector overlays (q6a)
# ---------------------------------------------------------------------------


def test_q6a_sector_match(ctx_wiktor):
    pred = 'q6a in ["waste_valorization", "wastewater_sludge_biofactories"]'
    assert evaluate(pred, ctx_wiktor) is True


def test_q6a_sector_no_match(ctx_arce):
    pred = 'q6a in ["waste_valorization", "wastewater_sludge_biofactories"]'
    assert evaluate(pred, ctx_arce) is False


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------


def test_none_predicate(ctx_wiktor):
    with pytest.raises(PredicateError, match="None"):
        evaluate(None, ctx_wiktor)  # type: ignore[arg-type]


def test_empty_predicate(ctx_wiktor):
    with pytest.raises(PredicateError, match="empty"):
        evaluate("", ctx_wiktor)


def test_whitespace_only_predicate(ctx_wiktor):
    with pytest.raises(PredicateError, match="empty"):
        evaluate("   ", ctx_wiktor)


def test_syntax_error(ctx_wiktor):
    with pytest.raises(PredicateError, match="syntax error"):
        evaluate('q1 ==', ctx_wiktor)


def test_unknown_identifier(ctx_wiktor):
    with pytest.raises(PredicateError, match="unknown identifier"):
        evaluate('foo == "B"', ctx_wiktor)


def test_disallowed_function_call(ctx_wiktor):
    with pytest.raises(PredicateError, match="disallowed construct"):
        evaluate('len(q4) > 0', ctx_wiktor)


def test_disallowed_subscript(ctx_wiktor):
    with pytest.raises(PredicateError, match="disallowed construct"):
        evaluate('q4[0] == "E"', ctx_wiktor)


def test_disallowed_arithmetic(ctx_wiktor):
    with pytest.raises(PredicateError, match="disallowed construct"):
        evaluate('1 + 1 == 2', ctx_wiktor)


def test_disallowed_chained_attribute(ctx_wiktor):
    # q3.env.something — chained attribute access
    with pytest.raises(PredicateError, match="single-level attribute"):
        evaluate('q3.env.something', ctx_wiktor)


def test_disallowed_builtins_not_accessible(ctx_wiktor):
    # __builtins__ cleared; calling print should be a NameError
    # but it's blocked earlier as Call AST node anyway
    with pytest.raises(PredicateError, match="disallowed construct"):
        evaluate('print("x")', ctx_wiktor)


# ---------------------------------------------------------------------------
# build_context_from_case smoke
# ---------------------------------------------------------------------------


def test_context_contains_expected_keys(ctx_wiktor):
    expected_keys = {
        "q1", "q2", "q3", "q4", "q5", "q6a", "q6b", "q7",
        "pathway_id", "ilcd_situation", "lcc_type",
        "slca_activation_state", "is_01_extended", "always",
    }
    assert set(ctx_wiktor.keys()) == expected_keys


def test_context_q3_proxy_type(ctx_wiktor):
    assert isinstance(ctx_wiktor["q3"], Q3Proxy)
    assert ctx_wiktor["q3"].env is True
    assert ctx_wiktor["q3"].soc is False


def test_context_q4_is_set(ctx_wiktor):
    assert ctx_wiktor["q4"] == {"E"}
