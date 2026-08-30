"""The verdict in words, for the report side.

`app/data/narrative.json` is the canonical table: the frontend mirrors it
through i18n, this module reads it directly so the .docx and the page say
the same thing. Keeping one table is the whole point — a report that
contradicts the screen it was generated from is worse than no report.

The report renders the *long* form by default. On screen the detail sits
behind a disclosure because the reader is deciding what to do next; a
document is read once, often by someone who was not at the keyboard, so
the paraphrase and the deliverable citation belong in the flow.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.domain.models import Case

_Q_TOKEN = re.compile(r"Q([1-7])(a|b)?")


@lru_cache(maxsize=1)
def load_narrative() -> dict[str, Any]:
    path = Path(__file__).resolve().parents[1] / "data" / "narrative.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)


@dataclass
class VerdictSection:
    """One methodological axis — ILCD situation, LCC type, S-LCA state."""

    code: str
    short: str
    detail: str
    quote: str = ""
    source: str = ""


@dataclass
class Verdict:
    title: str
    body: str
    detail: str
    codes: list[str] = field(default_factory=list)
    sections: list[VerdictSection] = field(default_factory=list)


def verdict_for(case: Case) -> Verdict | None:
    """Compose the plain-language verdict for a pipeline-run case."""
    nar = load_narrative()
    pathway = case.pathway_id.value if case.pathway_id else None
    if pathway is None:
        return None

    entry = nar["pathway"].get(pathway, {})
    body = entry.get("body", "")
    if case.is_01_extended and nar.get("extendedSuffix"):
        body = f"{body} {nar['extendedSuffix']}".strip()

    sections: list[VerdictSection] = []
    for key, value in (
        ("ilcd", case.ilcd_situation),
        ("lcc", case.lcc_type),
        ("slca", case.slca_activation_state),
    ):
        if value is None:
            continue
        row = nar[key].get(value.value)
        if row is None:
            continue
        sections.append(
            VerdictSection(
                code=value.value,
                short=row.get("short", ""),
                detail=row.get("detail", ""),
                quote=row.get("quote", ""),
                source=row.get("source", ""),
            )
        )

    codes = [pathway + (" extended" if case.is_01_extended else "")]
    if case.ilcd_situation:
        codes.append(case.ilcd_situation.value)
    if case.lcc_type and case.lcc_type.value != "deactivated":
        codes.append(f"LCC {case.lcc_type.value}")

    return Verdict(
        title=entry.get("title", pathway),
        body=body,
        detail=entry.get("detail", ""),
        codes=codes,
        sections=sections,
    )


def _answer_for(case: Case, label: str) -> str | None:
    """Render the answer a trigger expression refers to."""
    if label == "Q3":
        active = [d for d in ("env", "eco", "soc") if getattr(case.q3, d, False)]
        return " + ".join(active) if active else "none"
    if label == "Q4":
        return ", ".join(sorted(q.value for q in case.q4)) or None
    if label == "Q5":
        return " · ".join(f"{f.name}: {f.q5.value}" for f in case.flows) or None
    value = getattr(case, label.lower(), None)
    return getattr(value, "value", value) if value is not None else None


def answers_in(trigger: str | None, case: Case) -> list[tuple[str, str]]:
    """The questions a trigger names, resolved against this case.

    "Q7 ∈ {B, C, D}" becomes [("Q7", "B")] — the difference between a rule
    quoted at the reader and a rule addressed to them.
    """
    if not trigger:
        return []
    out: list[tuple[str, str]] = []
    seen: set[str] = set()
    for match in _Q_TOKEN.finditer(trigger):
        label = f"Q{match.group(1)}{match.group(2) or ''}"
        if label in seen:
            continue
        seen.add(label)
        answer = _answer_for(case, label)
        if answer is not None:
            out.append((label, str(answer)))
    return out


@dataclass
class ActionItem:
    kind: str  # "block" | "obligation" | "decision"
    code: str
    title: str
    detail: str
    trigger: str | None = None
    answers: list[tuple[str, str]] = field(default_factory=list)
    fields: list[str] = field(default_factory=list)
    severity: str | None = None


_SEVERITY_RANK = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}


def action_items(case: Case) -> list[ActionItem]:
    """Everything to act on, hardest-stop first — the same ordering the
    result page uses, so the document and the screen agree: blocks that
    stop the pipeline, methodological practices to document, decisions
    only a human can take."""
    items = [
        ActionItem(kind="block", code=block_id, title=block_id, detail="", severity="HIGH")
        for block_id in case.blocked_by
    ]
    # Triggered rules, not failed assertions: these are the practices the
    # case has to document. See l2_validate on why the assertions cannot
    # verify choices made outside the tool.
    for rule in case.applicable_rules:
        trigger = rule.get("trigger")
        items.append(
            ActionItem(
                kind="obligation",
                code=str(rule.get("rule_id", "")),
                title=str(rule.get("name") or rule.get("rule_id", "")),
                detail=str(rule.get("statement", "")),
                trigger=trigger,
                answers=answers_in(trigger, case),
                fields=list(rule.get("fields") or []),
            )
        )
    for cdp in sorted(
        case.cdp_flags,
        key=lambda c: _SEVERITY_RANK.get(str(c.get("severity") or "LOW"), 3),
    ):
        items.append(
            ActionItem(
                kind="decision",
                code=str(cdp.get("cdp_id", "")),
                title=str(cdp.get("name") or cdp.get("cdp_id", "")),
                detail=str(cdp.get("tension") or ""),
                severity=str(cdp.get("severity")) if cdp.get("severity") else None,
            )
        )
    return items
