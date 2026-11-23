"""The files of a case never saved carry the network drawn in the browser.

An unsaved case (no account) keeps its Network Builder draft in the browser;
the draft export endpoints used to build the files from the questionnaire
alone, so the network came out as a picture but not in the "Actors" and "Flow
Matrix" sheets. The browser now sends the draft as `data`, and the server
judges it as the content of a saved case: same checks, dormant values dropped.
"""
from __future__ import annotations

import io

import pytest
from docx import Document
from openpyxl import load_workbook

from app.routers.dcf import MAX_DRAFT_DATA_ROWS

CASE = {
    "q1": "B", "q2": "B", "decision_context": "micro", "q3": {"env": True, "eco": True, "soc": False},
    "flows": [{"id": "f1", "name": "sludge", "q5": "a"}, {"id": "f2", "name": "biogas", "q5": "c"}],
    "alternative_scenarios": [{"id": "alt1", "label": "Landfill", "overrides": {"flow_q5": {"f1": "b"}}}],
}


def _network(**flow_values) -> dict:
    """What the Network Builder holds for a case with no server id (`case_id` empty)."""
    return {
        "schema_version": "1.1",
        "case_id": "",
        "rows_by_section": {
            "actors": [
                {"row_id": "a1", "values": {"actor.name": "WWTP Alfa", "actor.role": "partner", "actor.country_iso2": " cz "}},
                {"row_id": "a2", "values": {"actor.name": "Biogas plant Beta", "actor.role": "partner"}},
            ],
            "flow_matrix": [
                {"row_id": "f1", "values": {"flow.origin_actor_id": "a1", "flow.dest_actor_id": "a2",
                                            "flow.type": "waste", "flow.unit": "t/y", **flow_values}},
                {"row_id": "f2", "values": {}},
            ],
        },
        "layout": {"a1": {"x": 0, "y": 0}, "a2": {"x": 240, "y": 120}},
    }


def _cells(blob: bytes) -> set:
    wb = load_workbook(io.BytesIO(blob))
    return {c.value for ws in wb.worksheets for row in ws.iter_rows() for c in row}


def _sheet_cells(blob: bytes, name: str) -> set:
    ws = load_workbook(io.BytesIO(blob))[name]
    return {c.value for row in ws.iter_rows() for c in row}


def _docx_text(blob: bytes) -> str:
    doc = Document(io.BytesIO(blob))
    parts = [p.text for p in doc.paragraphs]
    for table in doc.tables:
        for row in table.rows:
            parts.extend(c.text for c in row.cells)
    return "\n".join(parts)


def test_the_drawn_actors_and_flows_reach_the_excel_sheets(client):
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": _network()})
    assert r.status_code == 200, r.text
    assert {"WWTP Alfa", "Biogas plant Beta"} <= _sheet_cells(r.content, "Actors")
    flow_matrix = _sheet_cells(r.content, "Flow Matrix")
    # the drawn flow (from whom to whom, unit), and the questionnaire flow not drawn yet
    assert {"sludge", "biogas", "t/y", "WWTP Alfa", "Biogas plant Beta"} <= flow_matrix
    diagram = _sheet_cells(r.content, "Network Diagram")      # an edge of the diagram
    assert {"WWTP Alfa", "Biogas plant Beta"} <= diagram


def test_the_drawn_network_reaches_the_word_document(client):
    r = client.post("/api/dcf/export/docx", json={"case": CASE, "data": _network()})
    assert r.status_code == 200, r.text
    text = _docx_text(r.content)
    assert "WWTP Alfa" in text
    assert "Biogas plant Beta" in text
    assert "2 actors and 1 connected flow" in text


def test_without_data_the_files_are_as_before(client):
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE})
    assert r.status_code == 200, r.text
    assert "WWTP Alfa" not in _cells(r.content)
    assert "sludge" in _cells(r.content)     # the questionnaire flows are in every file
    docx = client.post("/api/dcf/export/docx", json={"case": CASE})
    assert "drawn interactively" in _docx_text(docx.content)


def test_the_draft_is_normalised_like_a_stored_network(client):
    """" cz " is written as "CZ", as PUT /{case_id}/data does."""
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": _network()})
    cells = _sheet_cells(r.content, "Actors")
    assert "CZ" in cells
    assert " cz " not in cells


def test_a_value_for_a_field_not_asked_is_not_exported(client):
    """flow.marginal_market_ref is asked only for Q1 = C: kept as dormant on a
    saved case, never exported; the draft is no different."""
    marker = "dormant-marker-x"
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": _network(**{"flow.marginal_market_ref": marker})})
    assert r.status_code == 200, r.text
    assert marker not in _cells(r.content)
    docx = client.post("/api/dcf/export/docx", json={"case": CASE, "data": _network(**{"flow.marginal_market_ref": marker})})
    assert docx.status_code == 200, docx.text
    assert marker not in _docx_text(docx.content)


def test_rows_of_a_section_not_asked_are_not_exported(client):
    """Costs are asked only with the economic dimension."""
    case = {**CASE, "q3": {"env": True, "eco": False, "soc": False}}
    data = _network()
    data["rows_by_section"]["costs"] = [{"row_id": "c-marker", "values": {"cost.flow_id": "f1"}}]
    r = client.post("/api/dcf/export/xlsx", json={"case": case, "data": data})
    assert r.status_code == 200, r.text
    assert "c-marker" not in _cells(r.content)
    assert "WWTP Alfa" in _cells(r.content)


def test_the_case_id_of_the_draft_does_not_matter(client):
    """An unsaved case has no id: the browser sends an empty one (or one left from before)."""
    for case_id in ("", "00000000-0000-0000-0000-000000000000"):
        data = {**_network(), "case_id": case_id}
        r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": data})
        assert r.status_code == 200, r.text


def test_a_broken_reference_is_refused_with_the_issues(client):
    data = _network()
    data["rows_by_section"]["flow_matrix"][0]["values"]["flow.dest_actor_id"] = "a-gone"
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": data})
    assert r.status_code == 422, r.text
    [issue] = r.json()["detail"]
    assert issue["code"] == "broken_reference"
    assert "a-gone" in issue["detail"]
    assert client.post("/api/dcf/export/docx", json={"case": CASE, "data": data}).status_code == 422


def test_an_unknown_field_and_a_bad_country_code_are_refused(client):
    data = _network()
    data["rows_by_section"]["actors"][0]["values"]["actor.favourite_colour"] = "blue"
    data["rows_by_section"]["actors"][1]["values"]["actor.country_iso2"] = "CZE"
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": data})
    assert r.status_code == 422, r.text
    assert {i["code"] for i in r.json()["detail"]} == {"unknown_field", "invalid_country_code"}


def test_the_draft_network_of_a_scenario_is_exported_and_a_stale_one_is_not(client):
    landfill = {"rows_by_section": {
        "actors": [{"row_id": "a1", "values": {"actor.name": "WWTP Alfa"}}, {"row_id": "a9", "values": {"actor.name": "Landfill site"}}],
        "flow_matrix": [{"row_id": "f1", "values": {"flow.origin_actor_id": "a1", "flow.dest_actor_id": "a9"}}]},
        "layout": {"a9": {"x": 10, "y": 20}}}
    r = client.post("/api/dcf/export/xlsx",
                    json={"case": CASE, "data": {**_network(), "networks_by_scenario": {"alt1": landfill}}})
    assert r.status_code == 200, r.text
    assert "Landfill site" in _cells(r.content)
    stale = client.post("/api/dcf/export/xlsx",
                        json={"case": CASE, "data": {**_network(), "networks_by_scenario": {"alt7": landfill}}})
    assert stale.status_code == 200, stale.text
    assert "Landfill site" not in _cells(stale.content)


def test_the_deadline_sent_with_the_network_reaches_the_cover(client):
    data = {**_network(), "sending": {"contact": "Giulia — g@example.org"}}
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": data})
    assert r.status_code == 200, r.text
    assert any(isinstance(c, str) and "g@example.org" in c for c in _cells(r.content))


def test_a_draft_holding_too_many_rows_is_refused(client):
    data = _network()
    data["rows_by_section"]["actors"] = [{"row_id": f"a{i}", "values": {}} for i in range(MAX_DRAFT_DATA_ROWS + 1)]
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": data})
    assert r.status_code == 422, r.text


def test_data_that_is_not_a_network_is_refused(client):
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "data": {"rows_by_section": "nope", "case_id": ""}})
    assert r.status_code == 422


@pytest.mark.usefixtures("anonymous_save_on")
def test_a_saved_case_keeps_its_files_from_the_server_copy(client):
    """`data` is for drafts: the case-scoped endpoint takes the stored network, not the one sent."""
    r = client.post("/api/cases", json={"name": "saved", "case": CASE})
    assert r.status_code == 201, r.text
    case_id = r.json()["id"]
    stored = _network()
    stored["case_id"] = case_id
    assert client.put(f"/api/dcf/{case_id}/data", json=stored).status_code == 200
    sent = _network()
    sent["rows_by_section"]["actors"][0]["values"]["actor.name"] = "Sent by the browser"
    r = client.post(f"/api/dcf/{case_id}/export/xlsx", json={"data": sent})
    assert r.status_code == 200, r.text
    cells = _cells(r.content)
    assert "WWTP Alfa" in cells
    assert "Sent by the browser" not in cells
