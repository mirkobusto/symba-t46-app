"""Pydantic models that mirror the structure of ``lcsa_decision_engine.v2.json``.

These models are the in-memory representation of the decision engine. They are
used both internally by :class:`app.domain.engine.DecisionEngine` and as the
return type of public engine methods. API-layer schemas live in
``app.schemas`` and convert between these and HTTP payloads.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field

# ---------------------------------------------------------------------------
# Trace + question metadata
# ---------------------------------------------------------------------------


class TraceEntry(BaseModel):
    """One pointer into the source D4.x deliverables."""

    model_config = ConfigDict(extra="allow")

    deliverable: str
    section: str
    node_id: str
    node_type: str | None = None


class QuestionOption(BaseModel):
    model_config = ConfigDict(extra="allow")

    value: Any  # str | bool — Q6/Q8 use booleans
    label: str


class QuestionMetadata(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    key: str
    label: str
    description: str
    options: list[QuestionOption]
    trace: list[TraceEntry] = Field(default_factory=list)
    post_processing_trigger: str | None = None


# ---------------------------------------------------------------------------
# Pathways
# ---------------------------------------------------------------------------


class PathwayMetadata(BaseModel):
    """One terminal pathway (LCSA-Px) in the decision engine."""

    model_config = ConfigDict(extra="allow")

    id: str
    name: str
    description: str | None = None
    answer_fingerprint: dict[str, Any]
    configuration: dict[str, Any]
    trace: list[TraceEntry] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    use_cases_examples: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Blocked combinations
# ---------------------------------------------------------------------------


class ViolatedConstraint(BaseModel):
    model_config = ConfigDict(extra="allow")

    deliverable: str
    section: str
    node_id: str
    rationale: str | None = None


class BlockedCombination(BaseModel):
    """Either a HARD block (severity unset / blocking unset) or a soft warning.

    The JSON encodes hard blocks by omitting ``severity``/``blocking``;
    soft warnings carry ``severity="warning"`` and ``blocking=False``.
    """

    model_config = ConfigDict(extra="allow")

    id: str
    trigger: dict[str, Any]
    user_message: str
    suggested_resolutions: list[str] = Field(default_factory=list)
    severity: str | None = None
    blocking: bool | None = None
    violated_constraints: list[ViolatedConstraint] = Field(default_factory=list)
    trace: list[TraceEntry] = Field(default_factory=list)

    @property
    def is_hard_block(self) -> bool:
        """True for combinations that must prevent pathway resolution."""
        if self.blocking is True:
            return True
        if self.blocking is False:
            return False
        # Default (no explicit blocking field): hard block.
        return self.severity != "warning"


class BlockInfo(BaseModel):
    """User-facing payload describing why a session is blocked."""

    block_id: str
    message: str
    suggested_resolutions: list[str] = Field(default_factory=list)
    violated_constraints: list[ViolatedConstraint] = Field(default_factory=list)
    trace: list[TraceEntry] = Field(default_factory=list)


class BlockedCheckResult(BaseModel):
    blocked: bool = False
    block_info: BlockInfo | None = None
    soft_warnings: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Post-processing rules + invariants
# ---------------------------------------------------------------------------


class PostProcessingRule(BaseModel):
    """A post-processing rule.

    Most rules carry a ``modifications`` dict (dotted-path -> new value)
    that gets applied to the chosen pathway configuration. Some rules
    (notably RULE-04) instead carry ``action`` + ``user_message`` and are
    interactive: the engine surfaces them as warnings without mutating
    the configuration.
    """

    model_config = ConfigDict(extra="allow")

    id: str
    patch_origin: str | None = None
    trigger: dict[str, Any]
    modifications: dict[str, Any] = Field(default_factory=dict)
    action: str | None = None
    user_message: str | None = None
    rationale: str | None = None
    trace: list[TraceEntry] = Field(default_factory=list)


class GlobalInvariant(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    rule: str
    rationale: str | None = None
    violation_severity: str | None = None


class InvariantViolation(BaseModel):
    invariant_id: str
    severity: str
    message: str


# ---------------------------------------------------------------------------
# Validation results
# ---------------------------------------------------------------------------


class ValidationResult(BaseModel):
    valid: bool
    error: str | None = None


class PathwayResolution(BaseModel):
    """Output of :meth:`DecisionEngine.resolve_pathway`.

    Distinct from the SQLAlchemy ``PathwayResolutionRecord`` model which
    persists this value into SQLite.
    """

    pathway_id: str | None = None
    pathway_name: str | None = None
    configuration: dict[str, Any] | None = None
    applied_rules: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    invariant_violations: list[InvariantViolation] = Field(default_factory=list)
    blocked: bool = False
    block_info: BlockInfo | None = None
    trace: list[TraceEntry] = Field(default_factory=list)
    match_distance: int | None = None  # 0 if exact match; >0 if Hamming fallback
