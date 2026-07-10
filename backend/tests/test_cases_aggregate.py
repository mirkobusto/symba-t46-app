"""Integration tests for GET /api/cases/aggregate/breakdown."""
from __future__ import annotations

CASE_A = {  # q1=B q2=D q6a=wastewater q7=B → IS-01 + A multi-actor
    "q1": "B", "q2": "D",
    "q3": {"env": True}, "q4": ["E"],
    "q6a": "wastewater_sludge_biofactories", "q6b": "TRL9", "q7": "B",
    "flows": [{"id": "f1", "name": "f1", "q5": "a"}],
}

CASE_B = {  # q1=C policy → IS-02
    "q1": "C", "q2": "D",
    "q3": {"env": True}, "q4": ["E"],
    "q6a": "waste_valorization", "q6b": "TRL9", "q7": "D",
    "flows": [{"id": "f1", "name": "f1", "q5": "e"}],
}

CASE_C = {  # similar to A but pulp_paper
    "q1": "B", "q2": "D",
    "q3": {"env": True}, "q4": ["E"],
    "q6a": "pulp_paper", "q6b": "TRL9", "q7": "B",
    "flows": [{"id": "f1", "name": "f1", "q5": "e"}],
}


def _save_post_pipeline(client, name: str, body: dict) -> str:
    """Run the pipeline first, then save the post-pipeline Case so its
    pathway_id / ilcd_situation are populated. Returns the saved id."""
    pipeline_r = client.post("/api/pipeline/run", json=body)
    assert pipeline_r.status_code == 200, pipeline_r.text
    post = pipeline_r.json()
    save_r = client.post("/api/cases", json={"name": name, "case": post})
    assert save_r.status_code == 201
    return save_r.json()["id"]


def test_aggregate_empty(client):
    r = client.get("/api/cases/aggregate/breakdown")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["total"] == 0
    assert body["by_pathway"] == []
    assert body["by_q6a_sector"] == []


def test_aggregate_after_three_cases(client):
    _save_post_pipeline(client, "A", CASE_A)
    _save_post_pipeline(client, "B", CASE_B)
    _save_post_pipeline(client, "C", CASE_C)

    r = client.get("/api/cases/aggregate/breakdown")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 3

    pathway_counts = {e["key"]: e["count"] for e in body["by_pathway"]}
    assert pathway_counts.get("IS-01") == 2
    assert pathway_counts.get("IS-02") == 1

    sectors = {e["key"]: e["count"] for e in body["by_q6a_sector"]}
    assert sectors.get("wastewater_sludge_biofactories") == 1
    assert sectors.get("waste_valorization") == 1
    assert sectors.get("pulp_paper") == 1

    scopes = {e["key"]: e["count"] for e in body["by_q7_geographic_scope"]}
    assert scopes.get("B") == 2
    assert scopes.get("D") == 1

    ilcd = {e["key"]: e["count"] for e in body["by_ilcd_situation"]}
    assert ilcd.get("ILCD Situation A multi-actor") == 2
    assert ilcd.get("ILCD Situation B") == 1


def test_aggregate_route_does_not_shadow_get_case(client):
    """'aggregate' must not be matched as a {case_id} value — regression."""
    case_id = _save_post_pipeline(client, "A", CASE_A)
    # The aggregate route returns CasesAggregate (a different schema);
    # if FastAPI had matched /aggregate/breakdown as case_id="aggregate"
    # it would return 404. Sanity by hitting both.
    r_agg = client.get("/api/cases/aggregate/breakdown")
    assert r_agg.status_code == 200
    assert "total" in r_agg.json()

    r_case = client.get(f"/api/cases/{case_id}")
    assert r_case.status_code == 200
    assert r_case.json()["id"] == case_id
