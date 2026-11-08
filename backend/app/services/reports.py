"""The .docx case report (POST /api/pipeline/report).

The 12-paper batch script in backend/scripts/generate_validation_reports.py is
a separate generator with paper-specific sections; this one writes a user's
case, in the interface language, with the app's own translations
(app/data/report_terms.json, copied from the frontend locales and
i18n/schemaTerms.ts by scripts/sync_report_terms.py).

Since the round of 2026-11-08 the document is written to be sent (theme B of
that round): a cover that says which case it is, who prepared it and when; the
order a reader asks in (the answers, the configuration, the decision points,
the obligations grouped and short, the sector rules, the scenarios); no field
path, raw answer value or flow id in the body; the funding acknowledgement in
the reader's language; A4 pages numbered in the footer; and a technical
appendix, last and labelled, for the analyst. Some parts are worded by the
browser and sent with the request, so the document and the screen cannot
drift: the configuration rows, the sector rules in the reader's language and
what each scenario changes in the configuration and in its network. A bare
Case (scripts, older clients) still gets a whole report, with the sector rules
in English.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from datetime import UTC, datetime
from functools import lru_cache
from io import BytesIO
from pathlib import Path
from typing import Any

from docx import Document
from docx.document import Document as DocxDocument
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Mm, Pt

from app.domain.enums import Q4
from app.domain.models import Q3, Case
from app.services.dcf_terms import language, ui
from app.services.narrative import ActionItem, action_items, load_narrative

# A4 with 2 cm side margins: 17 cm of text width, shared by the tables.
_TEXT_WIDTH_CM = 17.0
# Rule families in the order of the result page (configurationRows.obligationGroups).
_FAMILIES = ("IR", "CIR", "FU", "B")
_QCODE = re.compile(r"^Q\d+[a-c]?\s+")


@lru_cache(maxsize=1)
def _terms() -> dict[str, Any]:
    path = Path(__file__).resolve().parents[1] / "data" / "report_terms.json"
    return json.loads(path.read_text(encoding="utf-8"))


def _lookup(lang: str, path: str) -> Any:
    node: Any = _terms()[language(lang)]
    for part in path.split("."):
        if not isinstance(node, dict) or part not in node:
            return None
        node = node[part]
    return node


def _t(lang: str, path: str, default: str | None = None, **params: Any) -> str:
    """i18next-style lookup in report_terms.json: {{name}} placeholders,
    English, then `default`, then the path itself as fallbacks."""
    text = _lookup(lang, path)
    if not isinstance(text, str):
        text = _lookup("en", path)
    if not isinstance(text, str):
        text = default if default is not None else path
    return re.sub(r"\{\{(\w+)\}\}", lambda m: str(params.get(m.group(1), m.group(0))), text)


def _schema(lang: str, kind: str, code: str) -> dict[str, str]:
    """Rule / CDP / block wording in `lang`, English when the table lacks it."""
    terms = _terms()
    table = terms.get(language(lang), terms["en"]).get("schema", {}).get(kind, {})
    return table.get(code) or terms["en"].get("schema", {}).get(kind, {}).get(code) or {}


def _format_q3(q3: Q3, lang: str = "en") -> str:
    parts = [_t(lang, f"options.q3.{d}") for d in ("env", "eco", "soc") if getattr(q3, d)]
    return " + ".join(parts) or _t(lang, "docx.none")


def _format_q4(q4: set[Q4], lang: str = "en") -> str:
    return "; ".join(_t(lang, f"options.q4.{q.value}", q.value) for q in sorted(q4, key=lambda x: x.value)) \
        or _t(lang, "docx.none")


def _yes_no(lang: str, value: bool) -> str:
    return _t(lang, "common.yes" if value else "common.no")


# ---------------------------------------------------------------------------
# The answers, in words
# ---------------------------------------------------------------------------

# Every question of the questionnaire, in its order; the ones in _CONDITIONAL
# are listed only when answered (they are asked only after some answers).
_QUESTIONS = ("Q0", "Q1", "Q2", "Q2b", "Q3", "Q4", "Q5", "Q6a", "Q6b", "Q7", "Q7b",
              "Q8a", "Q8b", "Q8c", "Q9", "Q9b", "Q10", "Q11", "Q12")
_CONDITIONAL = {"Q2b", "Q7b", "Q9b"}


def _question(lang: str, label: str, guided: bool) -> str:
    """The question's name; guided mode never shows the Q-codes."""
    text = _t(lang, f"docx.q.{label.lower()}")
    if guided:
        text = _QCODE.sub("", text)
        text = text[:1].upper() + text[1:]
    return text


def _answer(case: Case, label: str, lang: str) -> str | None:
    """The answer to one question in words, None when it was not given."""
    def option(group: str, value: Any) -> str | None:
        if value is None:
            return None
        raw = getattr(value, "value", value)
        return _t(lang, f"options.{group}.{raw}", str(raw))

    match label:
        case "Q0":
            return option("q0", case.study_purpose)
        case "Q1":
            return option("q1", case.q1)
        case "Q2":
            return option("q2", case.q2)
        case "Q2b":
            return None if case.network_long_standing is None else _yes_no(lang, case.network_long_standing)
        case "Q3":
            return _format_q3(case.q3, lang)
        case "Q4":
            return _format_q4(case.q4, lang)
        case "Q5":
            return "; ".join(f"{f.name or f.id}: {option('q5', f.q5)}" for f in case.flows) or None
        case "Q6a":
            return option("q6a", case.q6a)
        case "Q6b":
            return option("q6b", case.q6b)
        case "Q7":
            return option("q7", case.q7)
        case "Q7b":
            parts = [case.reference_market_region, option("scope", case.reference_market_scope)]
            return " — ".join(p for p in parts if p) or None
        case "Q8a":
            start = option("q8start", case.operating_start)
            if start and case.operating_start_year is not None:
                start += f" ({case.operating_start_year})"
            return start
        case "Q8b":
            return None if case.analysis_period_years is None else f"{case.analysis_period_years:g}"
        case "Q8c":
            return None if case.asset_lifetime_years is None else f"{case.asset_lifetime_years:g}"
        case "Q9":
            return option("q9", case.decision_context)
        case "Q9b":
            value = case.market_screening_documented
            return None if value is None else _yes_no(lang, value)
        case "Q10":
            return None if case.policy_objective is None else _yes_no(lang, case.policy_objective)
        case "Q11":
            return option("q11", case.comparison_goal)
        case "Q12":
            value = case.dedicated_shared_assets
            return None if value is None else _yes_no(lang, value)
    return None


def _why_here(case: Case, item: ActionItem, lang: str, guided: bool) -> str:
    """The answers that switch an obligation on, as "question: answer" in words
    (the report printed "Q3 = env + eco" and "Q12 = yes", UX round 2026-11-08)."""
    parts = []
    for label, _raw in item.answers:
        words = _answer(case, label, lang)
        if words:
            parts.append(f"{_question(lang, label, guided)}: {words}")
    return "; ".join(parts) or _t(lang, "docx.whyAlways")


# ---------------------------------------------------------------------------
# Layout helpers
# ---------------------------------------------------------------------------


class _Sections:
    """Numbered level-1 headings: the numbering runs from the first section,
    whichever sections the case has (it used to start half-way down)."""

    def __init__(self, doc: DocxDocument):
        self.doc = doc
        self.n = 0

    def add(self, title: str) -> None:
        self.n += 1
        self.doc.add_heading(f"{self.n}. {title}", level=1)


def _add_kv(doc: DocxDocument, key: str, value: str) -> None:
    p = doc.add_paragraph()
    p.add_run(f"{key}: ").bold = True
    p.add_run(value)


def _small(paragraph, text: str, italic: bool = False) -> None:
    run = paragraph.add_run(text)
    run.font.size = Pt(9)
    run.italic = italic


def _repeat_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    header = OxmlElement("w:tblHeader")
    header.set(qn("w:val"), "true")
    tr_pr.append(header)


def _table(doc: DocxDocument, widths: list[float], rows: list[list[str]], header: list[str] | None = None,
           bold_first: bool = False):
    """A table with proportional column widths (shares of the text width) and,
    when given, a header row repeated on every page."""
    table = doc.add_table(rows=0, cols=len(widths))
    table.style = "Table Grid"
    table.autofit = False
    cm = [Cm(_TEXT_WIDTH_CM * w) for w in widths]
    if header:
        cells = table.add_row().cells
        for cell, text in zip(cells, header, strict=True):
            cell.text = text
            cell.paragraphs[0].runs[0].bold = True
        _repeat_header(table.rows[0])
    for values in rows:
        cells = table.add_row().cells
        for i, (cell, text) in enumerate(zip(cells, values, strict=True)):
            cell.text = text
            if bold_first and i == 0 and cell.paragraphs[0].runs:
                cell.paragraphs[0].runs[0].bold = True
    for row in table.rows:
        for cell, width in zip(row.cells, cm, strict=True):
            cell.width = width
    return table


def _field(paragraph, instruction: str) -> None:
    """A Word field (PAGE, NUMPAGES) that Word fills in when it lays out the page."""
    field = OxmlElement("w:fldSimple")
    field.set(qn("w:instr"), instruction)
    run = OxmlElement("w:r")
    text = OxmlElement("w:t")
    text.text = "1"
    run.append(text)
    field.append(run)
    paragraph._p.append(field)


def _page_setup(doc: DocxDocument, lang: str, case_name: str | None) -> None:
    """A4, 2 cm side margins, and "<case> · page X of Y" in the footer
    (the pages were US Letter and unnumbered, UX round 2026-11-08, P8-08)."""
    for section in doc.sections:
        section.page_width, section.page_height = Mm(210), Mm(297)
        section.left_margin = section.right_margin = Cm(2)
        section.top_margin = section.bottom_margin = Cm(2.2)
        footer = section.footer.paragraphs[0]
        template = _t(lang, "docx.footer", case=case_name) if case_name else _t(lang, "docx.footerNoCase")
        for piece in re.split(r"(\{\{page\}\}|\{\{pages\}\})", template):
            if piece == "{{page}}":
                _field(footer, "PAGE")
            elif piece == "{{pages}}":
                _field(footer, "NUMPAGES")
            elif piece:
                _small(footer, piece)


def _properties(doc: DocxDocument, lang: str, title: str, author: str | None) -> None:
    """Title, author and dates of the file: the template's were "python-docx"
    and 2013 (UX round 2026-11-08, P8-01)."""
    props = doc.core_properties
    now = datetime.now(UTC).replace(microsecond=0)
    props.title = title
    props.subject = _t(lang, "docx.title")
    props.author = author or "SYMBA T4.6"
    props.last_modified_by = author or "SYMBA T4.6"
    props.comments = ""
    props.keywords = "SYMBA; industrial symbiosis; LCA; LCC; S-LCA"
    props.language = language(lang)
    props.category = ""
    props.revision = 1
    props.created = now
    props.modified = now


# ---------------------------------------------------------------------------
# The parts of the document
# ---------------------------------------------------------------------------


def _cover(doc: DocxDocument, lang: str, title: str, meta: dict[str, Any]) -> None:
    heading = doc.add_heading(title, level=0)
    heading.runs[0].font.size = Pt(22)
    rows: list[list[str]] = []
    if meta.get("case_name"):
        rows.append([_t(lang, "docx.cover.case"), str(meta["case_name"])])
    if meta.get("case_ref"):
        rows.append([_t(lang, "docx.cover.reference"), str(meta["case_ref"])])
    if meta.get("prepared_by"):
        rows.append([_t(lang, "docx.cover.preparedBy"), str(meta["prepared_by"])])
    if meta.get("contact"):
        rows.append([_t(lang, "docx.cover.contact"), str(meta["contact"])])
    generated = meta.get("generated_on") or datetime.now(UTC).date().isoformat()
    rows.append([_t(lang, "docx.cover.generatedOn"), str(generated)])
    state = meta.get("state")
    saved_on = meta.get("saved_on")
    if state in ("saved", "diverged", "unsaved"):
        key = state if state == "unsaved" or saved_on else f"{state}NoDate"
        rows.append([_t(lang, "docx.cover.answers"), _t(lang, f"docx.cover.{key}", date=saved_on)])
    _table(doc, [0.3, 0.7], rows, bold_first=True)
    about = doc.add_paragraph()
    about.paragraph_format.space_before = Pt(8)
    about.add_run(_t(lang, "docx.about")).italic = True


def _headline(case: Case, lang: str, guided: bool) -> tuple[str, str, list[str]]:
    """Title, sentence and badges of the verdict, as the result page builds them
    (resultNarrative.verdictFor / plainVerdict): a study with no LCA is headed
    by its costing, guided mode uses the plain titles of the public views."""
    lcc = case.lcc_type.value if case.lcc_type and case.lcc_type.value != "deactivated" else None
    lcc_badge = _t(lang, f"page.lccBadge.{lcc}", f"LCC {lcc}") if lcc else None
    if not case.q3.env and lcc:
        return (_t(lang, f"page.lccTitle.{lcc}", lcc), _t(lang, f"narrative.lcc.{lcc}.short", ""),
                [lcc_badge] if lcc_badge else [])
    if case.ilcd_situation is None:
        return (_t(lang, "docx.title"), "", [])
    situation = case.ilcd_situation.value
    letter = situation.replace("ILCD Situation ", "")
    badges = [b for b in (_t(lang, f"page.situationBadge.{letter}", situation), lcc_badge) if b]
    if guided:
        return (_t(lang, f"reader.verdict.{letter}.title", situation), _t(lang, f"reader.verdict.{letter}.body", ""),
                badges)
    return (_t(lang, f"narrative.ilcd.{situation}.title", situation),
            _t(lang, f"narrative.ilcd.{situation}.short", ""), badges)


def _summary(doc: DocxDocument, sections: _Sections, case: Case, lang: str, guided: bool) -> None:
    sections.add(_t(lang, "docx.sections.summary"))
    title, body, badges = _headline(case, lang, guided)
    lead = doc.add_paragraph()
    lead.add_run(title).bold = True
    if body:
        doc.add_paragraph(body)
    if badges and not guided:
        _small(doc.add_paragraph(), " · ".join(badges), italic=True)
    if case.blocked_by:
        doc.add_paragraph(_t(lang, "docx.blocked"))
        for code in case.blocked_by:
            term = _schema(lang, "block", code)
            p = doc.add_paragraph(style="List Bullet")
            p.add_run(term.get("name") or code).bold = True
            if term.get("body"):
                p.add_run(f": {term['body']}")
        return
    if guided:
        doc.add_heading(_t(lang, "guided.title"), level=2)
        doc.add_paragraph(_t(lang, "guided.lead"))
    rules, cdps = len(case.applicable_rules), len(case.cdp_flags)
    if rules or cdps:
        doc.add_paragraph(_t(lang, "docx.counts", obligations=rules, cdps=cdps))
    else:
        doc.add_paragraph(_t(lang, "docx.nextNone"))


def _answers(doc: DocxDocument, sections: _Sections, case: Case, lang: str, guided: bool) -> None:
    sections.add(_t(lang, "docx.sections.answers"))
    not_set = _t(lang, "docx.notSet")
    for label in _QUESTIONS:
        words = _answer(case, label, lang)
        if words is None and label in _CONDITIONAL:
            continue
        _add_kv(doc, _question(lang, label, guided), words or not_set)
        if label == "Q5":
            answered = [f for f in case.flows if f.sellable_elsewhere is not None or f.sector]
            if answered:
                _add_kv(doc, _question(lang, "Q5extra", guided), "; ".join(
                    f"{f.name or f.id}: "
                    f"{'—' if f.sellable_elsewhere is None else _yes_no(lang, f.sellable_elsewhere)}"
                    f" / {_t(lang, f'options.q6a.{f.sector.value}', f.sector.value) if f.sector else '—'}"
                    for f in answered))


def _note(lang: str, w: dict[str, Any], plain: bool = False) -> str:
    """An engine note in the reader's language, as the result page shows it
    (engineNotes.translateNote): guided mode takes the plain wording first."""
    p = w.get("params") or {}
    suffix = f"{w['code']}" + (f".{p['variant']}" if p.get("variant") else "")
    if plain:
        text = _lookup(lang, f"engineNotesPlain.{suffix}")
        if isinstance(text, str) and text:
            return re.sub(r"\{\{flow\}\}", str(p.get("flow", "")), text)

    def chapter(c: str | None) -> str | None:
        return _t(lang, f"chapters.{c.split(' ')[0]}", c) if c else None
    return _t(lang, f"engineNotes.{suffix}", w.get("message", ""), flow=p.get("flow"),
              configuration=p.get("configuration"), situation=p.get("situation"),
              chapter=chapter(p.get("chapter")), declared=chapter(p.get("declared")))


def _configuration(
    doc: DocxDocument, sections: _Sections, case: Case, lang: str, rows: list[dict[str, Any]], guided: bool,
    quotes: list[tuple[str, str]],
) -> None:
    """"Your configuration" as the page shows it, then what it means. The
    verdict's sentence is in the summary: the lead axis repeats only its detail
    (the same sentence was printed twice in a row, P1-08)."""
    sections.add(_t(lang, "page.configTitle"))
    if rows:
        table_rows = []
        for row in rows:
            value = str(row.get("value", ""))
            if row.get("why"):
                value += f"\n{_t(lang, 'page.why')} {row['why']}"
            table_rows.append([str(row.get("label", "")), value])
        _table(doc, [0.3, 0.7], table_rows, bold_first=True)

    narrative = load_narrative()
    lead_axis = "lcc" if not case.q3.env and case.lcc_type and case.lcc_type.value != "deactivated" else "ilcd"
    entries = [(axis, value.value) for axis, value in (
        ("ilcd", case.ilcd_situation), ("lcc", case.lcc_type), ("slca", case.slca_activation_state))
        if value is not None and value.value in narrative[axis]]
    if not entries:
        return
    doc.add_heading(_t(lang, "docx.meaning"), level=2)
    for axis, code in entries:
        row = narrative[axis][code]
        if axis != lead_axis:
            doc.add_paragraph().add_run(_t(lang, f"narrative.{axis}.{code}.short", row.get("short", ""))).bold = True
        detail = _t(lang, f"narrative.{axis}.{code}.detail", row.get("detail", ""))
        if detail:
            doc.add_paragraph(detail)
        if row.get("quote"):
            if guided:
                # the guided register keeps the body in one language (P3-04):
                # the deliverable's own words go to the appendix
                quotes.append((row["quote"], row.get("source", "")))
                continue
            quoted = doc.add_paragraph(style="Intense Quote")
            quoted.add_run(f"“{row['quote']}”").italic = True
            _small(doc.add_paragraph(), row.get("source", ""))


def _notes(doc: DocxDocument, sections: _Sections, case: Case, lang: str, guided: bool) -> None:
    # the sector chapters are a row of the configuration: the per-flow note would repeat it
    notes = [w for w in case.warnings if not (not case.blocked_by and w.get("code") == "flow_part2_chapter")]
    if not notes:
        return
    sections.add(_t(lang, "docx.notes"))
    for w in notes:
        doc.add_paragraph(_note(lang, w, guided), style="List Bullet")


def _cdp_resolution(case: Case, code: str, text: str, lang: str) -> str:
    """How a decision point is resolved, without the branch that does not
    apply to this case (CDP-01 spoke of Situation B in a case A, CDP-08 of
    Q4 = D when it was not chosen, CDP-09 of SSP/RCP with a present-day
    background: P5-04, P6-08, P7-24). The schema's text stays as is."""
    from app.engine.activate import needs_future_background

    situation = case.ilcd_situation.value if case.ilcd_situation else None
    if code == "CDP-01" and situation != "ILCD Situation B":
        return _t(lang, "docx.cdpCase.cdp01NotB")
    if code == "CDP-08" and Q4.D not in case.q4:
        return _t(lang, "docx.cdpCase.cdp08NoD")
    if code == "CDP-09" and not needs_future_background(case):
        return f"{text} {_t(lang, 'docx.cdpCase.cdp09Present')}".strip()
    return text


def _decisions(doc: DocxDocument, sections: _Sections, case: Case, items: list[ActionItem], lang: str) -> None:
    decisions = [i for i in items if i.kind == "decision"]
    if not decisions:
        return
    sections.add(_t(lang, "docx.sections.decisions"))
    doc.add_paragraph(_t(lang, "docx.decisionsLead"))
    for item in decisions:
        term = _schema(lang, "cdp", item.code)
        head = doc.add_paragraph()
        head.paragraph_format.keep_with_next = True
        head.add_run(term.get("name") or item.title).bold = True
        _small(head, f"  {item.code}")
        body = term.get("body") or item.detail
        if body:
            doc.add_paragraph(body)
        resolution = term.get("resolution") or next(
            (str(c.get("resolution_at_l3")) for c in case.cdp_flags
             if c.get("cdp_id") == item.code and c.get("resolution_at_l3")), "")
        if resolution:
            how = doc.add_paragraph()
            how.add_run(f"{_t(lang, 'page.resolution')}: ").italic = True
            how.add_run(_cdp_resolution(case, item.code, resolution, lang))


def _obligations(
    doc: DocxDocument, sections: _Sections, case: Case, items: list[ActionItem], lang: str, guided: bool,
) -> None:
    """Grouped as on the result page, one row each: name and code, what it
    asks, the answers that switch it on. The full statements, with who is
    responsible and their status, are in the Data Collection File; the fields
    each rule governs are in the appendix (P8-04, P8-06, B7)."""
    obligations = [i for i in items if i.kind == "obligation"]
    if not obligations:
        return
    sections.add(_t(lang, "docx.sections.obligations"))
    groups: dict[str, list[ActionItem]] = {}
    for item in obligations:
        family = item.code.split("-")[0]
        groups.setdefault(family if family in _FAMILIES else "other", []).append(item)
    ordered = [f for f in _FAMILIES if f in groups] + (["other"] if "other" in groups else [])
    summary = " · ".join(_t(lang, f"families.{f}", count=len(groups[f])) for f in ordered if f != "other")
    doc.add_paragraph(_t(lang, "docx.obligationsLead", count=len(obligations), groups=summary))
    header = [_t(lang, "docx.col.obligation"), _t(lang, "docx.col.asks"), _t(lang, "docx.col.why")]
    for family in ordered:
        if family != "other":
            title = _t(lang, f"families.{family}", count=len(groups[family]))
            doc.add_heading(title[:1].upper() + title[1:], level=2)
        rows = []
        for item in groups[family]:
            term = _schema(lang, "rule", item.code)
            name = term.get("name") or item.title
            body = _t(lang, "docx.ruleBodyB07") if item.code == "B-07" else (term.get("body") or item.detail)
            rows.append([f"{name} ({item.code})", body, _why_here(case, item, lang, guided)])
        _table(doc, [0.28, 0.44, 0.28], rows, header=header, bold_first=True)


def _sector_rules(
    doc: DocxDocument, sections: _Sections, case: Case, lang: str, sector: list[dict[str, Any]] | None,
) -> None:
    """The D4.1 Part 2 rules of the chapters the case touches. The browser sends
    them in the reader's language, as the page shows them (P3-03); without it
    the statements stay in English. The line numbers are left out: the section
    is the reference a reader can follow."""
    if not case.sector_rules:
        return
    sections.add(_t(lang, "sector.title"))
    doc.add_paragraph(_t(lang, "sector.lead"))
    chapters = sector if sector else _sector_fallback(case, lang)
    for chapter in chapters:
        doc.add_heading(str(chapter.get("chapter", "")), level=2)
        if chapter.get("reason"):
            _small(doc.add_paragraph(), str(chapter["reason"]), italic=True)
        for rule in chapter.get("rules") or []:
            p = doc.add_paragraph(style="List Bullet")
            p.add_run(f"{rule.get('strength', '')}: ").bold = True
            p.add_run(str(rule.get("text", "")))
            if rule.get("source"):
                _small(p, f" ({rule['source']})")
            if rule.get("note"):
                _small(p, f" {rule['note']}", italic=True)


def _sector_fallback(case: Case, lang: str) -> list[dict[str, Any]]:
    chapters: dict[str, dict[str, Any]] = {}
    for r in case.sector_rules:
        chapter = r["chapter"]
        if chapter not in chapters:
            reasons = ", ".join(_t(lang, "sector.byFlow", name=a["name"]) if a["kind"] == "flow"
                                else _t(lang, "sector.byCaseSector") for a in r["activated_by"])
            chapters[chapter] = {"chapter": _t(lang, f"chapters.{chapter.split(' ')[0]}", chapter),
                                 "reason": _t(lang, "sector.activatedBy", reasons=reasons), "rules": []}
        chapters[chapter]["rules"].append({
            "strength": _t(lang, f"sector.strength.{r['strength']}", r["strength"]),
            "text": r["statement"], "source": r.get("source"), "note": r.get("note"),
        })
    return list(chapters.values())


def _scenario_runs(case: Case) -> list[tuple[Any, Case | None, str | None]]:
    """Each scenario of the case run as the comparison page runs it."""
    from app.engine.pipeline import run as pipeline_run
    from app.routers.pipeline import _apply_overrides, _scenario_error

    runs: list[tuple[Any, Case | None, str | None]] = []
    base = case.model_copy(update={"alternative_scenarios": []})
    for scenario in case.alternative_scenarios:
        try:
            runs.append((scenario, pipeline_run(_apply_overrides(base, scenario.overrides)), None))
        except ValueError as exc:
            runs.append((scenario, None, _scenario_error(exc)))
    return runs


def _answer_changes(base: Case, other: Case, lang: str, guided: bool) -> list[str]:
    lines = []
    for label in _QUESTIONS:
        if label == "Q5":
            continue
        before, after = _answer(base, label, lang), _answer(other, label, lang)
        if before != after:
            lines.append(_t(lang, "docx.scenario.change", label=_question(lang, label, guided),
                            before=before or _t(lang, "docx.notSet"), after=after or _t(lang, "docx.notSet")))
    was = {f.id: f.q5 for f in base.flows}
    for f in other.flows:
        if f.id in was and was[f.id] != f.q5:
            lines.append(_t(lang, "docx.scenario.change",
                            label=_t(lang, "docx.scenario.flowQ5", flow=f.name or f.id),
                            before=_t(lang, f"options.q5.{was[f.id].value}"),
                            after=_t(lang, f"options.q5.{f.q5.value}")))
    return lines


def _scenarios(
    doc: DocxDocument, sections: _Sections, case: Case, lang: str, guided: bool,
    sent: list[dict[str, Any]] | None,
) -> None:
    """Each scenario with what it changes: the answers, the ILCD situation, the
    obligations (computed here), the configuration rows and the network (sent
    by the browser, worded as the comparison page words them). The report
    listed the scenarios as "flow_q5 = f1: b; fmw7pwkwe: c" (P8-04, P1-08)."""
    if not case.alternative_scenarios:
        return
    sections.add(_t(lang, "docx.sections.scenarios"))
    doc.add_paragraph(_t(lang, "docx.scenario.lead"))
    by_id = {str(s.get("id")): s for s in sent or []}
    base_rules = {r["rule_id"] for r in case.applicable_rules}
    for scenario, result, error in _scenario_runs(case):
        doc.add_heading(scenario.label or scenario.id, level=2)
        if error or result is None:
            doc.add_paragraph(_t(lang, "docx.scenario.error", error=error or "—"))
            continue
        answers = _answer_changes(case, result, lang, guided)
        doc.add_paragraph().add_run(_t(lang, "docx.scenario.answers")).bold = True
        for line in answers or [_t(lang, "docx.scenario.noAnswer")]:
            doc.add_paragraph(line, style="List Bullet")

        effects = []
        before, after = _headline(case, lang, guided)[0], _headline(result, lang, guided)[0]
        if before != after:
            effects.append(_t(lang, "docx.scenario.change", label=_t(lang, "docx.scenario.situation"),
                              before=before, after=after))
        effects.extend(str(line) for line in (by_id.get(scenario.id) or {}).get("config") or [])
        sc_rules = {r["rule_id"] for r in result.applicable_rules}

        def named(codes: set[str]) -> str:
            return "; ".join(f"{_schema(lang, 'rule', c).get('name') or c} ({c})" for c in sorted(codes))
        if sc_rules - base_rules:
            effects.append(_t(lang, "docx.scenario.added", list=named(sc_rules - base_rules)))
        if base_rules - sc_rules:
            effects.append(_t(lang, "docx.scenario.removed", list=named(base_rules - sc_rules)))
        doc.add_paragraph().add_run(_t(lang, "docx.scenario.effects")).bold = True
        for line in effects or [_t(lang, "docx.scenario.same")]:
            doc.add_paragraph(line, style="List Bullet")

        network = (by_id.get(scenario.id) or {}).get("network") or []
        if network:
            doc.add_paragraph().add_run(_t(lang, "docx.scenario.network")).bold = True
            for line in network:
                doc.add_paragraph(str(line), style="List Bullet")


def _acknowledgement(doc: DocxDocument, lang: str) -> None:
    doc.add_heading(ui(lang, "dx.ack"), level=1)
    doc.add_paragraph().add_run(_t(lang, "eu.fundingStatement")).italic = True
    _small(doc.add_paragraph(), _t(lang, "eu.disclaimer"), italic=True)


def _appendix(doc: DocxDocument, case: Case, lang: str, quotes: list[tuple[str, str]]) -> None:
    """For the analyst, last and labelled: the deliverable passages quoted in
    English (guided mode), the engine fields each obligation governs, the
    activated nodes and the advanced settings. The engine's output key by key
    is in the case file (.json): it carried flow ids and dated notes (P3-05)."""
    doc.add_heading(_t(lang, "docx.appendix.title"), level=1)
    doc.add_paragraph(_t(lang, "docx.appendix.lead"))
    if quotes:
        doc.add_heading(_t(lang, "docx.appendix.quotes"), level=2)
        for quote, source in quotes:
            p = doc.add_paragraph(style="Intense Quote")
            p.add_run(f"“{quote}”").italic = True
            _small(doc.add_paragraph(), source)
    fielded = [r for r in case.applicable_rules if r.get("fields")]
    if fielded:
        doc.add_heading(_t(lang, "docx.appendix.fields"), level=2)
        _table(doc, [0.15, 0.85], [[str(r["rule_id"]), ", ".join(r["fields"])] for r in fielded])
    doc.add_heading(_t(lang, "docx.appendix.nodes"), level=2)
    grouped: dict[str, list[str]] = {}
    for nid in case.activated_nodes:
        grouped.setdefault(nid.split("_")[0], []).append(nid)
    counts = Counter({k: len(v) for k, v in grouped.items()})
    _add_kv(doc, _t(lang, "docx.appendix.countsByPrefix"), ", ".join(f"{k}={n}" for k, n in counts.most_common())
            or _t(lang, "docx.none"))
    for prefix in sorted(grouped):
        p = doc.add_paragraph()
        p.add_run(f"{prefix} ({len(grouped[prefix])}): ").bold = True
        _small(p, ", ".join(grouped[prefix]))
    if case.advanced:
        doc.add_heading(_t(lang, "docx.appendix.advanced"), level=2)
        doc.add_paragraph(", ".join(f"{k} = {v}" for k, v in case.advanced.items()))


def generate_case_report_bytes(
    case: Case,
    title: str | None = None,
    lang: str = "en",
    rows: list[dict[str, Any]] | None = None,
    *,
    meta: dict[str, Any] | None = None,
    sector: list[dict[str, Any]] | None = None,
    scenarios: list[dict[str, Any]] | None = None,
    guided: bool = False,
) -> bytes:
    """Build the .docx for `case` (assumed already pipeline-run) in `lang`.

    `rows` are the result page's configuration rows, `meta` the cover (case
    name and reference, prepared by, contact, dates and state of the answers,
    already formatted for `lang`), `sector` the Part 2 rules worded by the
    page, `scenarios` what each scenario changes in the configuration rows and
    in its network ({id, config: [...], network: [...]}); `guided` writes the
    plain register of guided mode. All are optional."""
    meta = meta or {}
    case_name = (meta.get("case_name") or "").strip() or None
    doc_title = title or (_t(lang, "docx.titleWithCase", name=case_name) if case_name else _t(lang, "docx.title"))

    doc = Document()
    doc.styles["Normal"].font.size = Pt(10.5)
    _page_setup(doc, lang, case_name)
    _properties(doc, lang, doc_title, (meta.get("prepared_by") or "").strip() or None)

    _cover(doc, lang, doc_title, meta)
    sections = _Sections(doc)
    quotes: list[tuple[str, str]] = []
    items = action_items(case)
    _summary(doc, sections, case, lang, guided)
    _answers(doc, sections, case, lang, guided)
    if not case.blocked_by:
        _configuration(doc, sections, case, lang, rows or [], guided, quotes)
    _notes(doc, sections, case, lang, guided)
    _decisions(doc, sections, case, items, lang)
    _obligations(doc, sections, case, items, lang, guided)
    _sector_rules(doc, sections, case, lang, sector)
    _scenarios(doc, sections, case, lang, guided, scenarios)
    _acknowledgement(doc, lang)
    _appendix(doc, case, lang, quotes)

    buf = BytesIO()
    doc.save(buf)
    return buf.getvalue()
