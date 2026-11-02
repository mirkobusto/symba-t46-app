"""Anonymous saving is off by default (2026-11-02).

With it on, any visitor of a public deployment could list, overwrite or
delete the studies other visitors had saved without signing in: the agent UX
round found "My cases" showing everyone's anonymous cases with a delete
button. `SYMBA_ANON_SAVE=true` restores the old flow.
"""
from __future__ import annotations

from app.models import CaseRecord

CASE = {
    "q1": "B",
    "q2": "A",
    "q3": {"env": True, "eco": False, "soc": False},
    "decision_context": "micro",
    "flows": [{"id": "f1", "name": "whey", "q5": "a"}],
}


def _token(client, email: str) -> str:
    r = client.post("/api/auth/register", json={"email": email, "password": "hunter2-strong"})
    assert r.status_code == 201, r.text
    return r.json()["access_token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _ownerless_row(db_session) -> str:
    """A case saved without an owner, as before 2026-11-02 or with the flag on."""
    rec = CaseRecord(id="legacy-1", name="legacy", case_json="{}", slug="legacy-1")
    db_session.add(rec)
    db_session.commit()
    return rec.id


def test_health_says_anonymous_saving_is_off(client):
    assert client.get("/health").json()["anonymous_save"] is False


def test_health_follows_the_flag(client, anonymous_save_on):
    assert client.get("/health").json()["anonymous_save"] is True


def test_saving_without_signing_in_is_refused(client):
    r = client.post("/api/cases", json={"name": "mine", "case": CASE})
    assert r.status_code == 401
    assert "Sign in" in r.json()["detail"]


def test_a_visitor_without_a_token_lists_nothing(client, db_session):
    _ownerless_row(db_session)
    assert client.get("/api/cases").json() == []


def test_a_signed_in_user_lists_only_their_own_cases(client, db_session):
    _ownerless_row(db_session)
    _token(client, "admin@example.eu")  # first user is the admin
    alice = _token(client, "alice@example.eu")
    r = client.post("/api/cases", json={"name": "alice's", "case": CASE}, headers=_auth(alice))
    assert r.status_code == 201
    names = [c["name"] for c in client.get("/api/cases", headers=_auth(alice)).json()]
    assert names == ["alice's"]


def test_an_ownerless_case_stays_readable_but_not_writable(client, db_session):
    case_id = _ownerless_row(db_session)
    assert client.get(f"/api/cases/{case_id}").status_code == 200
    assert client.delete(f"/api/cases/{case_id}").status_code == 403
    r = client.put(f"/api/cases/{case_id}", json={"name": "x", "case": CASE})
    assert r.status_code == 403


def test_an_admin_may_still_delete_an_ownerless_case(client, db_session):
    case_id = _ownerless_row(db_session)
    admin = _token(client, "admin@example.eu")
    assert client.delete(f"/api/cases/{case_id}", headers=_auth(admin)).status_code == 204
