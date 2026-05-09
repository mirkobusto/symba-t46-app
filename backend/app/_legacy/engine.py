"""DecisionEngine: load ``lcsa_decision_engine.v2.json`` and resolve pathways.

The engine is the only piece of code that owns the LCSA decision logic. It
exposes a small, side-effect-free API; persistence and HTTP wiring live in
``app.models``, ``app.routers``, and ``app.schemas``.
"""

from __future__ import annotations

import json
from copy import deepcopy
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.domain.models_domain import (
    BlockedCombination,
    GlobalInvariant,
    PathwayMetadata,
    PathwayResolution,
    PostProcessingRule,
    QuestionMetadata,
    TraceEntry,
    ValidationResult,
)
from app.domain.validators import (
    check_blocked_combinations,
    check_global_invariants,
    trigger_matches,
)

ALL_QUESTION_IDS = tuple(f"q{i}" for i in range(1, 11))

# Hamming distance weights per question (see SPEC §3.6).
QUESTION_WEIGHTS: dict[str, int] = {
    "q1": 5,
    "q3": 5,
    "q7": 5,
    "q2": 3,
    "q5": 3,
    "q9": 3,
    "q4": 1,
    "q6": 1,
    "q8": 1,
    "q10": 1,
}
# Threshold above which fallback matches receive a "weak match" warning.
FALLBACK_DISTANCE_WARNING_THRESHOLD = 10


class DecisionEngineError(Exception):
    """Base for engine-level errors."""


class IncompleteAnswersError(DecisionEngineError):
    def __init__(self, missing: list[str]) -> None:
        super().__init__(f"Missing answers for: {sorted(missing)}")
        self.missing = sorted(missing)


class InvalidAnswerError(DecisionEngineError):
    def __init__(self, q_id: str, value: Any, error: str) -> None:
        super().__init__(f"Invalid answer for {q_id}={value!r}: {error}")
        self.q_id = q_id
        self.value = value
        self.error = error


class UnknownQuestionError(DecisionEngineError):
    def __init__(self, q_id: str) -> None:
        super().__init__(f"Unknown question id: {q_id!r}")
        self.q_id = q_id


class UnknownPathwayError(DecisionEngineError):
    def __init__(self, pathway_id: str) -> None:
        super().__init__(f"Unknown pathway id: {pathway_id!r}")
        self.pathway_id = pathway_id


class DecisionEngine:
    """Loads the decision engine JSON and resolves pathways from answers."""

    def __init__(self, json_path: Path):
        self.json_path = Path(json_path)
        with self.json_path.open("r", encoding="utf-8") as f:
            raw = json.load(f)
        self._raw = raw
        self.version: str = raw.get("version", "0.0.0")
        self.questions: list[QuestionMetadata] = [
            QuestionMetadata(**q) for q in raw.get("questions", [])
        ]
        self._question_index: dict[str, QuestionMetadata] = {
            q.id: q for q in self.questions
        }
        self.pathways: list[PathwayMetadata] = [
            PathwayMetadata(**p) for p in raw.get("pathways", [])
        ]
        self._pathway_index: dict[str, PathwayMetadata] = {
            p.id: p for p in self.pathways
        }
        self.blocked_combinations: list[BlockedCombination] = [
            BlockedCombination(**b) for b in raw.get("blocked_combinations", [])
        ]
        self.post_processing_rules: list[PostProcessingRule] = [
            PostProcessingRule(**r) for r in raw.get("post_processing_rules", [])
        ]
        self.global_invariants: list[GlobalInvariant] = [
            GlobalInvariant(**inv) for inv in raw.get("global_invariants", [])
        ]

    # ------------------------------------------------------------------
    # Metadata access
    # ------------------------------------------------------------------

    def get_questions(self) -> list[QuestionMetadata]:
        return list(self.questions)

    def get_question(self, q_id: str) -> QuestionMetadata:
        if q_id not in self._question_index:
            raise UnknownQuestionError(q_id)
        return self._question_index[q_id]

    def list_pathways(self) -> list[PathwayMetadata]:
        return list(self.pathways)

    def get_pathway(self, pathway_id: str) -> PathwayMetadata:
        if pathway_id not in self._pathway_index:
            raise UnknownPathwayError(pathway_id)
        return self._pathway_index[pathway_id]

    # ------------------------------------------------------------------
    # Validation
    # ------------------------------------------------------------------

    def validate_answer(self, q_id: str, value: Any) -> ValidationResult:
        if q_id not in self._question_index:
            return ValidationResult(valid=False, error=f"unknown question id: {q_id}")
        question = self._question_index[q_id]
        allowed = [opt.value for opt in question.options]
        if value not in allowed:
            return ValidationResult(
                valid=False,
                error=f"value {value!r} not in allowed options for {q_id}: {allowed!r}",
            )
        return ValidationResult(valid=True)

    def check_blocked(self, answers: dict[str, Any]):
        return check_blocked_combinations(answers, self.blocked_combinations)

    # ------------------------------------------------------------------
    # Resolution
    # ------------------------------------------------------------------

    def _missing_answers(self, answers: dict[str, Any]) -> list[str]:
        return [q for q in ALL_QUESTION_IDS if q not in answers or answers[q] is None]

    def _validate_all_answers(self, answers: dict[str, Any]) -> None:
        for q_id in ALL_QUESTION_IDS:
            value = answers[q_id]
            result = self.validate_answer(q_id, value)
            if not result.valid:
                raise InvalidAnswerError(
                    q_id=q_id, value=value, error=result.error or "invalid"
                )

    def _hamming_distance(
        self, fingerprint: dict[str, Any], answers: dict[str, Any]
    ) -> int:
        """Weighted Hamming distance between answers and a pathway fingerprint.

        Mismatches cost the question weight; matches cost 0.
        """
        distance = 0
        for q_id in ALL_QUESTION_IDS:
            if fingerprint.get(q_id) != answers.get(q_id):
                distance += QUESTION_WEIGHTS.get(q_id, 1)
        return distance

    def _find_exact_match(self, answers: dict[str, Any]) -> PathwayMetadata | None:
        for pathway in self.pathways:
            if all(
                pathway.answer_fingerprint.get(q_id) == answers.get(q_id)
                for q_id in ALL_QUESTION_IDS
            ):
                return pathway
        return None

    def _find_closest_pathway(
        self, answers: dict[str, Any]
    ) -> tuple[PathwayMetadata, int]:
        scored = [
            (self._hamming_distance(p.answer_fingerprint, answers), p)
            for p in self.pathways
        ]
        scored.sort(key=lambda x: x[0])
        distance, pathway = scored[0]
        return pathway, distance

    def _apply_rule(
        self, rule: PostProcessingRule, config: dict[str, Any]
    ) -> dict[str, Any]:
        """Apply ``rule.modifications`` (dotted-path keys) to a config."""
        for dotted, new_value in rule.modifications.items():
            parts = dotted.split(".")
            cur = config
            for part in parts[:-1]:
                if part not in cur or not isinstance(cur[part], dict):
                    cur[part] = {}
                cur = cur[part]
            cur[parts[-1]] = new_value
        return config

    def _consolidate_trace(
        self,
        pathway: PathwayMetadata,
        answers: dict[str, Any],
        applied_rule_ids: list[str],
    ) -> list[TraceEntry]:
        """Merge pathway-level + per-answered-question + applied-rule traces.

        Duplicates (same deliverable + section + node_id) are dropped.
        """
        seen: set[tuple[str, str, str]] = set()
        out: list[TraceEntry] = []

        def _add(entries: list[TraceEntry]) -> None:
            for e in entries:
                key = (e.deliverable, e.section, e.node_id)
                if key in seen:
                    continue
                seen.add(key)
                out.append(e)

        _add(pathway.trace)
        for q_id in ALL_QUESTION_IDS:
            if q_id in answers:
                _add(self._question_index[q_id].trace)
        rules_by_id = {r.id: r for r in self.post_processing_rules}
        for rid in applied_rule_ids:
            rule = rules_by_id.get(rid)
            if rule is not None:
                _add(rule.trace)
        return out

    def resolve_pathway(self, answers: dict[str, Any]) -> PathwayResolution:
        """Resolve answers into a full :class:`PathwayResolution`.

        Steps (per SPEC §3.5):
        1. Completeness check (all 10 answers present).
        2. Per-answer validation against question options.
        3. Blocked combinations check (returns early if HARD block).
        4. Exact-fingerprint match across pathways.
        5. Hamming-distance fallback if no exact match.
        6. Apply post-processing rules in order.
        7. Verify global invariants (warn-only).
        8. Consolidate trace.
        """
        # Step 1
        missing = self._missing_answers(answers)
        if missing:
            raise IncompleteAnswersError(missing=missing)

        # Step 2
        self._validate_all_answers(answers)

        # Step 3
        block_result = self.check_blocked(answers)
        if block_result.blocked:
            return PathwayResolution(
                blocked=True,
                block_info=block_result.block_info,
                warnings=block_result.soft_warnings,
            )

        # Step 4 + 5
        warnings: list[str] = list(block_result.soft_warnings)
        match = self._find_exact_match(answers)
        if match is not None:
            distance = 0
        else:
            match, distance = self._find_closest_pathway(answers)
            warnings.append(
                f"No exact pathway match: closest is {match.id} "
                f"with weighted Hamming distance {distance}."
            )
            if distance > FALLBACK_DISTANCE_WARNING_THRESHOLD:
                warnings.append(
                    f"Match for {match.id} is weak (distance {distance} > "
                    f"{FALLBACK_DISTANCE_WARNING_THRESHOLD}); "
                    "review configuration carefully."
                )

        # Step 6
        config = deepcopy(match.configuration)
        applied: list[str] = []
        for rule in self.post_processing_rules:
            if not trigger_matches(answers, rule.trigger):
                continue
            if rule.modifications:
                self._apply_rule(rule, config)
            elif rule.user_message:
                # Interactive rules (e.g. RULE-04) only surface a message.
                warnings.append(f"{rule.id}: {rule.user_message}")
            applied.append(rule.id)

        # Step 7
        invariant_violations = check_global_invariants(config, self.global_invariants)
        for v in invariant_violations:
            if v.severity == "critical":
                warnings.append(f"INVARIANT-CRITICAL {v.invariant_id}: {v.message}")
            else:
                warnings.append(f"INVARIANT-{v.severity.upper()} {v.invariant_id}: {v.message}")

        # Step 8
        trace = self._consolidate_trace(match, answers, applied)

        return PathwayResolution(
            pathway_id=match.id,
            pathway_name=match.name,
            configuration=config,
            applied_rules=applied,
            warnings=list(match.warnings) + warnings,
            invariant_violations=invariant_violations,
            blocked=False,
            block_info=None,
            trace=trace,
            match_distance=distance,
        )


# ---------------------------------------------------------------------------
# Singleton accessor (FastAPI dependency)
# ---------------------------------------------------------------------------

DEFAULT_JSON_PATH = (
    Path(__file__).resolve().parent.parent / "data" / "lcsa_decision_engine.v2.json"
)


@lru_cache(maxsize=1)
def get_decision_engine() -> DecisionEngine:
    """FastAPI dependency: a process-wide :class:`DecisionEngine` instance."""
    return DecisionEngine(json_path=DEFAULT_JSON_PATH)
