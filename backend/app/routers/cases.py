"""Cases CRUD HTTP endpoints (Feature D — server-side persistence).

  GET    /api/cases             -> list all (id, name, ILCD situation, ts)
  GET    /api/cases/{case_id}   -> full Case JSON
  POST   /api/cases             -> create new (name + Case)
  PUT    /api/cases/{case_id}   -> update existing (name + Case)
  DELETE /api/cases/{case_id}   -> delete

The Case body is stored as JSON text on the CaseRecord ORM model;
no querying inside the JSON. Name + timestamps + ilcd_situation are the
only indexed/projected fields. The ILCD situation is denormalised into its own
column so the list endpoint can return it without parsing every row's
JSON.

Ownership-aware since Phase D: legacy rows (owner_id IS NULL) stay
world-readable/writable, owned rows are restricted to their owner and
to admins. The predicates live in `app.auth.ownership`.
"""
from __future__ import annotations

from collections import Counter
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import false, or_, select
from sqlalchemy.orm import Session as OrmSession

from app.auth.deps import get_current_user_optional
from app.auth.ownership import anonymous_save_enabled, can_modify, can_view
from app.db import get_db
from app.domain.models import Case
from app.models import CaseRecord, User
from app.services.naming import assign_unique_slug

router = APIRouter(tags=["cases"])


# ---------------------------------------------------------------------------
# Pydantic DTOs
# ---------------------------------------------------------------------------


class CaseSummary(BaseModel):
    """List-page summary — keeps the JSON payload off the wire."""

    id: str
    name: str
    slug: str | None = None
    ilcd_situation: str | None
    created_at: datetime
    updated_at: datetime
    shared_at: datetime | None = None


class CaseSavePayload(BaseModel):
    """Request body for POST + PUT."""

    name: str
    case: Case


class CaseDetail(BaseModel):
    """Response body for GET /{id} + POST + PUT."""

    id: str
    name: str
    slug: str | None = None
    ilcd_situation: str | None
    created_at: datetime
    updated_at: datetime
    shared_at: datetime | None = None
    prepared_by: str | None = None
    case_contact: str | None = None
    case: Case


class SharePayload(BaseModel):
    """Body of POST /{id}/share: turn the public report on or off, and say who
    prepared the case and whom to ask (shown on the public report)."""

    shared: bool
    prepared_by: str | None = Field(default=None, max_length=120)
    case_contact: str | None = Field(default=None, max_length=200)


class AggregateBreakdownEntry(BaseModel):
    """One row in an aggregate breakdown: { key, count }."""

    key: str
    count: int


class CasesAggregate(BaseModel):
    """Aggregate breakdown across all saved cases — for the multi-stakeholder
    'authority / regional dashboard' view (T4.6 roadmap Phase B).
    """

    total: int
    by_lcc_type: list[AggregateBreakdownEntry]
    by_q6a_sector: list[AggregateBreakdownEntry]
    by_q7_geographic_scope: list[AggregateBreakdownEntry]
    by_ilcd_situation: list[AggregateBreakdownEntry]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _to_summary(rec: CaseRecord) -> CaseSummary:
    return CaseSummary(
        id=rec.id,
        name=rec.name,
        slug=rec.slug,
        ilcd_situation=rec.ilcd_situation,
        created_at=rec.created_at,
        updated_at=rec.updated_at,
        shared_at=rec.shared_at,
    )


def _to_detail(rec: CaseRecord) -> CaseDetail:
    return CaseDetail(
        id=rec.id,
        name=rec.name,
        slug=rec.slug,
        ilcd_situation=rec.ilcd_situation,
        created_at=rec.created_at,
        updated_at=rec.updated_at,
        shared_at=rec.shared_at,
        prepared_by=rec.prepared_by,
        case_contact=rec.case_contact,
        case=Case.model_validate_json(rec.case_json),
    )


def shown_ilcd(case: Case) -> str | None:
    """The ILCD situation as the lists and dashboards show it: none for a
    costing-only study, the situations dictate the LCA model (UX round 5,
    P3-04). One helper, so "My cases" and both dashboards agree."""
    if not case.ilcd_situation or not case.q3.env:
        return None
    return case.ilcd_situation.value


def _populate_record(rec: CaseRecord, name: str, case: Case) -> None:
    rec.name = name
    rec.case_json = case.model_dump_json()
    rec.ilcd_situation = shown_ilcd(case)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


def _visible_to(user: User | None):
    """Build the visibility filter for a query on CaseRecord.

    - Admins: all rows.
    - With anonymous saving on: rows without an owner, plus the user's own.
    - With it off (the default): the user's own rows only, and nothing for a
      caller without a token. "My cases" listed every anonymous visitor's
      study to every other visitor (UX round 2026-11-02).
    """
    if user is not None and user.role == "admin":
        return None  # no filter
    if not anonymous_save_enabled():
        if user is None:
            return false()
        return CaseRecord.owner_id == user.id
    if user is None:
        return CaseRecord.owner_id.is_(None)
    return or_(CaseRecord.owner_id.is_(None), CaseRecord.owner_id == user.id)


@router.get("", response_model=list[CaseSummary])
def list_cases(
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> list[CaseSummary]:
    """List saved cases visible to the caller, newest first.

    Visibility as in `_visible_to`.
    """
    stmt = select(CaseRecord).order_by(CaseRecord.updated_at.desc())
    visibility = _visible_to(current_user)
    if visibility is not None:
        stmt = stmt.where(visibility)
    rows = db.execute(stmt).scalars().all()
    return [_to_summary(r) for r in rows]


def _sorted_counter(counter: Counter[str | None]) -> list[AggregateBreakdownEntry]:
    """Render a Counter as a list of {key,count}, '(none)' for None,
    descending by count."""
    items = sorted(counter.items(), key=lambda x: (-x[1], x[0] or ""))
    return [
        AggregateBreakdownEntry(key=k if k is not None else "(none)", count=v)
        for k, v in items
    ]


# IMPORTANT: declared BEFORE /{case_id} so "aggregate" is not matched as
# a case_id value (FastAPI uses FIFO route ordering).
@router.get("/aggregate/breakdown", response_model=CasesAggregate)
def aggregate_breakdown(db: OrmSession = Depends(get_db)) -> CasesAggregate:
    """Breakdown of all saved cases by Q6a sector / Q7 scope / ILCD
    situation / LCC type.

    Reads case_records row-by-row and parses the JSON blob — fine for
    MVP volumes (low hundreds of rows). For larger datasets, denormalise
    q6a / q7 / ilcd_situation into indexed columns.
    """
    rows = db.execute(select(CaseRecord)).scalars().all()
    lcc_counter: Counter[str | None] = Counter()
    sector_counter: Counter[str | None] = Counter()
    scope_counter: Counter[str | None] = Counter()
    ilcd_counter: Counter[str | None] = Counter()

    for r in rows:
        try:
            case = Case.model_validate_json(r.case_json)
        except Exception:
            sector_counter[None] += 1
            scope_counter[None] += 1
            ilcd_counter[None] += 1
            lcc_counter[None] += 1
            continue
        sector_counter[case.q6a.value if case.q6a else None] += 1
        scope_counter[case.q7.value if case.q7 else None] += 1
        ilcd_counter[shown_ilcd(case)] += 1
        lcc_counter[case.lcc_type.value if case.lcc_type else None] += 1

    return CasesAggregate(
        total=len(rows),
        by_q6a_sector=_sorted_counter(sector_counter),
        by_q7_geographic_scope=_sorted_counter(scope_counter),
        by_ilcd_situation=_sorted_counter(ilcd_counter),
        by_lcc_type=_sorted_counter(lcc_counter),
    )


@router.get("/{case_id}", response_model=CaseDetail)
def get_case(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> CaseDetail:
    rec = db.get(CaseRecord, case_id)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    # Read-visibility: same rule as list (legacy rows + own; admins see all).
    # 404 rather than 403 so an owned case's existence is not disclosed.
    if not can_view(rec, current_user):
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    return _to_detail(rec)


@router.post("", response_model=CaseDetail, status_code=status.HTTP_201_CREATED)
def create_case(
    payload: CaseSavePayload,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> CaseDetail:
    if current_user is None and not anonymous_save_enabled():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to save a case on the server",
        )
    rec = CaseRecord()
    _populate_record(rec, payload.name, payload.case)
    if current_user is not None:
        rec.owner_id = current_user.id
    # Slug generation needs a stable record id — flush first, then assign.
    db.add(rec)
    db.flush()
    rec.slug = assign_unique_slug(db, payload.case, rec.id)
    db.commit()
    db.refresh(rec)
    return _to_detail(rec)


@router.put("/{case_id}", response_model=CaseDetail)
def update_case(
    case_id: str,
    payload: CaseSavePayload,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> CaseDetail:
    rec = db.get(CaseRecord, case_id)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    if not can_modify(rec, current_user):
        raise HTTPException(status_code=403, detail="Not allowed to modify this case")
    _populate_record(rec, payload.name, payload.case)
    db.commit()
    db.refresh(rec)
    return _to_detail(rec)


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_case(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> None:
    rec = db.get(CaseRecord, case_id)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    if not can_modify(rec, current_user):
        raise HTTPException(status_code=403, detail="Not allowed to delete this case")
    db.delete(rec)
    db.commit()


@router.post("/{case_id}/share", response_model=CaseDetail)
def share_case(
    case_id: str,
    payload: SharePayload,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> CaseDetail:
    """Turn the public report of a case on or off (UX round 2026-11-03).

    Only whoever may modify the case may share it. Turning it off makes the
    public links answer 404 again; the slug stays, so sharing again restores
    the same links.
    """
    rec = db.get(CaseRecord, case_id)
    if rec is None or not can_view(rec, current_user):
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    if not can_modify(rec, current_user):
        raise HTTPException(status_code=403, detail="Not allowed to share this case")
    rec.shared_at = (rec.shared_at or datetime.now(UTC).replace(tzinfo=None)) if payload.shared else None
    rec.prepared_by = (payload.prepared_by or "").strip() or None
    rec.case_contact = (payload.case_contact or "").strip() or None
    db.commit()
    db.refresh(rec)
    return _to_detail(rec)
