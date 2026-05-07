"""Tests for :class:`app.domain.engine.DecisionEngine`."""

from __future__ import annotations

import pytest

from app.domain.engine import (
    DecisionEngine,
    IncompleteAnswersError,
    InvalidAnswerError,
    UnknownPathwayError,
    get_decision_engine,
)


def test_engine_loads_json(engine: DecisionEngine) -> None:
    assert engine.version.startswith("2.")
    assert len(engine.questions) == 10
    assert len(engine.pathways) == 10
    assert len(engine.blocked_combinations) == 6
    assert len(engine.post_processing_rules) == 5
    assert len(engine.global_invariants) == 5


def test_get_questions(engine: DecisionEngine) -> None:
    questions = engine.get_questions()
    assert [q.id for q in questions] == [f"q{i}" for i in range(1, 11)]
    q1 = engine.get_question("q1")
    assert q1.key == "ilcd_context"
    assert {opt.value for opt in q1.options} == {"A", "B", "C1", "C2"}


def test_singleton_is_cached() -> None:
    a = get_decision_engine()
    b = get_decision_engine()
    assert a is b


def test_validate_answer_valid(engine: DecisionEngine) -> None:
    assert engine.validate_answer("q1", "A").valid
    assert engine.validate_answer("q6", False).valid
    assert engine.validate_answer("q3", "C+E-LCC").valid


def test_validate_answer_invalid(engine: DecisionEngine) -> None:
    bad = engine.validate_answer("q1", "Z")
    assert not bad.valid
    assert "not in allowed options" in bad.error
    unknown = engine.validate_answer("q42", "A")
    assert not unknown.valid


def test_check_blocked_C2_ELCC(engine: DecisionEngine, sample_answers_blocked) -> None:
    """C2 + (anything containing E-LCC) must trip BLOCK-01."""
    result = engine.check_blocked(sample_answers_blocked)
    assert result.blocked is True
    assert result.block_info is not None
    assert result.block_info.block_id == "BLOCK-01"
    assert "C2" in result.block_info.message


def test_check_blocked_soft_warning_S_LCC(engine: DecisionEngine) -> None:
    """q3=S-LCC is a warning, not a hard block."""
    answers = {
        "q1": "A",
        "q2": "ex-post",
        "q3": "S-LCC",
        "q4": "function-oriented",
        "q5": "analysis",
        "q6": False,
        "q7": "system-expansion",
        "q8": False,
        "q9": "single-site",
        "q10": "basic",
    }
    result = engine.check_blocked(answers)
    assert result.blocked is False
    assert any("BLOCK-04" in w for w in result.soft_warnings)


def test_resolve_pathway_LCSA_P1(engine: DecisionEngine, sample_answers_p1) -> None:
    """Exact P1 fingerprint resolves to LCSA-P1 with no rules applied."""
    resolution = engine.resolve_pathway(sample_answers_p1)
    assert resolution.blocked is False
    assert resolution.pathway_id == "LCSA-P1"
    assert resolution.match_distance == 0
    assert "RULE-01-Q8-public-assertion" not in resolution.applied_rules
    assert resolution.configuration is not None
    assert resolution.configuration["lca"]["transport_modeling"] == "explicit-foreground"


def test_resolve_pathway_LCSA_P3(engine: DecisionEngine) -> None:
    """Macro-level B + national strategic case resolves to LCSA-P3."""
    answers = {
        "q1": "B",
        "q2": "ex-ante",
        "q3": "E-LCC",
        "q4": "function-oriented",
        "q5": "expansion",
        "q6": False,
        "q7": "system-expansion",
        "q8": True,
        "q9": "national",
        "q10": "advanced",
    }
    resolution = engine.resolve_pathway(answers)
    assert resolution.pathway_id == "LCSA-P3"
    # Q8=True so RULE-01 fires
    assert "RULE-01-Q8-public-assertion" in resolution.applied_rules


def test_resolve_pathway_post_processing_Q8(
    engine: DecisionEngine, sample_answers_sunflower
) -> None:
    """Q8=True triggers RULE-01 → weighting=no-weighting + critical_review=panel."""
    resolution = engine.resolve_pathway(sample_answers_sunflower)
    assert "RULE-01-Q8-public-assertion" in resolution.applied_rules
    assert resolution.configuration["lca"]["weighting"] == "no-weighting"
    assert resolution.configuration["lca"]["critical_review"] == "panel"
    assert resolution.configuration["lcc"]["reporting_layers"] == 3


def test_resolve_pathway_no_exact_match_falls_back(
    engine: DecisionEngine, sample_answers_sunflower
) -> None:
    """Sunflower (P1 fingerprint + Q8=True) has no exact match, falls back to P1."""
    resolution = engine.resolve_pathway(sample_answers_sunflower)
    assert resolution.pathway_id == "LCSA-P1"
    # Q8 has weight 1 -> distance is 1 (not 0)
    assert resolution.match_distance == 1
    # And the warning surfaces the fallback
    assert any(
        "No exact pathway match" in w or "weak" in w for w in resolution.warnings
    )


def test_resolve_pathway_blocked(
    engine: DecisionEngine, sample_answers_blocked
) -> None:
    """A hard-blocked combination yields blocked=True and no pathway."""
    resolution = engine.resolve_pathway(sample_answers_blocked)
    assert resolution.blocked is True
    assert resolution.pathway_id is None
    assert resolution.block_info is not None
    assert resolution.block_info.block_id == "BLOCK-01"


def test_resolve_pathway_RULE_04_C2_force_allocation(engine: DecisionEngine) -> None:
    """C2 + q7≠allocation triggers RULE-04, forcing allocation in config."""
    answers = {
        "q1": "C2",
        "q2": "ex-post",
        "q3": "C-LCC",
        "q4": "function-oriented",
        "q5": "analysis",
        "q6": False,
        "q7": "pef-cff",  # not allocation -> rule fires
        "q8": False,
        "q9": "single-site",
        "q10": "standard",
    }
    resolution = engine.resolve_pathway(answers)
    assert "RULE-04-Q1-C2-force-allocation" in resolution.applied_rules


def test_resolve_pathway_incomplete_raises(engine: DecisionEngine) -> None:
    with pytest.raises(IncompleteAnswersError) as exc:
        engine.resolve_pathway({"q1": "A"})
    assert "q2" in exc.value.missing


def test_resolve_pathway_invalid_value_raises(
    engine: DecisionEngine, sample_answers_p1
) -> None:
    bad = dict(sample_answers_p1)
    bad["q1"] = "ZZZ"
    with pytest.raises(InvalidAnswerError) as exc:
        engine.resolve_pathway(bad)
    assert exc.value.q_id == "q1"


def test_get_pathway_unknown(engine: DecisionEngine) -> None:
    with pytest.raises(UnknownPathwayError):
        engine.get_pathway("LCSA-P999")


def test_consolidated_trace_is_deduplicated(
    engine: DecisionEngine, sample_answers_p1
) -> None:
    resolution = engine.resolve_pathway(sample_answers_p1)
    keys = [(t.deliverable, t.section, t.node_id) for t in resolution.trace]
    assert len(keys) == len(set(keys)), "trace entries should be unique"
