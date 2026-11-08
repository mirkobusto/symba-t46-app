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
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.engine.dcf_compose import _LEGACY_ENUM_VALUES, RETIRED_VALUE_MAP, DcfPayload

LANGUAGES = ("en", "it", "fr", "de", "es")

# One order for the sheets of the workbook and the sections of the Word
# document: the companies' sheets first, the analyst's last (UX round 6,
# P2-09, P8-07). The network diagram comes right after the instructions.
COMPANY_SECTIONS = ["actors", "flow_matrix", "reference_scenario", "logistics", "costs", "infrastructure"]
ANALYST_SECTIONS = ["flow_classification"]
DATA_SECTION_ORDER = [*COMPANY_SECTIONS, *ANALYST_SECTIONS]


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


def count(lang: str, key: str, n: int) -> str:
    """"1 flow" / "3 flows": `n.<key>_one` and `n.<key>_other` ("actor(s)"
    read as a form letter, UX round 6, P8-17, P2-17)."""
    return ui(lang, f"n.{key}_{'one' if n == 1 else 'other'}", n=n)


def fmt_date(lang: str, value: str | date | None) -> str | None:
    """"8 November 2026" / "8 novembre 2026" / "8. November 2026" instead of
    the ISO date in a file written for a company (UX round 6, P8-17)."""
    if value is None or value == "":
        return None
    try:
        d = value if isinstance(value, date) else date.fromisoformat(str(value)[:10])
    except ValueError:
        return str(value)
    months = ui(lang, "date.months").split(",")
    return ui(lang, "date.format", d=d.day, month=months[d.month - 1], y=d.year)


def quoted(lang: str, text: str) -> str:
    """A sheet or field name between the quotes of the language."""
    marks = {"en": ("“", "”"), "it": ("«", "»"), "fr": ("« ", " »"), "de": ("„", "“"), "es": ("«", "»")}
    o, c = marks[language(lang)]
    return f"{o}{text}{c}"


def enum_label(lang: str, value: Any) -> str:
    if value is None:
        return ""
    return _terms()[language(lang)]["enums"].get(str(value), str(value))


def method_label(lang: str, method: str | None) -> str:
    """The method column in the deliverables' acronyms: "S-LCA", not the
    pillar key "SLCA" (UX round 6, P2-17); "between the methods" for a rule
    that spans them."""
    if not method:
        return ""
    if method == "cross-method":
        return ui(lang, "method.cross")
    return method.replace("SLCA", "S-LCA")


def retired_value(field_id: str, value: Any) -> str | None:
    """The value a stored retired one reads as in the files, or None when the
    value is current (UX round 6, P2-02, P8-10)."""
    if not isinstance(value, str):
        return None
    return RETIRED_VALUE_MAP.get(field_id, {}).get(value)


def only_when(section: Any, field: Any, lang: str) -> str | None:
    """"Only for rows with Status: new / replaced" for a field asked on some
    rows only (DcfFieldDescriptor.row_condition_values); None otherwise."""
    values = getattr(field, "row_condition_values", None)
    if values is None:
        return None
    ref = next((f for f in section.fields if f.id == field.row_condition_field), None)
    name = (ref.label or ref.label_en) if ref else field.row_condition_field
    labels = (ref.enum_labels or {}) if ref else {}
    shown = " / ".join(labels.get(v) or enum_label(lang, v) for v in values) or "—"
    return f"{ui(lang, 'note.only_when')} {name}: {shown}."


def ref_label(lang: str, ref: str | None, value: Any) -> str | None:
    """Label of a value from a questionnaire vocabulary (Q6a sector, Q5 who
    pays whom), as the app's own locale words it."""
    if value is None or not ref:
        return None
    return _terms()[language(lang)].get("enum_refs", {}).get(ref, {}).get(str(value))


def value_label(lang: str, field: Any, value: Any) -> Any:
    """What a cell shows for a stored value: the label of an enum value (the
    field's own wording when it has one, "bassa" for a reliability), the value
    itself otherwise."""
    if value is None:
        return None
    if getattr(field, "enum_values", None):
        labels = getattr(field, "enum_labels", None) or {}
        return labels.get(str(value)) or enum_label(lang, value)
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
            field.label_base = ftext.get("label_base")
            field.help = ftext.get("description", field.description_en)
            field.reason = reason(code, field.activation_predicate)
            if (out.costing_only and field.reason
                    and "q3.env or q3.eco" in (field.activation_predicate or "")):
                field.reason = terms.get("ui", {}).get("reason.costing_only", field.reason)
            if field.enum_values:
                # the field's own wording first: "bassa" for a reliability,
                # "basso" for a contamination level (UX round 6, P2-17)
                own = ftext.get("values", {})
                field.enum_labels = {v: own.get(v) or enum_label(code, v) for v in field.enum_values}
                # a stored retired value is shown with its label, not as "—"
                # (Fable review of #206); only the current ones are offered
                for v in RETIRED_VALUE_MAP.get(field.id, {}):
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
        item.because = worded_because(code, item.because) if item.because else ui_terms.get("because.always")
    for item in out.decision_points:
        cdp = _rt_dict(code, "schema", "cdp", item.id) or {}
        item.category_label = ui(code, "cat.decision_points")
        item.origin_label = ui(code, "origin.decision_point")
        item.title = cdp.get("name") or item.title
        item.statement = cdp.get("body") or item.statement
        item.resolution = cdp.get("resolution") or item.resolution
        methods = [method_label(code, m) for m in item.method.split(" + ")]
        listed = (f"{', '.join(methods[:-1])} {ui(code, 'mc.and')} {methods[-1]}" if len(methods) > 1
                  else methods[0])
        item.because = ui(code, "mc.cdp_because", methods=listed)
    for item in out.sector_rules:
        item.category_label = ui(code, "cat.sector_rules")
        item.origin_label = ui(code, "origin.sector_rule")
        chapter = (item.title or "").split(" ")[0]
        item.title = _rt(code, "chapters", chapter) or item.title
        reasons = [ui(code, "mc.because_flow", name=part[5:]) if part.startswith("flow:")
                   else ui(code, "mc.because_case") for part in (item.because or "").split("; ") if part]
        item.because = ", ".join(reasons) or ui_terms.get("because.always")
    return out


_ANSWER = re.compile(r"(Q\d+[a-z]?) = ")


def worded_because(lang: str, text: str) -> str:
    """"Q3 = env + eco + soc, Q12 = yes, Q8b = 20 y" with the questions and the
    answers in the reader's words: "Q3 dimensioni: Ambientale (LCA) + …,
    Q12 beni dedicati e condivisi: sì, Q8b periodo di analisi (anni): 20 anni"
    (UX round 6, P2-17). The letters of who pays whom stay as the file's own
    column has them; anything not recognised stays as it was."""
    parts = _ANSWER.split(text)
    if len(parts) < 3:
        return text
    out = []
    for code, value in zip(parts[1::2], parts[2::2], strict=True):
        value = value.strip().rstrip(",").strip()
        key = code.lower()
        label = _rt(lang, "docx", "q", key) or code
        options = _rt_dict(lang, "options", key) or {}
        if key == "q3":
            shown = " + ".join(options.get(v, v) for v in value.split(" + "))
        elif key == "q4":
            shown = ", ".join(options.get(v.strip(), v.strip()) for v in value.split(","))
        elif value in ("yes", "no"):
            shown = _rt(lang, "common", value) or value
        elif re.fullmatch(r"[\d.]+ y", value):
            shown = f"{value[:-2]} {ui(lang, 'unit.years')}"
        else:
            shown = options.get(value, value)
        out.append(f"{label}: {shown}")
    return "; ".join(out)


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


def config_rows(
    payload: Any,
    lang: str,
    rows: list[dict[str, str]] | None = None,
) -> list[tuple[str, str]]:
    """The configuration of the study, for whoever carries it out: the rows
    of the result page when the browser sends them (D7), so the file and the
    screen say the same thing, else the situation and costing badges. It
    used to open the cover, where the companies met "Multifunctionality" and
    "ILCD situation" before what was asked of them (UX round 6, P8-02, P2-09);
    it now heads the analyst's checklist. A costing-only study has no ILCD
    situation (P3-04)."""
    situation = (
        (ui(lang, "cover.ilcd"), ui(lang, "cover.noIlcd")) if payload.costing_only
        else (ui(lang, "cover.ilcd"), cover_value(lang, "ilcd", payload.ilcd_situation))
    )
    if rows:
        # the result rows already carry the kind of study and the market (in
        # the reference scenario row): no second copy
        return [situation, *((r["label"], r["value"]) for r in rows if r.get("label"))]
    return [
        (ui(lang, "cover.purpose"), cover_value(lang, "purpose", payload.study_purpose)),
        (ui(lang, "cover.market"), cover_value(lang, "market", payload.reference_market)),
        situation,
        (ui(lang, "cover.lcc"), cover_value(lang, "lcc", payload.lcc_type)),
        (ui(lang, "cover.slca"), cover_value(lang, "slca", payload.slca_activation_state)),
    ]


def sheet_name(lang: str, section_id: str) -> str:
    return ui(lang, f"sheet.{section_id}")


def recipient_cover_rows(payload: Any, lang: str, cover: dict[str, Any], case_title: str | None) -> list[tuple[str, str]]:
    """The cover written for the company that receives the file (UX round 6,
    P8-02, P2-09, P2-19): which case, its reference, the version and date,
    the date to return it by and to whom, that it is confidential, what we
    ask, and the scenarios the projected quantities are asked for. The same
    whether the file comes from a saved case or a draft (P8-16)."""
    rows: list[tuple[str, str]] = []
    if case_title:
        rows.append((ui(lang, "cover.case"), case_title))
    rows.append((ui(lang, "cover.ref"), cover.get("case_ref") or payload.case_id[:8]))
    generated = fmt_date(lang, cover.get("generated_on"))
    version = (cover.get("version") or "").strip()
    if version:
        rows.append((ui(lang, "cover.version"), ui(lang, "cover.version_value", version=version, date=generated or "")))
    elif generated:
        rows.append((ui(lang, "cover.generated"), generated))
    return_by = fmt_date(lang, cover.get("return_by"))
    if return_by:
        rows.append((ui(lang, "ins.return_by"), return_by))
    contact = (cover.get("contact") or "").strip()
    if contact:
        rows.append((ui(lang, "ins.contact"), f"{contact} ({ui(lang, 'ins.contact_note')})"))
    rows.append((ui(lang, "cover.conf"), ui(lang, "cover.conf_value")))
    active = {s.id for s in payload.sections if s.active}
    sheets = ", ".join(sheet_name(lang, s) for s in COMPANY_SECTIONS if s in active)
    rows.append((ui(lang, "cover.ask"), ui(lang, "cover.ask_value", sheets=sheets,
                                            instructions=sheet_name(lang, "instructions"))))
    scenarios = [label for _, label in cover.get("scenarios") or []]
    if scenarios:
        rows.append((ui(lang, "cover.scenarios"), ui(
            lang, "cover.scenarios_value", names=", ".join(quoted(lang, s) for s in scenarios),
            instructions=sheet_name(lang, "instructions"))))
    return rows


def scenario_changes(lang: str, data: Any, scenarios: list[tuple[str, str]] | None) -> list[tuple[str, list[str]]]:
    """(label, what its own network changes, in words) for every scenario of
    the case, in the questionnaire's order; an empty list when the scenario
    has no network of its own (scenario networks, owner OK 2026-11-04)."""
    from app.engine.dcf_rows import network_diff, rows_for

    own = getattr(data, "networks_by_scenario", None) or {}
    actors, flows = rows_for(data, "actors"), rows_for(data, "flow_matrix")
    out = []
    for sid, label in scenarios or []:
        variant = own.get(sid)
        if variant is None:
            out.append((label, []))
            continue
        diff = network_diff(actors, flows, variant.rows_by_section.get("actors", []),
                            variant.rows_by_section.get("flow_matrix", []))
        lines = (
            [ui(lang, "dx.s2_sc_actor_added", **x) for x in diff["actors_added"]]
            + [ui(lang, "dx.s2_sc_actor_removed", **x) for x in diff["actors_removed"]]
            + [ui(lang, "dx.s2_sc_actor_renamed", **x) for x in diff["actors_renamed"]]
            + [ui(lang, "dx.s2_sc_flow_rerouted", **x) for x in diff["flows_rerouted"]]
            + [ui(lang, "dx.s2_sc_flow_dropped", **x) for x in diff["flows_dropped"]]
            + [ui(lang, "dx.s2_sc_flow_only_here", **x) for x in diff["flows_only_in_scenario"]]
            + [ui(lang, "dx.s2_sc_value", flow=x["flow"],
                  field=ui(lang, "dx.s2_sc_field." + x["field"].removeprefix("flow.")),
                  before="—" if x["before"] in (None, "") else x["before"],
                  after="—" if x["after"] in (None, "") else x["after"]) for x in diff["value_changes"]]
        )
        out.append((label, lines or [ui(lang, "dx.s2_sc_same")]))
    return out


def offered_labels(field: Any, lang: str) -> list[str]:
    """The labels of the values a field offers. `enum_labels` also carries the
    labels of retired values, to show a stored one; the dropdowns, comments
    and the Word list only what is still offered (Fable review of #210)."""
    if field.enum_values:
        labels = field.enum_labels or {}
        return [labels.get(v) or enum_label(lang, v) for v in field.enum_values]
    return list((field.enum_labels or {}).values())
