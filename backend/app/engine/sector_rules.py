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


def _configurations(overlays: dict[str, Any]) -> dict[str, tuple[str, dict[str, Any]]]:
    """Configuration id -> (chapter key, configuration)."""
    return {cfg["id"]: (key, cfg) for key, chapter in overlays.items()
            for cfg in chapter.get("configurations", [])}


def chapters_for(case: Case, overlays: dict[str, Any]) -> dict[str, list[dict[str, str]]]:
    """Active chapter keys, in the order of the deliverable, each with what
    activated it: the flows that declare it (by sector or configuration) and/or
    the case sector."""
    sector_to_chapter = {
        sector: key for key, chapter in overlays.items() for sector in chapter["q6a"]
    }
    configurations = _configurations(overlays)
    reasons: dict[str, list[dict[str, str]]] = {}
    for flow in case.flows:
        keys = {sector_to_chapter.get(flow.sector.value) if flow.sector else None,
                configurations.get(flow.configuration, (None, None))[0]} - {None}
        for key in sorted(keys):
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

    configurations = _configurations(overlays)
    c2 = case.ilcd_situation is not None and case.ilcd_situation.value == "ILCD Situation C2"
    sector_to_chapter = {s: k for k, ch in overlays.items() for s in ch["q6a"]}

    def flow_lines(key: str) -> list[dict[str, Any]]:
        """One line per flow that declares a configuration of this chapter: the
        conventional product it substitutes (§4.1-§8.1)."""
        out = []
        for flow in case.flows:
            chapter_key, cfg = configurations.get(flow.configuration, (None, None))
            if chapter_key != key:
                continue
            out.append({
                "chapter_key": key, "chapter": overlays[key]["chapter"],
                "activated_by": [{"kind": "flow", "name": flow.name}],
                "id": f"{cfg['id']}:{flow.id}", "group": "configuration", "strength": "descriptive",
                "applies_when": None,
                "statement": (f"Flow \u201c{flow.name}\u201d \u2014 {cfg['label']}: the conventional product it "
                              f"substitutes is {cfg['substitutes']}."),
                "source": cfg["source"], "lines": cfg["lines"],
                # structured, so the client can write the line in the reader's language
                "configuration_id": cfg["id"], "flow_name": flow.name, "substitutes": cfg["substitutes"],
                "note": ("Situation C2: no substitution credit is applied (D4.1 §7.2.3); the product only "
                         "describes the configuration." if c2 else None),
            })
        return out

    case.sector_rules = [
        line
        for key, reasons in chapters_for(case, overlays).items()
        for line in flow_lines(key) + [
            {
                "chapter_key": key,
                "chapter": overlays[key]["chapter"],
                "activated_by": reasons,
                **{f: rule.get(f) for f in
                   ("id", "group", "strength", "applies_when", "statement", "source", "lines", "note")},
            }
            for rule in overlays[key]["rules"] if applies(rule)
        ]
    ]

    for flow in case.flows:
        if not flow.configuration:
            continue
        if flow.configuration not in configurations:
            case.warnings.append({"code": "flow_configuration_unknown",
                                  "params": {"flow": flow.name, "configuration": flow.configuration}, "message": (
                f"Flow '{flow.name}': configuration '{flow.configuration}' is not one of D4.1 Part 2.")})
            continue
        declared = sector_to_chapter.get(flow.sector.value) if flow.sector else None
        chapter_key = configurations[flow.configuration][0]
        if declared and declared != chapter_key:
            case.warnings.append({"code": "flow_configuration_other_chapter", "params": {
                "flow": flow.name, "chapter": overlays[chapter_key]["chapter"].split(" ")[0],
                "declared": overlays[declared]["chapter"].split(" ")[0]}, "message": (
                f"Flow '{flow.name}': its configuration belongs to {overlays[chapter_key]['chapter']}, "
                f"not to the declared {overlays[declared]['chapter']}; the rules of both chapters are listed.")})
    return case
