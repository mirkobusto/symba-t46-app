"""Scoring HTTP endpoints — ingest + fetch the CIRCE-produced scoring
payload for a saved Case (T4.6 roadmap Phase B).

Endpoints:
  GET    /api/scoring/{case_id}  -> ScoringPayload (404 if not ingested)
  PUT    /api/scoring/{case_id}  -> ingest or update the payload
  DELETE /api/scoring/{case_id}  -> drop the payload (analyst trigger)

The Case must already exist in the case_records table (i.e. saved via
POST /api/cases) — otherwise PUT returns 404 to keep referential
integrity without a foreign-key constraint (SQLite-friendly).

Authorization follows the owning Case (`app.auth.ownership`): a
scoring payload is as readable/writable as the case it scores. Legacy
cases (`owner_id IS NULL`) stay open so the unauthenticated MVP flow and
the CIRCE ingest against demo cases keep working; once a case is saved
by an authenticated analyst, only that analyst (or an admin) can read,
ingest or drop its scoring.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as OrmSession

from app.auth.deps import get_current_user_optional
from app.auth.ownership import can_modify, can_view
from app.db import get_db
from app.domain.scoring import ScoringPayload
from app.models import CaseRecord, CaseScoring, User

router = APIRouter(tags=["scoring"])


@router.get("/{case_id}", response_model=ScoringPayload)
def get_scoring(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> ScoringPayload:
    """Return the most recent scoring payload for `case_id`.

    Raises 404 if no payload has been ingested for this case (the UI
    interprets the 404 as 'scoring not yet available' rather than
    surfacing the HTTP error), and the same 404 when the caller may not
    see the owning case — an owned case's existence is not disclosed.
    """
    case_rec = db.get(CaseRecord, case_id)
    if case_rec is not None and not can_view(case_rec, current_user):
        raise HTTPException(
            status_code=404,
            detail=f"No scoring payload ingested for case {case_id!r}",
        )
    rec = db.get(CaseScoring, case_id)
    if rec is None:
        raise HTTPException(
            status_code=404,
            detail=f"No scoring payload ingested for case {case_id!r}",
        )
    return ScoringPayload.model_validate_json(rec.scoring_json)


@router.put("/{case_id}", response_model=ScoringPayload)
def put_scoring(
    case_id: str,
    payload: ScoringPayload,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> ScoringPayload:
    """Ingest (create or replace) the scoring payload for `case_id`.

    The Case must already exist on the server (return 404 otherwise).
    The payload.case_id must match the URL case_id (return 400 otherwise)
    to catch routing mistakes upstream.
    """
    if payload.case_id != case_id:
        raise HTTPException(
            status_code=400,
            detail=(
                f"payload.case_id ({payload.case_id!r}) != URL case_id "
                f"({case_id!r})"
            ),
        )

    case_rec = db.get(CaseRecord, case_id)
    if case_rec is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Case {case_id!r} not found — save the case via POST "
                f"/api/cases before ingesting scoring"
            ),
        )
    if not can_modify(case_rec, current_user):
        raise HTTPException(
            status_code=403,
            detail="Not allowed to ingest scoring for this case",
        )

    existing = db.get(CaseScoring, case_id)
    if existing is None:
        existing = CaseScoring(
            case_id=case_id,
            scoring_json=payload.model_dump_json(),
            source=payload.source,
            computed_at=payload.computed_at,
        )
        db.add(existing)
    else:
        existing.scoring_json = payload.model_dump_json()
        existing.source = payload.source
        existing.computed_at = payload.computed_at
        # updated_at is auto-set by SQLAlchemy `onupdate=func.now()` on the model

    db.commit()
    db.refresh(existing)
    return payload


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scoring(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> None:
    case_rec = db.get(CaseRecord, case_id)
    if case_rec is not None and not can_modify(case_rec, current_user):
        raise HTTPException(
            status_code=403,
            detail="Not allowed to drop the scoring for this case",
        )
    rec = db.get(CaseScoring, case_id)
    if rec is None:
        raise HTTPException(
            status_code=404,
            detail=f"No scoring payload to delete for case {case_id!r}",
        )
    db.delete(rec)
    db.commit()
