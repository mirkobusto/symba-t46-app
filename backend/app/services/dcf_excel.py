"""DCF xlsx writer — render a DcfPayload to an Excel workbook.

Multi-tab structure:
- Cover            — case metadata + EU funding statement
- Actors           — header + whatever the Network Builder stored, then
                     blank rows for offline collection
- Flow Matrix      — same
- Logistics        — same (or placeholder note if section
                     deactivated, e.g. q7=A)
- Infrastructure   — header + 10 empty rows
- Methodological Choices — auto-populated checklist of activated
                     procedural_mandates, grouped by category
- Network Diagram  — placeholder note (the interactive viz is in-app)

Design principles:
- SYMBA palette: navy header (#29364E, the website heading colour) + white text, italic small gray
  for field-id technical reference, EU footer on every sheet (inline + page
  footer for print).
- No macros, no VBA — Excel/LibreOffice/Google Sheets compatible.
- Returns bytes; caller decides how to serve (HTTP / file / etc).
"""
from __future__ import annotations

from io import BytesIO
from typing import Any

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

from app.domain.dcf_data import DcfData, DcfRow
from app.engine.dcf_compose import DcfPayload, DcfSection
from app.engine.dcf_rows import actor_label, cell_values, edge_list, rows_for
from app.services.dcf_terms import cover_rows, enum_label, offered_labels, only_when, ui, value_label

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

EU_FOOTER = (
    "This Project has received funding from the European Union's Horizon "
    "Research and Innovation Programme under Grant Agreement N. 101135562 — "
    "www.symbaproject.eu"
)

# SYMBA palette: white + blue + green geometric (per project visual identity).
_HEADER_FILL = PatternFill(fill_type="solid", fgColor="29364E")
# a column the analyst fills in: grey, so a company sees it is not theirs (D4)
_ANALYST_FILL = PatternFill(fill_type="solid", fgColor="8A93A3")
_HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
_TITLE_FONT = Font(bold=True, size=14, color="29364E")
_SUBTITLE_FONT = Font(italic=True, size=10, color="404040")
_FIELDID_FONT = Font(size=8, italic=True, color="666666")
_LABEL_FONT = Font(bold=True)
_FOOTER_FONT = Font(size=8, italic=True, color="888888")

_DATA_SECTION_ORDER = [
    "actors", "flow_matrix", "flow_classification", "reference_scenario", "logistics", "costs",
    "infrastructure",
]
_LISTS_SHEET = "_lists"  # hidden: the dropdown values, one column per field
_EMPTY_DATA_ROWS = 10
# Even a fully-filled section keeps a few blank rows: collection continues
# offline after the export.
_MIN_BLANK_ROWS = 3


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def render_xlsx(
    payload: DcfPayload,
    data: DcfData | None = None,
    case_title: str | None = None,
    lang: str = "en",
    cover: dict[str, Any] | None = None,
) -> bytes:
    """Render the DcfPayload to an xlsx workbook and return raw bytes.

    `cover` carries what the cover states beyond the payload: `rows` (the
    result page's configuration, worded in `lang`), `case_ref` (the case's
    readable id) and `generated_on` (the date).

    `data` is the content stored by the Network Builder, when the case
    has any: its rows are written under the headers so the analyst gets
    a partially-filled workbook to continue from, instead of the empty
    grid the export produced before.

    `lang` sets the fixed text, and the payload should come through
    `dcf_terms.localize` so the sections and fields carry it too. Cells show
    labels, not codes: the enum value's label, an actor's or a flow's name
    (the file goes to partners and is never read back by the app).
    """
    wb = Workbook()
    wb.remove(wb.active)  # drop the default empty sheet
    lists = wb.create_sheet(_LISTS_SHEET)
    lists.sheet_state = "hidden"

    _write_cover_tab(wb, payload, case_title, lang, cover or {})
    _write_instructions_tab(wb, payload, case_title, lang, (cover or {}).get("contact"))

    sections = {s.id: s for s in payload.sections}
    names = _names(data)

    for sec_id in _DATA_SECTION_ORDER:
        sec = sections.get(sec_id)
        if sec is not None:
            _write_data_section_tab(wb, sec, rows_for(data, sec_id), lang, names, lists, data)

    mc = sections.get("methodological_choices")
    if mc is not None:
        _write_mandates_tab(wb, mc, payload.obligations, lang)

    nw = sections.get("network_diagram")
    if nw is not None:
        _write_network_tab(wb, nw, data, lang)

    wb.move_sheet(_LISTS_SHEET, offset=len(wb.sheetnames))

    buf = BytesIO()
    wb.save(buf)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Tab writers
# ---------------------------------------------------------------------------


def _names(data: DcfData | None) -> dict[str, dict[str, str]]:
    """Actor and flow names by row id: a foreign key shows the name. A flow
    also shows who gives it and who receives it, so each company finds its
    rows (filter on the column) and nobody types an id (UX round 5, D4)."""
    actors = {r.row_id: actor_label(r) for r in rows_for(data, "actors")}
    flows = {}
    for r in rows_for(data, "flow_matrix"):
        name = str(r.values.get("flow.name") or r.row_id)
        origin = actors.get(str(r.values.get("flow.origin_actor_id") or ""))
        dest = actors.get(str(r.values.get("flow.dest_actor_id") or ""))
        flows[r.row_id] = f"{name} ({origin} → {dest})" if origin and dest else name
    return {"fk_actor": actors, "fk_flow": flows}


# The foreign key a per-flow or per-actor sheet is keyed on: one row each is
# written already, so the companies fill in rather than retype names (P1-06,
# P2-07, P4-06, P5-01, P6-06).
_SEED_KEY = {
    "flow_classification": ("classif.flow_id", "flow_matrix"),
    "logistics": ("route.flow_id", "flow_matrix"),
    "costs": ("cost.flow_id", "flow_matrix"),
    "reference_scenario": ("ref.actor_id", "actors"),
}


def _reference_rows(rows: list[DcfRow], data: DcfData | None) -> list[DcfRow]:
    """Two rows per flow, one for the actor that gives it and one for the
    actor that receives it: one cell per actor could not hold an actor that
    gives a flow and receives another (UX round 5, D6; D4.1 §11.1)."""
    have = {(r.values.get("ref.flow_id"), r.values.get("ref.side")) for r in rows}
    seeded = []
    for f in rows_for(data, "flow_matrix"):
        for side, actor_key in (("origin", "flow.origin_actor_id"), ("destination", "flow.dest_actor_id")):
            if (f.row_id, side) in have:
                continue
            values = {"ref.flow_id": f.row_id, "ref.side": side}
            if f.values.get(actor_key):
                values["ref.actor_id"] = f.values[actor_key]
            seeded.append(DcfRow(row_id=f"seed-ref-{f.row_id}-{side}", values=values))
    return [*rows, *seeded]


def _with_seeded_rows(section: DcfSection, rows: list[DcfRow], data: DcfData | None) -> list[DcfRow]:
    if section.id == "reference_scenario" and "ref.side" in {f.id for f in section.fields}:
        return _reference_rows(rows, data)
    key = _SEED_KEY.get(section.id)
    if key is None or key[0] not in {f.id for f in section.fields}:
        return rows
    field_id, target = key
    have = {r.values.get(field_id) for r in rows}
    seeded = [
        DcfRow(row_id=f"seed-{section.id}-{t.row_id}", values={field_id: t.row_id})
        for t in rows_for(data, target)
        if t.row_id not in have
    ]
    return [*rows, *seeded]


def _title(section: DcfSection) -> str:
    return section.title or section.title_en


def _label(field) -> str:
    return field.label or field.label_en


def _write_cover_tab(
    wb: Workbook, payload: DcfPayload, case_title: str | None = None, lang: str = "en",
    cover: dict[str, Any] | None = None,
) -> None:
    cover = cover or {}
    ws = wb.create_sheet(ui(lang, "sheet.cover"))
    # The recipient knows the case by its name, not by a uuid.
    ws["A1"] = f"{ui(lang, 'title')} — {case_title}" if case_title else ui(lang, "title")
    ws["A1"].font = _TITLE_FONT

    rows = cover_rows(payload, lang, cover.get("rows"), cover.get("case_ref"), cover.get("generated_on"))
    for i, (label, value) in enumerate(rows, start=3):
        ws.cell(row=i, column=1, value=label).font = _LABEL_FONT
        ws.cell(row=i, column=2, value=value)

    footer_row = 3 + len(rows) + 2
    ws.cell(row=footer_row, column=1, value=EU_FOOTER).font = _FOOTER_FONT
    ws.merge_cells(start_row=footer_row, start_column=1, end_row=footer_row, end_column=4)

    ws.column_dimensions["A"].width = 30
    ws.column_dimensions["B"].width = 90
    for r in range(3, 3 + len(rows)):
        ws.cell(row=r, column=2).alignment = Alignment(wrap_text=True, vertical="top")
    _set_print_footer(ws)


def _write_data_section_tab(
    wb: Workbook, section: DcfSection, rows: list[DcfRow] | None = None,
    lang: str = "en", names: dict[str, dict[str, str]] | None = None, lists=None,
    data: DcfData | None = None,
) -> None:
    ws = wb.create_sheet(ui(lang, f"sheet.{section.id}"))
    names = names or {}

    if not section.active:
        ws["A1"] = _title(section)
        ws["A1"].font = _TITLE_FONT
        ws["A3"] = ui(lang, "not_active")
        ws["A3"].alignment = Alignment(wrap_text=True)
        ws.cell(row=5, column=1, value=EU_FOOTER).font = _FOOTER_FONT
        ws.column_dimensions["A"].width = 80
        _set_print_footer(ws)
        return

    ws["A1"] = _title(section)
    ws["A1"].font = _TITLE_FONT
    ws["A2"] = section.description or section.description_en
    ws["A2"].font = _SUBTITLE_FONT
    ws["A2"].alignment = Alignment(wrap_text=True)
    ws.merge_cells("A2:H2")
    if section.filled_by:
        # who fills this sheet in, on the sheet itself: it was only on the web
        # page, not in the file the companies receive (UX round 5, D4)
        ws["A3"] = f"{ui(lang, 'h.who')}: {ui(lang, f'who.{section.filled_by}')}"
        ws["A3"].font = _LABEL_FONT

    # Row 4: header labels. The technical field id and the description
    # ride along as a cell comment instead of a second visible row: the
    # sheet has to read as a form to whoever fills it in, while the id
    # stays available to whoever maps the file back to the schema.
    header_row = 4
    for col_idx, field in enumerate(section.fields, start=1):
        c = ws.cell(row=header_row, column=col_idx, value=_header_label(field))
        c.font = _HEADER_FONT
        c.fill = _ANALYST_FILL if field.filled_by == "analyst" else _HEADER_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        note = _field_note(field, lang, section)
        if note:
            c.comment = Comment(note, "SYMBA T4.6")

    fieldid_row = header_row

    # Stored rows first, then one row per flow or actor still missing, then
    # blank ones so collection can continue.
    stored = _with_seeded_rows(section, rows or [], data)
    first_data_row = fieldid_row + 1
    for offset, row in enumerate(stored):
        for col_idx, (field, value) in enumerate(zip(section.fields, cell_values(section, row), strict=True), start=1):
            shown = names.get(field.type, {}).get(value, value) if field.type in names else value_label(lang, field, value)
            ws.cell(row=first_data_row + offset, column=col_idx, value=shown)

    blank_start = first_data_row + len(stored)
    blank_count = max(_EMPTY_DATA_ROWS - len(stored), _MIN_BLANK_ROWS)
    for r in range(blank_start, blank_start + blank_count):
        for col_idx in range(1, len(section.fields) + 1):
            ws.cell(row=r, column=col_idx, value=None)
    total_data_rows = len(stored) + blank_count

    _add_enum_dropdowns(ws, section, first_data_row, blank_start + blank_count, lang, lists)
    if section.id == "actors" and stored:
        # what each actor gives and receives, from the arrows: one role could
        # not say both (UX round 5, D6); computed, not to be typed in
        col = len(section.fields) + 1
        head = ws.cell(row=header_row, column=col, value=f"{ui(lang, 'h.gives')} / {ui(lang, 'h.receives')}")
        head.font = _HEADER_FONT
        head.fill = _HEADER_FILL
        head.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        head.comment = Comment(ui(lang, "note.computed"), "SYMBA T4.6")
        flows = rows_for(data, "flow_matrix")
        for offset, row in enumerate(stored):
            gives = [str(f.values.get("flow.name") or f.row_id) for f in flows
                     if f.values.get("flow.origin_actor_id") == row.row_id]
            receives = [str(f.values.get("flow.name") or f.row_id) for f in flows
                        if f.values.get("flow.dest_actor_id") == row.row_id]
            text = "; ".join(x for x in (
                f"{ui(lang, 'h.gives')}: {', '.join(gives)}" if gives else "",
                f"{ui(lang, 'h.receives')}: {', '.join(receives)}" if receives else "",
            ) if x)
            ws.cell(row=first_data_row + offset, column=col, value=text or None)
        ws.column_dimensions[get_column_letter(col)].width = 40
    # a company filters the flow or actor column to find its own rows (D4); the
    # computed gives/receives column of the actors sheet sorts with its rows
    last_col = len(section.fields) + (1 if section.id == "actors" and stored else 0)
    ws.auto_filter.ref = f"A{header_row}:{get_column_letter(last_col)}{blank_start + blank_count - 1}"

    # Column widths
    for col_idx, field in enumerate(section.fields, start=1):
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = max(15, min(36, len(_label(field)) + 4))

    # Freeze top 5 rows (title + description + 2 header rows + small buffer)
    ws.freeze_panes = ws.cell(row=fieldid_row + 1, column=1).coordinate

    # Footer
    footer_row = fieldid_row + 1 + total_data_rows + 2
    ws.cell(row=footer_row, column=1, value=EU_FOOTER).font = _FOOTER_FONT

    _set_print_footer(ws)


# heading / body keys of the instructions, in dcf_terms.json "ui"
_INSTRUCTIONS = ["what", "how", "unknown", "units", "conf", "return"]


def _write_instructions_tab(
    wb: Workbook, payload: DcfPayload, case_title: str | None = None, lang: str = "en",
    contact: str | None = None,
) -> None:
    """A sheet for the person who has to fill this in.

    The workbook used to arrive with no instructions, no deadline and no
    contact — a recipient outside the assessment team had no way of
    knowing what was expected of them.
    """
    ws = wb.create_sheet(ui(lang, "sheet.instructions"))
    ws["A1"] = ui(lang, "ins.title")
    ws["A1"].font = _TITLE_FONT
    if case_title:
        ws["A2"] = ui(lang, "ins.case", name=case_title)
        ws["A2"].font = _SUBTITLE_FONT

    row = 4
    for key in _INSTRUCTIONS:
        c = ws.cell(row=row, column=1, value=ui(lang, f"ins.{key}"))
        c.font = _HEADER_FONT
        c.fill = _HEADER_FILL
        body = ui(lang, f"ins.{key}_body")
        if key == "conf":
            # what to do with a value that cannot be shared (P2-10)
            body += "\n\n" + ui(lang, "ins.conf_values")
        ws.cell(row=row, column=2, value=body).alignment = Alignment(wrap_text=True)
        row += 2

    ws.cell(row=row, column=1, value=ui(lang, "ins.return_by")).font = _HEADER_FONT
    ws.cell(row=row, column=2, value=ui(lang, "ins.return_by_hint"))
    row += 1
    ws.cell(row=row, column=1, value=ui(lang, "ins.contact")).font = _HEADER_FONT
    ws.cell(row=row, column=2, value=contact or ui(lang, "ins.contact_hint"))

    ws.column_dimensions["A"].width = 26
    ws.column_dimensions["B"].width = 96
    ws.cell(row=row + 3, column=1, value=EU_FOOTER).font = _FOOTER_FONT
    _set_print_footer(ws)


def _header_label(field) -> str:
    """Column header as a person reads it: the label, and a star when the
    field has to be filled in."""
    return f"{_label(field)} *" if field.required else _label(field)


def _field_note(field, lang: str = "en", section=None) -> str:
    """The comment on a header: who fills it in when it is not the sheet's
    filler, what the field means, the values it takes and why it is asked, in
    words. No field id: it was noise to whoever fills the file in."""
    parts = []
    # the payment class arrives filled in from the questionnaire: its own text
    # says so, "leave it empty" would be wrong (Fable review of #208)
    if field.filled_by == "analyst" and field.id != "flow.q5_class":
        parts.append(ui(lang, "note.analyst"))
    help_text = field.help or field.description_en
    if help_text:
        parts.append(str(help_text))
    labels = offered_labels(field, lang)
    if labels:
        parts.append(f"{ui(lang, 'note.allowed')}: " + "; ".join(labels))
    if field.reason:
        parts.append(f"{ui(lang, 'note.because')}: {field.reason}")
    rows_note = only_when(section, field, lang) if section is not None else None
    if rows_note:
        parts.append(rows_note)
    # the field id was noise to whoever fills the file in (P2-05, P3-10, P6-07)
    return "\n".join(parts)


def _add_enum_dropdowns(
    ws, section: DcfSection, first_row: int, last_row: int, lang: str = "en", lists=None,
) -> None:
    """Turn every enum into a dropdown of its labels.

    Typing an allowed value from memory is how a collection file comes
    back with 'medium', 'Med' and 'M' in the same column. The labels sit in
    a hidden sheet, one column per field: an inline list breaks on a comma
    inside a label and is capped at 255 characters.
    """
    for col_idx, field in enumerate(section.fields, start=1):
        labels = offered_labels(field, lang)
        if not labels:
            continue
        if lists is None:
            continue
        list_col = lists.max_column + 1 if lists.max_row > 1 or lists["A1"].value else 1
        letter_l = get_column_letter(list_col)
        for i, label in enumerate(labels, start=1):
            lists.cell(row=i, column=list_col, value=label)
        dv = DataValidation(
            type="list", formula1=f"'{_LISTS_SHEET}'!${letter_l}$1:${letter_l}${len(labels)}",
            allow_blank=True, showDropDown=False,
        )
        dv.error = ui(lang, "dv.error")
        dv.errorTitle = ui(lang, "dv.title")
        ws.add_data_validation(dv)
        letter = get_column_letter(col_idx)
        dv.add(f"{letter}{first_row}:{letter}{last_row}")


def _write_mandates_tab(
    wb: Workbook,
    section: DcfSection,
    obligations: list,
    lang: str = "en",
) -> None:
    """One tab for everything the case has to document.

    Procedural mandates and triggered cross-method rules used to live in
    two different places in two different formats; they are the same job
    for whoever fills the file in, so they share a tab, with `Origin`
    keeping the traceability a reviewer needs.
    """
    ws = wb.create_sheet(ui(lang, "sheet.methodological_choices"))
    ws["A1"] = _title(section)
    ws["A1"].font = _TITLE_FONT
    # the description already says it is for whoever carries out the study
    ws["A2"] = section.description or section.description_en
    ws["A2"].font = _SUBTITLE_FONT
    ws["A2"].alignment = Alignment(wrap_text=True)
    ws.merge_cells("A2:I2")

    headers = [ui(lang, f"h.{k}") for k in (
        "category", "origin", "id", "method", "statement", "because", "target", "assignee", "status")]
    header_row = 4
    for col_idx, label in enumerate(headers, start=1):
        c = ws.cell(row=header_row, column=col_idx, value=label)
        c.font = _HEADER_FONT
        c.fill = _HEADER_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    row = header_row + 1
    for item in obligations:
        ws.cell(row=row, column=1, value=item.category_label or item.category)
        ws.cell(row=row, column=2, value=item.origin_label or item.origin)
        ws.cell(row=row, column=3, value=item.id)
        ws.cell(row=row, column=4, value=item.method)
        statement = item.statement if not item.title else f"{item.title} — {item.statement}"
        ws.cell(row=row, column=5, value=statement).alignment = Alignment(wrap_text=True)
        ws.cell(row=row, column=6, value=item.because or item.trigger or "")
        ws.cell(row=row, column=7, value="")
        ws.cell(row=row, column=8, value="")
        ws.cell(row=row, column=9, value=ui(lang, "status.pending"))
        row += 1

    widths = {"A": 24, "B": 10, "C": 14, "D": 8, "E": 60, "F": 26,
              "G": 28, "H": 18, "I": 12}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    ws.freeze_panes = "A5"
    ws.cell(row=row + 2, column=1, value=EU_FOOTER).font = _FOOTER_FONT
    _set_print_footer(ws)


def _write_network_tab(
    wb: Workbook, section: DcfSection, data: DcfData | None, lang: str = "en"
) -> None:
    """Edge list of the drawn network, or the placeholder note when the
    analyst has not drawn one yet."""
    ws = wb.create_sheet(ui(lang, "sheet.network_diagram"))
    ws["A1"] = _title(section)
    ws["A1"].font = _TITLE_FONT

    edges = edge_list(data)
    if not edges:
        ws["A3"] = ui(lang, "nw.none")
        ws["A3"].alignment = Alignment(wrap_text=True)
        ws.column_dimensions["A"].width = 90
        ws.cell(row=5, column=1, value=EU_FOOTER).font = _FOOTER_FONT
        _set_print_footer(ws)
        return

    ws["A2"] = ui(lang, "nw.intro")
    ws["A2"].font = _SUBTITLE_FONT
    ws["A2"].alignment = Alignment(wrap_text=True)

    headers = [ui(lang, f"h.{k}") for k in ("flow", "origin_actor", "dest_actor", "type", "quantity", "unit")]
    header_row = 4
    for col_idx, label in enumerate(headers, start=1):
        c = ws.cell(row=header_row, column=col_idx, value=label)
        c.font = _HEADER_FONT
        c.fill = _HEADER_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    for offset, edge in enumerate(edges, start=1):
        ws.cell(row=header_row + offset, column=1, value=edge["name"])
        ws.cell(row=header_row + offset, column=2, value=edge["origin"])
        ws.cell(row=header_row + offset, column=3, value=edge["destination"])
        ws.cell(row=header_row + offset, column=4, value=enum_label(lang, edge["type"]) or None)
        ws.cell(row=header_row + offset, column=5, value=edge["quantity"])
        ws.cell(row=header_row + offset, column=6, value=edge["unit"])

    for col_idx, label in enumerate(headers, start=1):
        ws.column_dimensions[get_column_letter(col_idx)].width = max(16, len(label) + 6)

    ws.cell(
        row=header_row + len(edges) + 2, column=1, value=EU_FOOTER
    ).font = _FOOTER_FONT
    _set_print_footer(ws)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _set_print_footer(ws) -> None:
    """Best-effort print footer (visible when sheet is printed)."""
    try:
        ws.oddFooter.center.text = EU_FOOTER
        ws.oddFooter.center.size = 8
    except Exception:
        # openpyxl HeaderFooter API can be flaky across versions; the inline
        # footer cell is the authoritative one. Swallow.
        pass
