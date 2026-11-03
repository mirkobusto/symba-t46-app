"""The Data Collection File in the reader's language.

`app/data/dcf_terms.json` holds, for each language, the section titles and
descriptions, field labels and help, the labels of the enum values, a plain
reason for every activation predicate, and the fixed text of the Excel and
Word exports. The schema (`dcf_schema.json`, authoritative) is not touched:
its `*_en` text stays the traceable source, and the English entries here are
the same text with the developer notes taken out ("New first-class concept:
actors are not in the current Case model", raw predicates). The agent UX
round of 2026-11-02 found the whole DCF in English inside an Italian app,
with notes written for whoever built the software.
"""
from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.engine.dcf_compose import _LEGACY_ENUM_VALUES, DcfPayload

LANGUAGES = ("en", "it", "fr", "de", "es")


@lru_cache(maxsize=1)
def _terms() -> dict[str, Any]:
    path = Path(__file__).resolve().parents[1] / "data" / "dcf_terms.json"
    return json.loads(path.read_text(encoding="utf-8"))


def language(lang: str | None) -> str:
    """'it-IT' -> 'it'; anything unknown reads as English."""
    code = (lang or "en").split("-")[0].lower()
    return code if code in LANGUAGES else "en"


# values a field no longer offers but may still hold (see dcf_compose)
_RETIRED_LABELS = {
    "flow.type": ("waste", "by_product"),
    "cost.price_basis": ("gate_fee_paid", "gate_fee_received"),
    "actor.role": ("producer", "consumer"),
}


def ui(lang: str, key: str, **params: Any) -> str:
    table = _terms()[language(lang)]["ui"]
    text = table.get(key) or _terms()["en"]["ui"].get(key, key)
    return text.format(**params) if params else text


def enum_label(lang: str, value: Any) -> str:
    if value is None:
        return ""
    return _terms()[language(lang)]["enums"].get(str(value), str(value))


def ref_label(lang: str, ref: str | None, value: Any) -> str | None:
    """Label of a value from a questionnaire vocabulary (Q6a sector, Q5 who
    pays whom), as the app's own locale words it."""
    if value is None or not ref:
        return None
    return _terms()[language(lang)].get("enum_refs", {}).get(ref, {}).get(str(value))


def value_label(lang: str, field: Any, value: Any) -> Any:
    """What a cell shows for a stored value: the label of an enum value,
    the value itself otherwise."""
    if value is None:
        return None
    if getattr(field, "enum_values", None):
        return enum_label(lang, value)
    return ref_label(lang, getattr(field, "enum_ref", None), value) or value


def reason(lang: str, predicate: str | None) -> str | None:
    if not predicate or predicate == "always":
        return None
    text = _terms()[language(lang)]["reasons"].get(predicate)
    # "(Q2)", "(Q8 or Q6b)": the companies never saw the questionnaire, the
    # code said nothing to them (UX round 5, P2-06, P4-02, P6-07)
    return re.sub(r"\s*\(Q\d[^)]*\)", "", text) if text else text


def localize(payload: DcfPayload, lang: str | None) -> DcfPayload:
    """A copy of the payload with the reader-facing text filled in; the
    `*_en` fields stay as the schema has them."""
    code = language(lang)
    terms = _terms()[code]
    out = payload.model_copy(deep=True)
    for section in out.sections:
        text = terms["sections"].get(section.id, {})
        section.title = text.get("title", section.title_en)
        section.description = text.get("description", section.description_en)
        if section.id == "reference_scenario" and out.situation_c2:
            section.description = text.get("description_c2", section.description)
        elif out.costing_only and section.id in ("reference_scenario", "flow_classification"):
            # without an LCA the two sheets read as LCA leftovers: say why the
            # costing needs them (Fable D9, D4.2 §6.2, §6.3)
            section.description = text.get("description_costing_only", section.description)
        for field in section.fields:
            ftext = terms["fields"].get(field.id, {})
            field.label = ftext.get("label", field.label_en)
            field.help = ftext.get("description", field.description_en)
            field.reason = reason(code, field.activation_predicate)
            if (out.costing_only and field.reason
                    and "q3.env or q3.eco" in (field.activation_predicate or "")):
                field.reason = terms.get("ui", {}).get("reason.costing_only", field.reason)
            if field.enum_values:
                field.enum_labels = {v: enum_label(code, v) for v in field.enum_values}
                # a stored retired value is shown with its label, not as "—"
                # (Fable review of #206)
                for v in _RETIRED_LABELS.get(field.id, ()):
                    field.enum_labels.setdefault(v, enum_label(code, v))
            elif field.enum_ref and field.enum_ref in terms.get("enum_refs", {}):
                # the legacy sector values stay readable, but are not offered (UX round 4, P1-14)
                field.enum_labels = {k: v for k, v in terms["enum_refs"][field.enum_ref].items()
                                     if k not in _LEGACY_ENUM_VALUES}
    # the methodological choices: category, kind of item and the rule wording
    # in the reader's language (UX round 4, P1-04, P2-03); mandate statements
    # stay the deliverables' English text (owner decision R5)
    ui_terms = terms.get("ui", {})
    for item in out.obligations:
        item.category_label = ui_terms.get(f"cat.{item.category}", item.category.replace("_", " "))
        item.origin_label = ui_terms.get(f"origin.{item.origin}", item.origin)
        if item.origin == "rule":
            rule = (_rt_dict(code, "schema", "rule", item.id) or {})
            item.title = rule.get("name") or item.title
            item.statement = rule.get("body") or item.statement
        if not item.because:
            item.because = ui_terms.get("because.always")
    return out


def _rt_dict(lang: str, *keys: str) -> dict[str, Any] | None:
    node: Any = _report_terms().get(language(lang), {})
    for k in keys:
        node = node.get(k) if isinstance(node, dict) else None
    return node if isinstance(node, dict) else None


# The cover of the DCF printed the engine's English values ("ILCD Situation C1",
# "deactivated", "Analysis", "(national)") under translated labels (UX round
# 2026-11-03). They are worded with the app's own texts, which
# scripts/sync_report_terms.py copies into app/data/report_terms.json.
@lru_cache(maxsize=1)
def _report_terms() -> dict[str, Any]:
    path = Path(__file__).resolve().parents[1] / "data" / "report_terms.json"
    return json.loads(path.read_text(encoding="utf-8"))


def _rt(lang: str, *keys: str) -> str | None:
    node: Any = _report_terms().get(language(lang), {})
    for k in keys:
        node = node.get(k) if isinstance(node, dict) else None
    return node if isinstance(node, str) else None


def cover_value(lang: str, field: str, raw: str | None) -> str:
    """A value of the DCF cover in `lang`; the raw value when no wording exists."""
    if not raw:
        return "—"
    if field == "ilcd":
        return _rt(lang, "page", "situationBadge", raw.replace("ILCD Situation ", "")) or raw
    if field == "lcc":
        if raw == "deactivated":
            return _rt(lang, "docx", "none") or raw
        return _rt(lang, "page", "lccBadge", raw) or raw
    if field == "slca":
        return _rt(lang, "common", "yes" if raw == "active" else "no") or raw
    if field == "purpose":
        return _rt(lang, "options", "q0", raw.lower()) or raw
    if field == "market":
        m = re.match(r"^(.*?)\s*\(([^)]*)\)$", raw)
        if not m:
            return raw
        scope = _rt(lang, "options", "scope", m.group(2).replace("-", "_"))
        # the option label carries its own explanation in brackets: keep the name
        name = scope.split(" (")[0].lower() if scope else m.group(2)
        return f"{m.group(1)} ({name})".strip()
    return raw


def cover_rows(
    payload: Any,
    lang: str,
    config_rows: list[dict[str, str]] | None = None,
    case_ref: str | None = None,
    generated_on: str | None = None,
) -> list[tuple[str, str]]:
    """The cover of the workbook and of the companion document.

    It names the case by its readable id and the day it was generated (two
    files of two versions looked identical, UX round 5, P7-07), and states the
    configuration with the rows of the result page when the browser sends them
    (D7: reference scenario, horizon, functional unit, treatment of each flow),
    so the file and the screen say the same thing. Without them it falls back
    to the situation and costing badges; a costing-only study has no ILCD
    situation (P3-04). The schema version is gone: it read as "draft".
    """
    rows: list[tuple[str, str]] = [(ui(lang, "cover.case_id"), case_ref or payload.case_id)]
    if generated_on:
        rows.append((ui(lang, "cover.generated"), generated_on))
    # the situation is not among the result rows (it heads the result page):
    # name it here, or say there is none (Fable review of #206)
    situation = (
        (ui(lang, "cover.ilcd"), ui(lang, "cover.noIlcd")) if payload.costing_only
        else (ui(lang, "cover.ilcd"), cover_value(lang, "ilcd", payload.ilcd_situation))
    )
    if config_rows:
        # the result rows already carry the kind of study and the market (in
        # the reference scenario row): no second copy
        rows.append(situation)
        rows.extend((r["label"], r["value"]) for r in config_rows if r.get("label"))
        return rows
    rows.append((ui(lang, "cover.purpose"), cover_value(lang, "purpose", payload.study_purpose)))
    rows.append((ui(lang, "cover.market"), cover_value(lang, "market", payload.reference_market)))
    rows.append(situation)
    rows.append((ui(lang, "cover.lcc"), cover_value(lang, "lcc", payload.lcc_type)))
    rows.append((ui(lang, "cover.slca"), cover_value(lang, "slca", payload.slca_activation_state)))
    return rows


def offered_labels(field: Any, lang: str) -> list[str]:
    """The labels of the values a field offers. `enum_labels` also carries the
    labels of retired values, to show a stored one; the dropdowns, comments
    and the Word list only what is still offered (Fable review of #210)."""
    if field.enum_values:
        labels = field.enum_labels or {}
        return [labels.get(v) or enum_label(lang, v) for v in field.enum_values]
    return list((field.enum_labels or {}).values())
