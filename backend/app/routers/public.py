"""Public HTTP endpoints — served without authentication.

Used by the ReaderShell (frontend Phase 6) for the `/r/:caseId/:audience`
share URLs and by the /r/region/:code aggregate view. These endpoints
are read-only and expose only the cases their owner has shared
(CaseRecord.shared_at, set from the ShareReportModal): an unshared case
answers 404 whether it is asked by slug or by id (UX round 2026-11-03,
decided by Fable; before, every saved case was readable by anyone who
guessed its slug). The case is returned without the analyst's working
material: flow notes and quantities, sites, scenarios, raw diagnostics.

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
    ilcd_situation: str | None
    created_at: datetime
    updated_at: datetime
    shared_at: datetime | None = None
    prepared_by: str | None = None
    case_contact: str | None = None
    case: Case
    scoring: ScoringPayload | None = None


# advanced settings a reader's view depends on (the horizon threshold, the
# asset lifetime fallback); the rest is the analyst's working material
_PUBLIC_ADVANCED = ("future_background_threshold_years", "asset_lifetime")


def _public_case(case: Case) -> Case:
    """The case as a public reader sees it, without working notes."""
    return case.model_copy(update={
        "sites": [],
        "alternative_scenarios": [],
        "warnings": [],
        "rule_violations": [],
        "advanced": {k: v for k, v in case.advanced.items() if k in _PUBLIC_ADVANCED},
        "flows": [f.model_copy(update={"notes": None, "physical_quantity": None, "physical_unit": None})
                  for f in case.flows],
    })


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
    if rec is None or rec.shared_at is None:   # an unshared case does not exist for the public
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
        ilcd_situation=rec.ilcd_situation,
        created_at=rec.created_at,
        updated_at=rec.updated_at,
        shared_at=rec.shared_at,
        prepared_by=rec.prepared_by,
        case_contact=rec.case_contact,
        case=_public_case(Case.model_validate_json(rec.case_json)),
        scoring=scoring,
    )


class RegionAggregate(BaseModel):
    region: str
    total: int
    by_ilcd_situation: list[dict[str, Any]]
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

    # only shared cases count on a public page (UX round 2026-11-03)
    rows = db.execute(select(CaseRecord).where(CaseRecord.shared_at.is_not(None))).scalars().all()
    ilcd_counter: Counter[str | None] = Counter()
    sector_counter: Counter[str | None] = Counter()
    from app.routers.cases import shown_ilcd

    for r in rows:
        try:
            case = Case.model_validate_json(r.case_json)
        except Exception:
            ilcd_counter[None] += 1
            sector_counter[None] += 1
            continue
        # from the case, as the private dashboard counts it (Fable review of #206)
        ilcd_counter[shown_ilcd(case)] += 1
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
        by_ilcd_situation=_fmt(ilcd_counter),
        by_sector=_fmt(sector_counter),
    )
