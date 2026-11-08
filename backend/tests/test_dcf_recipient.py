"""The Data Collection File for the company that receives it (UX round 6,
2026-11-08: P2 the dairy that fills it in, P8 the editor who sends it).
Scenarios named where quantities are asked per scenario, actors of a
scenario network on the Actors sheet, numbers written as numbers, readable
row numbers, one order for the two files, the reader's language."""
from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

import pytest
from docx import Document
from openpyxl import load_workbook

from app.domain.dcf_data import DcfData, DcfNetworkVariant, DcfRow
from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Q3, AlternativeScenario, Case, Flow
from app.engine.dcf_compose import compose_dcf
from app.engine.pipeline import run as pipeline_run
from app.services.dcf_docx import generate_dcf_docx_bytes
from app.services.dcf_excel import render_xlsx
from app.services.dcf_terms import count, fmt_date, localize, ui

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT / "backend/app/schemas/dcf_schema.json").read_text())
CENSUS = json.loads((ROOT / "backend/coordination/dcf_mandates_census.json").read_text())
SCENARIOS = [("s1", "Second dairy joins")]


@pytest.fixture()
def case(schemas):
    c = Case(q1=Q1.B, q2=Q2.B, q3=Q3(env=True, eco=True), q4={Q4.E},
             q6a=Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES, q6b=Q6b.TRL9, q7=Q7.B,
             flows=[Flow(id="fx9", name="whey", q5=Q5.a)],
             alternative_scenarios=[AlternativeScenario(id="s1", label="Second dairy joins", overrides={})])
    pipeline_run(c, schemas)
    return c


@pytest.fixture()
def data():
    actors = [DcfRow(row_id="amw7q2s9h1", values={"actor.name": "Dairy", "actor.role": "partner"}),
              DcfRow(row_id="amw7q30k12", values={"actor.name": "Biogas", "actor.role": "partner"})]
    flows = [DcfRow(row_id="fx9", values={
        "flow.name": "whey", "flow.origin_actor_id": "amw7q2s9h1", "flow.dest_actor_id": "amw7q30k12",
        "flow.type": "material", "flow.quantity_projected": {"baseline": "12000", "s1": "15000"},
        "flow.quality.purity_pct": "93,5", "flow.quality.reliability_of_supply": "low"})]
    variant = DcfNetworkVariant(rows_by_section={
        "actors": [*actors, DcfRow(row_id="anew", values={"actor.name": "Second dairy", "actor.role": "partner"})],
        "flow_matrix": flows})
    return DcfData(case_id="c", rows_by_section={"actors": actors, "flow_matrix": flows},
                   networks_by_scenario={"s1": variant})


def _xlsx(case, data, lang="en"):
    payload = localize(compose_dcf(case, SCHEMA, CENSUS), lang)
    cover = {"scenarios": SCENARIOS, "generated_on": "2026-11-08", "case_ref": "abcd1234"}
    return load_workbook(BytesIO(render_xlsx(payload, data, "Dairy case", lang=lang, cover=cover)))


def _headers(ws) -> list:
    return [c.value for c in ws[4]]


def test_per_scenario_quantities_get_a_column_per_named_scenario(case, data):
    """P2-06, P8-03, P1-20: "Projected quantity (per scenario)" in one cell,
    and no scenario named anywhere in the files."""
    ws = _xlsx(case, data)["Flow Matrix"]
    headers = _headers(ws)
    base = headers.index("Projected quantity (per year): base case")
    assert headers[base + 1] == "Projected quantity (per year): Second dairy joins"
    assert ws.cell(row=5, column=base + 1).value == 12000
    assert ws.cell(row=5, column=base + 2).value == 15000


def test_quantities_are_numbers_not_text(case, data):
    """P8-11: a quantity typed in the editor reached Excel as text."""
    ws = _xlsx(case, data)["Flow Matrix"]
    purity = _headers(ws).index("Purity (%)") + 1
    assert ws.cell(row=5, column=purity).value == 93.5


def test_an_actor_of_a_scenario_network_is_on_the_actors_sheet(case, data):
    """P7-16, P2-06: the actor added by a scenario had no row to fill in."""
    ws = _xlsx(case, data)["Actors"]
    rows = [[c.value for c in r] for r in ws.iter_rows(min_row=5, max_row=7)]
    assert [r[0] for r in rows] == ["A1", "A2", "A3"]
    assert rows[2][1] == "Second dairy"
    assert rows[2][-1] == "Only in the scenario “Second dairy joins”"


def test_the_cover_and_the_instructions_name_the_scenarios(case, data):
    wb = _xlsx(case, data, "it")
    cover = " ".join(str(c.value) for r in wb["Copertina"].iter_rows() for c in r if c.value)
    assert "«Second dairy joins»" in cover
    instructions = " ".join(str(c.value) for r in wb["Istruzioni"].iter_rows() for c in r if c.value)
    assert "uno scenario alternativo" in instructions and "Attore aggiunto: Second dairy" in instructions


def test_the_frozen_panes_keep_the_row_named(case, data):
    """P2-20: only the header was frozen; the flow scrolled away."""
    wb = _xlsx(case, data)
    assert wb["Flow Matrix"].freeze_panes == "E5"
    assert wb["Logistics"].freeze_panes == "B5"
    assert wb["Actors"].freeze_panes == "C5"


def test_values_agree_with_their_field_in_italian(case, data):
    """P2-17: "Affidabilità: basso", "Frequenza: continuo"."""
    ws = _xlsx(case, data, "it")["Matrice dei flussi"]
    reliability = _headers(ws).index("Affidabilità della fornitura") + 1
    assert ws.cell(row=5, column=reliability).value == "bassa"
    lists = {str(c.value) for row in _xlsx(case, data, "it")["_lists"].iter_rows() for c in row if c.value}
    assert {"bassa", "continua"} <= lists


def test_the_word_document_follows_the_order_of_the_workbook(case, data):
    """P8-07: §3 used the schema's order and the long titles; the network sheet
    sat last in the workbook."""
    payload = localize(compose_dcf(case, SCHEMA, CENSUS), "en")
    doc = Document(BytesIO(generate_dcf_docx_bytes(payload, "Dairy case", data, cover={"scenarios": SCENARIOS})))
    headings = [p.text for p in doc.paragraphs if p.style.name == "Heading 2"]
    sheets = [h for h in headings if h in ("Actors", "Flow Matrix", "Reference Scenario", "Logistics",
                                           "Costs & Revenues", "Infrastructure", "Flow Classification")]
    # the actors of §2 come first, then §3 in the workbook's order
    assert sheets[1:] == ["Actors", "Flow Matrix", "Reference Scenario", "Logistics", "Costs & Revenues",
                          "Infrastructure", "Flow Classification"]
    text = "\n".join(p.text for p in doc.paragraphs)
    assert text.index("Data Collection File cover") < text.index("§1.") < text.index("§2.") < text.index("§3.")
    assert "Second dairy joins" in text


def test_dates_and_counts_read_in_the_language():
    assert fmt_date("it", "2026-11-08") == "8 novembre 2026"
    assert fmt_date("de", "2026-11-08") == "8. November 2026"
    assert fmt_date("es", "2026-11-08") == "8 de noviembre de 2026"
    assert count("it", "cflows", 1) == "1 flusso collegato"
    assert count("en", "actors", 3) == "3 actors"
    assert "Finanziato dall'Unione Europea" in ui("it", "eu.disclaimer")


def test_a_column_naming_an_actor_offers_the_actors(case, data):
    """P2-05: the linked actor of an asset was free text to copy by hand."""
    wb = _xlsx(case, data)
    dvs = [dv for dv in wb["Infrastructure"].data_validations.dataValidation if "'Actors'!" in dv.formula1]
    assert dvs and dvs[0].errorStyle == "warning"
    assert any("'Actors'!" in dv.formula1 for dv in wb["Flow Matrix"].data_validations.dataValidation)


def test_the_overview_payload_offers_no_retired_value(case):
    """A10 (P1-05, P6-15, P7-18): the page listed waste / by-product,
    producer / consumer and the two old price bases."""
    payload = localize(compose_dcf(case, SCHEMA, CENSUS), "en")
    fields = {f.id: f for s in payload.sections for f in s.fields}
    assert "by_product" not in fields["flow.type"].enum_values
    assert "producer" not in fields["actor.role"].enum_values
    assert "gate_fee_paid" not in fields["cost.price_basis"].enum_values
