"""Pydantic schemas for the decision-engine and pathway endpoints."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.domain.models_domain import (
    BlockInfo,
    InvariantViolation,
    PathwayMetadata,
    QuestionMetadata,
    TraceEntry,
)


class QuestionsListResponse(BaseModel):
    questions: list[QuestionMetadata]


class PathwaysListResponse(BaseModel):
    pathways: list[PathwayMetadata]


class PathwayResolutionResponse(BaseModel):
    """Returned by ``POST /api/sessions/{id}/resolve`` and the GET endpoint."""

    session_id: str
    resolved_at: datetime
    pathway_id: str | None = None
    pathway_name: str | None = None
    configuration: dict[str, Any] | None = None
    applied_rules: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    invariant_violations: list[InvariantViolation] = Field(default_factory=list)
    blocked: bool = False
    block_info: BlockInfo | None = None
    trace: list[TraceEntry] = Field(default_factory=list)
    match_distance: int | None = None
