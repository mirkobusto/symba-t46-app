"""Tests for POST /api/pipeline/run — Sprint 4 Step 3 follow-up γ-2.

Verifies the HTTP wrapper around `engine.pipeline.run`: minimal valid
case → 200 with derived state populated; partial questionnaire
(Q1=None) → 400; invalid Q1 enum value → 422 (Pydantic validation).
"""
from __future__ import annotations


def test_pipeline_run_minimal_case(client):
    """Q1=A, Q2=A, Q3.env=True is the minimum valid payload."""
    resp = client.post("/api/pipeline/run", json={
        "q1": "A", "q2": "A",
        "q3": {"env": True, "eco": False, "soc": False},
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["pathway_id"] == "IS-01"
    assert body["ilcd_situation"] == "ILCD Situation A"
    assert body["lcc_type"] == "deactivated"
    assert body["slca_activation_state"] == "deactivated"
    assert body["blocked_by"] == []
    assert len(body["activated_nodes"]) >= 116


def test_pipeline_run_full_lcsa_case(client):
    """Tri-method case (env+eco+soc) populates lcc_type, S-LCA, CDPs."""
    resp = client.post("/api/pipeline/run", json={
        "q1": "B", "q2": "D",
        "q3": {"env": True, "eco": True, "soc": True},
        "q4": ["E"],
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["pathway_id"] == "IS-01"
    assert body["is_01_extended"] is True
    assert body["lcc_type"] == "C+E"
    assert body["slca_activation_state"] == "active"
    assert len(body["cdp_flags"]) > 0


def test_pipeline_run_q1_none_returns_400(client):
    """Partial questionnaire (Q1 missing) → ValueError → HTTP 400."""
    resp = client.post("/api/pipeline/run", json={
        "q3": {"env": True, "eco": False, "soc": False},
    })
    assert resp.status_code == 400
    assert "Invalid Q1" in resp.json()["detail"]


def test_pipeline_run_invalid_q1_returns_422(client):
    """Invalid enum value → Pydantic validation → HTTP 422."""
    resp = client.post("/api/pipeline/run", json={
        "q1": "Z",  # not in Q1 enum
        "q3": {"env": True, "eco": False, "soc": False},
    })
    assert resp.status_code == 422


def test_pipeline_run_extra_field_returns_422(client):
    """Case has extra='forbid' → unknown top-level field → HTTP 422."""
    resp = client.post("/api/pipeline/run", json={
        "q1": "A", "q2": "A",
        "q3": {"env": True, "eco": False, "soc": False},
        "q8": "X",  # not a valid Q
    })
    assert resp.status_code == 422


def test_pipeline_run_with_flows(client):
    """Per-flow nodes populate flow-keyed dicts."""
    resp = client.post("/api/pipeline/run", json={
        "q1": "A", "q2": "A",
        "q3": {"env": True, "eco": False, "soc": False},
        "flows": [
            {"id": "f1", "name": "heat", "q5": "a"},
            {"id": "f2", "name": "solvent", "q5": "c"},
        ],
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["lca"].get("zero_burden_classification") == {
        "f1": "zero-burden",
        "f2": "substitution+Q-correction",
    }


def test_pipeline_report_returns_docx(client):
    """POST /api/pipeline/report runs pipeline + streams a .docx."""
    resp = client.post("/api/pipeline/report", json={
        "q1": "A", "q2": "A",
        "q3": {"env": True, "eco": False, "soc": False},
    })
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert "symba-case-report.docx" in resp.headers["content-disposition"]
    # .docx is a ZIP container — first two magic bytes PK
    assert resp.content[:2] == b"PK"
    assert len(resp.content) > 2000


def test_pipeline_report_q1_none_returns_400(client):
    resp = client.post("/api/pipeline/report", json={
        "q3": {"env": True, "eco": False, "soc": False},
    })
    assert resp.status_code == 400


# ---------------------------------------------------------------------------
# /run-scenarios (Feature C)
# ---------------------------------------------------------------------------


def test_run_scenarios_baseline_only(client):
    """Empty scenarios list -> just the baseline result."""
    resp = client.post("/api/pipeline/run-scenarios", json={
        "baseline": {
            "q1": "B", "q2": "D",
            "q3": {"env": True, "eco": False, "soc": False},
        },
        "scenarios": [],
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["baseline"]["pathway_id"] == "IS-01"
    assert body["scenarios"] == []


def test_run_scenarios_with_two_alternatives(client):
    """Baseline + 2 scenarios with Q-overrides."""
    resp = client.post("/api/pipeline/run-scenarios", json={
        "baseline": {
            "q1": "B", "q2": "D",
            "q3": {"env": True, "eco": False, "soc": False},
        },
        "scenarios": [
            {"id": "alt1", "label": "Add ECO", "overrides": {
                "q3": {"env": True, "eco": True, "soc": False}
            }},
            {"id": "alt2", "label": "Switch to Q1=C", "overrides": {
                "q1": "C"
            }},
        ],
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["baseline"]["pathway_id"] == "IS-01"
    assert body["baseline"]["lcc_type"] == "deactivated"
    # Scenario 1: ECO added -> still IS-01 but lcc_type now C+E
    assert body["scenarios"][0]["id"] == "alt1"
    assert body["scenarios"][0]["result"]["pathway_id"] == "IS-01"
    assert body["scenarios"][0]["result"]["lcc_type"] == "C+E"
    # Scenario 2: Q1 switched to C -> pathway IS-02
    assert body["scenarios"][1]["id"] == "alt2"
    assert body["scenarios"][1]["result"]["pathway_id"] == "IS-02"


def test_run_scenarios_baseline_q1_none_returns_400(client):
    resp = client.post("/api/pipeline/run-scenarios", json={
        "baseline": {
            "q3": {"env": True, "eco": False, "soc": False},
        },
        "scenarios": [],
    })
    assert resp.status_code == 400
    assert "baseline" in resp.json()["detail"]


def test_run_scenarios_scenario_engine_failure_does_not_400_the_batch(client):
    """If one scenario's overrides break the engine (e.g. q1=null),
    the batch still returns 200 with the failed scenario surfaced
    via empty engine output."""
    resp = client.post("/api/pipeline/run-scenarios", json={
        "baseline": {
            "q1": "B", "q2": "D",
            "q3": {"env": True, "eco": False, "soc": False},
        },
        "scenarios": [
            {"id": "broken", "label": "Strip Q1",
             "overrides": {"q1": None}},
        ],
    })
    assert resp.status_code == 200
    body = resp.json()
    # Failed scenario has no pathway_id
    assert body["scenarios"][0]["result"]["pathway_id"] is None


def test_pipeline_run_with_advanced_override(client):
    """advanced['slca_framework_override']='absolute' + Q3.soc=True →
    L1 BLOCK 2 fires."""
    resp = client.post("/api/pipeline/run", json={
        "q1": "A", "q2": "A",
        "q3": {"env": True, "eco": False, "soc": True},
        "advanced": {"slca_framework_override": "absolute"},
    })
    assert resp.status_code == 200
    body = resp.json()
    assert "block_anyQ1_plus_AbsoluteSLCA" in body["blocked_by"]
