"""Validation helpers for the decision engine.

The engine matches "trigger dictionaries" against an answers payload several
times (blocked combinations, post-processing rules). We extract the matcher
here so it can be unit-tested in isolation.

Trigger conventions
-------------------
A trigger is a flat ``dict[str, Any]`` whose keys are either:

* ``"q<N>"`` — match exact equality with ``answers["q<N>"]``;
* ``"q<N>_contains"`` — match if ``answers["q<N>"]`` (a string) **contains**
  the trigger value as a substring (used e.g. for ``q3="C+E-LCC"``);
* ``"q<N>_in"`` — match if ``answers["q<N>"]`` is in the trigger list;
* ``"q<N>_neq"`` — match if ``answers["q<N>"]`` is **not** equal to the value;
* anything else (e.g. ``"asset_lifetime_implicit"``) — treated as a
  derived-state key that the engine does not currently track. Such triggers
  are skipped (return ``False``) and reported as an unknown predicate.

A trigger fires only when **all** of its predicates match (logical AND).
"""

from __future__ import annotations

from typing import Any

from app.domain.models_domain import (
    BlockedCheckResult,
    BlockedCombination,
    BlockInfo,
    GlobalInvariant,
    InvariantViolation,
)

# Question IDs known to the engine.
KNOWN_QUESTION_KEYS = {f"q{i}" for i in range(1, 11)}
SUFFIXES = ("_contains", "_in", "_neq")


def _split_key(key: str) -> tuple[str, str | None]:
    """Return ``(question_id, suffix)`` from a trigger key.

    Example: ``"q3_contains"`` -> ``("q3", "_contains")``;
    ``"q1"`` -> ``("q1", None)``.
    """
    for suffix in SUFFIXES:
        if key.endswith(suffix):
            return key[: -len(suffix)], suffix
    return key, None


def predicate_matches(answers: dict[str, Any], trigger_key: str, trigger_value: Any) -> bool:
    """Evaluate one predicate of a trigger against the answers payload.

    Returns ``False`` for unknown predicates so they cannot accidentally fire
    a rule (the engine treats this as "skip").
    """
    q_id, suffix = _split_key(trigger_key)
    if q_id not in KNOWN_QUESTION_KEYS:
        # Derived-state predicates (e.g. asset_lifetime_implicit) are out of
        # scope for the Sprint 2 engine. They never match.
        return False
    if q_id not in answers:
        return False
    answer = answers[q_id]
    if suffix is None:
        return answer == trigger_value
    if suffix == "_contains":
        return (
            isinstance(answer, str)
            and isinstance(trigger_value, str)
            and trigger_value in answer
        )
    if suffix == "_in":
        return isinstance(trigger_value, (list, tuple, set)) and answer in trigger_value
    if suffix == "_neq":
        return answer != trigger_value
    return False  # pragma: no cover — exhaustively handled above


def trigger_matches(answers: dict[str, Any], trigger: dict[str, Any]) -> bool:
    """All predicates in *trigger* must hold against *answers*."""
    if not trigger:
        return False
    return all(predicate_matches(answers, k, v) for k, v in trigger.items())


# ---------------------------------------------------------------------------
# Blocked combination check
# ---------------------------------------------------------------------------


def check_blocked_combinations(
    answers: dict[str, Any],
    blocked_rules: list[BlockedCombination],
) -> BlockedCheckResult:
    """Iterate the blocked rules.

    Returns the **first hard block** encountered, otherwise accumulates the
    user_message of any matching soft warnings.
    """
    soft_warnings: list[str] = []
    for rule in blocked_rules:
        if not trigger_matches(answers, rule.trigger):
            continue
        if rule.is_hard_block:
            return BlockedCheckResult(
                blocked=True,
                block_info=BlockInfo(
                    block_id=rule.id,
                    message=rule.user_message,
                    suggested_resolutions=rule.suggested_resolutions,
                    violated_constraints=rule.violated_constraints,
                    trace=rule.trace,
                ),
            )
        soft_warnings.append(f"{rule.id}: {rule.user_message}")
    return BlockedCheckResult(blocked=False, soft_warnings=soft_warnings)


# ---------------------------------------------------------------------------
# Global invariants
# ---------------------------------------------------------------------------


def _get_path(config: dict[str, Any], dotted: str) -> Any:
    """Look up ``"lca.weighting"`` style paths inside a configuration dict."""
    cur: Any = config
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def check_global_invariants(
    config: dict[str, Any],
    invariants: list[GlobalInvariant],
) -> list[InvariantViolation]:
    """Check a configuration against the invariants from the JSON.

    The invariant rules are natural-language strings — we hard-code the
    handful of programmatic checks here. Invariants we do not model yet are
    silently skipped (they remain documentary).
    """
    violations: list[InvariantViolation] = []
    by_id = {inv.id: inv for inv in invariants}

    inv = by_id.get("INV-01")
    if inv is not None:
        transport = _get_path(config, "lca.transport_modeling")
        if transport is not None and transport != "explicit-foreground":
            violations.append(
                InvariantViolation(
                    invariant_id=inv.id,
                    severity=inv.violation_severity or "warning",
                    message=(
                        f"INV-01 violated: lca.transport_modeling="
                        f"'{transport}', expected 'explicit-foreground'"
                    ),
                )
            )

    inv = by_id.get("INV-02")
    if inv is not None:
        fu = _get_path(config, "lca.functional_unit")
        if fu is not None and fu != "function-oriented":
            violations.append(
                InvariantViolation(
                    invariant_id=inv.id,
                    severity=inv.violation_severity or "warning",
                    message=(
                        f"INV-02 violated: lca.functional_unit='{fu}', "
                        "expected 'function-oriented'"
                    ),
                )
            )

    inv = by_id.get("INV-04")
    if inv is not None:
        lcc_type = _get_path(config, "lcc.type")
        if isinstance(lcc_type, str) and "E-LCC" in lcc_type:
            lca_boundary = _get_path(config, "lca.system_boundary")
            lcc_boundary = _get_path(config, "lcc.boundary")
            if (
                lca_boundary is not None
                and lcc_boundary is not None
                and lca_boundary != lcc_boundary
            ):
                violations.append(
                    InvariantViolation(
                        invariant_id=inv.id,
                        severity=inv.violation_severity or "warning",
                        message=(
                            "INV-04 violated: lcc.boundary "
                            f"('{lcc_boundary}') must equal lca.system_boundary "
                            f"('{lca_boundary}') when E-LCC is in lcc.type"
                        ),
                    )
                )

    return violations
