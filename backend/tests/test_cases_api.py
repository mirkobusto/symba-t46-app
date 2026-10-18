"""Tests for the cases CRUD endpoints (Feature D)."""
from __future__ import annotations

VALID_CASE = {
    "q1": "B", "q2": "B",
    "q3": {"env": True, "eco": False, "soc": False},
}


def test_list_cases_empty(client):
    resp = client.get("/api/cases")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_then_list(client):
    resp = client.post("/api/cases", json={
        "name": "My first case",
        "case": VALID_CASE,
    })
    assert resp.status_code == 201
    body = resp.json()
    assert body["id"]
    assert body["name"] == "My first case"
    # ilcd_situation will be None because the case was saved without running
    # the engine first (the API stores what the client sends as-is)
    assert body["case"]["q1"] == "B"

    listing = client.get("/api/cases").json()
    assert len(listing) == 1
    assert listing[0]["name"] == "My first case"


def test_get_case_by_id(client):
    created = client.post("/api/cases", json={
        "name": "Lookup target", "case": VALID_CASE,
    }).json()
    resp = client.get(f"/api/cases/{created['id']}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == created["id"]
    assert body["case"]["q2"] == "B"


def test_get_case_not_found(client):
    resp = client.get("/api/cases/nonexistent-id")
    assert resp.status_code == 404


def test_update_case(client):
    created = client.post("/api/cases", json={
        "name": "Before", "case": VALID_CASE,
    }).json()
    case_id = created["id"]

    new_case = {**VALID_CASE, "q1": "C"}
    resp = client.put(f"/api/cases/{case_id}", json={
        "name": "After", "case": new_case,
    })
    assert resp.status_code == 200
    assert resp.json()["name"] == "After"
    assert resp.json()["case"]["q1"] == "C"

    # Confirm via GET
    fetched = client.get(f"/api/cases/{case_id}").json()
    assert fetched["name"] == "After"
    assert fetched["case"]["q1"] == "C"


def test_update_case_not_found(client):
    resp = client.put("/api/cases/nonexistent", json={
        "name": "x", "case": VALID_CASE,
    })
    assert resp.status_code == 404


def test_delete_case(client):
    created = client.post("/api/cases", json={
        "name": "ToDelete", "case": VALID_CASE,
    }).json()
    case_id = created["id"]

    resp = client.delete(f"/api/cases/{case_id}")
    assert resp.status_code == 204

    assert client.get(f"/api/cases/{case_id}").status_code == 404
    assert client.get("/api/cases").json() == []


def test_delete_case_not_found(client):
    resp = client.delete("/api/cases/nonexistent")
    assert resp.status_code == 404


def test_ilcd_situation_persisted_when_set(client):
    """If the client sends a Case with the ILCD situation already derived (from
    a previous pipeline run), the column is denormalised so the list summary
    surfaces it without re-parsing the JSON."""
    run_case = {**VALID_CASE, "ilcd_situation": "ILCD Situation A"}
    created = client.post("/api/cases", json={"name": "Already-run", "case": run_case}).json()
    assert created["ilcd_situation"] == "ILCD Situation A"
    listing = client.get("/api/cases").json()
    assert listing[0]["ilcd_situation"] == "ILCD Situation A"


def test_a_case_saved_with_the_retired_pathway_still_loads(client):
    """Cases exported before 2026-10-18 carry pathway_id / is_01_extended."""
    old = {**VALID_CASE, "pathway_id": "IS-01", "is_01_extended": True}
    created = client.post("/api/cases", json={"name": "Old export", "case": old})
    assert created.status_code in (200, 201)
    assert "pathway_id" not in created.json()["case"]
