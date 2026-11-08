"""DCF xlsx writer — render a DcfPayload to an Excel workbook.

One order for the workbook and the Word document (UX round 6, P2-09, P8-07):
- Cover            — written for the company that receives the file: the
                     case, its reference, version and date, the date to
                     return it by and to whom, that it is confidential, what
                     we ask, the scenarios
- Instructions     — how to fill it in, grey columns, row numbers, scenarios
- Network Diagram  — the links of the drawn network and its picture
- Actors, Flow Matrix, Reference Scenario, Logistics, Costs & Revenues,
  Infrastructure   — the companies' sheets: header + the stored rows, then
                     blank rows for offline collection
- Flow Classification, Methodological Choices — for whoever carries out the
                     study: the configuration of the study heads the
                     checklist of what to document

Design principles:
- SYMBA palette: navy header (#29364E, the website heading colour) + white
  text; a grey header marks the analyst's columns.
- Printable: A4 landscape, one page wide, header rows repeated, the case in
  the page header, the EU funding line and the page number in the footer.
  The funding line is not written inside the input area of a data sheet
  (P8-14, P1-21).
- No macros, no VBA — Excel/LibreOffice/Google Sheets compatible.
- Returns bytes; caller decides how to serve (HTTP / file / etc).
"""
from __future__ import annotations

from io import BytesIO
from typing import Any

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.properties import PageSetupProperties

from app.domain.dcf_data import DcfData, DcfRow
from app.engine.dcf_compose import DcfPayload, DcfSection
from app.engine.dcf_rows import (
    _number,
    actor_label,
    edge_list,
    edge_list_rows,
    row_condition_holds,
    rows_for,
    scenario_networks,
)
from app.services.dcf_terms import (
    DATA_SECTION_ORDER,
    _terms,
    config_rows,
    count,
    enum_label,
    fmt_date,
    method_label,
    offered_labels,
    only_when,
    recipient_cover_rows,
    retired_value,
    scenario_changes,
    sheet_name,
    ui,
    value_label,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# The English wording; each file carries the one of its language (P2-17, P8-09).
EU_FOOTER = (
    "This Project has received funding from the European Union's Horizon "
    "Research and Innovation Programme under Grant Agreement N. 101135562 — "
    "www.symbaproject.eu"
)

# SYMBA palette: white + blue + green geometric (per project visual identity).
_HEADER_FILL = PatternFill(fill_type="solid", fgColor="29364E")
# a column the analyst fills in: grey, so a company sees it is not theirs (D4)
_ANALYST_FILL = PatternFill(fill_type="solid", fgColor="8A93A3")
# a stored value converted from a retired one: to check (P2-02)
_CHECK_FILL = PatternFill(fill_type="solid", fgColor="FFF2CC")
_HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
_TITLE_FONT = Font(bold=True, size=14, color="29364E")
_SUBTITLE_FONT = Font(italic=True, size=10, color="404040")
_LABEL_FONT = Font(bold=True)
_FOOTER_FONT = Font(size=8, italic=True, color="888888")
_WRAP_TOP = Alignment(wrap_text=True, vertical="top")

_LISTS_SHEET = "_lists"  # hidden: the dropdown values, one column per field
_EMPTY_DATA_ROWS = 10
# Even a fully-filled section keeps a few blank rows: collection continues
# offline after the export.
_MIN_BLANK_ROWS = 3
# Dropdowns reach well below the prepared rows: a company adding a twelfth
# actor or asset got a cell without its list (Kimi test 2026-11-04, A4-08).
_DROPDOWN_ROWS = 200
_NUMBER_TYPES = {"float", "int"}
_PER_SCENARIO = "float_per_scenario"

# the readable number of a row of a sheet with an id column (P2-18, P8-15)
_ID_PREFIX = {"actors": "A", "flow_matrix": "F", "infrastructure": "I"}
# the column the panes freeze after, so the row stays named while scrolling
# right (P2-20)
_FREEZE_AFTER = {
    "actors": "actor.name", "flow_matrix": "flow.name", "reference_scenario": "ref.flow_id",
    "logistics": "route.flow_id", "costs": "cost.flow_id", "flow_classification": "classif.flow_id",
    "infrastructure": "infra.linked_actor_id",
}


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

    `cover` carries what the files state beyond the payload: `rows` (the
    result page's configuration, worded in `lang`), `case_ref`,
    `generated_on`, `return_by`, `contact`, `version`, `scenarios` ((id,
    label) of the case's scenarios) and `network_png`.

    `data` is the content stored by the Network Builder, when the case
    has any: its rows are written under the headers so the analyst gets
    a partially-filled workbook to continue from.

    `lang` sets the fixed text, and the payload should come through
    `dcf_terms.localize` so the sections and fields carry it too. Cells show
    labels, not codes: the enum value's label, an actor's or a flow's name
    (the file goes to partners and is never read back by the app).
    """
    cover = cover or {}
    wb = Workbook()
    wb.remove(wb.active)  # drop the default empty sheet
    lists = wb.create_sheet(_LISTS_SHEET)
    lists.sheet_state = "hidden"
    # a file named after its case, not "openpyxl" with no title (P8-01)
    wb.properties.title = f"{ui(lang, 'title')} — {case_title}" if case_title else ui(lang, "title")
    wb.properties.creator = "SYMBA T4.6"

    ctx = _Context(lang, case_title, cover, data)
    _write_cover_tab(wb, payload, ctx)
    _write_instructions_tab(wb, payload, ctx)

    sections = {s.id: s for s in payload.sections}
    nw = sections.get("network_diagram")
    if nw is not None:
        _write_network_tab(wb, nw, ctx)

    for sec_id in DATA_SECTION_ORDER:
        sec = sections.get(sec_id)
        if sec is not None:
            _write_data_section_tab(wb, sec, ctx, lists)

    mc = sections.get("methodological_choices")
    if mc is not None:
        _write_mandates_tab(wb, mc, payload, ctx)

    wb.move_sheet(_LISTS_SHEET, offset=len(wb.sheetnames))

    buf = BytesIO()
    wb.save(buf)
    return buf.getvalue()


class _Context:
    """What every sheet needs: the language, the case, the cover values, the
    stored rows, names and readable numbers."""

    def __init__(self, lang: str, case_title: str | None, cover: dict[str, Any], data: DcfData | None):
        self.lang = lang
        self.case_title = case_title
        self.cover = cover
        self.data = data
        self.scenarios: list[tuple[str, str]] = list(cover.get("scenarios") or [])
        self.names = _names(data)
        self.extra_actors = _scenario_only_actors(data, self.scenarios)
        self.ids = _display_ids(data, self.extra_actors)
        # the actor names of the Actors sheet, once written, for the columns
        # that name an actor
        self.actor_names_ref: str | None = None


# ---------------------------------------------------------------------------
# Rows and names
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


def _scenario_only_actors(data: DcfData | None, scenarios: list[tuple[str, str]]) -> list[tuple[DcfRow, list[str]]]:
    """Actors that exist only in a scenario's own network, with the scenarios
    they appear in: the recipient must know they exist, and the Actors sheet
    left them out (UX round 6, P2-06, P7-16)."""
    case_ids = {r.row_id for r in rows_for(data, "actors")}
    found: dict[str, tuple[DcfRow, list[str]]] = {}
    for label, variant in scenario_networks(data, scenarios):
        for row in variant.rows_by_section.get("actors", []):
            if row.row_id in case_ids:
                continue
            found.setdefault(row.row_id, (row, []))[1].append(label)
    return list(found.values())


def _display_ids(data: DcfData | None, extra_actors: list[tuple[DcfRow, list[str]]]) -> dict[str, str]:
    """A1, A2… for the actors, F1… for the flows, I1… for the assets, in the
    order of the sheet: "amw7q2s9h1" and "fmw7pwkwe" read as typos (P2-18,
    P8-15). The files are never read back, so the internal id is not needed."""
    out: dict[str, str] = {}
    for section_id, prefix in _ID_PREFIX.items():
        rows = rows_for(data, section_id)
        if section_id == "actors":
            rows = [*rows, *(row for row, _ in extra_actors)]
        for i, row in enumerate(rows, start=1):
            out.setdefault(row.row_id, f"{prefix}{i}")
    return out


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


def _with_seeded_rows(section: DcfSection, rows: list[DcfRow], ctx: _Context) -> list[DcfRow]:
    data = ctx.data
    if section.id == "actors":
        return [*rows, *(row for row, _ in ctx.extra_actors)]
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


# ---------------------------------------------------------------------------
# Columns
# ---------------------------------------------------------------------------


class _Column:
    """One column of a data sheet: a field, or one scenario's column of a
    per-scenario field (one column per scenario instead of several values in
    one cell, UX round 6, P2-06, P8-03, P1-20)."""

    def __init__(self, field, header: str, scenario: str | None = None, per_scenario: bool = False):
        self.field = field
        self.header = header
        self.scenario = scenario  # None = the base case, or the only column
        self.per_scenario = per_scenario


def _columns(section: DcfSection, ctx: _Context) -> list[_Column]:
    cols = []
    for field in section.fields:
        if field.type == _PER_SCENARIO and ctx.scenarios:
            base = field.label_base or _label(field)
            cols.append(_Column(field, f"{base}: {ui(ctx.lang, 'col.base_case')}", None, True))
            cols.extend(_Column(field, f"{base}: {label}", sid, True) for sid, label in ctx.scenarios)
        elif field.type == _PER_SCENARIO:
            cols.append(_Column(field, field.label_base or _label(field)))
        else:
            cols.append(_Column(field, _header_label(field)))
    return cols


def _header_label(field) -> str:
    """Column header as a person reads it: the label, and a star when the
    field has to be filled in by the companies (a grey column filled by the
    analyst carries no star: "Who pays whom" read as required but not theirs,
    P2-10)."""
    return f"{_label(field)} *" if field.required and field.filled_by != "analyst" else _label(field)


def _per_scenario_value(value: Any, scenario: str | None) -> Any:
    if isinstance(value, dict):
        return value.get(scenario or "baseline")
    return value if scenario is None else None


def _cell(field, value: Any, ctx: _Context, row: DcfRow) -> tuple[Any, str | None]:
    """(what the cell shows, a comment when the stored value was converted)."""
    if field.derived:
        return ctx.ids.get(row.row_id, row.row_id), None
    if value is None or value == "":
        return None, None
    if field.type in ctx.names:
        return ctx.names[field.type].get(value, value), None
    if field.type in _NUMBER_TYPES or field.type == _PER_SCENARIO:
        # a quantity typed in the editor arrived as text: Excel flagged it and
        # would not sum it (P8-11)
        number = _number(value)
        return (number if number is not None else value), None
    new = retired_value(field.id, value)
    if new is not None:
        old_label = (field.enum_labels or {}).get(value) or enum_label(ctx.lang, value)
        new_label = value_label(ctx.lang, field, new)
        return new_label, ui(ctx.lang, "note.converted", old=old_label, new=new_label)
    return value_label(ctx.lang, field, value), None


# ---------------------------------------------------------------------------
# Tab writers
# ---------------------------------------------------------------------------


def _eu_funding(lang: str) -> str:
    return ui(lang, "eu.funding")


def _write_cover_tab(wb: Workbook, payload: DcfPayload, ctx: _Context) -> None:
    lang = ctx.lang
    ws = wb.create_sheet(ui(lang, "sheet.cover"))
    # The recipient knows the case by its name, not by a uuid.
    ws["A1"] = f"{ui(lang, 'title')} — {ctx.case_title}" if ctx.case_title else ui(lang, "title")
    ws["A1"].font = _TITLE_FONT

    rows = recipient_cover_rows(payload, lang, ctx.cover, ctx.case_title)
    for i, (label, value) in enumerate(rows, start=3):
        ws.cell(row=i, column=1, value=label).font = _LABEL_FONT
        ws.cell(row=i, column=1).alignment = _WRAP_TOP
        ws.cell(row=i, column=2, value=value).alignment = _WRAP_TOP

    footer_row = 3 + len(rows) + 2
    ws.cell(row=footer_row, column=1, value=_eu_funding(lang)).font = _FOOTER_FONT
    ws.merge_cells(start_row=footer_row, start_column=1, end_row=footer_row, end_column=2)
    ws.cell(row=footer_row + 1, column=1, value=ui(lang, "eu.disclaimer")).font = _FOOTER_FONT
    ws.cell(row=footer_row + 1, column=1).alignment = Alignment(wrap_text=True)
    ws.merge_cells(start_row=footer_row + 1, start_column=1, end_row=footer_row + 1, end_column=2)
    ws.row_dimensions[footer_row + 1].height = 36

    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 100
    _print_setup(ws, ctx, landscape=False, title_rows=None)


# heading / body keys of the instructions, in dcf_terms.json "ui"
_INSTRUCTIONS = ["what", "how", "grey", "ids", "unknown", "units", "conf", "return"]


def _write_instructions_tab(wb: Workbook, payload: DcfPayload, ctx: _Context) -> None:
    """A sheet for the person who has to fill this in: what the file is, how
    to fill it in, what grey columns and row numbers mean, the scenarios, the
    date and the contact (UX round 6, P2-10, P2-18, P2-06)."""
    lang = ctx.lang
    ws = wb.create_sheet(ui(lang, "sheet.instructions"))
    ws["A1"] = ui(lang, "ins.title")
    ws["A1"].font = _TITLE_FONT
    if ctx.case_title:
        ws["A2"] = ui(lang, "ins.case", name=ctx.case_title)
        ws["A2"].font = _SUBTITLE_FONT

    contact = (ctx.cover.get("contact") or "").strip()
    row = 4
    for key in _INSTRUCTIONS:
        c = ws.cell(row=row, column=1, value=ui(lang, f"ins.{key}"))
        c.font = _HEADER_FONT
        c.fill = _HEADER_FILL
        c.alignment = _WRAP_TOP
        body = ui(lang, f"ins.{key}_body")
        if key == "conf":
            # what to do with a value that cannot be shared (P2-10); no
            # "the contact below" when there is none (P8-02)
            body += "\n\n" + ui(lang, "ins.conf_values" if contact else "ins.conf_values_nocontact")
        ws.cell(row=row, column=2, value=body).alignment = _WRAP_TOP
        row += 2

    if ctx.scenarios:
        c = ws.cell(row=row, column=1, value=ui(lang, "ins.scenarios"))
        c.font = _HEADER_FONT
        c.fill = _HEADER_FILL
        c.alignment = _WRAP_TOP
        ws.cell(row=row, column=2, value=ui(lang, "ins.scenarios_body",
                                            n=count(lang, "scenarios", len(ctx.scenarios)))).alignment = _WRAP_TOP
        row += 1
        for label, lines in scenario_changes(lang, ctx.data, ctx.scenarios):
            ws.cell(row=row, column=1, value=label).font = _LABEL_FONT
            ws.cell(row=row, column=1).alignment = _WRAP_TOP
            ws.cell(row=row, column=2, value="; ".join(lines) or None).alignment = _WRAP_TOP
            row += 1
        row += 1

    # the date and the contact only when set: a placeholder in brackets went
    # to the companies (P8-02, P2-19)
    return_by = fmt_date(lang, ctx.cover.get("return_by"))
    if return_by:
        ws.cell(row=row, column=1, value=ui(lang, "ins.return_by")).font = _LABEL_FONT
        ws.cell(row=row, column=2, value=return_by)
        row += 1
    if contact:
        ws.cell(row=row, column=1, value=ui(lang, "ins.contact")).font = _LABEL_FONT
        ws.cell(row=row, column=2, value=contact)
        row += 1

    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 100
    ws.cell(row=row + 2, column=1, value=_eu_funding(lang)).font = _FOOTER_FONT
    _print_setup(ws, ctx, landscape=False, title_rows=None)


def _write_data_section_tab(wb: Workbook, section: DcfSection, ctx: _Context, lists) -> None:
    lang = ctx.lang
    ws = wb.create_sheet(ui(lang, f"sheet.{section.id}"))

    if not section.active:
        ws["A1"] = _title(section)
        ws["A1"].font = _TITLE_FONT
        ws["A3"] = ui(lang, "not_active")
        ws["A3"].alignment = Alignment(wrap_text=True)
        ws.column_dimensions["A"].width = 80
        _print_setup(ws, ctx, landscape=False, title_rows=None)
        return

    columns = _columns(section, ctx)
    ws["A1"] = _title(section)
    ws["A1"].font = _TITLE_FONT
    ws["A2"] = section.description or section.description_en
    ws["A2"].font = _SUBTITLE_FONT
    ws["A2"].alignment = Alignment(wrap_text=True, vertical="top")
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=max(8, min(len(columns), 12)))
    ws.row_dimensions[2].height = 45
    # who fills this sheet in, and what the grey columns mean, on the sheet
    # itself: only the comments said it (UX round 5, D4; round 6, P2-10)
    who = f"{ui(lang, 'h.who')}: {ui(lang, f'who.{section.filled_by}')}" if section.filled_by else ""
    if any(c.field.filled_by == "analyst" for c in columns):
        who = f"{who}. {ui(lang, 'sheet.grey_note')}" if who else ui(lang, "sheet.grey_note")
    if who:
        ws["A3"] = who
        ws["A3"].font = _LABEL_FONT

    # Row 4: header labels; the meaning rides along as a cell comment.
    header_row = 4
    for col_idx, col in enumerate(columns, start=1):
        c = ws.cell(row=header_row, column=col_idx, value=col.header)
        c.font = _HEADER_FONT
        c.fill = _ANALYST_FILL if col.field.filled_by == "analyst" else _HEADER_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        note = _field_note(col, lang, section)
        if note:
            c.comment = Comment(note, "SYMBA T4.6", width=320, height=220)
    ws.row_dimensions[header_row].height = 45

    # Stored rows first, then one row per flow or actor still missing, then
    # blank ones so collection can continue.
    stored = _with_seeded_rows(section, rows_for(ctx.data, section.id), ctx)
    first_data_row = header_row + 1
    for offset, row in enumerate(stored):
        for col_idx, col in enumerate(columns, start=1):
            if not col.field.derived and not row_condition_holds(col.field, row):
                continue  # dormant on this row (e.g. CAPEX on an existing asset): kept, not exported
            raw = row.values.get(col.field.id)
            if col.per_scenario:
                raw = _per_scenario_value(raw, col.scenario)
            shown, note = _cell(col.field, raw, ctx, row)
            cell = ws.cell(row=first_data_row + offset, column=col_idx, value=shown)
            if col.field.type in ("fk_flow", "text"):
                cell.alignment = _WRAP_TOP
            if note:
                cell.comment = Comment(note, "SYMBA T4.6")
                cell.fill = _CHECK_FILL

    blank_start = first_data_row + len(stored)
    blank_count = max(_EMPTY_DATA_ROWS - len(stored), _MIN_BLANK_ROWS)
    last_row = blank_start + blank_count - 1

    dropdown_last = max(last_row, first_data_row + _DROPDOWN_ROWS - 1)
    _add_enum_dropdowns(ws, columns, first_data_row, dropdown_last, lang, lists)
    if section.id == "actors":
        names = [c.field.id for c in columns]
        if "actor.name" in names:
            letter = get_column_letter(names.index("actor.name") + 1)
            ctx.actor_names_ref = f"'{ws.title}'!${letter}${first_data_row}:${letter}${dropdown_last}"
    else:
        _add_actor_dropdowns(ws, columns, first_data_row, dropdown_last, ctx)
    last_col = len(columns)
    if section.id == "actors" and stored:
        last_col += 1
        _write_gives_receives(ws, section, stored, ctx, header_row, last_col)
    # a company filters the flow or actor column to find its own rows (D4); the
    # computed gives/receives column of the actors sheet sorts with its rows
    ws.auto_filter.ref = f"A{header_row}:{get_column_letter(last_col)}{last_row}"

    for col_idx, col in enumerate(columns, start=1):
        ws.column_dimensions[get_column_letter(col_idx)].width = _width(col)

    # the panes keep the header and the column that names the row (P2-20)
    freeze_field = _FREEZE_AFTER.get(section.id)
    ids = [c.field.id for c in columns]
    freeze_col = ids.index(freeze_field) + 2 if freeze_field in ids else 2
    ws.freeze_panes = ws.cell(row=first_data_row, column=freeze_col).coordinate
    _print_setup(ws, ctx, landscape=True, title_rows=f"1:{header_row}")


def _width(col: _Column) -> float:
    field = col.field
    if field.derived:
        return 8
    if field.type == "fk_flow":
        return 44
    if field.type == "fk_actor":
        return 26
    if field.type in ("text", "string_docref") or field.id.endswith(".name"):
        return 30
    return max(14, min(28, len(col.header) * 0.6 + 6))


def _write_gives_receives(ws, section: DcfSection, stored: list[DcfRow], ctx: _Context, header_row: int,
                          col: int) -> None:
    """What each actor gives and receives, from the arrows: one role could
    not say both (UX round 5, D6); computed, not to be typed in. An actor
    of a scenario's network only says so (UX round 6, P7-16)."""
    lang = ctx.lang
    head = ws.cell(row=header_row, column=col, value=f"{ui(lang, 'h.gives')} / {ui(lang, 'h.receives')}")
    head.font = _HEADER_FONT
    head.fill = _HEADER_FILL
    head.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    head.comment = Comment(ui(lang, "note.computed"), "SYMBA T4.6")
    flows = rows_for(ctx.data, "flow_matrix")
    only_in = {row.row_id: labels for row, labels in ctx.extra_actors}
    for offset, row in enumerate(stored):
        if row.row_id in only_in:
            text = "; ".join(ui(lang, "actors.only_scenario", label=label) for label in only_in[row.row_id])
        else:
            gives = [str(f.values.get("flow.name") or f.row_id) for f in flows
                     if f.values.get("flow.origin_actor_id") == row.row_id]
            receives = [str(f.values.get("flow.name") or f.row_id) for f in flows
                        if f.values.get("flow.dest_actor_id") == row.row_id]
            text = "; ".join(x for x in (
                f"{ui(lang, 'h.gives')}: {', '.join(gives)}" if gives else "",
                f"{ui(lang, 'h.receives')}: {', '.join(receives)}" if receives else "",
            ) if x)
        ws.cell(row=header_row + 1 + offset, column=col, value=text or None).alignment = _WRAP_TOP
    ws.column_dimensions[get_column_letter(col)].width = 40


def _field_note(col: _Column, lang: str = "en", section=None) -> str:
    """The comment on a header: who fills it in when it is not the sheet's
    filler, what the field means, the values it takes and why it is asked, in
    words. No field id: it was noise to whoever fills the file in."""
    field = col.field
    parts = []
    if field.derived:
        # the readable row number, and what to write in a new row (P2-18)
        return ui(lang, "note.id")
    if field.id == "flow.q5_class":
        # filled in from the study's answers; the company cannot change the
        # questionnaire, it tells the contact (P2-10)
        parts.append(ui(lang, "note.q5_company"))
    else:
        if field.filled_by == "analyst":
            parts.append(ui(lang, "note.analyst"))
        help_text = field.help or field.description_en
        if help_text:
            parts.append(str(help_text))
    labels = offered_labels(field, lang)
    if labels:
        parts.append(f"{ui(lang, 'note.allowed')}: " + "; ".join(labels))
    if col.per_scenario:
        parts.append(ui(lang, "note.per_scenario", instructions=sheet_name(lang, "instructions")))
    if field.reason:
        parts.append(f"{ui(lang, 'note.because')}: {field.reason}")
    rows_note = only_when(section, field, lang) if section is not None else None
    if rows_note:
        parts.append(rows_note)
    return "\n".join(parts)


def _add_enum_dropdowns(ws, columns: list[_Column], first_row: int, last_row: int, lang: str = "en",
                        lists=None) -> None:
    """Turn every enum into a dropdown of its labels.

    Typing an allowed value from memory is how a collection file comes
    back with 'medium', 'Med' and 'M' in the same column. The labels sit in
    a hidden sheet, one column per field: an inline list breaks on a comma
    inside a label and is capped at 255 characters.
    """
    if lists is None:
        return
    for col_idx, col in enumerate(columns, start=1):
        labels = offered_labels(col.field, lang)
        if not labels:
            continue
        list_col = lists.max_column + 1 if lists.max_row > 1 or lists["A1"].value else 1
        letter_l = get_column_letter(list_col)
        for i, label in enumerate(labels, start=1):
            lists.cell(row=i, column=list_col, value=label)
        dv = DataValidation(
            type="list", formula1=f"'{_LISTS_SHEET}'!${letter_l}$1:${letter_l}${len(labels)}",
            allow_blank=True, showDropDown=False,
            # the error text was there but never shown: Excel took any free
            # text, against what the instructions say (Kimi test 2026-11-04, A4-04)
            showErrorMessage=True,
        )
        dv.error = ui(lang, "dv.error")
        dv.errorTitle = ui(lang, "dv.title")
        ws.add_data_validation(dv)
        letter = get_column_letter(col_idx)
        dv.add(f"{letter}{first_row}:{letter}{last_row}")


def _add_actor_dropdowns(ws, columns: list[_Column], first_row: int, last_row: int, ctx: _Context) -> None:
    """A column that names an actor offers the names of the Actors sheet: the
    linked actor of an asset was free text to copy by hand (P2-05). A name
    not in the list only warns: an actor may be added to the sheet later."""
    if ctx.actor_names_ref is None:
        return
    for col_idx, col in enumerate(columns, start=1):
        if col.field.type != "fk_actor":
            continue
        dv = DataValidation(type="list", formula1=ctx.actor_names_ref, allow_blank=True,
                            showDropDown=False, showErrorMessage=True, errorStyle="warning")
        dv.error = ui(ctx.lang, "dv.error")
        dv.errorTitle = ui(ctx.lang, "dv.title")
        ws.add_data_validation(dv)
        letter = get_column_letter(col_idx)
        dv.add(f"{letter}{first_row}:{letter}{last_row}")


def _checklist(payload: DcfPayload) -> list:
    """Everything the case has to document, in one list: the mandates and the
    rules between the methods, then the decision points and the D4.1 Part 2
    sector rules, which only the result page listed (UX round 6, P1-22, P6-10)."""
    return [*payload.obligations, *payload.decision_points, *payload.sector_rules]


def _statement(item, lang: str) -> str:
    if item.origin == "decision_point":
        return ui(lang, "mc.cdp_statement", name=item.title or item.id, body=item.statement,
                  resolution=item.resolution or "—")
    if item.origin == "sector_rule":
        strength = ui(lang, f"strength.{item.strength}") if item.strength else ""
        source = f" ({item.source_section})" if item.source_section else ""
        return ", ".join(x for x in (item.title, strength) if x) + f": {item.statement}{source}"
    return item.statement if not item.title else f"{item.title}: {item.statement}"


def _write_mandates_tab(wb: Workbook, section: DcfSection, payload: DcfPayload, ctx: _Context) -> None:
    """One tab for everything the case has to document, headed by the
    configuration of the study: both are for whoever carries out the study
    (the configuration used to open the cover the companies read first, P8-02).

    Procedural mandates and triggered cross-method rules used to live in
    two different places in two different formats; they are the same job
    for whoever fills the file in, so they share a tab, with `Origin`
    keeping the traceability a reviewer needs.
    """
    lang = ctx.lang
    ws = wb.create_sheet(ui(lang, "sheet.methodological_choices"))
    ws["A1"] = _title(section)
    ws["A1"].font = _TITLE_FONT
    # the description already says it is for whoever carries out the study
    ws["A2"] = section.description or section.description_en
    ws["A2"].font = _SUBTITLE_FONT
    ws["A2"].alignment = Alignment(wrap_text=True, vertical="top")
    ws.merge_cells("A2:I2")
    ws.row_dimensions[2].height = 30

    row = 4
    ws.cell(row=row, column=1, value=ui(lang, "mc.config")).font = _TITLE_FONT
    row += 1
    for label, value in config_rows(payload, lang, ctx.cover.get("rows")):
        ws.cell(row=row, column=1, value=label).font = _LABEL_FONT
        ws.cell(row=row, column=1).alignment = _WRAP_TOP
        ws.cell(row=row, column=2, value=value).alignment = _WRAP_TOP
        ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=9)
        ws.row_dimensions[row].height = max(15, 15 * (len(str(value)) // 140 + 1))
        row += 1

    row += 1
    ws.cell(row=row, column=1, value=ui(lang, "mc.checklist")).font = _TITLE_FONT
    header_row = row + 1
    headers = [ui(lang, f"h.{k}") for k in (
        "category", "origin", "id", "method", "statement", "because", "target", "assignee", "status")]
    for col_idx, label in enumerate(headers, start=1):
        c = ws.cell(row=header_row, column=col_idx, value=label)
        c.font = _HEADER_FONT
        c.fill = _HEADER_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    row = header_row + 1
    for item in _checklist(payload):
        ws.cell(row=row, column=1, value=item.category_label or item.category).alignment = _WRAP_TOP
        ws.cell(row=row, column=2, value=item.origin_label or item.origin).alignment = _WRAP_TOP
        ws.cell(row=row, column=3, value=item.id).alignment = _WRAP_TOP
        ws.cell(row=row, column=4, value=method_label(lang, item.method)).alignment = _WRAP_TOP
        ws.cell(row=row, column=5, value=_statement(item, lang)).alignment = _WRAP_TOP
        ws.cell(row=row, column=6, value=item.because or item.trigger or "").alignment = _WRAP_TOP
        ws.cell(row=row, column=7, value="")
        ws.cell(row=row, column=8, value="")
        ws.cell(row=row, column=9, value=ui(lang, "status.pending"))
        row += 1

    widths = {"A": 22, "B": 14, "C": 14, "D": 10, "E": 70, "F": 28, "G": 18, "H": 16, "I": 12}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w
    ws.auto_filter.ref = f"A{header_row}:I{max(row - 1, header_row)}"
    _print_setup(ws, ctx, landscape=True, title_rows=f"{header_row}:{header_row}")


def _write_network_tab(wb: Workbook, section: DcfSection, ctx: _Context) -> None:
    """Edge list of the drawn network, or the placeholder note when the
    analyst has not drawn one yet; the picture of the network, as the app
    draws it, to the right of the list when the browser sent one, with its
    caption (UX round 6, P8-13)."""
    lang = ctx.lang
    data = ctx.data
    ws = wb.create_sheet(ui(lang, "sheet.network_diagram"))
    ws["A1"] = _title(section)
    ws["A1"].font = _TITLE_FONT

    edges = edge_list(data)
    own_networks = scenario_networks(data, ctx.scenarios)
    png = ctx.cover.get("network_png")
    if png:
        actors = len(rows_for(data, "actors"))
        ws["H1"] = ui(lang, "dx.fig", actors=count(lang, "actors", actors), flows=count(lang, "flows", len(edges)))
        ws["H1"].font = _SUBTITLE_FONT
        ws.add_image(_scaled_image(png, 900), "H2")
    # a scenario's network may be drawn while the case's is still empty (Q2 = B)
    if not edges and not own_networks:
        ws["A3"] = ui(lang, "nw.none")
        ws["A3"].alignment = Alignment(wrap_text=True)
        ws.column_dimensions["A"].width = 90
        _print_setup(ws, ctx, landscape=True, title_rows=None)
        return

    # "scenarios follow below" only when one does (Kimi test 2026-11-04, A3-02)
    intro = ui(lang, "nw.intro")
    ws["A2"] = f"{intro} {ui(lang, 'nw.intro_scenarios')}" if own_networks else intro
    ws["A2"].font = _SUBTITLE_FONT
    ws["A2"].alignment = Alignment(wrap_text=True, vertical="top")
    ws.merge_cells("A2:F2")
    ws.row_dimensions[2].height = 45

    nature = _terms()[lang if lang in _terms() else "en"]["fields"]["flow.type"]["label"]
    headers = [ui(lang, "h.flow"), ui(lang, "h.origin_actor"), ui(lang, "h.dest_actor"), nature,
               ui(lang, "h.quantity"), ui(lang, "h.unit")]

    def edge_block(header_row: int, block_edges: list[dict]) -> int:
        for col_idx, label in enumerate(headers, start=1):
            c = ws.cell(row=header_row, column=col_idx, value=label)
            c.font = _HEADER_FONT
            c.fill = _HEADER_FILL
            c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        for offset, edge in enumerate(block_edges, start=1):
            r = header_row + offset
            ws.cell(row=r, column=1, value=edge["name"]).alignment = _WRAP_TOP
            ws.cell(row=r, column=2, value=edge["origin"]).alignment = _WRAP_TOP
            ws.cell(row=r, column=3, value=edge["destination"]).alignment = _WRAP_TOP
            kind = retired_value("flow.type", edge["type"]) or edge["type"]
            ws.cell(row=r, column=4, value=enum_label(lang, kind) or None)
            quantity = _number(edge["quantity"])
            ws.cell(row=r, column=5, value=quantity if quantity is not None else edge["quantity"])
            ws.cell(row=r, column=6, value=edge["unit"])
        return header_row + len(block_edges)

    last = edge_block(4, edges)
    # each scenario with a network of its own: its links below the case's
    # (scenario networks, owner OK 2026-11-04)
    for label, variant in own_networks:
        ws.cell(row=last + 2, column=1, value=ui(lang, "nw.sc_title", label=label)).font = _SUBTITLE_FONT
        last = edge_block(last + 3, edge_list_rows(variant.rows_by_section.get("actors", []),
                                                    variant.rows_by_section.get("flow_matrix", [])))

    for letter, width in zip("ABCDEF", (30, 26, 26, 16, 12, 12), strict=True):
        ws.column_dimensions[letter].width = width
    _print_setup(ws, ctx, landscape=True, title_rows=None)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _escape(text: str) -> str:
    return text.replace("&", "&&")


def _print_setup(ws, ctx: _Context, landscape: bool, title_rows: str | None) -> None:
    """A4, one page wide, the header rows repeated on every page, the case
    in the page header, the funding line and "page X of Y" in the footer:
    the workbook printed in portrait on Letter, split over pages without
    its headers (UX round 6, P8-08)."""
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr = PageSetupProperties(fitToPage=True)
    ws.print_options.gridLines = False
    if title_rows:
        ws.print_title_rows = title_rows
    if ctx.case_title:
        ws.oddHeader.center.text = _escape(ctx.case_title)
        ws.oddHeader.center.size = 9
    ws.oddFooter.left.text = _escape(_eu_funding(ctx.lang))
    ws.oddFooter.left.size = 7
    ws.oddFooter.right.text = f"{ui(ctx.lang, 'dx.footer_page')} &P {ui(ctx.lang, 'dx.footer_of')} &N"
    ws.oddFooter.right.size = 8


def _scaled_image(png: bytes, max_width_px: int) -> XLImage:
    """An openpyxl image of `png`, no wider than `max_width_px` (needs Pillow)."""
    img = XLImage(BytesIO(png))
    if img.width > max_width_px:
        ratio = max_width_px / img.width
        img.width, img.height = int(img.width * ratio), int(img.height * ratio)
    return img
