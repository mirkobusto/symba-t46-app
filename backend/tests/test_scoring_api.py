"""Integration tests for /api/scoring/* endpoints."""
from __future__ import annotations

from datetime import datetime


WIKTOR_BODY = {
    "q1": "B",
    "q2": "D",
    "q3": {"env": True, "eco": True, "soc": False},
    "q4": ["E"],
    "q6a": "wastewater_sludge_biofactories",
    "q6b": "TRL7-8",
    "q7": "B",
    "flows": [
        {"id": "f1", "name": "flow1", "q5": "a"},
        {"id": "f2", "name": "flow2", "q5": "c"},
    ],
}


def _create_case(client) -> str:
    """Helper: save a Case and return its server-side id."""
    r = client.post("/api/cases", json={"name": "wiktor", "case": WIKTOR_BODY})
    assert r.status_code == 201, r.text
    return r.json()["id"]


def _sample_scoring(case_id: str) -> dict:
    return {
        "case_id": case_id,
        "source": "CIRCE",
        "schema_version": "1.0-draft",
        "computed_at": "2026-05-22T10:30:00",
        "indicators": [
            {
                "id": "env.gwp",
                "label_en": "Global warming potential",
                "dimension": "env",
                "value": 12.3,
                "unit": "kg CO2-eq / FU",
            },
            {
                "id": "eco.npv",
                "label_en": "Net present value",
                "dimension": "eco",
                "value": 2_350_000.0,
                "unit": "EUR2024",
            },
        ],
        "notes": None,
    }


# ---------------------------------------------------------------------------
# 404 paths
# ---------------------------------------------------------------------------


def test_get_404_when_no_scoring(client):
    case_id = _create_case(client)
    r = client.get(f"/api/scoring/{case_id}")
    assert r.status_code == 404


def test_put_404_when_case_not_saved(client):
    # No Case in DB. Use a random case_id.
    case_id = "00000000-0000-0000-0000-000000000000"
    r = client.put(f"/api/scoring/{case_id}", json=_sample_scoring(case_id))
    assert r.status_code == 404
    assert "Case" in r.json()["detail"]


def test_delete_404_when_no_scoring(client):
    case_id = _create_case(client)
    r = client.delete(f"/api/scoring/{case_id}")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# Mismatched case_id
# ---------------------------------------------------------------------------


def test_put_400_when_case_id_mismatch(client):
    case_id = _create_case(client)
    payload = _sample_scoring("DIFFERENT-id")
    r = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r.status_code == 400
    assert "case_id" in r.json()["detail"]


# ---------------------------------------------------------------------------
# Happy path
# ---------------------------------------------------------------------------


def test_put_then_get_roundtrip(client):
    case_id = _create_case(client)
    payload = _sample_scoring(case_id)
    r = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["case_id"] == case_id
    assert body["source"] == "CIRCE"
    assert len(body["indicators"]) == 2

    g = client.get(f"/api/scoring/{case_id}")
    assert g.status_code == 200
    fetched = g.json()
    assert fetched["indicators"][0]["id"] == "env.gwp"
    assert fetched["indicators"][0]["value"] == 12.3


def test_put_twice_updates_payload(client):
    case_id = _create_case(client)
    payload = _sample_scoring(case_id)
    r1 = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r1.status_code == 200

    payload["indicators"][0]["value"] = 99.9
    payload["notes"] = "updated"
    r2 = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r2.status_code == 200

    g = client.get(f"/api/scoring/{case_id}")
    fetched = g.json()
    assert fetched["indicators"][0]["value"] == 99.9
    assert fetched["notes"] == "updated"


def test_delete_then_get_404(client):
    case_id = _create_case(client)
    client.put(f"/api/scoring/{case_id}", json=_sample_scoring(case_id))
    d = client.delete(f"/api/scoring/{case_id}")
    assert d.status_code == 204
    g = client.get(f"/api/scoring/{case_id}")
    assert g.status_code == 404


# ---------------------------------------------------------------------------
# Schema validation
# ---------------------------------------------------------------------------


def test_put_422_on_invalid_dimension(client):
    case_id = _create_case(client)
    payload = _sample_scoring(case_id)
    payload["indicators"][0]["dimension"] = "invalid"
    r = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r.status_code == 422


def test_put_accepts_missing_value_for_indicator(client):
    """value can be None when an indicator is declared but not yet computed."""
    case_id = _create_case(client)
    payload = _sample_scoring(case_id)
    payload["indicators"][0]["value"] = None
    r = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r.status_code == 200
    g = client.get(f"/api/scoring/{case_id}").json()
    assert g["indicators"][0]["value"] is None


def test_put_rejects_extra_indicator_fields(client):
    """extra='forbid' on ScoringIndicator."""
    case_id = _create_case(client)
    payload = _sample_scoring(case_id)
    payload["indicators"][0]["foo"] = "bar"
    r = client.put(f"/api/scoring/{case_id}", json=payload)
    assert r.status_code == 422
