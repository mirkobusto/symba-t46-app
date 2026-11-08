"""Tests for app.services.dcf_excel.

Verifies the rendered workbook is structurally correct (right tabs,
header cells, expected technical-id row, EU footer present).
"""
from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

import pytest
from openpyxl import load_workbook

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.dcf_compose import compose_dcf
from app.engine.pipeline import run as pipeline_run
from app.services.dcf_excel import EU_FOOTER, render_xlsx


@pytest.fixture(scope="module")
def dcf_schema() -> dict:
    p = (
        Path(__file__).resolve().parents[1] / "app" / "schemas" / "dcf_schema.json"
    )
    with open(p) as f:
        return json.load(f)


@pytest.fixture(scope="module")
def mandates_census() -> dict:
    p = (
        Path(__file__).resolve().parents[1]
        / "coordination" / "dcf_mandates_census.json"
    )
    with open(p) as f:
        return json.load(f)


def _flows(*qs):
    return [Flow(id=f"f{i+1}", name=f"flow{i+1}", q5=q) for i, q in enumerate(qs)]


@pytest.fixture()
def payload_wiktor(schemas, dcf_schema, mandates_census):
    case = Case(
        q1=Q1.B, q2=Q2.B, q3=Q3(env=True, eco=True), q4={Q4.E},
        q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
        flows=_flows(Q5.a, Q5.c, Q5.c),
    )
    pipeline_run(case, schemas)
    return compose_dcf(case, dcf_schema, mandates_census)


@pytest.fixture()
def payload_arce(schemas, dcf_schema, mandates_census):
    """q7=A → logistics tab will be a placeholder."""
    case = Case(
        q1=Q1.B, q2=Q2.A, q3=Q3(env=True), q4={Q4.E},
        q6a=Q6a.PLASTICS_PACKAGING, q6b=Q6b.TRL9, q7=Q7.A,
        flows=_flows(Q5.b, Q5.c),
    )
    pipeline_run(case, schemas)
    return compose_dcf(case, dcf_schema, mandates_census)


# ---------------------------------------------------------------------------
# Structure
# ---------------------------------------------------------------------------


def test_render_returns_bytes(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    assert isinstance(blob, bytes)
    assert len(blob) > 1000  # workbook isn't empty


def test_workbook_has_expected_tabs(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    # one order with the Word document: the network after the instructions,
    # the companies' sheets, then the analyst's (UX round 6, P2-09, P8-07)
    expected = ["Cover", "Instructions", "Network Diagram", "Actors", "Flow Matrix", "Reference Scenario",
                "Logistics", "Costs & Revenues", "Infrastructure", "Flow Classification",
                "Methodological Choices"]
    # plus the hidden sheet that holds the dropdown labels
    assert wb.sheetnames == [*expected, "_lists"]
    assert wb["_lists"].sheet_state == "hidden"


def test_cover_tab_carries_case_metadata(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    cover = wb["Cover"]
    assert cover["A1"].value == "SYMBA T4.6: Data Collection File"

    # Read the label/value pairs from rows 3+: written for the recipient
    labels = {cover.cell(row=r, column=1).value for r in range(3, 14)}
    assert "Case reference" in labels
    assert "What we ask you" in labels and "Confidential" in labels
    assert "ILCD situation" not in labels and "LCC type" not in labels


def test_cover_has_no_pathway_row(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    cover = load_workbook(BytesIO(blob))["Cover"]
    labels = {cover.cell(row=r, column=1).value for r in range(3, 11)}
    assert "Pathway" not in labels and "IS-01 Extended" not in labels

def test_actors_tab_has_header_row(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    ws = wb["Actors"]
    # Row 4 should be the header labels
    header_values = [ws.cell(row=4, column=c).value for c in range(1, 10)]
    # at least "Actor ID" should appear
    assert "Actor ID" in header_values


def test_actors_tab_keeps_the_field_ids_in_the_header_comments(payload_wiktor):
    """The technical ids used to occupy a second visible row, which made
    the sheet read as a schema dump to whoever had to fill it in. They now
    live in the header comment, so the mapping survives without being in
    the way."""
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    ws = wb["Actors"]
    notes = [
        ws.cell(row=4, column=c).comment.text
        for c in range(1, 10)
        if ws.cell(row=4, column=c).comment
    ]
    joined = "\n".join(notes)
    # explained in words, without the field ids that read as code to whoever
    # fills the file in (UX round 5, P2-05, P3-10)
    assert "actor.id" not in joined and "actor.role" not in joined
    assert "Allowed:" in joined
    # and row 5 is data, not a second header
    assert ws.cell(row=5, column=2).value is None


def test_required_columns_are_starred(payload_wiktor):
    ws = load_workbook(BytesIO(render_xlsx(payload_wiktor)))["Actors"]
    headers = [ws.cell(row=4, column=c).value for c in range(1, 10)]
    assert any(h and h.endswith(" *") for h in headers)


def test_flow_classification_tab_has_its_columns_and_dropdowns(payload_wiktor):
    wb = load_workbook(BytesIO(render_xlsx(payload_wiktor)))
    ws = wb["Flow Classification"]
    headers = [c.value for c in ws[4] if c.value]
    assert any("Freedom-to-Act" in h for h in headers) and any("End-of-Waste" in h for h in headers)
    assert ws.data_validations.dataValidation, "no dropdown on the Flow Classification tab"


def test_enum_columns_get_a_dropdown(payload_wiktor):
    """Free text is how a column comes back with 'medium', 'Med' and 'M'."""
    ws = load_workbook(BytesIO(render_xlsx(payload_wiktor)))["Actors"]
    assert ws.data_validations.dataValidation, "no dropdown on the Actors tab"


def test_dropdowns_refuse_free_text_and_reach_added_rows(payload_wiktor):
    """Kimi test 2026-11-04: Excel took any free text in a list cell although
    the instructions say it does not (A4-04), and a twelfth row had no list
    (A4-08)."""
    ws = load_workbook(BytesIO(render_xlsx(payload_wiktor)))["Actors"]
    for dv in ws.data_validations.dataValidation:
        assert dv.showErrorMessage and dv.error
        assert max(rng.max_row for rng in dv.sqref.ranges) >= 5 + 199


def test_instructions_tab_tells_the_recipient_what_to_do(payload_wiktor):
    ws = load_workbook(BytesIO(render_xlsx(payload_wiktor, None, "Wiktor")))["Instructions"]
    text = "\n".join(
        str(c.value) for row in ws.iter_rows() for c in row if c.value is not None
    )
    assert "Case: Wiktor" in text
    assert "Confidentiality" in text
    assert "Grey columns" in text and "A1, A2" in text
    # no placeholder when no date was set (P8-02, P2-19)
    assert "agree a date" not in text


def test_flow_matrix_tab_has_marginal_market_when_q1c(
    schemas, dcf_schema, mandates_census
):
    """q1=C → flow.marginal_market_ref should be in the header."""
    case = Case(
        q1=Q1.C, q2=Q2.B, q3=Q3(env=True, eco=True, soc=True), q4={Q4.E},
        q6a=Q6a.BIOBASED_POLYMERS, q6b=Q6b.TRL9, q7=None,
        flows=_flows(Q5.b, Q5.c),
    )
    pipeline_run(case, schemas)
    payload = compose_dcf(case, dcf_schema, mandates_census)
    blob = render_xlsx(payload)
    wb = load_workbook(BytesIO(blob))
    ws = wb["Flow Matrix"]
    notes = "\n".join(
        ws.cell(row=4, column=c).comment.text
        for c in range(1, 30)
        if ws.cell(row=4, column=c).comment
    )
    # the column is there, marked for the analyst (grey, UX round 5 D4)
    assert "flow.marginal_market_ref" not in notes
    assert "For whoever carries out the study" in notes


def test_inactive_tab_shows_placeholder(payload_arce):
    """A section that does not apply gets a placeholder, not a header row. The
    Arce case is environment-only, so Costs & Revenues is the inactive one
    (Logistics used to be, until Q7=A also got it; audit I-08)."""
    blob = render_xlsx(payload_arce)
    wb = load_workbook(BytesIO(blob))
    ws = wb["Costs & Revenues"]
    a3 = ws["A3"].value
    assert a3 is not None and "not active for this case" in a3


# ---------------------------------------------------------------------------
# Methodological choices tab
# ---------------------------------------------------------------------------


def _checklist_header(ws) -> int:
    return next(r for r in range(1, 60) if ws.cell(row=r, column=1).value == "Category")


def test_mandates_tab_lists_mandates_and_triggered_rules(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    ws = wb["Methodological Choices"]
    # the configuration of the study first, then the checklist (P8-02)
    assert ws["A4"].value == "Configuration of the study"
    header = _checklist_header(ws)
    headers = [ws.cell(row=header, column=c).value for c in range(1, 10)]
    assert headers == [
        "Category", "Origin", "ID", "Method", "Statement (deliverable text, English)", "Applies because",
        "Deliverable target", "Assignee", "Status",
    ]
    row_count = 0
    for r in range(header + 1, 300):
        if ws.cell(row=r, column=3).value:  # id column
            row_count += 1
    assert row_count >= 25
    origins = {ws.cell(row=r, column=2).value for r in range(header + 1, header + 1 + row_count)}
    # mandates and rules, then the decision points of the case (P1-22, P6-10)
    assert {"mandate", "rule", "decision_point"} <= origins
    methods = {ws.cell(row=r, column=4).value for r in range(header + 1, header + 1 + row_count)}
    assert "SLCA" not in methods


def test_sector_rules_join_the_checklist(schemas, dcf_schema, mandates_census):
    """The D4.1 Part 2 rules of the chapters a flow touches, with strength and
    section but without the line numbers (P1-22, P8-09)."""
    case = Case(
        q1=Q1.B, q2=Q2.B, q3=Q3(env=True, eco=True), q4={Q4.E},
        q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
        flows=[Flow(id="f1", name="sludge", q5=Q5.a, sector=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES)],
    )
    pipeline_run(case, schemas)
    from app.services.dcf_terms import localize
    payload = localize(compose_dcf(case, dcf_schema, mandates_census), "it")
    ws = load_workbook(BytesIO(render_xlsx(payload, lang="it")))["Scelte metodologiche"]
    rows = [[c.value for c in r] for r in ws.iter_rows(min_row=5)]
    sector = [r for r in rows if r[1] == "Regola di settore"]
    assert sector and all(r[0] == "Regole di settore (D4.1 Parte 2)" for r in sector)
    assert sector[0][4].startswith("§6 ") and "obbligatoria" in sector[0][4]
    assert all("L0" not in str(r[4]) for r in sector)
    assert sector[0][5] == "flusso sludge"


# ---------------------------------------------------------------------------
# EU footer
# ---------------------------------------------------------------------------


def test_eu_footer_present_in_cover(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    cover = wb["Cover"]
    # Footer somewhere in column A
    has_footer = False
    for r in range(1, 30):
        v = cover.cell(row=r, column=1).value
        if v and "Grant Agreement N. 101135562" in str(v):
            has_footer = True
            break
    assert has_footer


def test_eu_footer_text_is_canonical(payload_wiktor):
    blob = render_xlsx(payload_wiktor)
    wb = load_workbook(BytesIO(blob))
    # canonical reference is in our module
    assert "101135562" in EU_FOOTER
    assert "www.symbaproject.eu" in EU_FOOTER
    assert "Horizon" in EU_FOOTER
    # every sheet prints it in the footer, A4, one page wide; the data sheets
    # no longer carry it inside the input area (P8-14, P1-21, P8-08)
    for sheet_name in wb.sheetnames:
        if sheet_name == "_lists":
            continue  # hidden, holds the dropdown labels
        ws = wb[sheet_name]
        assert "101135562" in (ws.oddFooter.left.text or ""), sheet_name
        assert str(ws.page_setup.paperSize) == ws.PAPERSIZE_A4, sheet_name
        assert ws.sheet_properties.pageSetUpPr.fitToPage, sheet_name
    actors = wb["Actors"]
    assert not any("101135562" in str(c.value) for row in actors.iter_rows() for c in row if c.value)
    assert actors.print_title_rows and actors.page_setup.orientation == "landscape"


def test_cover_values_are_worded_in_the_reader_language(payload_wiktor):
    # UX round 2026-11-03: "ILCD Situation C1", "deactivated" and "Analysis" stood
    # under Italian labels on the cover
    wb = load_workbook(BytesIO(render_xlsx(payload_wiktor, lang="it")))
    # the configuration now heads the analyst's checklist (P8-02)
    values = {wb["Scelte metodologiche"].cell(row=r, column=2).value for r in range(5, 12)}
    assert any(str(v).startswith("Situazione ILCD") for v in values)
    assert "deactivated" not in values and "active" not in values
    assert not any(str(v).startswith("ILCD Situation") for v in values)
