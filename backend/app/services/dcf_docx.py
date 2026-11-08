"""DCF docx writer — render a DcfPayload to a Word document.

The companion of the Excel workbook, written for the company that receives
it and in the same order (UX round 6, P8-02, P8-07): the cover says which
case, what we ask, by when and to whom; §1 how to fill in the workbook, §2
the network, §3 every column in the order of the sheets; Annex A is for
whoever carries out the study (the configuration and a pointer to the
checklist sheet, which is the one full list: the 60-120 rows were repeated
in three files, B7 / P8-06); the project data and the EU acknowledgement, in
the reader's language, close it. A4, with the case and the page number in
the footer (P8-08).

This is a *companion* to `services/reports.py` (the case report); the two
are separate downloads.
"""
from __future__ import annotations

from datetime import UTC, datetime
from io import BytesIO
from typing import Any

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Mm, Pt, RGBColor

from app.domain.dcf_data import DcfData
from app.engine.dcf_compose import DcfPayload
from app.engine.dcf_rows import actor_label, edge_list, rows_for, scenario_networks
from app.services.dcf_terms import (
    DATA_SECTION_ORDER,
    _terms,
    config_rows,
    count,
    enum_label,
    fmt_date,
    offered_labels,
    only_when,
    quoted,
    recipient_cover_rows,
    ref_label,
    retired_value,
    scenario_changes,
    sheet_name,
    ui,
)

# The English wording; the document carries the one of its language (P8-09).
EU_FOOTER = (
    "This Project has received funding from the European Union's Horizon "
    "Research and Innovation Programme under Grant Agreement N. 101135562 — "
    "www.symbaproject.eu"
)

EU_DISCLAIMER = (
    "Funded by the European Union. Views and opinions expressed are however "
    "those of the author(s) only and do not necessarily reflect those of the "
    "European Union. Neither the European Union nor the European Research "
    "Executive Agency can be held responsible for them."
)

PROJECT_TITLE = (
    "Securing local supplY chains via the development of new Methods to "
    "assess the circularity and symbiosis of the Bio-bAsed industrial "
    "ecosystem enhancing the EU competitiveness and resource independence."
)

# The website heading colour (--dd-navy in the app), white-on-navy contrast above 10:1.
SYMBA_NAVY = RGBColor(0x29, 0x36, 0x4E)
# the text width of an A4 page with 2 cm margins
_TEXT_CM = 17.0


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def generate_dcf_docx_bytes(
    payload: DcfPayload,
    case_title: str | None = None,
    data: DcfData | None = None,
    lang: str = "en",
    cover: dict[str, Any] | None = None,
) -> bytes:
    """Render a DCF docx from a DcfPayload and return the bytes.

    When `data` carries a network drawn in the app, §2 reports the actual
    actors and flows instead of describing what the diagram would show.
    `cover` is the one the Excel workbook takes (dcf_excel.render_xlsx).
    """
    cover = cover or {}
    doc = Document()
    doc.styles["Normal"].font.size = Pt(11)
    _page_setup(doc, case_title, lang)
    _properties(doc, case_title, lang)

    _write_cover_block(doc, payload, case_title, lang, cover)
    _write_instructions_section(doc, payload, data, lang, cover)
    _write_network_section(doc, payload, data, lang, cover.get("network_png"), cover.get("scenarios"))
    _write_field_reference_section(doc, payload, lang, cover.get("scenarios") or [])
    _write_analyst_annex(doc, payload, lang, cover)
    _write_project_data(doc, lang)
    _write_eu_closing(doc, lang)

    buf = BytesIO()
    doc.save(buf)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Page and helpers
# ---------------------------------------------------------------------------


def _page_setup(doc: Document, case_title: str | None, lang: str) -> None:
    """A4 with 2 cm margins (python-docx starts on US Letter), and a footer
    with the case and "page X of Y" (P8-08)."""
    section = doc.sections[0]
    section.page_width, section.page_height = Mm(210), Mm(297)
    for side in ("left_margin", "right_margin", "top_margin", "bottom_margin"):
        setattr(section, side, Cm(2))
    para = section.footer.paragraphs[0]
    run = para.add_run(f"{case_title} · " if case_title else "")
    run.font.size = Pt(8)
    para.add_run(f"{ui(lang, 'dx.footer_page')} ").font.size = Pt(8)
    _field(para, "PAGE")
    para.add_run(f" {ui(lang, 'dx.footer_of')} ").font.size = Pt(8)
    _field(para, "NUMPAGES")


def _field(paragraph, instr: str) -> None:
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), instr)
    run = OxmlElement("w:r")
    rpr = OxmlElement("w:rPr")
    size = OxmlElement("w:sz")
    size.set(qn("w:val"), "16")
    rpr.append(size)
    run.append(rpr)
    text = OxmlElement("w:t")
    text.text = "1"
    run.append(text)
    fld.append(run)
    paragraph._p.append(fld)


def _properties(doc: Document, case_title: str | None, lang: str) -> None:
    """Title, author and dates of the file: it said "python-docx", 2013 (P8-01)."""
    props = doc.core_properties
    props.title = f"{ui(lang, 'dx.title')} · {case_title}" if case_title else ui(lang, "dx.title")
    props.author = "SYMBA T4.6"
    props.last_modified_by = "SYMBA T4.6"
    props.comments = ""
    props.subject = "SYMBA T4.6 Data Collection File"
    now = datetime.now(UTC).replace(tzinfo=None)
    props.created = now
    props.modified = now


def _table(doc: Document, widths_cm: list[float], header: list[str] | None = None, style: str | None = None):
    table = doc.add_table(rows=1 if header else 0, cols=len(widths_cm))
    if style:
        table.style = style
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    if header:
        for i, text in enumerate(header):
            cell = table.rows[0].cells[i]
            cell.text = text
            for run in cell.paragraphs[0].runs:
                run.bold = True
    table._widths = widths_cm  # applied by _fix_widths once filled
    return table


def _fix_widths(table) -> None:
    """Proportional column widths: every table had equal columns, the long
    text squeezed into 2.5 cm (P8-08)."""
    widths = getattr(table, "_widths", None)
    if not widths:
        return
    for row in table.rows:
        for cell, w in zip(row.cells, widths, strict=False):
            cell.width = Cm(w)


def _kv_table(doc: Document, rows: list[tuple[str, str]]) -> None:
    table = _table(doc, [5.0, _TEXT_CM - 5.0])
    for label, value in rows:
        cells = table.add_row().cells
        cells[0].text = label
        for run in cells[0].paragraphs[0].runs:
            run.bold = True
        cells[1].text = str(value)
    _fix_widths(table)


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------


def _write_cover_block(
    doc: Document, payload: DcfPayload, case_title: str | None, lang: str, cover: dict[str, Any],
) -> None:
    """The title says what the document is and for which case (it held only
    the case name, P8-07); the cover is the recipient's (P8-02)."""
    title = f"{ui(lang, 'dx.title')} · {case_title}" if case_title else ui(lang, "dx.title")
    heading = doc.add_heading(title, level=0)
    heading.runs[0].font.size = Pt(20)
    heading.runs[0].font.color.rgb = SYMBA_NAVY

    para = doc.add_paragraph()
    run = para.add_run(ui(lang, "dx.intro"))
    run.italic = True

    doc.add_heading(ui(lang, "dx.cover"), level=1)
    _kv_table(doc, recipient_cover_rows(payload, lang, cover, case_title))


_INSTRUCTION_KEYS = ["what", "how", "grey", "ids", "unknown", "units", "conf", "return"]


def _write_instructions_section(
    doc: Document, payload: DcfPayload, data: DcfData | None, lang: str, cover: dict[str, Any],
) -> None:
    """§1: what the Instructions sheet of the workbook says, who fills in
    which sheet (in the order of the sheets), the scenarios, and the date
    and contact when they were set."""
    contact = (cover.get("contact") or "").strip()
    doc.add_heading(ui(lang, "dx.s1i"), level=1)
    for key in _INSTRUCTION_KEYS:
        p = doc.add_paragraph()
        p.add_run(ui(lang, f"ins.{key}") + ". ").bold = True
        p.add_run(ui(lang, f"ins.{key}_body"))
        if key == "conf":
            doc.add_paragraph(ui(lang, "ins.conf_values" if contact else "ins.conf_values_nocontact"))

    doc.add_heading(ui(lang, "dx.who_title"), level=2)
    table = _table(doc, [7.0, _TEXT_CM - 7.0], [ui(lang, "h.sheet"), ui(lang, "h.who")], "Light List Accent 1")
    sections = {s.id: s for s in payload.sections}
    for sec_id in [*DATA_SECTION_ORDER, "methodological_choices"]:
        section = sections.get(sec_id)
        if section is None or not section.active or not section.filled_by:
            continue
        cells = table.add_row().cells
        cells[0].text = sheet_name(lang, sec_id)
        cells[1].text = ui(lang, f"who.{section.filled_by}")
    _fix_widths(table)

    scenarios = cover.get("scenarios") or []
    if scenarios:
        doc.add_heading(ui(lang, "ins.scenarios"), level=2)
        doc.add_paragraph(ui(lang, "ins.scenarios_body", n=count(lang, "scenarios", len(scenarios))))
        for label, lines in scenario_changes(lang, data, scenarios):
            p = doc.add_paragraph(style="List Bullet")
            p.add_run(label).bold = True
            if lines:
                p.add_run(": " + "; ".join(lines))

    return_by = fmt_date(lang, cover.get("return_by"))
    if return_by:
        p = doc.add_paragraph()
        p.add_run(ui(lang, "ins.return_by") + ": ").bold = True
        p.add_run(return_by)
    if contact:
        p = doc.add_paragraph()
        p.add_run(ui(lang, "ins.contact") + ": ").bold = True
        p.add_run(contact)


def _write_network_section(
    doc: Document, payload: DcfPayload, data: DcfData | None = None, lang: str = "en",
    network_png: bytes | None = None, scenarios: list[tuple[str, str]] | None = None,
) -> None:
    doc.add_heading(ui(lang, "dx.s2"), level=1)
    if payload.network_render_spec is None:
        doc.add_paragraph(ui(lang, "dx.s2_off"))
        return
    actors = rows_for(data, "actors")
    edges = edge_list(data)
    if network_png:
        # the network as the app draws it (owner decision 2026-11-03), with a
        # caption that says what the arrows mean (P8-13)
        doc.add_picture(BytesIO(network_png), width=Inches(6.3))
        caption = doc.add_paragraph()
        run = caption.add_run(ui(lang, "dx.fig", actors=count(lang, "actors", len(actors)),
                                 flows=count(lang, "flows", len(edges))))
        run.italic = True
        run.font.size = Pt(9)

    # a scenario's network may be drawn while the case's is still empty (Q2 = B)
    if actors or edges or scenario_networks(data, scenarios):
        _write_drawn_network(doc, actors, edges, lang)
        _write_scenario_networks(doc, data, scenarios or [], lang)
        return

    doc.add_paragraph(ui(lang, "dx.s2_static"))


def _role(lang: str, value: Any) -> str:
    return enum_label(lang, retired_value("actor.role", value) or value) or "—"


def _write_drawn_network(doc: Document, actors: list, edges: list[dict], lang: str = "en") -> None:
    """Report the network the analyst drew in the app: who takes part, and
    what moves between them."""
    doc.add_paragraph(ui(lang, "dx.s2_drawn", actors=count(lang, "actors", len(actors)),
                         flows=count(lang, "cflows", len(edges)),
                         sheet_actors=quoted(lang, sheet_name(lang, "actors")),
                         sheet_flows=quoted(lang, sheet_name(lang, "flow_matrix"))))

    if actors:
        doc.add_heading(ui(lang, "dx.actors"), level=2)
        # what each actor gives and receives, from the arrows: one role could
        # not say both (UX round 5, D6)
        gives: dict[str, list[str]] = {}
        receives: dict[str, list[str]] = {}
        for edge in edges:
            gives.setdefault(edge["origin_id"], []).append(str(edge["name"]))
            receives.setdefault(edge["destination_id"], []).append(str(edge["name"]))
        table = _table(doc, [4.2, 2.4, 3.8, 3.3, 3.3],
                       [ui(lang, "h.actor"), ui(lang, "h.role"), ui(lang, "h.sector"),
                        ui(lang, "h.gives"), ui(lang, "h.receives")], "Light List Accent 1")
        for row in actors:
            cells = table.add_row().cells
            cells[0].text = actor_label(row)
            cells[1].text = _role(lang, row.values.get("actor.role"))
            sector = row.values.get("actor.sector")
            cells[2].text = ref_label(lang, "Q6a", sector) or str(sector or "—")
            cells[3].text = ", ".join(gives.get(row.row_id, [])) or "—"
            cells[4].text = ", ".join(receives.get(row.row_id, [])) or "—"
        _fix_widths(table)

    if edges:
        doc.add_heading(ui(lang, "dx.flows"), level=2)
        nature = _terms()[lang if lang in _terms() else "en"]["fields"]["flow.type"]["label"]
        table = _table(doc, [5.0, 4.3, 4.3, 3.4],
                       [ui(lang, "h.flow"), ui(lang, "h.from"), ui(lang, "h.to"), nature], "Light List Accent 1")
        for edge in edges:
            cells = table.add_row().cells
            cells[0].text = str(edge["name"])
            cells[1].text = str(edge["origin"])
            cells[2].text = str(edge["destination"])
            cells[3].text = enum_label(lang, retired_value("flow.type", edge["type"]) or edge["type"]) or "—"
        _fix_widths(table)


def _write_scenario_networks(doc: Document, data: DcfData | None, scenarios: list[tuple[str, str]],
                             lang: str = "en") -> None:
    """Each scenario with a network of its own: what it changes against the
    case's network, in words (scenario networks, owner OK 2026-11-04)."""
    own = {label for label, _ in scenario_networks(data, scenarios)}
    for label, lines in scenario_changes(lang, data, scenarios):
        if label not in own:
            continue
        doc.add_heading(ui(lang, "dx.s2_sc_heading", label=label), level=2)
        for line in lines:
            doc.add_paragraph(line, style="List Bullet")


def _write_field_reference_section(doc: Document, payload: DcfPayload, lang: str,
                                   scenarios: list[tuple[str, str]]) -> None:
    """§3: every column of every active sheet, in the order of the sheets and
    under the sheet's own name (the Word and the workbook named and ordered
    them differently, P8-07) — what it asks, the values it takes, who fills
    it in."""
    doc.add_heading(ui(lang, "dx.s3"), level=1)
    doc.add_paragraph(ui(lang, "dx.s3_body"))
    sections = {s.id: s for s in payload.sections}
    for sec_id in DATA_SECTION_ORDER:
        section = sections.get(sec_id)
        if section is None or not section.active or not section.fields:
            continue
        doc.add_heading(sheet_name(lang, sec_id), level=2)
        title = section.title or section.title_en
        if title and title != sheet_name(lang, sec_id):
            doc.add_paragraph(title).runs[0].italic = True
        if section.filled_by:
            p = doc.add_paragraph()
            p.add_run(ui(lang, "h.who") + ": ").bold = True
            p.add_run(ui(lang, f"who.{section.filled_by}"))
        table = _table(doc, [4.3, 8.7, 4.0], [ui(lang, "h.column"), ui(lang, "h.meaning"), ui(lang, "h.values")],
                       "Light List Accent 1")
        for field in section.fields:
            if field.derived:
                continue
            cells = table.add_row().cells
            per_scenario = field.type == "float_per_scenario"
            label = (field.label_base or field.label or field.label_en) if per_scenario else (field.label or field.label_en)
            star = field.required and field.filled_by != "analyst"
            cells[0].text = label + (" *" if star else "")
            meaning = []
            # the same note as the Excel comment (Fable review of #208)
            if field.id == "flow.q5_class":
                meaning.append(ui(lang, "note.q5_company"))
            else:
                if field.filled_by == "analyst":
                    meaning.append(ui(lang, "note.analyst"))
                meaning.append(str(field.help or field.description_en or ""))
            if per_scenario and scenarios:
                meaning.append(ui(lang, "note.per_scenario", instructions=sheet_name(lang, "instructions")))
            if field.reason:
                meaning.append(f"{ui(lang, 'note.because')}: {field.reason}")
            meaning.append(only_when(section, field, lang) or "")
            cells[1].text = " ".join(_sentence(m) for m in meaning if m).strip() or "—"
            labels = offered_labels(field, lang)
            cells[2].text = "; ".join(labels) if labels else "—"
        _fix_widths(table)


def _sentence(text: str) -> str:
    """A part of the meaning cell, closed with a full stop: two parts ran into
    one another ("…shared Only for rows with…", P8-17)."""
    text = text.strip()
    return text if not text or text[-1] in ".!?)»”“" else f"{text}."


def _write_analyst_annex(doc: Document, payload: DcfPayload, lang: str, cover: dict[str, Any]) -> None:
    """Annex A, for whoever carries out the study: the configuration (it used
    to open the cover, P8-02) and where the checklist is. The 60-120 rows of
    the checklist are no longer repeated here: the workbook's sheet is the one
    full list, with assignee and status (B7, P8-06)."""
    doc.add_heading(ui(lang, "dx.annex"), level=1)
    doc.add_paragraph(ui(lang, "dx.annex_intro")).runs[0].italic = True
    doc.add_heading(ui(lang, "mc.config"), level=2)
    _kv_table(doc, config_rows(payload, lang, cover.get("rows")))
    total = len(payload.obligations) + len(payload.decision_points) + len(payload.sector_rules)
    if total:
        doc.add_heading(ui(lang, "mc.checklist"), level=2)
        doc.add_paragraph(ui(lang, "dx.annex_pointer", total=total,
                             sheet=quoted(lang, sheet_name(lang, "methodological_choices"))))


def _write_project_data(doc: Document, lang: str) -> None:
    """The project data close the document: a technician of a greenhouse
    opened it on "CSA, M22-M36" (P8-07)."""
    doc.add_heading(ui(lang, "dx.meta"), level=1)
    _kv_table(doc, [
        (ui(lang, "dx.project"), "SYMBA — Grant Agreement N. 101135562"),
        (ui(lang, "dx.project_title"), PROJECT_TITLE),
        (ui(lang, "dx.topic"), "HORIZON-CL6-2023-CircBio-01-7 — Symbiosis in the bio-based industrial ecosystems"),
        (ui(lang, "dx.instrument"), ui(lang, "dx.csa")),
        (ui(lang, "dx.task"), "T4.6 — SYMBA Monitoring & Reporting System (M22–M36, ENCO lead)"),
        (ui(lang, "dx.deliverable"), "D4.6 — SYMBA monitoring system"),
    ])


def _write_eu_closing(doc: Document, lang: str = "en") -> None:
    # in the reader's language: the Italian file closed in English (P2-17, P8-09)
    doc.add_heading(ui(lang, "dx.ack"), level=1)
    p = doc.add_paragraph()
    run = p.add_run(ui(lang, "eu.funding"))
    run.italic = True

    p = doc.add_paragraph()
    run = p.add_run(ui(lang, "eu.disclaimer"))
    run.italic = True
    run.font.size = Pt(9)
