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
    GET /api/public/countries                  -> list[CountryCount]
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session as OrmSession

from app.db import get_db
from app.domain.models import Case
from app.domain.scoring import ScoringPayload
from app.models import CaseDcfData, CaseRecord, CaseScoring

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
    # where the plants are: the distinct countries of the companies in the
    # case's drawn network, never their names (UX round 6, P4-08, decided by Fable)
    countries: list[str] = Field(default_factory=list)
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


def _network_countries(db: OrmSession, case_id: str) -> list[str]:
    """Distinct ISO2 codes of the actors of the base network, sorted. The
    scenario networks are left out: scenarios are not in the public payload
    and may add companies elsewhere."""
    from app.domain.dcf_data import DcfData
    from app.engine.dcf_rows import rows_for

    stored = db.get(CaseDcfData, case_id)
    if stored is None:
        return []
    try:
        data = DcfData.model_validate_json(stored.data_json)
    except Exception:
        return []
    codes = {str(row.values.get("actor.country_iso2") or "").strip().upper()
             for row in rows_for(data, "actors")}
    return sorted(c for c in codes if c)


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
        countries=_network_countries(db, rec.id),
        case=_public_case(Case.model_validate_json(rec.case_json)),
        scoring=scoring,
    )


class RegionCase(BaseModel):
    """A shared case listed on a country page: the key of its public report
    (slug, or id for a case saved before slugs), its name, when it was shared."""

    key: str
    name: str
    shared_at: datetime | None = None


class RegionAggregate(BaseModel):
    region: str
    total: int
    by_ilcd_situation: list[dict[str, Any]]
    by_sector: list[dict[str, Any]]
    # the shared cases counted, newest share first (UX round 6, P3-08, P7-23)
    cases: list[RegionCase] = Field(default_factory=list)


class CountryCount(BaseModel):
    code: str
    count: int


def _shared_with_countries(db: OrmSession) -> list[tuple[CaseRecord, set[str]]]:
    """Every shared case with the countries of the companies in its drawn
    network (`actor.country_iso2`, the only per-case geography filled in).
    A case without a drawn network, or without a country on any company, has
    an empty set. Q7b is the reference market, not where the partners are,
    so it is not used."""
    from app.domain.dcf_data import DcfData
    from app.engine.dcf_rows import rows_for

    # only shared cases count on a public page (UX round 2026-11-03)
    shared = db.execute(
        select(CaseRecord).where(CaseRecord.shared_at.is_not(None)).order_by(CaseRecord.shared_at.desc())
    ).scalars().all()
    stored = {
        d.case_id: d.data_json
        for d in db.execute(
            select(CaseDcfData).where(CaseDcfData.case_id.in_([r.id for r in shared]))
        ).scalars()
    }

    def _countries(case_id: str) -> set[str]:
        raw = stored.get(case_id)
        if raw is None:
            return set()
        try:
            data = DcfData.model_validate_json(raw)
        except Exception:
            return set()
        codes = {str(row.values.get("actor.country_iso2") or "").strip().upper()
                 for row in rows_for(data, "actors")}
        return {c for c in codes if c}

    return [(r, _countries(r.id)) for r in shared]


@router.get("/countries", response_model=list[CountryCount])
def public_countries(db: OrmSession = Depends(get_db)) -> list[CountryCount]:
    """The countries that have a page with at least one case, with the number
    of shared cases there, most cases first: the way from the dashboard to the
    country pages (UX round 6, P3-08)."""
    from collections import Counter

    counter: Counter[str] = Counter()
    for _, countries in _shared_with_countries(db):
        counter.update(countries)
    return [CountryCount(code=c, count=n) for c, n in sorted(counter.items(), key=lambda x: (-x[1], x[0]))]


@router.get("/region/{region_code}", response_model=RegionAggregate)
def public_region_aggregate(
    region_code: str,
    db: OrmSession = Depends(get_db),
) -> RegionAggregate:
    """Shared cases with at least one partner in the country `region_code`
    (ISO 3166-1 alpha-2), read from the actors of the network the case
    stores. A case without a drawn network does not count. The path keeps
    the word "region" so that links already sent keep working; the page
    calls it a country."""
    from collections import Counter

    from app.routers.cases import case_sectors, shown_ilcd

    code = region_code.strip().upper()
    rows = [r for r, countries in _shared_with_countries(db) if code in countries]
    ilcd_counter: Counter[str | None] = Counter()
    sector_counter: Counter[str | None] = Counter()

    for r in rows:
        try:
            case = Case.model_validate_json(r.case_json)
        except Exception:
            ilcd_counter[None] += 1
            sector_counter[None] += 1
            continue
        # from the case, as the private dashboard counts it (Fable review of #206)
        ilcd_counter[shown_ilcd(case)] += 1
        for sector in case_sectors(case) or [None]:
            sector_counter[sector] += 1

    def _fmt(counter: Counter[str | None]) -> list[dict[str, Any]]:
        items = sorted(counter.items(), key=lambda x: (-x[1], x[0] or ""))
        return [
            {"key": k if k is not None else "(none)", "count": v}
            for k, v in items
        ]

    return RegionAggregate(
        region=code,
        total=len(rows),
        by_ilcd_situation=_fmt(ilcd_counter),
        by_sector=_fmt(sector_counter),
        cases=[RegionCase(key=r.slug or r.id, name=r.name, shared_at=r.shared_at) for r in rows],
    )
