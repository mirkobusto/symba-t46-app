"""Cases CRUD HTTP endpoints (Feature D — server-side persistence).

  GET    /api/cases             -> list all (id, name, pathway, ts)
  GET    /api/cases/{case_id}   -> full Case JSON
  POST   /api/cases             -> create new (name + Case)
  PUT    /api/cases/{case_id}   -> update existing (name + Case)
  DELETE /api/cases/{case_id}   -> delete

The Case body is stored as JSON text on the CaseRecord ORM model;
no querying inside the JSON. Name + timestamps + pathway_id are the
only indexed/projected fields. Pathway is denormalised into its own
column so the list endpoint can return it without parsing every row's
JSON.

Stateless (no auth in MVP). For multi-tenant deployment, add an
owner_id column + a Depends(get_current_user) dependency.
"""
from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from app.db import get_db
from app.domain.models import Case
from app.models import CaseRecord

router = APIRouter(tags=["cases"])


# ---------------------------------------------------------------------------
# Pydantic DTOs
# ---------------------------------------------------------------------------


class CaseSummary(BaseModel):
    """List-page summary — keeps the JSON payload off the wire."""

    id: str
    name: str
    pathway_id: str | None
    created_at: datetime
    updated_at: datetime


class CaseSavePayload(BaseModel):
    """Request body for POST + PUT."""

    name: str
    case: Case


class CaseDetail(BaseModel):
    """Response body for GET /{id} + POST + PUT."""

    id: str
    name: str
    pathway_id: str | None
    created_at: datetime
    updated_at: datetime
    case: Case


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _to_summary(rec: CaseRecord) -> CaseSummary:
    return CaseSummary(
        id=rec.id,
        name=rec.name,
        pathway_id=rec.pathway_id,
        created_at=rec.created_at,
        updated_at=rec.updated_at,
    )


def _to_detail(rec: CaseRecord) -> CaseDetail:
    return CaseDetail(
        id=rec.id,
        name=rec.name,
        pathway_id=rec.pathway_id,
        created_at=rec.created_at,
        updated_at=rec.updated_at,
        case=Case.model_validate_json(rec.case_json),
    )


def _populate_record(rec: CaseRecord, name: str, case: Case) -> None:
    rec.name = name
    rec.case_json = case.model_dump_json()
    rec.pathway_id = case.pathway_id.value if case.pathway_id else None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get("", response_model=list[CaseSummary])
def list_cases(db: OrmSession = Depends(get_db)) -> list[CaseSummary]:
    """List all saved cases, newest first."""
    rows = db.execute(
        select(CaseRecord).order_by(CaseRecord.updated_at.desc())
    ).scalars().all()
    return [_to_summary(r) for r in rows]


@router.get("/{case_id}", response_model=CaseDetail)
def get_case(case_id: str, db: OrmSession = Depends(get_db)) -> CaseDetail:
    rec = db.get(CaseRecord, case_id)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    return _to_detail(rec)


@router.post("", response_model=CaseDetail, status_code=status.HTTP_201_CREATED)
def create_case(
    payload: CaseSavePayload, db: OrmSession = Depends(get_db),
) -> CaseDetail:
    rec = CaseRecord()
    _populate_record(rec, payload.name, payload.case)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return _to_detail(rec)


@router.put("/{case_id}", response_model=CaseDetail)
def update_case(
    case_id: str, payload: CaseSavePayload,
    db: OrmSession = Depends(get_db),
) -> CaseDetail:
    rec = db.get(CaseRecord, case_id)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    _populate_record(rec, payload.name, payload.case)
    db.commit()
    db.refresh(rec)
    return _to_detail(rec)


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_case(case_id: str, db: OrmSession = Depends(get_db)) -> None:
    rec = db.get(CaseRecord, case_id)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    db.delete(rec)
    db.commit()
