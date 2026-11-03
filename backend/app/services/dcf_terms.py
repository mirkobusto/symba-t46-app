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
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.engine.dcf_compose import DcfPayload

LANGUAGES = ("en", "it", "fr", "de", "es")


@lru_cache(maxsize=1)
def _terms() -> dict[str, Any]:
    path = Path(__file__).resolve().parents[1] / "data" / "dcf_terms.json"
    return json.loads(path.read_text(encoding="utf-8"))


def language(lang: str | None) -> str:
    """'it-IT' -> 'it'; anything unknown reads as English."""
    code = (lang or "en").split("-")[0].lower()
    return code if code in LANGUAGES else "en"


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
    return _terms()[language(lang)]["reasons"].get(predicate)


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
        for field in section.fields:
            ftext = terms["fields"].get(field.id, {})
            field.label = ftext.get("label", field.label_en)
            field.help = ftext.get("description", field.description_en)
            field.reason = reason(code, field.activation_predicate)
            if field.enum_values:
                field.enum_labels = {v: enum_label(code, v) for v in field.enum_values}
            elif field.enum_ref and field.enum_ref in terms.get("enum_refs", {}):
                field.enum_labels = dict(terms["enum_refs"][field.enum_ref])
    return out
