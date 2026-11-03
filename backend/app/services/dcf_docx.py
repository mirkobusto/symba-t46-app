"""DCF docx writer — render a DcfPayload to a Word document.

Produces a standalone .docx containing the DCF narrative sections per
the spec (DCF Cover, Methodological Choices checklist, Network Diagram
placeholder, Excel reference). Follows the SYMBA Deliverable Template
V3 conventions: EU funding statement on the closing page, accessible
table head rows, project metadata.

This is a *companion* to the existing `services/reports.py` (which
produces the 8-section LCSA case report). The two can be served as
separate downloads, or future code can concatenate them into a single
combined deliverable.
"""
from __future__ import annotations

from io import BytesIO

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.shared import Pt, RGBColor

from app.domain.dcf_data import DcfData
from app.engine.dcf_compose import DcfPayload
from app.engine.dcf_rows import actor_label, edge_list, rows_for
from app.services.dcf_terms import cover_value, enum_label, ref_label, ui

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


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def generate_dcf_docx_bytes(
    payload: DcfPayload,
    case_title: str | None = None,
    data: DcfData | None = None,
    lang: str = "en",
) -> bytes:
    """Render a DCF docx from a DcfPayload and return the bytes.

    When `data` carries a network drawn in the app, §2 reports the actual
    actors and flows instead of describing what the diagram would show.
    """
    doc = Document()
    doc.styles["Normal"].font.size = Pt(11)

    _write_cover_block(doc, payload, case_title, lang)
    _write_methodological_section(doc, payload, lang)
    _write_network_section(doc, payload, data, lang)
    _write_excel_reference_section(doc, payload, lang)
    _write_eu_closing(doc, lang)

    buf = BytesIO()
    doc.save(buf)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------


def _write_cover_block(doc: Document, payload: DcfPayload, case_title: str | None, lang: str = "en") -> None:
    heading = doc.add_heading(case_title or ui(lang, "title"), level=0)
    heading.runs[0].font.size = Pt(20)
    heading.runs[0].font.color.rgb = SYMBA_NAVY

    para = doc.add_paragraph()
    run = para.add_run(ui(lang, "dx.intro"))
    run.italic = True

    doc.add_heading(ui(lang, "dx.meta"), level=1)
    table = doc.add_table(rows=0, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    rows = [
        (ui(lang, "dx.project"), "SYMBA — Grant Agreement N. 101135562"),
        (ui(lang, "dx.project_title"), PROJECT_TITLE),
        (ui(lang, "dx.topic"), "HORIZON-CL6-2023-CircBio-01-7 — Symbiosis in the bio-based industrial ecosystems"),
        (ui(lang, "dx.instrument"), "CSA"),
        (ui(lang, "dx.task"), "T4.6 — SYMBA Monitoring & Reporting System (M22–M36, ENCO lead)"),
        (ui(lang, "dx.deliverable"), "D4.6 — SYMBA monitoring system"),
    ]
    for label, value in rows:
        row = table.add_row().cells
        row[0].text = label
        for run in row[0].paragraphs[0].runs:
            run.bold = True
        row[1].text = value

    doc.add_heading(ui(lang, "dx.cover"), level=1)
    table = doc.add_table(rows=0, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    rows = [
        (ui(lang, "cover.case_id"), payload.case_id),
        (ui(lang, "cover.ilcd"), cover_value(lang, "ilcd", payload.ilcd_situation)),
        (ui(lang, "cover.lcc"), cover_value(lang, "lcc", payload.lcc_type)),
        (ui(lang, "cover.slca"), cover_value(lang, "slca", payload.slca_activation_state)),
        (ui(lang, "cover.purpose"), cover_value(lang, "purpose", payload.study_purpose)),
        (ui(lang, "cover.market"), cover_value(lang, "market", payload.reference_market)),
        (ui(lang, "cover.schema"), payload.schema_version),
    ]
    for label, value in rows:
        cells = table.add_row().cells
        cells[0].text = label
        for run in cells[0].paragraphs[0].runs:
            run.bold = True
        cells[1].text = str(value)


def _write_methodological_section(doc: Document, payload: DcfPayload, lang: str = "en") -> None:
    """Everything the case has to document, in one table.

    Procedural mandates (what each method requires) and the cross-method
    rules whose trigger fired (what has to line up between methods) are
    the same job for the analyst, so they share a table; `Origin` keeps
    them distinguishable for review.
    """
    doc.add_heading(ui(lang, "dx.s1"), level=1)

    if not payload.obligations:
        doc.add_paragraph(ui(lang, "dx.s1_none"))
        return

    mandates = sum(1 for o in payload.obligations if o.origin == "mandate")
    rules = len(payload.obligations) - mandates
    intro = doc.add_paragraph()
    intro.add_run(ui(lang, "dx.s1_intro", total=len(payload.obligations), rules=rules, mandates=mandates))

    table = doc.add_table(rows=1, cols=6)
    table.style = "Light List Accent 1"
    head = table.rows[0].cells
    headers = [ui(lang, f"h.{k}") for k in ("category", "origin", "id", "statement", "because", "status")]
    for i, h in enumerate(headers):
        head[i].text = h
        for run in head[i].paragraphs[0].runs:
            run.bold = True

    for item in payload.obligations:
        cells = table.add_row().cells
        cells[0].text = item.category
        cells[1].text = item.origin
        cells[2].text = item.id
        cells[3].text = (
            f"{item.title} — {item.statement}" if item.title else item.statement
        )
        cells[4].text = item.trigger or "—"
        cells[5].text = ui(lang, "status.pending")


def _write_network_section(
    doc: Document, payload: DcfPayload, data: DcfData | None = None, lang: str = "en"
) -> None:
    doc.add_heading(ui(lang, "dx.s2"), level=1)
    if payload.network_render_spec is None:
        doc.add_paragraph(ui(lang, "dx.s2_off"))
        return

    actors = rows_for(data, "actors")
    edges = edge_list(data)
    if actors or edges:
        _write_drawn_network(doc, actors, edges, lang)
        return

    doc.add_paragraph(ui(lang, "dx.s2_static"))


def _write_drawn_network(doc: Document, actors: list, edges: list[dict], lang: str = "en") -> None:
    """Report the network the analyst drew in the app: who takes part, and
    what moves between them."""
    doc.add_paragraph(ui(lang, "dx.s2_drawn", actors=len(actors), flows=len(edges)))

    if actors:
        doc.add_heading(ui(lang, "dx.actors"), level=2)
        table = doc.add_table(rows=1, cols=3)
        table.style = "Light List Accent 1"
        head = table.rows[0].cells
        for i, h in enumerate([ui(lang, "h.actor"), ui(lang, "h.role"), ui(lang, "h.sector")]):
            head[i].text = h
            for run in head[i].paragraphs[0].runs:
                run.bold = True
        for row in actors:
            cells = table.add_row().cells
            cells[0].text = actor_label(row)
            cells[1].text = enum_label(lang, row.values.get("actor.role")) or "—"
            sector = row.values.get("actor.sector")
            cells[2].text = ref_label(lang, "Q6a", sector) or str(sector or "—")

    if edges:
        doc.add_heading(ui(lang, "dx.flows"), level=2)
        table = doc.add_table(rows=1, cols=4)
        table.style = "Light List Accent 1"
        head = table.rows[0].cells
        for i, h in enumerate([ui(lang, f"h.{k}") for k in ("flow", "from", "to", "type")]):
            head[i].text = h
            for run in head[i].paragraphs[0].runs:
                run.bold = True
        for edge in edges:
            cells = table.add_row().cells
            cells[0].text = str(edge["name"])
            cells[1].text = str(edge["origin"])
            cells[2].text = str(edge["destination"])
            cells[3].text = enum_label(lang, edge["type"]) or "—"


def _write_excel_reference_section(doc: Document, payload: DcfPayload, lang: str = "en") -> None:
    doc.add_heading(ui(lang, "dx.s3"), level=1)
    doc.add_paragraph(ui(lang, "dx.s3_body"))

    doc.add_heading(ui(lang, "dx.active"), level=2)
    table = doc.add_table(rows=1, cols=3)
    table.style = "Light List Accent 1"
    head = table.rows[0].cells
    for i, h in enumerate([ui(lang, f"h.{k}") for k in ("section", "active", "fields")]):
        head[i].text = h
        for run in head[i].paragraphs[0].runs:
            run.bold = True

    for section in payload.sections:
        if section.id in {"methodological_choices", "network_diagram"}:
            continue
        cells = table.add_row().cells
        cells[0].text = section.title or section.title_en
        cells[1].text = ui(lang, "yes") if section.active else ui(lang, "no")
        cells[2].text = str(len(section.fields)) if section.active else "—"


def _write_eu_closing(doc: Document, lang: str = "en") -> None:
    # the EU funding statement and disclaimer keep their standard English wording
    doc.add_heading(ui(lang, "dx.ack"), level=1)
    p = doc.add_paragraph()
    run = p.add_run(EU_FOOTER)
    run.italic = True

    p = doc.add_paragraph()
    run = p.add_run(EU_DISCLAIMER)
    run.italic = True
    run.font.size = Pt(9)
