"""Tests for the read-only decision-engine endpoints."""

from __future__ import annotations


def test_get_questions_endpoint(client) -> None:
    response = client.get("/api/decision-engine/questions")
    assert response.status_code == 200
    payload = response.json()
    assert "questions" in payload
    assert len(payload["questions"]) == 10
    q1 = payload["questions"][0]
    assert q1["id"] == "q1"
    assert q1["key"] == "ilcd_context"
    assert any(opt["value"] == "C2" for opt in q1["options"])


def test_get_pathways_endpoint(client) -> None:
    response = client.get("/api/decision-engine/pathways")
    assert response.status_code == 200
    pathways = response.json()["pathways"]
    assert len(pathways) == 10
    ids = {p["id"] for p in pathways}
    assert {"LCSA-P1", "LCSA-P10"} <= ids


def test_get_pathway_by_id(client) -> None:
    response = client.get("/api/decision-engine/pathways/LCSA-P1")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "LCSA-P1"
    assert "configuration" in body


def test_get_pathway_unknown_returns_404(client) -> None:
    response = client.get("/api/decision-engine/pathways/LCSA-PXX")
    assert response.status_code == 404
