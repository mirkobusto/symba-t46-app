"""Integration tests for /api/dcf/* endpoints.

Spins the FastAPI app via TestClient and verifies:
- /preview returns a DcfPayload JSON
- /export/xlsx returns an xlsx blob with correct mime
- /export/docx returns a docx blob with correct mime
- 400 on partial Case (Q1=None)
"""
from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


# A minimal-valid Case body (Wiktor-like)
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

ARCE_BODY = {
    "q1": "B",
    "q2": "A",
    "q3": {"env": True, "eco": False, "soc": False},
    "q4": ["E"],
    "q6a": "plastics_packaging",
    "q6b": "TRL9",
    "q7": "A",
    "flows": [
        {"id": "f1", "name": "flow1", "q5": "b"},
        {"id": "f2", "name": "flow2", "q5": "c"},
    ],
}

PARTIAL_BODY = {  # q1=None
    "q2": "D",
    "q3": {"env": True},
    "q4": ["E"],
    "q6a": "pulp_paper",
    "q6b": "TRL9",
    "q7": "B",
    "flows": [{"id": "f1", "name": "flow1", "q5": "e"}],
}


# ---------------------------------------------------------------------------
# /preview
# ---------------------------------------------------------------------------


def test_preview_returns_payload():
    r = client.post("/api/dcf/preview", json=WIKTOR_BODY)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["pathway_id"] == "IS-01"
    assert body["is_01_extended"] is True
    assert body["ilcd_situation"] == "ILCD Situation A multi-actor"
    # 6 sections in spec order
    ids = [s["id"] for s in body["sections"]]
    assert ids == [
        "actors", "flow_matrix", "logistics", "infrastructure",
        "methodological_choices", "network_diagram",
    ]


def test_preview_logistics_off_when_q7_a():
    r = client.post("/api/dcf/preview", json=ARCE_BODY)
    assert r.status_code == 200
    body = r.json()
    logistics = next(s for s in body["sections"] if s["id"] == "logistics")
    assert logistics["active"] is False
    assert logistics["fields"] == []


def test_preview_mandates_by_category_populated():
    r = client.post("/api/dcf/preview", json=WIKTOR_BODY)
    body = r.json()
    assert len(body["mandates_by_category"]) > 0


def test_preview_400_on_partial_case():
    r = client.post("/api/dcf/preview", json=PARTIAL_BODY)
    assert r.status_code == 400


# ---------------------------------------------------------------------------
# /export/xlsx
# ---------------------------------------------------------------------------


def test_export_xlsx_returns_blob():
    r = client.post("/api/dcf/export/xlsx", json=WIKTOR_BODY)
    assert r.status_code == 200, r.text
    assert r.headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    assert "attachment" in r.headers["content-disposition"]
    assert r.headers["content-disposition"].endswith('.xlsx"')
    assert len(r.content) > 2000


# ---------------------------------------------------------------------------
# /export/docx
# ---------------------------------------------------------------------------


def test_export_docx_returns_blob():
    r = client.post("/api/dcf/export/docx", json=WIKTOR_BODY)
    assert r.status_code == 200, r.text
    assert r.headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert "attachment" in r.headers["content-disposition"]
    assert r.headers["content-disposition"].endswith('.docx"')
    assert len(r.content) > 5000
