"""A network of its own for an alternative scenario (designed by Fable,
approved by the owner on 2026-11-04): stored with the case's DCF content,
validated inside the variant, compared with the case's network in words."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.domain.dcf_data import DcfData, DcfRow
from app.domain.models import Case
from app.engine.dcf_rows import network_diff, with_case_flows

pytestmark = pytest.mark.usefixtures("anonymous_save_on")

FIXTURES = json.loads((Path(__file__).resolve().parents[2]
                       / "frontend/src/__tests__/fixtures/networkDiffCases.json").read_text())


def _rows(items):
    return [DcfRow(**r) for r in items]


@pytest.mark.parametrize("case", FIXTURES["cases"], ids=[c["name"] for c in FIXTURES["cases"]])
def test_network_diff_on_the_shared_fixtures(case):
    base = FIXTURES["base"]
    got = network_diff(_rows(base["actors"]), _rows(base["flows"]),
                       _rows(case["variant"]["actors"]), _rows(case["variant"]["flows"]))
    assert got == case["expected"]


CASE = {
    "q1": "B", "q2": "B", "decision_context": "micro", "q3": {"env": True, "eco": True, "soc": False},
    "flows": [{"id": "f1", "name": "sludge", "q5": "a"}, {"id": "f2", "name": "biogas", "q5": "c"}],
    "alternative_scenarios": [{"id": "alt1", "label": "Landfill", "overrides": {"flow_q5": {"f1": "b"}}}],
}


def _save(client) -> str:
    r = client.post("/api/cases", json={"name": "net", "case": CASE})
    assert r.status_code == 201, r.text
    return r.json()["id"]


def _network(case_id: str, variant: dict | None = None, scenario_id: str = "alt1") -> dict:
    base = {"actors": [{"row_id": "a1", "values": {"actor.name": "WWTP", "actor.role": "partner"}},
                       {"row_id": "a2", "values": {"actor.name": "Biogas", "actor.role": "partner"}}],
            "flow_matrix": [{"row_id": "f1", "values": {"flow.origin_actor_id": "a1", "flow.dest_actor_id": "a2"}}]}
    body = {"case_id": case_id, "rows_by_section": base}
    if variant is not None:
        body["networks_by_scenario"] = {scenario_id: variant}
    return body


LANDFILL = {"rows_by_section": {
    "actors": [{"row_id": "a1", "values": {"actor.name": "WWTP"}}, {"row_id": "a9", "values": {"actor.name": "Landfill"}}],
    "flow_matrix": [{"row_id": "f1", "values": {"flow.origin_actor_id": "a1", "flow.dest_actor_id": "a9"}}]},
    "layout": {"a9": {"x": 10, "y": 20}}}


def test_a_scenario_network_round_trips(client):
    case_id = _save(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, LANDFILL))
    assert r.status_code == 200, r.text
    got = client.get(f"/api/dcf/{case_id}/data").json()["data"]
    assert got["networks_by_scenario"]["alt1"]["layout"] == {"a9": {"x": 10.0, "y": 20.0}}


def test_a_scenario_network_holds_actors_and_flows_only(client):
    case_id = _save(client)
    variant = {"rows_by_section": {**LANDFILL["rows_by_section"], "logistics": []}}
    r = client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, variant))
    assert r.status_code == 422
    assert "scenario_section_not_allowed" in r.text


def test_references_resolve_inside_the_scenario_network(client):
    case_id = _save(client)
    broken = {"rows_by_section": {"actors": [{"row_id": "a1", "values": {"actor.name": "WWTP"}}],
                                  "flow_matrix": [{"row_id": "f1", "values": {"flow.origin_actor_id": "a1",
                                                                             "flow.dest_actor_id": "a2"}}]}}
    assert client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, broken)).status_code == 422
    stray = {"rows_by_section": LANDFILL["rows_by_section"], "layout": {"a2": {"x": 0, "y": 0}}}
    assert client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, stray)).status_code == 422


def test_the_network_of_a_deleted_scenario_is_kept_dormant(client):
    case_id = _save(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, LANDFILL, scenario_id="alt7"))
    assert r.status_code == 200, r.text
    dormant = r.json()["validation"]["dormant"]
    assert [(d["code"], d["scenario_id"]) for d in dormant] == [("scenario_unknown", "alt7")]


def test_content_saved_before_scenario_networks_still_loads():
    old = DcfData.model_validate_json(json.dumps({"schema_version": "1.0", "case_id": "c", "rows_by_section": {}}))
    assert old.networks_by_scenario == {}


def test_the_scenario_network_follows_the_questionnaire_and_its_flow_q5():
    case = Case.model_validate(CASE)
    data = DcfData.model_validate(_network("c", LANDFILL))
    out = with_case_flows(data, case, "c")
    [row] = out.networks_by_scenario["alt1"].rows_by_section["flow_matrix"]
    assert (row.values["flow.name"], row.values["flow.q5_class"]) == ("sludge", "b")


def test_the_files_carry_each_scenario_network(client):
    import io

    from docx import Document
    from openpyxl import load_workbook

    case_id = _save(client)
    assert client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, LANDFILL)).status_code == 200
    xlsx = client.post(f"/api/dcf/{case_id}/export/xlsx", json={"rows": []})
    cells = [str(c.value) for ws in load_workbook(io.BytesIO(xlsx.content)).worksheets for row in ws.iter_rows() for c in row
             if c.value is not None]
    assert any(c.startswith("Scenario “Landfill”") for c in cells)
    assert "Landfill" in cells   # the scenario's edge goes to the landfill
    docx = client.post(f"/api/dcf/{case_id}/export/docx", json={"rows": []})
    text = "\n".join(p.text for p in Document(io.BytesIO(docx.content)).paragraphs)
    assert "Actor added: Landfill" in text
    assert "sludge: WWTP → Biogas becomes WWTP → Landfill" in text


def test_a_network_whose_scenario_left_is_not_exported(client):
    import io

    from docx import Document

    case_id = _save(client)
    assert client.put(f"/api/dcf/{case_id}/data", json=_network(case_id, LANDFILL, scenario_id="alt7")).status_code == 200
    docx = client.post(f"/api/dcf/{case_id}/export/docx", json={"rows": []})
    assert "Landfill" not in "\n".join(p.text for p in Document(io.BytesIO(docx.content)).paragraphs)
