"""Sector rules of D4.1 Part 2 for the chapters a case touches.

D4.1 Part 2 gives modelling rules for five sectors (§4-§8) and their LCIA
categories (§9). They live in `schemas/sector_overlays.json`, one entry per
chapter, and reach the user as mandates: the engine does not compute with them,
it lists the ones that apply so the analyst can document how each was met.

A chapter applies when a flow declares it (`Flow.sector`, the D4.1 Part 2 sector
of what is exchanged) or when the case sector (Q6a) belongs to it. The flow is
the stronger signal: the test on real cases showed that the chapters follow what
is exchanged, not the industry of the company (review report, 2026-10-15).
"""
from __future__ import annotations

from typing import Any

from app.domain.models import Case
from app.engine.branch_keys import Answers, parse_branch_key
from app.engine.loader import LoadedSchemas


def chapters_for(case: Case, overlays: dict[str, Any]) -> dict[str, list[dict[str, str]]]:
    """Active chapter keys, in the order of the deliverable, each with what
    activated it: the flows that declare it and/or the case sector."""
    sector_to_chapter = {
        sector: key for key, chapter in overlays.items() for sector in chapter["q6a"]
    }
    reasons: dict[str, list[dict[str, str]]] = {}
    for flow in case.flows:
        key = sector_to_chapter.get(flow.sector.value) if flow.sector else None
        if key:
            reasons.setdefault(key, []).append({"kind": "flow", "name": flow.name})
    key = sector_to_chapter.get(case.q6a.value) if case.q6a else None
    if key:
        reasons.setdefault(key, []).append({"kind": "case_sector"})
    return {k: reasons[k] for k in overlays if k in reasons}


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Write `case.sector_rules`: every rule of every active chapter, with the
    chapter, the reason it applies and the deliverable lines."""
    overlays = schemas.sector_overlays.get("overlays") or {}
    answers = Answers.from_case(case)

    def applies(rule: dict[str, Any]) -> bool:
        # e.g. substitution not in Situation C2, scale-up only below TRL 7
        key = rule.get("when_key")
        return not key or parse_branch_key(key).matches(answers)

    case.sector_rules = [
        {
            "chapter_key": key,
            "chapter": overlays[key]["chapter"],
            "activated_by": reasons,
            **{f: rule.get(f) for f in
               ("id", "group", "strength", "applies_when", "statement", "source", "lines", "note")},
        }
        for key, reasons in chapters_for(case, overlays).items()
        for rule in overlays[key]["rules"]
        if applies(rule)
    ]
    return case
