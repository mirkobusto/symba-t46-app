"""Integration tests for the stored DCF content endpoints.

`/api/dcf/{case_id}/data` is the persistence half of the Network
Builder: it holds the actors and flow-matrix rows the analyst draws in
the app, validated against the DCF descriptor composed for that case.
"""
from __future__ import annotations

WIKTOR_BODY = {
    "q1": "B",
    "q2": "D",
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


def test_field_not_activated_for_this_pathway_is_rejected(client):
    """flow.marginal_market_ref only activates for q1 == 'C'; Wiktor is 'B'."""
    case_id = _create_case(client)
    data = _two_actors_one_flow(case_id)
    data["rows_by_section"]["flow_matrix"][0]["values"]["flow.marginal_market_ref"] = "x"
    issues = _put_expect_422(client, case_id, data)
    assert issues[0]["code"] == "field_not_active"
    assert issues[0]["field_id"] == "flow.marginal_market_ref"


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
