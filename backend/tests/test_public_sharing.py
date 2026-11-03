"""Sharing of saved cases (UX round 2026-11-03, decided by Fable).

Before, every saved case was readable by anyone at /api/public/report/<slug or
id>, and a slug ended in 4 hex digits. Now a case is public only once its owner
shares it, the slug carries 8 hex digits, and the public payload leaves out the
analyst's working material.
"""
from __future__ import annotations

import re

CASE = {
    "q1": "B", "q2": "A", "decision_context": "micro", "q6a": "agriculture_agrifood_biorefineries", "q7": "B",
    "q3": {"env": True, "eco": False, "soc": False},
    "flows": [{"id": "f1", "name": "whey", "q5": "a", "notes": "price under negotiation",
               "physical_quantity": 12000, "physical_unit": "t/y"}],
    "advanced": {"slca_framework_override": "x", "future_background_threshold_years": 15},
}


def _auth(client, email: str) -> dict:
    r = client.post("/api/auth/register", json={"email": email, "password": "hunter2-strong"})
    assert r.status_code == 201, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _save(client, headers) -> dict:
    r = client.post("/api/cases", json={"name": "Valley", "case": CASE}, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()


def test_a_saved_case_is_not_public_until_shared(client):
    owner = _auth(client, "owner@example.eu")
    saved = _save(client, owner)
    assert saved["shared_at"] is None
    for key in (saved["slug"], saved["id"]):
        assert client.get(f"/api/public/report/{key}").status_code == 404


def test_the_owner_shares_and_unshares(client):
    owner = _auth(client, "owner@example.eu")
    saved = _save(client, owner)
    r = client.post(f"/api/cases/{saved['id']}/share",
                    json={"shared": True, "prepared_by": " ENCO ", "case_contact": "case@enco.example"},
                    headers=owner)
    assert r.status_code == 200 and r.json()["shared_at"] and r.json()["prepared_by"] == "ENCO"
    report = client.get(f"/api/public/report/{saved['slug']}").json()
    assert report["prepared_by"] == "ENCO" and report["case_contact"] == "case@enco.example"
    flow = report["case"]["flows"][0]
    assert flow["name"] == "whey" and flow["notes"] is None and flow["physical_quantity"] is None
    assert report["case"]["advanced"] == {"future_background_threshold_years": 15}
    assert client.post(f"/api/cases/{saved['id']}/share", json={"shared": False}, headers=owner).status_code == 200
    assert client.get(f"/api/public/report/{saved['slug']}").status_code == 404


def test_only_who_may_modify_can_share(client):
    owner = _auth(client, "owner@example.eu")
    saved = _save(client, owner)
    other = _auth(client, "other@example.eu")
    assert client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}, headers=other).status_code == 404
    assert client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}).status_code == 404


def test_slugs_carry_eight_hex_digits(client):
    saved = _save(client, _auth(client, "owner@example.eu"))
    assert re.search(r"-[0-9a-f]{8}$", saved["slug"]), saved["slug"]


def test_the_public_region_counts_only_shared_cases(client):
    owner = _auth(client, "owner@example.eu")
    saved = _save(client, owner)
    assert client.get("/api/public/region/IT").json()["total"] == 0
    client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}, headers=owner)
    assert client.get("/api/public/region/IT").json()["total"] == 1
