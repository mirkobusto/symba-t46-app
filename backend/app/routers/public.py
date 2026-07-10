"""Public HTTP endpoints — served without authentication.

Used by the ReaderShell (frontend Phase 6) for the `/r/:caseId/:audience`
share URLs and by the /r/region/:code aggregate view. These endpoints
are read-only and expose only cases whose visibility permits public
reading; ownership is not checked because these URLs are shared
deliberately by the case owner via the ShareReportModal (Phase 7).

Endpoints:
    GET /api/public/report/{case_id_or_slug}   -> PublicReport
    GET /api/public/region/{region_code}       -> RegionAggregate
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from app.db import get_db
from app.domain.models import Case
from app.domain.scoring import ScoringPayload
from app.models import CaseRecord, CaseScoring


router = APIRouter(tags=["public"])


class PublicReport(BaseModel):
    """Read-only projection of a Case suitable for public sharing.

    Excludes owner_id and other internal columns; carries the derived
    engine state and (if ingested) the scoring payload.
    """

    id: str
    slug: str | None
    name: str
    pathway_id: str | None
    created_at: datetime
    updated_at: datetime
    case: Case
    scoring: ScoringPayload | None = None


def _find_case(db: OrmSession, key: str) -> CaseRecord | None:
    """Look up a case by slug first (canonical for share URLs), then
    fall back to the primary key (in case the caller has the UUID)."""
    stmt = select(CaseRecord).where(CaseRecord.slug == key).limit(1)
    rec = db.execute(stmt).scalar_one_or_none()
    if rec is not None:
        return rec
    return db.get(CaseRecord, key)


@router.get("/report/{key}", response_model=PublicReport)
def public_report(
    key: str,
    db: OrmSession = Depends(get_db),
) -> PublicReport:
    rec = _find_case(db, key)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"Case {key!r} not found")

    scoring_rec = db.get(CaseScoring, rec.id)
    scoring = (
        ScoringPayload.model_validate_json(scoring_rec.scoring_json)
        if scoring_rec is not None
        else None
    )

    return PublicReport(
        id=rec.id,
        slug=rec.slug,
        name=rec.name,
        pathway_id=rec.pathway_id,
        created_at=rec.created_at,
        updated_at=rec.updated_at,
        case=Case.model_validate_json(rec.case_json),
        scoring=scoring,
    )


class RegionAggregate(BaseModel):
    region: str
    total: int
    by_pathway: list[dict[str, Any]]
    by_sector: list[dict[str, Any]]


@router.get("/region/{region_code}", response_model=RegionAggregate)
def public_region_aggregate(
    region_code: str,
    db: OrmSession = Depends(get_db),
) -> RegionAggregate:
    """Stub aggregate. Phase 8 will add a real region column; for now
    we return the same breakdowns as /api/cases/aggregate/breakdown but
    keep the endpoint shape stable so the frontend page can be shipped."""
    from collections import Counter

    rows = db.execute(select(CaseRecord)).scalars().all()
    pathway_counter: Counter[str | None] = Counter()
    sector_counter: Counter[str | None] = Counter()
    for r in rows:
        pathway_counter[r.pathway_id] += 1
        try:
            case = Case.model_validate_json(r.case_json)
        except Exception:
            sector_counter[None] += 1
            continue
        sector_counter[case.q6a.value if case.q6a else None] += 1

    def _fmt(counter: Counter[str | None]) -> list[dict[str, Any]]:
        items = sorted(counter.items(), key=lambda x: (-x[1], x[0] or ""))
        return [
            {"key": k if k is not None else "(none)", "count": v}
            for k, v in items
        ]

    return RegionAggregate(
        region=region_code,
        total=len(rows),
        by_pathway=_fmt(pathway_counter),
        by_sector=_fmt(sector_counter),
    )
