"""Scoring HTTP endpoints — ingest + fetch the CIRCE-produced scoring
payload for a saved Case (T4.6 roadmap Phase B).

Endpoints:
  GET    /api/scoring/{case_id}  -> ScoringPayload (404 if not ingested)
  PUT    /api/scoring/{case_id}  -> ingest or update the payload
  DELETE /api/scoring/{case_id}  -> drop the payload (analyst trigger)

The Case must already exist in the case_records table (i.e. saved via
POST /api/cases) — otherwise PUT returns 404 to keep referential
integrity without a foreign-key constraint (SQLite-friendly).

Stateless: no auth in MVP. CIRCE will call PUT from outside; the
endpoint is open in this phase but should be protected (auth in
Phase D) before exposing the deployed app to the public internet.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as OrmSession

from app.db import get_db
from app.domain.scoring import ScoringPayload
from app.models import CaseRecord, CaseScoring


router = APIRouter(tags=["scoring"])


@router.get("/{case_id}", response_model=ScoringPayload)
def get_scoring(case_id: str, db: OrmSession = Depends(get_db)) -> ScoringPayload:
    """Return the most recent scoring payload for `case_id`.

    Raises 404 if no payload has been ingested for this case (the UI
    interprets the 404 as 'scoring not yet available' rather than
    surfacing the HTTP error).
    """
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
def delete_scoring(case_id: str, db: OrmSession = Depends(get_db)) -> None:
    rec = db.get(CaseScoring, case_id)
    if rec is None:
        raise HTTPException(
            status_code=404,
            detail=f"No scoring payload to delete for case {case_id!r}",
        )
    db.delete(rec)
    db.commit()
