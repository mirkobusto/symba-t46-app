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
from typing import Any

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.shared import Inches, Pt, RGBColor

from app.domain.dcf_data import DcfData
from app.engine.dcf_compose import DcfPayload
from app.engine.dcf_rows import actor_label, edge_list, network_diff, rows_for, scenario_networks
from app.services.dcf_terms import cover_rows, enum_label, offered_labels, only_when, ref_label, ui

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
    cover: dict[str, Any] | None = None,
) -> bytes:
    """Render a DCF docx from a DcfPayload and return the bytes.

    When `data` carries a network drawn in the app, §2 reports the actual
    actors and flows instead of describing what the diagram would show.
    """
    doc = Document()
    doc.styles["Normal"].font.size = Pt(11)

    # Companies first, the analyst's list last: the document opened with 60-120
    # rows of English methodology the data providers did not need, and promised
    # a field-by-field §3 that held only counts (UX round 5, D10; P1-08, P2-02,
    # P4-08, P5-13, P6-09).
    _write_cover_block(doc, payload, case_title, lang, cover or {})
    _write_instructions_section(doc, payload, lang, (cover or {}).get("contact"))
    _write_network_section(doc, payload, data, lang, (cover or {}).get("network_png"), (cover or {}).get("scenarios"))
    _write_field_reference_section(doc, payload, lang)
    _write_methodological_section(doc, payload, lang)
    _write_eu_closing(doc, lang)

    buf = BytesIO()
    doc.save(buf)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------


def _write_cover_block(
    doc: Document, payload: DcfPayload, case_title: str | None, lang: str = "en",
    cover: dict[str, Any] | None = None,
) -> None:
    cover = cover or {}
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
    rows = cover_rows(payload, lang, cover.get("rows"), cover.get("case_ref"), cover.get("generated_on"))
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
    doc.add_heading(ui(lang, "dx.annex"), level=1)
    doc.add_paragraph(ui(lang, "dx.annex_intro")).runs[0].italic = True

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
        cells[0].text = item.category_label or item.category
        cells[1].text = item.origin_label or item.origin
        cells[2].text = item.id
        cells[3].text = (
            f"{item.title} — {item.statement}" if item.title else item.statement
        )
        cells[4].text = item.because or item.trigger or "—"
        cells[5].text = ui(lang, "status.pending")


def _write_network_section(
    doc: Document, payload: DcfPayload, data: DcfData | None = None, lang: str = "en",
    network_png: bytes | None = None, scenarios: list[tuple[str, str]] | None = None,
) -> None:
    doc.add_heading(ui(lang, "dx.s2"), level=1)
    if payload.network_render_spec is None:
        doc.add_paragraph(ui(lang, "dx.s2_off"))
        return
    if network_png:
        # the network as the app draws it (owner decision 2026-11-03)
        doc.add_picture(BytesIO(network_png), width=Inches(6.3))

    actors = rows_for(data, "actors")
    edges = edge_list(data)
    # a scenario's network may be drawn while the case's is still empty (Q2 = B)
    if actors or edges or scenario_networks(data, scenarios):
        _write_drawn_network(doc, actors, edges, lang)
        _write_scenario_networks(doc, data, actors, scenarios or [], lang)
        return

    doc.add_paragraph(ui(lang, "dx.s2_static"))


def _write_drawn_network(doc: Document, actors: list, edges: list[dict], lang: str = "en") -> None:
    """Report the network the analyst drew in the app: who takes part, and
    what moves between them."""
    doc.add_paragraph(ui(lang, "dx.s2_drawn", actors=len(actors), flows=len(edges)))

    if actors:
        doc.add_heading(ui(lang, "dx.actors"), level=2)
        # what each actor gives and receives, from the arrows: one role could
        # not say both (UX round 5, D6)
        gives = {}
        receives = {}
        for edge in edges:
            gives.setdefault(edge["origin_id"], []).append(str(edge["name"]))
            receives.setdefault(edge["destination_id"], []).append(str(edge["name"]))
        table = doc.add_table(rows=1, cols=5)
        table.style = "Light List Accent 1"
        head = table.rows[0].cells
        headers = [ui(lang, "h.actor"), ui(lang, "h.role"), ui(lang, "h.sector"),
                   ui(lang, "h.gives"), ui(lang, "h.receives")]
        for i, h in enumerate(headers):
            head[i].text = h
            for run in head[i].paragraphs[0].runs:
                run.bold = True
        for row in actors:
            cells = table.add_row().cells
            name = actor_label(row)
            cells[0].text = name
            cells[1].text = enum_label(lang, row.values.get("actor.role")) or "—"
            sector = row.values.get("actor.sector")
            cells[2].text = ref_label(lang, "Q6a", sector) or str(sector or "—")
            cells[3].text = ", ".join(gives.get(row.row_id, [])) or "—"
            cells[4].text = ", ".join(receives.get(row.row_id, [])) or "—"

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


def _write_scenario_networks(doc: Document, data: DcfData | None, actors: list, scenarios: list[tuple[str, str]],
                             lang: str = "en") -> None:
    """Each scenario with a network of its own: what it changes against the
    case's network, in words (scenario networks, owner OK 2026-11-04)."""
    flows = rows_for(data, "flow_matrix")
    for label, variant in scenario_networks(data, scenarios):
        doc.add_heading(ui(lang, "dx.s2_sc_heading", label=label), level=2)
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
        if not lines:
            doc.add_paragraph(ui(lang, "dx.s2_sc_same"))
        for line in lines:
            doc.add_paragraph(line, style="List Bullet")


_INSTRUCTION_KEYS = ["what", "how", "unknown", "units", "conf", "return"]


def _bold_row(table, cells: list[str]) -> None:
    row = table.rows[0].cells if len(table.rows) == 1 and not table.rows[0].cells[0].text else table.add_row().cells
    for i, text in enumerate(cells):
        row[i].text = text
        for run in row[i].paragraphs[0].runs:
            run.bold = True


def _write_instructions_section(
    doc: Document, payload: DcfPayload, lang: str = "en", contact: str | None = None
) -> None:
    """§1: what the Instructions sheet of the workbook says, and who fills in
    which sheet, with the contact of the shared case when there is one."""
    doc.add_heading(ui(lang, "dx.s1i"), level=1)
    for key in _INSTRUCTION_KEYS:
        p = doc.add_paragraph()
        p.add_run(ui(lang, f"ins.{key}") + ". ").bold = True
        p.add_run(ui(lang, f"ins.{key}_body"))
        if key == "conf":
            doc.add_paragraph(ui(lang, "ins.conf_values"))

    doc.add_heading(ui(lang, "dx.who_title"), level=2)
    table = doc.add_table(rows=1, cols=2)
    table.style = "Light List Accent 1"
    _bold_row(table, [ui(lang, "h.sheet"), ui(lang, "h.who")])
    for section in payload.sections:
        if not section.active or section.id == "network_diagram" or not section.filled_by:
            continue
        cells = table.add_row().cells
        cells[0].text = section.title or section.title_en
        cells[1].text = ui(lang, f"who.{section.filled_by}")

    p = doc.add_paragraph()
    p.add_run(ui(lang, "ins.return_by") + ": ").bold = True
    p.add_run(ui(lang, "ins.return_by_hint"))
    p = doc.add_paragraph()
    p.add_run(ui(lang, "ins.contact") + ": ").bold = True
    p.add_run(contact or ui(lang, "ins.contact_hint"))


def _write_field_reference_section(doc: Document, payload: DcfPayload, lang: str = "en") -> None:
    """§3: every column of every active sheet — what it asks, the values it
    takes, who fills it in. It used to promise this and give section counts."""
    doc.add_heading(ui(lang, "dx.s3"), level=1)
    doc.add_paragraph(ui(lang, "dx.s3_body"))
    for section in payload.sections:
        if not section.active or not section.fields:
            continue
        doc.add_heading(section.title or section.title_en, level=2)
        if section.filled_by:
            p = doc.add_paragraph()
            p.add_run(ui(lang, "h.who") + ": ").bold = True
            p.add_run(ui(lang, f"who.{section.filled_by}"))
        table = doc.add_table(rows=1, cols=3)
        table.style = "Light List Accent 1"
        _bold_row(table, [ui(lang, "h.column"), ui(lang, "h.meaning"), ui(lang, "h.values")])
        for field in section.fields:
            if field.derived:
                continue
            cells = table.add_row().cells
            cells[0].text = (field.label or field.label_en) + (" *" if field.required else "")
            meaning = []
            # the same note as the Excel comment (Fable review of #208)
            if field.filled_by == "analyst" and field.id != "flow.q5_class":
                meaning.append(ui(lang, "note.analyst"))
            meaning.append(str(field.help or field.description_en or ""))
            if field.reason:
                meaning.append(f"{ui(lang, 'note.because')}: {field.reason}")
            meaning.append(only_when(section, field, lang) or "")
            cells[1].text = " ".join(m for m in meaning if m).strip() or "—"
            labels = offered_labels(field, lang)
            cells[2].text = "; ".join(labels) if labels else "—"


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
