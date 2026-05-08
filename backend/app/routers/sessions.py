"""Sessions endpoints: create / read / update / delete + answers + resolve."""

from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session as OrmSession

from app.db import get_db
from app.domain.engine import (
    DecisionEngine,
    IncompleteAnswersError,
    InvalidAnswerError,
    get_decision_engine,
)
from app.models import Answer, PathwayResolutionRecord, Session
from app.wire.pathway_schemas import PathwayResolutionResponse
from app.wire.session_schemas import (
    AnswerOut,
    AnswersBulkSubmitRequest,
    AnswersSubmitResponse,
    SessionCreateRequest,
    SessionDetailResponse,
    SessionResponse,
    SessionUpdateRequest,
)

router = APIRouter(tags=["sessions"])

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _decode_answer_value(stored: str) -> Any:
    """Answer values are JSON-encoded strings (booleans + strings)."""
    try:
        return json.loads(stored)
    except (TypeError, ValueError):
        return stored


def _encode_answer_value(value: Any) -> str:
    return json.dumps(value)


def _answers_dict(session: Session) -> dict[str, Any]:
    return {a.question_id: _decode_answer_value(a.value) for a in session.answers}


def _serialize_session(session: Session) -> SessionResponse:
    return SessionResponse(
        id=session.id,
        created_at=session.created_at,
        updated_at=session.updated_at,
        status=session.status,  # type: ignore[arg-type]
        case_name=session.case_name,
        notes=session.notes,
        answers_count=len(session.answers),
        pathway_resolved=session.pathway_resolution is not None,
    )


def _serialize_session_detail(session: Session) -> SessionDetailResponse:
    return SessionDetailResponse(
        id=session.id,
        created_at=session.created_at,
        updated_at=session.updated_at,
        status=session.status,  # type: ignore[arg-type]
        case_name=session.case_name,
        notes=session.notes,
        answers_count=len(session.answers),
        pathway_resolved=session.pathway_resolution is not None,
        answers=[
            AnswerOut(
                question_id=a.question_id,
                value=_decode_answer_value(a.value),
                created_at=a.created_at,
                updated_at=a.updated_at,
            )
            for a in sorted(session.answers, key=lambda a: a.question_id)
        ],
    )


def _get_session_or_404(db: OrmSession, session_id: str) -> Session:
    session = db.get(Session, session_id)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id!r} not found",
        )
    return session


def _recompute_status(session: Session, total_questions: int) -> None:
    if session.pathway_resolution is not None:
        session.status = "pathway_resolved"
    elif len(session.answers) >= total_questions:
        session.status = "answers_complete"
    else:
        session.status = "draft"


# ---------------------------------------------------------------------------
# Session CRUD
# ---------------------------------------------------------------------------


@router.post(
    "",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    payload: SessionCreateRequest | None = None,
    db: OrmSession = Depends(get_db),
) -> SessionResponse:
    body = payload or SessionCreateRequest()
    session = Session(case_name=body.case_name, notes=body.notes, status="draft")
    db.add(session)
    db.commit()
    db.refresh(session)
    return _serialize_session(session)


@router.get("/{session_id}", response_model=SessionDetailResponse)
def get_session(
    session_id: str,
    db: OrmSession = Depends(get_db),
) -> SessionDetailResponse:
    session = _get_session_or_404(db, session_id)
    return _serialize_session_detail(session)


@router.patch("/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: str,
    payload: SessionUpdateRequest,
    db: OrmSession = Depends(get_db),
) -> SessionResponse:
    session = _get_session_or_404(db, session_id)
    if payload.case_name is not None:
        session.case_name = payload.case_name
    if payload.notes is not None:
        session.notes = payload.notes
    db.commit()
    db.refresh(session)
    return _serialize_session(session)


@router.delete("/{session_id}", response_model=SessionResponse)
def archive_session(
    session_id: str,
    db: OrmSession = Depends(get_db),
) -> SessionResponse:
    session = _get_session_or_404(db, session_id)
    session.status = "archived"
    db.commit()
    db.refresh(session)
    return _serialize_session(session)


# ---------------------------------------------------------------------------
# Answers
# ---------------------------------------------------------------------------


@router.post(
    "/{session_id}/answers",
    response_model=AnswersSubmitResponse,
)
def submit_answers(
    session_id: str,
    payload: AnswersBulkSubmitRequest,
    db: OrmSession = Depends(get_db),
    engine: DecisionEngine = Depends(get_decision_engine),
) -> AnswersSubmitResponse:
    """Submit one or more answers.

    Behaviour:
    * Each answer is validated against the engine's question schema.
    * Valid answers are upserted (uniqueness on ``(session_id, question_id)``).
    * Invalid answers are reported in ``rejected``.
    * The session ``status`` is recomputed; never touched on this endpoint
      beyond ``draft`` <-> ``answers_complete``.
    """
    session = _get_session_or_404(db, session_id)
    if session.status == "archived":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit answers for an archived session",
        )

    total_questions = len(engine.get_questions())
    existing: dict[str, Answer] = {a.question_id: a for a in session.answers}

    accepted: list[str] = []
    rejected: list[dict[str, Any]] = []

    for entry in payload.answers:
        result = engine.validate_answer(entry.question_id, entry.value)
        if not result.valid:
            rejected.append(
                {"question_id": entry.question_id, "reason": result.error}
            )
            continue
        encoded = _encode_answer_value(entry.value)
        if entry.question_id in existing:
            existing[entry.question_id].value = encoded
        else:
            new_answer = Answer(
                session_id=session.id,
                question_id=entry.question_id,
                value=encoded,
            )
            db.add(new_answer)
            session.answers.append(new_answer)
        accepted.append(entry.question_id)

    db.flush()
    _recompute_status(session, total_questions)
    db.commit()
    db.refresh(session)

    return AnswersSubmitResponse(
        session_id=session.id,
        accepted=accepted,
        rejected=rejected,
        answers_count=len(session.answers),
        status=session.status,  # type: ignore[arg-type]
    )


# ---------------------------------------------------------------------------
# Resolve pathway
# ---------------------------------------------------------------------------


def _persist_resolution(
    db: OrmSession,
    session: Session,
    resolution,
) -> PathwayResolutionRecord:
    record = session.pathway_resolution
    if record is None:
        record = PathwayResolutionRecord(session_id=session.id)
        db.add(record)
        session.pathway_resolution = record

    record.pathway_id = resolution.pathway_id
    record.pathway_name = resolution.pathway_name
    record.configuration_json = json.dumps(resolution.configuration or {})
    record.applied_rules = json.dumps(resolution.applied_rules)
    record.warnings = json.dumps(resolution.warnings)
    record.trace_json = json.dumps(
        [t.model_dump() for t in resolution.trace]
    )
    record.blocked = resolution.blocked
    record.match_distance = resolution.match_distance

    if resolution.blocked and resolution.block_info is not None:
        record.block_id = resolution.block_info.block_id
        record.block_message = resolution.block_info.message
        record.block_resolutions = json.dumps(
            resolution.block_info.suggested_resolutions
        )
    else:
        record.block_id = None
        record.block_message = None
        record.block_resolutions = None

    record.resolved_at = datetime.now(UTC).replace(tzinfo=None)
    return record


def _record_to_response(
    record: PathwayResolutionRecord,
    session_id: str,
) -> PathwayResolutionResponse:
    block_info = None
    if record.blocked:
        from app.domain.models_domain import BlockInfo

        block_info = BlockInfo(
            block_id=record.block_id or "",
            message=record.block_message or "",
            suggested_resolutions=json.loads(record.block_resolutions or "[]"),
        )
    return PathwayResolutionResponse(
        session_id=session_id,
        resolved_at=record.resolved_at,
        pathway_id=record.pathway_id,
        pathway_name=record.pathway_name,
        configuration=json.loads(record.configuration_json or "null"),
        applied_rules=json.loads(record.applied_rules or "[]"),
        warnings=json.loads(record.warnings or "[]"),
        blocked=record.blocked,
        block_info=block_info,
        trace=json.loads(record.trace_json or "[]"),
        match_distance=record.match_distance,
    )


@router.post(
    "/{session_id}/resolve",
    response_model=PathwayResolutionResponse,
)
def resolve_session_pathway(
    session_id: str,
    db: OrmSession = Depends(get_db),
    engine: DecisionEngine = Depends(get_decision_engine),
) -> PathwayResolutionResponse:
    session = _get_session_or_404(db, session_id)
    if session.status == "archived":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot resolve an archived session",
        )

    answers = _answers_dict(session)
    try:
        resolution = engine.resolve_pathway(answers)
    except IncompleteAnswersError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "incomplete_answers", "missing": exc.missing},
        ) from exc
    except InvalidAnswerError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "invalid_answer",
                "question_id": exc.q_id,
                "value": exc.value,
                "reason": exc.error,
            },
        ) from exc

    record = _persist_resolution(db, session, resolution)
    _recompute_status(session, total_questions=len(engine.get_questions()))
    db.commit()
    db.refresh(record)

    response = PathwayResolutionResponse(
        session_id=session.id,
        resolved_at=record.resolved_at,
        pathway_id=resolution.pathway_id,
        pathway_name=resolution.pathway_name,
        configuration=resolution.configuration,
        applied_rules=resolution.applied_rules,
        warnings=resolution.warnings,
        invariant_violations=resolution.invariant_violations,
        blocked=resolution.blocked,
        block_info=resolution.block_info,
        trace=resolution.trace,
        match_distance=resolution.match_distance,
    )
    return response


@router.get(
    "/{session_id}/pathway",
    response_model=PathwayResolutionResponse,
)
def get_session_pathway(
    session_id: str,
    db: OrmSession = Depends(get_db),
) -> PathwayResolutionResponse:
    session = _get_session_or_404(db, session_id)
    record = session.pathway_resolution
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No pathway has been resolved for session {session_id!r}",
        )
    return _record_to_response(record, session_id)


# ---------------------------------------------------------------------------
# Stub endpoints for future sprints
# ---------------------------------------------------------------------------


@router.get("/{session_id}/protocol")
def get_session_protocol(session_id: str) -> Response:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Protocol generation is scheduled for Sprint 5.",
    )


@router.get("/{session_id}/data-template")
def get_session_data_template(session_id: str) -> Response:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Data-collection template is scheduled for Sprint 6.",
    )
