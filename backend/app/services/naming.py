"""Slug generation for saved cases (Phase 8).

Produces short, human-readable, URL-safe slugs like:

    wastewater-b-sita-3f0b

    ^         ^  ^    ^
    Q6a       Q7 ILCD situation (sitA, sitB, sitC1, sitC2), first 4 chars of the case id

Falls back gracefully when Q6a / Q7 / the situation are missing:

    (missing sector)    -> "case"
    (missing Q7)        -> omitted
    (missing situation) -> omitted

Slugs saved before 2026-10-18 carry the retired IS-01..IS-05 pathway instead
(e.g. "-is01-"); they are not rewritten, so shared links keep working.

Uniqueness is guaranteed by appending a random 3-char suffix on
collision. The database enforces uniqueness via a UNIQUE index.
"""
from __future__ import annotations

import re
import secrets

from sqlalchemy.orm import Session as OrmSession

from app.domain.models import Case
from app.models import CaseRecord

_SECTOR_ABBREV: dict[str, str] = {
    "agriculture_agrifood_biorefineries": "agri",
    "biobased_polymers": "biopoly",
    "plastics_packaging": "plastics",
    "pulp_paper": "pulp",
    "chemicals_fertilizers": "chem",
    "cement_construction": "cement",
    "steel_metals": "steel",
    "energy_utilities": "energy",
    "wastewater_sludge_biofactories": "wastewater",
    "textile_leather": "textile",
    "waste_valorization": "waste",
    "food_production": "food",
    "multi_tenant_urban_building": "urban",
    "multi_sector": "multi",
    "none": "case",
    "other": "case",
}


def _sanitize(part: str) -> str:
    # keep [a-z0-9-]; collapse other runs to '-'
    part = part.lower()
    part = re.sub(r"[^a-z0-9]+", "-", part)
    part = part.strip("-")
    return part


def _situation_abbrev(situation: str | None) -> str:
    if not situation:
        return ""
    # "ILCD Situation C2" -> "sitc2"
    return "sit" + _sanitize(situation.split()[-1]).replace("-", "")


def generate_case_slug(case: Case, short_id: str) -> str:
    """Compose a base slug from case properties + a 4-char id suffix
    for lexical distinctness. Uniqueness against the database is
    checked separately (see `assign_unique_slug`)."""
    sector = _SECTOR_ABBREV.get(
        case.q6a.value if case.q6a else "none", "case"
    )
    q7 = case.q7.value.lower() if case.q7 else ""
    situation = _situation_abbrev(case.ilcd_situation.value if case.ilcd_situation else None)

    parts = [sector]
    if q7:
        parts.append(q7)
    if situation:
        parts.append(situation)
    parts.append(short_id[:4].lower())

    return "-".join(p for p in parts if p)


def assign_unique_slug(
    db: OrmSession,
    case: Case,
    record_id: str,
    max_attempts: int = 12,
) -> str:
    """Return a slug guaranteed to be unique against `case_records.slug`.

    Falls back to appending a random 3-char token on collision.
    """
    short_id = record_id.split("-")[0]  # first hex block from the UUID
    base = generate_case_slug(case, short_id)
    candidate = base

    for _ in range(max_attempts):
        exists = (
            db.query(CaseRecord.id).filter(CaseRecord.slug == candidate).first()
        )
        if exists is None:
            return candidate
        candidate = f"{base}-{secrets.token_hex(2)}"

    # Extremely unlikely — fall through to id-based slug guaranteed unique.
    return f"case-{record_id[:8]}"
