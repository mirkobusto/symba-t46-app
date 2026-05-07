"""Integration tests for the sessions REST API."""

from __future__ import annotations

from typing import Any

# Reuse the canonical sample answers from conftest.
SUNFLOWER: dict[str, Any] = {
    "q1": "A",
    "q2": "ex-ante",
    "q3": "C+E-LCC",
    "q4": "function-oriented",
    "q5": "design",
    "q6": False,
    "q7": "system-expansion",
    "q8": True,
    "q9": "single-site",
    "q10": "standard",
}

BLOCKED_C2_ELCC: dict[str, Any] = {
    "q1": "C2",
    "q2": "ex-post",
    "q3": "C+E-LCC",
    "q4": "function-oriented",
    "q5": "analysis",
    "q6": False,
    "q7": "allocation",
    "q8": False,
    "q9": "single-site",
    "q10": "standard",
}


def _bulk(answers: dict[str, Any]) -> dict[str, Any]:
    return {
        "answers": [
            {"question_id": q, "value": v} for q, v in answers.items()
        ]
    }


# ---------------------------------------------------------------------------
# CRUD
# ---------------------------------------------------------------------------


def test_create_session(client) -> None:
    response = client.post("/api/sessions", json={})
    assert response.status_code == 201
    body = response.json()
    assert "id" in body
    assert body["status"] == "draft"
    assert body["answers_count"] == 0
    assert body["pathway_resolved"] is False


def test_create_session_with_metadata(client) -> None:
    response = client.post(
        "/api/sessions", json={"case_name": "Sunflower", "notes": "park"}
    )
    assert response.status_code == 201
    body = response.json()
    assert body["case_name"] == "Sunflower"
    assert body["notes"] == "park"


def test_get_session_not_found(client) -> None:
    response = client.get("/api/sessions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_patch_session_metadata(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    response = client.patch(f"/api/sessions/{sid}", json={"case_name": "Foo"})
    assert response.status_code == 200
    assert response.json()["case_name"] == "Foo"


def test_archive_session(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    response = client.delete(f"/api/sessions/{sid}")
    assert response.status_code == 200
    assert response.json()["status"] == "archived"


# ---------------------------------------------------------------------------
# Answers
# ---------------------------------------------------------------------------


def test_submit_answers_partial_keeps_draft(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    payload = {
        "answers": [
            {"question_id": "q1", "value": "A"},
            {"question_id": "q2", "value": "ex-ante"},
        ]
    }
    response = client.post(f"/api/sessions/{sid}/answers", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["accepted"] == ["q1", "q2"]
    assert body["rejected"] == []
    assert body["answers_count"] == 2
    assert body["status"] == "draft"


def test_submit_answers_invalid_question_id(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    payload = {"answers": [{"question_id": "q42", "value": "A"}]}
    response = client.post(f"/api/sessions/{sid}/answers", json=payload)
    assert response.status_code == 200  # endpoint accepts the request shape
    body = response.json()
    assert body["accepted"] == []
    assert body["rejected"] and body["rejected"][0]["question_id"] == "q42"


def test_submit_answers_invalid_value(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    payload = {"answers": [{"question_id": "q1", "value": "ZZZ"}]}
    response = client.post(f"/api/sessions/{sid}/answers", json=payload)
    body = response.json()
    assert body["rejected"]


def test_answers_upsert(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    client.post(
        f"/api/sessions/{sid}/answers",
        json={"answers": [{"question_id": "q1", "value": "A"}]},
    )
    # Resubmit the same q1 with a different value
    client.post(
        f"/api/sessions/{sid}/answers",
        json={"answers": [{"question_id": "q1", "value": "B"}]},
    )
    detail = client.get(f"/api/sessions/{sid}").json()
    q1 = next(a for a in detail["answers"] if a["question_id"] == "q1")
    assert q1["value"] == "B"
    assert detail["answers_count"] == 1


def test_complete_answers_marks_status(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    response = client.post(f"/api/sessions/{sid}/answers", json=_bulk(SUNFLOWER))
    assert response.status_code == 200
    body = response.json()
    assert body["answers_count"] == 10
    assert body["status"] == "answers_complete"


# ---------------------------------------------------------------------------
# Resolve pathway — happy path
# ---------------------------------------------------------------------------


def test_resolve_pathway_complete_session_sunflower(client) -> None:
    sid = client.post(
        "/api/sessions", json={"case_name": "Sunflower-Compost-Park"}
    ).json()["id"]
    client.post(f"/api/sessions/{sid}/answers", json=_bulk(SUNFLOWER))
    response = client.post(f"/api/sessions/{sid}/resolve")
    assert response.status_code == 200
    body = response.json()
    assert body["pathway_id"] == "LCSA-P1"
    assert "RULE-01-Q8-public-assertion" in body["applied_rules"]
    assert body["configuration"]["lca"]["weighting"] == "no-weighting"
    assert body["configuration"]["lca"]["critical_review"] == "panel"
    assert body["blocked"] is False

    # GET endpoint returns the persisted resolution
    persisted = client.get(f"/api/sessions/{sid}/pathway")
    assert persisted.status_code == 200
    assert persisted.json()["pathway_id"] == "LCSA-P1"

    # Session status flipped
    detail = client.get(f"/api/sessions/{sid}").json()
    assert detail["status"] == "pathway_resolved"
    assert detail["pathway_resolved"] is True


def test_resolve_pathway_blocked(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    client.post(f"/api/sessions/{sid}/answers", json=_bulk(BLOCKED_C2_ELCC))
    response = client.post(f"/api/sessions/{sid}/resolve")
    assert response.status_code == 200
    body = response.json()
    assert body["blocked"] is True
    assert body["block_info"]["block_id"] == "BLOCK-01"
    assert body["pathway_id"] is None


def test_resolve_pathway_incomplete_returns_400(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    client.post(
        f"/api/sessions/{sid}/answers",
        json={"answers": [{"question_id": "q1", "value": "A"}]},
    )
    response = client.post(f"/api/sessions/{sid}/resolve")
    assert response.status_code == 400
    detail = response.json()["detail"]
    assert detail["error"] == "incomplete_answers"
    assert "q2" in detail["missing"]


def test_get_pathway_before_resolve_404(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    response = client.get(f"/api/sessions/{sid}/pathway")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Stub endpoints (501)
# ---------------------------------------------------------------------------


def test_protocol_endpoint_is_501(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    response = client.get(f"/api/sessions/{sid}/protocol")
    assert response.status_code == 501


def test_data_template_endpoint_is_501(client) -> None:
    sid = client.post("/api/sessions", json={}).json()["id"]
    response = client.get(f"/api/sessions/{sid}/data-template")
    assert response.status_code == 501


# ---------------------------------------------------------------------------
# Sprint 1 regression — un-prefixed /health still reachable
# ---------------------------------------------------------------------------


def test_health_root_endpoint_still_works(client) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health_api_endpoint(client) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
