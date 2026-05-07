"""Tests for the trigger matcher and invariant checks."""

from __future__ import annotations

from app.domain.engine import DecisionEngine
from app.domain.models_domain import GlobalInvariant
from app.domain.validators import (
    check_global_invariants,
    predicate_matches,
    trigger_matches,
)


def test_predicate_exact_match() -> None:
    assert predicate_matches({"q1": "C2"}, "q1", "C2")
    assert not predicate_matches({"q1": "A"}, "q1", "C2")


def test_predicate_contains() -> None:
    assert predicate_matches({"q3": "C+E-LCC"}, "q3_contains", "E-LCC")
    assert not predicate_matches({"q3": "C-LCC"}, "q3_contains", "E-LCC")
    # Booleans cannot contain anything
    assert not predicate_matches({"q6": True}, "q6_contains", "true")


def test_predicate_in() -> None:
    assert predicate_matches({"q5": "design"}, "q5_in", ["design", "expansion"])
    assert not predicate_matches({"q5": "analysis"}, "q5_in", ["design", "expansion"])


def test_predicate_neq() -> None:
    assert predicate_matches({"q7": "pef-cff"}, "q7_neq", "allocation")
    assert not predicate_matches({"q7": "allocation"}, "q7_neq", "allocation")


def test_predicate_unknown_key_returns_false() -> None:
    # Out-of-scope derived predicates do not match
    assert not predicate_matches(
        {"q5": "design"}, "asset_lifetime_implicit", ">15"
    )


def test_predicate_missing_answer() -> None:
    assert not predicate_matches({}, "q1", "A")


def test_trigger_matches_all_predicates_and() -> None:
    answers = {"q1": "C2", "q3": "C+E-LCC"}
    trigger = {"q1": "C2", "q3_contains": "E-LCC"}
    assert trigger_matches(answers, trigger)
    # Mismatch on q1 fails the whole trigger
    assert not trigger_matches({"q1": "A", "q3": "C+E-LCC"}, trigger)


def test_trigger_empty_does_not_match() -> None:
    assert not trigger_matches({"q1": "A"}, {})


def test_invariants_detect_transport_violation(engine: DecisionEngine) -> None:
    bad_config = {"lca": {"transport_modeling": "generic-background"}}
    violations = check_global_invariants(bad_config, engine.global_invariants)
    assert any(v.invariant_id == "INV-01" for v in violations)


def test_invariants_pass_clean_config(engine: DecisionEngine) -> None:
    good = {
        "lca": {
            "transport_modeling": "explicit-foreground",
            "functional_unit": "function-oriented",
        }
    }
    assert check_global_invariants(good, engine.global_invariants) == []


def test_invariants_E_LCC_boundary_mismatch() -> None:
    invariants = [
        GlobalInvariant(
            id="INV-04",
            rule="If lcc.type contains 'E-LCC', lcc.boundary == lca.system_boundary",
            violation_severity="critical",
        )
    ]
    bad = {
        "lca": {"system_boundary": "cradle-to-gate"},
        "lcc": {"type": "C+E-LCC", "boundary": "cradle-to-grave"},
    }
    violations = check_global_invariants(bad, invariants)
    assert len(violations) == 1
    assert violations[0].invariant_id == "INV-04"
