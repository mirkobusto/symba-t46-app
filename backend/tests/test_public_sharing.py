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


def _network_in(client, headers, case_id: str, country: str | None) -> None:
    values = {"actor.name": "Dairy", "actor.role": "partner"}
    if country:
        values["actor.country_iso2"] = country
    r = client.put(f"/api/dcf/{case_id}/data", headers=headers, json={
        "case_id": case_id, "rows_by_section": {"actors": [{"row_id": "a1", "values": values}]}})
    assert r.status_code == 200, r.text


def test_the_public_region_counts_only_shared_cases(client):
    owner = _auth(client, "owner@example.eu")
    saved = _save(client, owner)
    _network_in(client, owner, saved["id"], "it")
    assert client.get("/api/public/region/IT").json()["total"] == 0
    client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}, headers=owner)
    body = client.get("/api/public/region/it").json()
    assert (body["region"], body["total"]) == ("IT", 1)


def test_the_public_region_counts_cases_with_a_partner_there(client):
    # by the partners' country in the drawn network, not by Q7b (round 4 leftover)
    owner = _auth(client, "owner@example.eu")
    in_it, no_network = _save(client, owner), _save(client, owner)
    _network_in(client, owner, in_it["id"], "IT")
    for saved in (in_it, no_network):
        client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}, headers=owner)
    assert client.get("/api/public/region/IT").json()["total"] == 1
    assert client.get("/api/public/region/DE").json()["total"] == 0


def test_the_public_report_says_where_the_plants_are_without_naming_them(client):
    # UX round 6, P4-08 (decided by Fable): the distinct countries of the base
    # network, never the company names, never a scenario network's actors
    owner = _auth(client, "owner@example.eu")
    saved = _save(client, owner)
    client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}, headers=owner)
    assert client.get(f"/api/public/report/{saved['slug']}").json()["countries"] == []
    actors = [{"row_id": f"a{i}", "values": {"actor.name": name, "actor.role": "partner",
                                             "actor.country_iso2": code}}
              for i, (name, code) in enumerate([("Dairy", "it"), ("Biogas", "IT "), ("Farm", "ES")])]
    r = client.put(f"/api/dcf/{saved['id']}/data", headers=owner, json={
        "case_id": saved["id"], "rows_by_section": {"actors": actors},
        "networks_by_scenario": {"s1": {"rows_by_section": {"actors": [
            {"row_id": "a9", "values": {"actor.name": "Elsewhere", "actor.role": "partner",
                                        "actor.country_iso2": "DE"}}]}}}})
    assert r.status_code == 200, r.text
    report = client.get(f"/api/public/report/{saved['slug']}").json()
    assert report["countries"] == ["ES", "IT"]
    assert "Dairy" not in str(report)


def test_the_country_page_lists_its_shared_cases(client):
    # UX round 6, P3-08 / P7-23: "Cases 1" with no way to reach the case
    owner = _auth(client, "owner@example.eu")
    shared, unshared = _save(client, owner), _save(client, owner)
    for saved in (shared, unshared):
        _network_in(client, owner, saved["id"], "IT")
    client.post(f"/api/cases/{shared['id']}/share", json={"shared": True}, headers=owner)
    body = client.get("/api/public/region/IT").json()
    assert [(c["key"], c["name"]) for c in body["cases"]] == [(shared["slug"], "Valley")]
    assert body["cases"][0]["shared_at"]
    assert body["by_sector"] == [{"key": "agriculture_agrifood_biorefineries", "count": 1}]


def test_the_countries_with_a_page_are_listed(client):
    # the way from the dashboard to the country pages (P3-08): only shared
    # cases, one count per country however many companies are there
    owner = _auth(client, "owner@example.eu")
    it_es, it_only, unshared, no_network = (_save(client, owner) for _ in range(4))
    r = client.put(f"/api/dcf/{it_es['id']}/data", headers=owner, json={
        "case_id": it_es["id"], "rows_by_section": {"actors": [
            {"row_id": f"a{i}", "values": {"actor.name": n, "actor.role": "partner", "actor.country_iso2": c}}
            for i, (n, c) in enumerate([("Dairy", "IT"), ("Farm", "it"), ("Biogas", "ES")])]}})
    assert r.status_code == 200, r.text
    _network_in(client, owner, it_only["id"], "IT")
    _network_in(client, owner, unshared["id"], "FR")
    for saved in (it_es, it_only, no_network):
        client.post(f"/api/cases/{saved['id']}/share", json={"shared": True}, headers=owner)
    assert client.get("/api/public/countries").json() == [
        {"code": "IT", "count": 2}, {"code": "ES", "count": 1}]
