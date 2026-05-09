"""Pydantic schemas for the sessions REST API."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from app.models import SESSION_STATUSES

SessionStatus = Literal["draft", "answers_complete", "pathway_resolved", "archived"]
assert set(SESSION_STATUSES) == set(  # type: ignore[arg-type]
    ("draft", "answers_complete", "pathway_resolved", "archived")
)


class SessionCreateRequest(BaseModel):
    """Body for ``POST /api/sessions``. All fields optional."""

    case_name: str | None = Field(default=None, max_length=256)
    notes: str | None = Field(default=None, max_length=4096)


class SessionUpdateRequest(BaseModel):
    """Body for ``PATCH /api/sessions/{id}``."""

    case_name: str | None = Field(default=None, max_length=256)
    notes: str | None = Field(default=None, max_length=4096)


class AnswerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    question_id: str
    value: Any
    created_at: datetime
    updated_at: datetime


class SessionResponse(BaseModel):
    """Lightweight session payload (used in list-style responses)."""

    id: str
    created_at: datetime
    updated_at: datetime
    status: SessionStatus
    case_name: str | None = None
    notes: str | None = None
    answers_count: int = 0
    pathway_resolved: bool = False


class SessionDetailResponse(SessionResponse):
    """Full session payload including answers."""

    answers: list[AnswerOut] = Field(default_factory=list)


# ----- Answers ------------------------------------------------------------


class AnswerSubmitRequest(BaseModel):
    question_id: str = Field(min_length=2, max_length=8)
    value: Any  # str | bool — validated against the engine question schema


class AnswersBulkSubmitRequest(BaseModel):
    answers: list[AnswerSubmitRequest] = Field(min_length=1)


class AnswersSubmitResponse(BaseModel):
    session_id: str
    accepted: list[str] = Field(default_factory=list)  # question_ids saved
    rejected: list[dict[str, Any]] = Field(default_factory=list)  # {q_id, reason}
    answers_count: int
    status: SessionStatus
