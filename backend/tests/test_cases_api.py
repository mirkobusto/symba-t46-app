"""Tests for the cases CRUD endpoints (Feature D)."""
from __future__ import annotations

VALID_CASE = {
    "q1": "B", "q2": "D",
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
    # pathway_id will be None because the case was saved without running
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
    assert body["case"]["q2"] == "D"


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


def test_pathway_id_persisted_when_set(client):
    """If the client sends a Case with pathway_id already set (from a
    previous pipeline run), the column is denormalised so the list
    summary surfaces it without re-parsing the JSON."""
    case_with_pathway = {**VALID_CASE, "pathway_id": "IS-01"}
    created = client.post("/api/cases", json={
        "name": "Already-run", "case": case_with_pathway,
    }).json()
    assert created["pathway_id"] == "IS-01"
    listing = client.get("/api/cases").json()
    assert listing[0]["pathway_id"] == "IS-01"
