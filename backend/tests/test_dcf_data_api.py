"""Integration tests for the stored DCF content endpoints.

`/api/dcf/{case_id}/data` is the persistence half of the Network
Builder: it holds the actors and flow-matrix rows the analyst draws in
the app, validated against the DCF descriptor composed for that case.
"""
from __future__ import annotations

import pytest

# written for the anonymous flow, off by default since 2026-11-02
pytestmark = pytest.mark.usefixtures("anonymous_save_on")


WIKTOR_BODY = {
    "q1": "B",
    "q2": "B",
    "q3": {"env": True, "eco": True, "soc": False},
    "q4": ["E"],
    "q6a": "wastewater_sludge_biofactories",
    "q6b": "TRL7-8",
    "q7": "B",
    "flows": [
        {"id": "f1", "name": "sludge", "q5": "a"},
        {"id": "f2", "name": "biogas", "q5": "c"},
    ],
}


def _create_case(client, headers: dict | None = None) -> str:
    r = client.post(
        "/api/cases",
        json={"name": "wiktor", "case": WIKTOR_BODY},
        headers=headers or {},
    )
    assert r.status_code == 201, r.text
    return r.json()["id"]


def _two_actors_one_flow(case_id: str) -> dict:
    """A minimal but complete network: WWTP -> biogas plant."""
    return {
        "case_id": case_id,
        "rows_by_section": {
            "actors": [
                {
                    "row_id": "a1",
                    "values": {"actor.name": "WWTP Alfa", "actor.role": "producer"},
                },
                {
                    "row_id": "a2",
                    "values": {
                        "actor.name": "Biogas plant Beta",
                        "actor.role": "consumer",
                    },
                },
            ],
            "flow_matrix": [
                {
                    "row_id": "f1",
                    "values": {
                        "flow.origin_actor_id": "a1",
                        "flow.dest_actor_id": "a2",
                        "flow.name": "sludge",
                        "flow.type": "waste",
                        "flow.q5_class": "a",
                        "flow.unit": "t/y",
                        "flow.regime": "continuous",
                        "flow.uncertainty.type": "point",
                    },
                }
            ],
        },
        "layout": {"a1": {"x": 0.0, "y": 0.0}, "a2": {"x": 240.0, "y": 120.0}},
    }


# ---------------------------------------------------------------------------
# Happy path
# ---------------------------------------------------------------------------


def test_get_404_when_nothing_stored(client):
    case_id = _create_case(client)
    assert client.get(f"/api/dcf/{case_id}/data").status_code == 404


def test_put_then_get_roundtrip(client):
    case_id = _create_case(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id))
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["validation"]["errors"] == []
    assert body["validation"]["missing_required"] == []
    assert body["data"]["updated_at"] is not None

    g = client.get(f"/api/dcf/{case_id}/data").json()
    assert len(g["data"]["rows_by_section"]["actors"]) == 2
    assert g["data"]["layout"]["a2"] == {"x": 240.0, "y": 120.0}
    assert g["validation"]["errors"] == []


def test_put_replaces_previous_content(client):
    case_id = _create_case(client)
    client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id))
    smaller = {
        "case_id": case_id,
        "rows_by_section": {
            "actors": [
                {"row_id": "a1", "values": {"actor.name": "Solo", "actor.role": "producer"}}
            ]
        },
        "layout": {},
    }
    r = client.put(f"/api/dcf/{case_id}/data", json=smaller)
    assert r.status_code == 200, r.text
    g = client.get(f"/api/dcf/{case_id}/data").json()
    assert "flow_matrix" not in g["data"]["rows_by_section"]


def test_completeness_is_reported_per_section(client):
    case_id = _create_case(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id))
    by_section = {c["section_id"]: c for c in r.json()["validation"]["completeness"]}
    assert by_section["actors"]["rows"] == 2
    # actor.id is derived from row_id, so it is not counted as required.
    assert by_section["actors"]["required_fields"] == 4
    assert by_section["actors"]["filled_required"] == 4


def test_delete_then_get_404(client):
    case_id = _create_case(client)
    client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id))
    assert client.delete(f"/api/dcf/{case_id}/data").status_code == 204
    assert client.get(f"/api/dcf/{case_id}/data").status_code == 404


# ---------------------------------------------------------------------------
# Partial fill is allowed
# ---------------------------------------------------------------------------


def test_missing_required_does_not_block_the_write(client):
    """A DCF is filled in over days — a half-filled row must still save."""
    case_id = _create_case(client)
    partial = {
        "case_id": case_id,
        "rows_by_section": {
            "actors": [{"row_id": "a1", "values": {"actor.name": "WWTP Alfa"}}]
        },
        "layout": {},
    }
    r = client.put(f"/api/dcf/{case_id}/data", json=partial)
    assert r.status_code == 200, r.text
    codes = {i["field_id"] for i in r.json()["validation"]["missing_required"]}
    assert codes == {"actor.role"}
    assert r.json()["validation"]["errors"] == []


# ---------------------------------------------------------------------------
# Rejected submissions
# ---------------------------------------------------------------------------


def _put_expect_422(client, case_id: str, data: dict) -> list[dict]:
    r = client.put(f"/api/dcf/{case_id}/data", json=data)
    assert r.status_code == 422, r.text
    return r.json()["detail"]


def test_put_400_on_case_id_mismatch(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["case_id"] = "00000000-0000-0000-0000-000000000000"
    assert client.put(f"/api/dcf/{case_id}/data", json=data).status_code == 400


def test_put_404_when_case_not_saved(client):
    ghost = "00000000-0000-0000-0000-000000000000"
    r = client.put(f"/api/dcf/{ghost}/data", json=_two_actors_one_flow(ghost))
    assert r.status_code == 404


def test_unknown_field_is_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["actors"][0]["values"]["actor.favourite_colour"] = "blue"
    assert _put_expect_422(client, case_id, data)[0]["code"] == "unknown_field"


def test_value_for_a_field_not_asked_is_kept_as_dormant(client):
    """flow.marginal_market_ref only activates for q1 == 'C'; Wiktor is 'B'.

    A value entered before the configuration changed is stored and reported
    as dormant, not rejected and not exported (UX round 5, D3)."""
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["flow_matrix"][0]["values"]["flow.marginal_market_ref"] = "x"
    r = client.put(f"/api/dcf/{case_id}/data", json=data)
    assert r.status_code == 200, r.text
    validation = r.json()["validation"]
    assert validation["errors"] == []
    assert [(i["code"], i["field_id"]) for i in validation["dormant"]] == [
        ("field_not_active", "flow.marginal_market_ref")
    ]
    stored = client.get(f"/api/dcf/{case_id}/data").json()["data"]
    assert stored["rows_by_section"]["flow_matrix"][0]["values"][
        "flow.marginal_market_ref"
    ] == "x"
    xlsx = client.get(f"/api/dcf/{case_id}/export/xlsx")
    assert xlsx.status_code == 200
    from io import BytesIO

    import openpyxl

    wb = openpyxl.load_workbook(BytesIO(xlsx.content))
    cells = {c.value for ws in wb.worksheets for row in ws.iter_rows() for c in row}
    assert "x" not in cells


def test_rows_of_a_section_not_asked_are_kept_as_dormant(client):
    """Costs are asked only with the economic dimension: rows entered before
    it was switched off are kept, not rejected (UX round 5, D3)."""
    body = {**WIKTOR_BODY, "q3": {"env": True, "eco": False, "soc": False}}
    r = client.post("/api/cases", json={"name": "env only", "case": body})
    assert r.status_code == 201, r.text
    case_id = r.json()["id"]
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["costs"] = [
        {"row_id": "c1", "values": {"cost.flow_id": "f1"}}
    ]
    r = client.put(f"/api/dcf/{case_id}/data", json=data)
    assert r.status_code == 200, r.text
    assert "section_inactive" in [i["code"] for i in r.json()["validation"]["dormant"]]
    # kept, but not in the files
    xlsx = client.get(f"/api/dcf/{case_id}/export/xlsx")
    from io import BytesIO

    import openpyxl

    wb = openpyxl.load_workbook(BytesIO(xlsx.content))
    cells = {c.value for ws in wb.worksheets for row in ws.iter_rows() for c in row}
    assert "c1" not in cells


def test_structural_errors_in_a_section_not_asked_still_block(client):
    """Dormant is for values, not for malformed rows (Fable review of #202)."""
    body = {**WIKTOR_BODY, "q3": {"env": True, "eco": False, "soc": False}}
    case_id = client.post("/api/cases", json={"name": "env only", "case": body}).json()["id"]
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["costs"] = [
        {"row_id": "c1", "values": {"cost.no_such_field": 1}},
        {"row_id": "c1", "values": {}},
    ]
    codes = {i["code"] for i in _put_expect_422(client, case_id, data)}
    assert {"unknown_field", "duplicate_row_id"} <= codes


def test_saving_the_network_updates_the_case_date(client, sqlite_engine):
    """"My cases" dates a case by its record: a saved network is a change too."""
    from datetime import datetime

    from sqlalchemy.orm import Session

    from app.models import CaseRecord

    case_id = _create_case(client)
    with Session(sqlite_engine) as db:  # date the case back instead of sleeping
        db.get(CaseRecord, case_id).updated_at = datetime(2020, 1, 1)
        db.commit()
    before = client.get(f"/api/cases/{case_id}").json()["updated_at"]
    r = client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id))
    assert r.status_code == 200, r.text
    after = client.get(f"/api/cases/{case_id}").json()["updated_at"]
    assert after > before


def test_derived_id_field_is_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["actors"][0]["values"]["actor.id"] = "hand-written"
    assert _put_expect_422(client, case_id, data)[0]["code"] == "derived_field"


def test_broken_actor_reference_is_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["flow_matrix"][0]["values"]["flow.dest_actor_id"] = "nope"
    issues = _put_expect_422(client, case_id, data)
    assert issues[0]["code"] == "broken_reference"


def test_duplicate_row_id_is_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["actors"][1]["row_id"] = "a1"
    codes = {i["code"] for i in _put_expect_422(client, case_id, data)}
    assert "duplicate_row_id" in codes


def test_value_outside_inline_enum_is_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["actors"][0]["values"]["actor.role"] = "wizard"
    assert _put_expect_422(client, case_id, data)[0]["code"] == "invalid_enum"


def test_rows_in_a_derived_section_are_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["methodological_choices"] = [
        {"row_id": "m1", "values": {}}
    ]
    codes = {i["code"] for i in _put_expect_422(client, case_id, data)}
    assert "section_not_editable" in codes


def test_unknown_section_is_rejected(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["invented"] = [{"row_id": "x1", "values": {}}]
    codes = {i["code"] for i in _put_expect_422(client, case_id, data)}
    assert "unknown_section" in codes


def test_layout_must_reference_an_actor_row(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["layout"]["ghost"] = {"x": 1.0, "y": 2.0}
    codes = {i["code"] for i in _put_expect_422(client, case_id, data)}
    assert "unknown_layout_ref" in codes


def test_site_reference_must_exist_on_the_case(client):
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["actors"][0]["values"]["actor.site_id"] = "site-99"
    issues = _put_expect_422(client, case_id, data)
    assert issues[0]["code"] == "broken_reference"


# ---------------------------------------------------------------------------
# Ownership (same rules as /api/cases and /api/scoring)
# ---------------------------------------------------------------------------


def _register(client, email: str) -> str:
    r = client.post(
        "/api/auth/register", json={"email": email, "password": "hunter2-strong"}
    )
    assert r.status_code == 201, r.text
    return r.json()["access_token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_owned_case_dcf_data_is_hidden_from_others(client):
    _register(client, "alice@example.eu")  # first user is admin
    bob = _register(client, "bob@example.eu")
    carol = _register(client, "carol@example.eu")
    case_id = _create_case(client, _auth(bob))
    client.put(
        f"/api/dcf/{case_id}/data",
        json=_two_actors_one_flow(case_id),
        headers=_auth(bob),
    )

    assert client.get(f"/api/dcf/{case_id}/data", headers=_auth(carol)).status_code == 404
    assert client.get(f"/api/dcf/{case_id}/data").status_code == 404
    assert client.get(f"/api/dcf/{case_id}/data", headers=_auth(bob)).status_code == 200


def test_legacy_anonymous_case_dcf_data_stays_open(client):
    case_id = _create_case(client)  # no token -> owner_id IS NULL
    assert (
        client.put(
            f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id)
        ).status_code
        == 200
    )


# ---------------------------------------------------------------------------
# Case-scoped exports (phase 3 — the drawn network reaches the artefacts)
# ---------------------------------------------------------------------------

XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def test_case_export_xlsx_is_prefilled_with_the_stored_rows(client):
    case_id = _create_case(client)
    client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id))

    r = client.get(f"/api/dcf/{case_id}/export/xlsx")

    assert r.status_code == 200, r.text
    assert r.headers["content-type"] == XLSX_MIME
    assert "attachment" in r.headers["content-disposition"]

    from io import BytesIO

    from openpyxl import load_workbook

    wb = load_workbook(BytesIO(r.content))
    text = "\n".join(
        str(c.value)
        for row in wb["Actors"].iter_rows()
        for c in row
        if c.value is not None
    )
    assert "WWTP Alfa" in text


def test_case_export_docx_works_without_stored_content(client):
    case_id = _create_case(client)
    r = client.get(f"/api/dcf/{case_id}/export/docx")
    assert r.status_code == 200, r.text
    assert len(r.content) > 1000


def test_case_export_404_for_unknown_case(client):
    r = client.get("/api/dcf/00000000-0000-0000-0000-000000000000/export/xlsx")
    assert r.status_code == 404


def test_case_export_hidden_from_non_owners(client):
    _register(client, "alice@example.eu")
    bob = _register(client, "bob@example.eu")
    carol = _register(client, "carol@example.eu")
    case_id = _create_case(client, _auth(bob))

    assert client.get(
        f"/api/dcf/{case_id}/export/xlsx", headers=_auth(carol)
    ).status_code == 404
    assert client.get(
        f"/api/dcf/{case_id}/export/xlsx", headers=_auth(bob)
    ).status_code == 200


# ---------------------------------------------------------------------------
# Flow classification (audit I-09): rows per flow, validated like the others
# ---------------------------------------------------------------------------


def _with_classification(case_id: str, **values) -> dict:
    body = _two_actors_one_flow(case_id)
    body["rows_by_section"]["flow_classification"] = [
        {"row_id": "c1", "values": {"classif.flow_id": "f1", **values}}
    ]
    return body


def test_flow_classification_row_is_stored(client):
    case_id = _create_case(client)
    r = client.put(f"/api/dcf/{case_id}/data",
                   json=_with_classification(case_id, **{"classif.eow_status": "achieved"}))
    assert r.status_code == 200, r.text
    assert r.json()["validation"]["errors"] == []
    stored = client.get(f"/api/dcf/{case_id}/data").json()["data"]["rows_by_section"]
    assert stored["flow_classification"][0]["values"]["classif.eow_status"] == "achieved"


def test_flow_classification_rejects_a_value_outside_the_enum(client):
    case_id = _create_case(client)
    data = _with_classification(case_id, **{"classif.eow_status": "maybe"})
    assert _put_expect_422(client, case_id, data)[0]["code"] == "invalid_enum"


def test_flow_classification_rejects_an_unknown_flow(client):
    case_id = _create_case(client)
    body = _two_actors_one_flow(case_id)
    body["rows_by_section"]["flow_classification"] = [
        {"row_id": "c1", "values": {"classif.flow_id": "nope"}}
    ]
    assert _put_expect_422(client, case_id, body)[0]["code"] == "broken_reference"


def _cover_cells(content: bytes) -> dict:
    from io import BytesIO

    import openpyxl

    ws = openpyxl.load_workbook(BytesIO(content)).worksheets[0]
    return {r[0].value: r[1].value for r in ws.iter_rows(min_row=3) if r[0].value}


def _sheet_cells(content: bytes, sheet: str) -> dict:
    from io import BytesIO

    import openpyxl

    ws = openpyxl.load_workbook(BytesIO(content))[sheet]
    out = {}
    for r in ws.iter_rows(min_row=3):
        if r[0].value in ("What to document",):
            break  # the checklist below the configuration
        if r[0].value:
            out[r[0].value] = r[1].value
    return out


def test_cover_speaks_to_the_recipient_and_the_configuration_goes_to_the_analyst(client):
    """UX round 6 (P8-02, P2-09, P6-18): the cover names the case, a neutral
    reference, the date, what we ask and that it is confidential; the result
    rows and the ILCD situation head the analyst's checklist instead. The
    file is named after the case, not after the slug."""
    case_id = _create_case(client)
    rows = [{"label": "Reference scenario", "value": "What each firm would do today without the links (HNSRS)"}]
    r = client.post(f"/api/dcf/{case_id}/export/xlsx", json={"rows": rows})
    assert r.status_code == 200, r.text
    cover = _cover_cells(r.content)
    assert cover["Case"] == "wiktor"
    assert cover["Case reference"] == case_id.split("-")[0]
    assert cover["Generated on"].endswith(str(__import__("datetime").date.today().year))
    assert "What we ask you" in cover and "Confidential" in cover
    assert "ILCD situation" not in cover and "Reference scenario" not in cover
    analyst = _sheet_cells(r.content, "Methodological Choices")
    assert analyst["Reference scenario"].endswith("(HNSRS)")
    assert analyst["ILCD situation"].startswith("ILCD Situation")
    assert "DCF_wiktor_" in r.headers["content-disposition"]


def test_deadline_contact_and_version_reach_both_files_and_are_stored(client):
    """P8-02, P2-19: set on the DCF page, sent with the download and saved
    with the network; without them the files carry no placeholder."""
    from io import BytesIO

    from docx import Document

    case_id = _create_case(client)
    bare = _cover_cells(client.get(f"/api/dcf/{case_id}/export/xlsx").content)
    assert "Return by" not in bare and "Contact" not in bare
    instructions = _sheet_cells(client.get(f"/api/dcf/{case_id}/export/xlsx").content, "Instructions")
    assert not any("(agree a date" in str(v) or "(name and e-mail" in str(v) for v in instructions.values())

    sending = {"return_by": "2026-11-22", "contact": "Giulia — g@example.org", "version": "2"}
    r = client.post(f"/api/dcf/{case_id}/export/xlsx", json={"sending": sending})
    cover = _cover_cells(r.content)
    assert cover["Return by"] == "22 November 2026"
    assert cover["Contact"].startswith("Giulia — g@example.org")
    assert cover["Version"].startswith("2 of ")
    doc = Document(BytesIO(client.post(f"/api/dcf/{case_id}/export/docx", json={"sending": sending}).content))
    cells = [c.text for t in doc.tables for row in t.rows for c in row.cells]
    assert "22 November 2026" in cells

    data = {"case_id": case_id, "rows_by_section": {}, "sending": sending}
    assert client.put(f"/api/dcf/{case_id}/data", json=data).status_code == 200
    assert client.get(f"/api/dcf/{case_id}/data").json()["data"]["sending"]["return_by"] == "2026-11-22"
    stored = _cover_cells(client.get(f"/api/dcf/{case_id}/export/xlsx").content)
    assert stored["Return by"] == "22 November 2026"


def test_a_costing_only_cover_has_no_ilcd_situation(client):
    body = {**WIKTOR_BODY, "q3": {"env": False, "eco": True, "soc": False}}
    case_id = client.post("/api/cases", json={"name": "costing", "case": body}).json()["id"]
    analyst = _sheet_cells(client.get(f"/api/dcf/{case_id}/export/xlsx").content, "Methodological Choices")
    assert analyst["ILCD situation"].startswith("None: a costing-only study")


def test_a_draft_export_accepts_the_rows_too(client):
    r = client.post("/api/dcf/export/docx", json={"case": WIKTOR_BODY, "rows": [{"label": "Horizon", "value": "today"}]})
    assert r.status_code == 200, r.text
    assert "DCF_draft_" in r.headers["content-disposition"]


def test_flow_type_no_longer_offers_waste_but_accepts_it_when_stored(client):
    """The flow type is the physical nature; waste/by-product is the
    classification's call (UX round 5, D5). Stored values stay legal."""
    case_id = _create_case(client)
    preview = client.post("/api/dcf/preview", json=WIKTOR_BODY).json()
    [matrix] = [s for s in preview["sections"] if s["id"] == "flow_matrix"]
    [ftype] = [f for f in matrix["fields"] if f["id"] == "flow.type"]
    assert "waste" not in ftype["enum_values"] and "by_product" not in ftype["enum_values"]
    data = _two_actors_one_flow(case_id)  # stores flow.type = "waste"
    r = client.put(f"/api/dcf/{case_id}/data", json=data)
    assert r.status_code == 200, r.text


def test_a_stored_retired_value_is_shown_with_its_label(client):
    """flow.type no longer offers "waste" but a stored one keeps its label."""
    preview = client.post("/api/dcf/preview", json=WIKTOR_BODY).json()
    [matrix] = [s for s in preview["sections"] if s["id"] == "flow_matrix"]
    [ftype] = [f for f in matrix["fields"] if f["id"] == "flow.type"]
    assert "waste" not in ftype["enum_values"]
    assert ftype["enum_labels"]["waste"] == "waste"


def test_both_dashboards_count_a_costing_only_study_without_ilcd(client):
    body = {**WIKTOR_BODY, "q3": {"env": False, "eco": True, "soc": False}}
    case_id = client.post("/api/cases", json={"name": "costing", "case": body}).json()["id"]
    client.post(f"/api/cases/{case_id}/share", json={"shared": True})
    # the public region counts the cases with a partner in the country
    client.put(f"/api/dcf/{case_id}/data", json={"case_id": case_id, "rows_by_section": {"actors": [
        {"row_id": "a1", "values": {"actor.name": "WWTP", "actor.role": "partner", "actor.country_iso2": "IT"}}]}})
    private = client.get("/api/cases/aggregate/breakdown").json()["by_ilcd_situation"]
    public = client.get("/api/public/region/IT").json()["by_ilcd_situation"]
    # both say "no situation", each in its own format
    assert [e["key"] for e in private] == ["(none)"]
    assert len(public) == 1 and "ILCD" not in str(public[0])
def test_the_word_document_starts_with_the_companies_and_explains_every_column(client):
    """D10: instructions and who fills what first, the network, every column,
    the methodological choices last; the shared case's contact is filled in."""
    from io import BytesIO

    from docx import Document

    case_id = _create_case(client)
    client.post(f"/api/cases/{case_id}/share", json={"shared": True, "prepared_by": "Giulia", "case_contact": "g@example.org"})
    r = client.get(f"/api/dcf/{case_id}/export/docx")
    assert r.status_code == 200, r.text
    doc = Document(BytesIO(r.content))
    headings = [p.text for p in doc.paragraphs if p.style.name.startswith("Heading")]
    order = [next(i for i, h in enumerate(headings) if h.startswith(prefix))
             for prefix in ("§1. How to fill in", "§2.", "§3. The columns", "Annex A")]
    assert order == sorted(order)
    text = "\n".join(p.text for p in doc.paragraphs)
    assert "Giulia — g@example.org" in text
    assert "Who fills in what" in headings
    # one row per editable column of the actors sheet
    cells = [c.text for t in doc.tables for row in t.rows for c in row.cells]
    assert any(c.startswith("Actor name") for c in cells)


def test_each_sheet_says_who_fills_it_and_has_a_row_per_flow(client):
    """D4: row 3 says who fills the sheet in, analyst columns are grey, the
    per-flow sheets arrive with one row per flow named with its route, and the
    header row carries a filter (UX round 5, P1-06, P2-01, P5-01)."""
    from io import BytesIO

    import openpyxl

    case_id = _create_case(client)
    assert client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id)).status_code == 200
    wb = openpyxl.load_workbook(BytesIO(client.get(f"/api/dcf/{case_id}/export/xlsx").content))
    logistics = wb["Logistics"]
    assert logistics["A3"].value.startswith("Filled in by: the companies' staff")
    assert logistics["A5"].value == "sludge (WWTP Alfa → Biogas plant Beta)"
    assert logistics.auto_filter.ref.startswith("A4:")
    classif = wb["Flow Classification"]
    assert classif["A3"].value.startswith("Filled in by: whoever carries out the study")
    matrix = wb["Flow Matrix"]
    fills = {matrix.cell(row=4, column=c).value: matrix.cell(row=4, column=c).fill.fgColor.rgb
             for c in range(1, matrix.max_column + 1)}
    # grey, and no star: the analyst fills it in (P2-10)
    assert fills["Who pays whom"].endswith("8A93A3")


def test_a_case_never_drawn_gets_a_row_per_questionnaire_flow(client):
    """Without any stored network the per-flow sheets still list the
    questionnaire flows, and a stored row is not duplicated (Fable, #208)."""
    from io import BytesIO

    import openpyxl

    case_id = _create_case(client)
    wb = openpyxl.load_workbook(BytesIO(client.get(f"/api/dcf/{case_id}/export/xlsx").content))
    costs = wb["Costs & Revenues"] if "Costs & Revenues" in wb.sheetnames else wb[[n for n in wb.sheetnames if n.startswith("Cost")][0]]
    assert [costs.cell(row=r, column=1).value for r in (5, 6)] == ["sludge", "biogas"]

    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["logistics"] = [{"row_id": "r1", "values": {"route.flow_id": "f1"}}]
    assert client.put(f"/api/dcf/{case_id}/data", json=data).status_code == 200
    wb = openpyxl.load_workbook(BytesIO(client.get(f"/api/dcf/{case_id}/export/xlsx").content))
    firsts = [wb["Logistics"].cell(row=r, column=1).value for r in range(5, 9)]
    assert firsts.count("sludge (WWTP Alfa → Biogas plant Beta)") == 1


def test_the_reference_scenario_has_a_row_per_flow_and_side(client):
    """UX round 5, D6: the origin says where the flow would go, the
    destination what it would buy instead; one cell per actor could not."""
    from io import BytesIO

    import openpyxl

    case_id = _create_case(client)
    assert client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id)).status_code == 200
    ws = openpyxl.load_workbook(BytesIO(client.get(f"/api/dcf/{case_id}/export/xlsx").content))["Reference Scenario"]
    rows = [[c.value for c in ws[r]][:3] for r in (5, 6)]
    assert rows == [
        ["WWTP Alfa", "sludge (WWTP Alfa → Biogas plant Beta)", "origin (gives the flow)"],
        ["Biogas plant Beta", "sludge (WWTP Alfa → Biogas plant Beta)", "destination (receives the flow)"],
    ]


def test_files_do_not_offer_retired_values_but_show_stored_ones(client):
    """A stored "producer" stays legible, but the dropdowns, comments and the
    Word list only partner / facilitator / … (Fable review of #210)."""
    from io import BytesIO

    import openpyxl

    case_id = _create_case(client)
    assert client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id)).status_code == 200
    wb = openpyxl.load_workbook(BytesIO(client.get(f"/api/dcf/{case_id}/export/xlsx").content))
    actors = wb["Actors"]
    role_col = next(c for c in range(1, actors.max_column + 1) if str(actors.cell(row=4, column=c).value).startswith("Role"))
    assert "producer" not in actors.cell(row=4, column=role_col).comment.text
    # the stored value reads as the one that replaced it, flagged (UX round 6,
    # P2-02, P8-10): the dropdown refused "producer"
    cell = actors.cell(row=5, column=role_col)
    assert cell.value == "partner" and "producer" in cell.comment.text
    assert wb["Flow Matrix"]["E5"].value == "material"
    lists = {str(c.value) for row in wb["_lists"].iter_rows() for c in row if c.value}
    assert "partner" in lists and "producer" not in lists and "gate fee paid" not in lists


def test_a_costing_only_study_says_why_it_asks_the_reference_and_the_classification(client):
    """Fable D9: without an LCA the two sheets cite D4.2, not D4.1."""
    body = {**WIKTOR_BODY, "q3": {"env": False, "eco": True, "soc": False}}
    payload = client.post("/api/dcf/preview", json=body).json()
    sections = {s["id"]: s for s in payload["sections"]}
    assert sections["flow_classification"]["description"].startswith("Asked without an LCA")
    assert "D4.2 §6.2" in sections["reference_scenario"]["description"]
    fields = {f["id"]: f for f in sections["flow_classification"]["fields"]}
    assert fields["classif.substituted_product"]["reason"] == "the costing needs it even without an LCA (D4.2 §6.2)"


def test_the_actors_sheet_says_what_each_actor_gives_and_receives(client):
    from io import BytesIO

    import openpyxl

    case_id = _create_case(client)
    assert client.put(f"/api/dcf/{case_id}/data", json=_two_actors_one_flow(case_id)).status_code == 200
    ws = openpyxl.load_workbook(BytesIO(client.get(f"/api/dcf/{case_id}/export/xlsx").content))["Actors"]
    header = [c.value for c in ws[4]]
    col = header.index("Gives / Receives") + 1
    assert ws.auto_filter.ref.split(":")[1].startswith(ws.cell(row=4, column=col).column_letter)
    assert ws.cell(row=5, column=col).value == "Gives: sludge"
    assert ws.cell(row=6, column=col).value == "Receives: sludge"
