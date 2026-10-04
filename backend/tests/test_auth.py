"""Integration tests for /api/auth/* + cases ownership filter."""
from __future__ import annotations


def _register(client, email: str, password: str = "hunter2-strong") -> dict:
    r = client.post(
        "/api/auth/register", json={"email": email, "password": password}
    )
    assert r.status_code == 201, r.text
    return r.json()


def _login(client, email: str, password: str = "hunter2-strong") -> dict:
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r.json()


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


WIKTOR_CASE = {
    "q1": "B",
    "q2": "D",
    "q3": {"env": True, "eco": True, "soc": False},
    "q4": ["E"],
    "q6a": "wastewater_sludge_biofactories",
    "q6b": "TRL7-8",
    "q7": "B",
    "flows": [{"id": "f1", "name": "f1", "q5": "a"}],
}


# ---------------------------------------------------------------------------
# Register + login + me
# ---------------------------------------------------------------------------


def test_register_first_user_is_admin(client):
    r = _register(client, "alice@example.eu")
    assert r["user"]["role"] == "admin"
    assert r["user"]["email"] == "alice@example.eu"
    assert r["access_token"]


def test_register_second_user_is_analyst(client):
    _register(client, "alice@example.eu")
    second = _register(client, "bob@example.eu")
    assert second["user"]["role"] == "analyst"


def test_register_duplicate_email_400(client):
    _register(client, "alice@example.eu")
    r = client.post(
        "/api/auth/register",
        json={"email": "alice@example.eu", "password": "hunter2-strong"},
    )
    assert r.status_code == 400


def test_register_password_too_short_422(client):
    r = client.post(
        "/api/auth/register",
        json={"email": "alice@example.eu", "password": "short"},
    )
    assert r.status_code == 422


def test_login_returns_token(client):
    _register(client, "alice@example.eu")
    body = _login(client, "alice@example.eu")
    assert body["access_token"]
    assert body["user"]["email"] == "alice@example.eu"


def test_login_wrong_password_401(client):
    _register(client, "alice@example.eu")
    r = client.post(
        "/api/auth/login",
        json={"email": "alice@example.eu", "password": "wrong-password"},
    )
    assert r.status_code == 401


def test_login_unknown_email_401(client):
    r = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.eu", "password": "hunter2-strong"},
    )
    assert r.status_code == 401


def test_me_with_valid_token(client):
    body = _register(client, "alice@example.eu")
    token = body["access_token"]
    r = client.get("/api/auth/me", headers=_auth(token))
    assert r.status_code == 200
    assert r.json()["email"] == "alice@example.eu"


def test_me_without_token_403(client):
    # HTTPBearer auto_error=True → 403 when header is missing
    r = client.get("/api/auth/me")
    assert r.status_code in (401, 403)


def test_me_with_invalid_token_401(client):
    r = client.get("/api/auth/me", headers=_auth("not-a-token"))
    assert r.status_code == 401


# ---------------------------------------------------------------------------
# Cases ownership
# ---------------------------------------------------------------------------


def test_anonymous_case_visible_to_everyone(client):
    """Backward-compat: cases created without auth are visible to all."""
    client.post("/api/cases", json={"name": "legacy", "case": WIKTOR_CASE})
    # Anonymous list
    r = client.get("/api/cases")
    assert r.status_code == 200
    assert len(r.json()) == 1
    # Authenticated user also sees the legacy row
    body = _register(client, "alice@example.eu")
    r2 = client.get("/api/cases", headers=_auth(body["access_token"]))
    assert len(r2.json()) == 1


def test_owned_case_invisible_to_other_user(client):
    a = _register(client, "alice@example.eu")  # admin
    b = _register(client, "bob@example.eu")    # analyst

    # Bob creates an owned case
    create = client.post(
        "/api/cases",
        headers=_auth(b["access_token"]),
        json={"name": "bob-case", "case": WIKTOR_CASE},
    )
    assert create.status_code == 201

    # Charlie (new analyst) doesn't see bob's case
    c = _register(client, "charlie@example.eu")
    listed = client.get("/api/cases", headers=_auth(c["access_token"]))
    names = [r["name"] for r in listed.json()]
    assert "bob-case" not in names

    # Bob sees his own
    listed_b = client.get("/api/cases", headers=_auth(b["access_token"]))
    assert "bob-case" in [r["name"] for r in listed_b.json()]

    # Admin (Alice) sees everything
    listed_a = client.get("/api/cases", headers=_auth(a["access_token"]))
    assert "bob-case" in [r["name"] for r in listed_a.json()]


def test_get_owned_case_404_for_other_user(client):
    _register(client, "alice@example.eu")
    b = _register(client, "bob@example.eu")
    c = _register(client, "charlie@example.eu")
    create = client.post(
        "/api/cases",
        headers=_auth(b["access_token"]),
        json={"name": "bob-case", "case": WIKTOR_CASE},
    )
    case_id = create.json()["id"]

    # Charlie cannot read Bob's case
    r = client.get(f"/api/cases/{case_id}", headers=_auth(c["access_token"]))
    assert r.status_code == 404


def test_update_owned_case_403_for_other_user(client):
    _register(client, "alice@example.eu")
    b = _register(client, "bob@example.eu")
    c = _register(client, "charlie@example.eu")
    create = client.post(
        "/api/cases",
        headers=_auth(b["access_token"]),
        json={"name": "bob-case", "case": WIKTOR_CASE},
    )
    case_id = create.json()["id"]

    r = client.put(
        f"/api/cases/{case_id}",
        headers=_auth(c["access_token"]),
        json={"name": "stolen", "case": WIKTOR_CASE},
    )
    assert r.status_code == 403


def test_admin_can_modify_other_users_case(client):
    a = _register(client, "alice@example.eu")  # admin
    b = _register(client, "bob@example.eu")    # analyst
    create = client.post(
        "/api/cases",
        headers=_auth(b["access_token"]),
        json={"name": "bob-case", "case": WIKTOR_CASE},
    )
    case_id = create.json()["id"]

    r = client.put(
        f"/api/cases/{case_id}",
        headers=_auth(a["access_token"]),
        json={"name": "admin-renamed", "case": WIKTOR_CASE},
    )
    assert r.status_code == 200
    assert r.json()["name"] == "admin-renamed"


# ---------------------------------------------------------------------------
# Public-instance safeguards: pinned admin, closed registration
# ---------------------------------------------------------------------------


def _try_register(client, email):
    return client.post("/api/auth/register", json={"email": email, "password": "hunter2-strong"})


def test_admin_email_pins_the_admin_whoever_registers_first(client, monkeypatch):
    monkeypatch.setenv("SYMBA_ADMIN_EMAIL", "Operator@Example.eu")
    stranger = _try_register(client, "stranger@example.eu")
    assert stranger.status_code == 201 and stranger.json()["user"]["role"] == "analyst"
    operator = _try_register(client, "operator@example.eu")      # case-insensitive, and not first
    assert operator.json()["user"]["role"] == "admin"


def test_without_admin_email_the_first_user_is_still_admin(client, monkeypatch):
    monkeypatch.delenv("SYMBA_ADMIN_EMAIL", raising=False)
    assert _register(client, "alice@example.eu")["user"]["role"] == "admin"


def test_closed_registration_refuses_strangers_but_not_the_pinned_admin(client, monkeypatch):
    monkeypatch.setenv("SYMBA_REGISTRATION_OPEN", "false")
    monkeypatch.setenv("SYMBA_ADMIN_EMAIL", "operator@example.eu")
    refused = _try_register(client, "stranger@example.eu")
    assert refused.status_code == 403 and "closed" in refused.json()["detail"]
    ok = _try_register(client, "operator@example.eu")
    assert ok.status_code == 201 and ok.json()["user"]["role"] == "admin"
    assert _try_register(client, "another@example.eu").status_code == 403


def test_closed_registration_without_admin_email_allows_only_the_first_user(client, monkeypatch):
    monkeypatch.setenv("SYMBA_REGISTRATION_OPEN", "false")
    monkeypatch.delenv("SYMBA_ADMIN_EMAIL", raising=False)
    assert _try_register(client, "first@example.eu").status_code == 201
    assert _try_register(client, "second@example.eu").status_code == 403


def test_registration_stays_open_by_default(client, monkeypatch):
    monkeypatch.delenv("SYMBA_REGISTRATION_OPEN", raising=False)
    monkeypatch.delenv("SYMBA_ADMIN_EMAIL", raising=False)
    assert _try_register(client, "a@example.eu").status_code == 201
    assert _try_register(client, "b@example.eu").status_code == 201


def test_register_duplicate_is_400_even_when_the_check_is_raced(client, monkeypatch):
    """Two simultaneous sign-ups for one address: the loser hits the unique index, not a 500."""
    from app.routers import auth as auth_router

    _register(client, "racer@example.eu")
    # the second request passes the "already registered?" check before the first one commits
    monkeypatch.setattr(auth_router, "_find_user_by_email", lambda db, email: None)
    r = client.post(
        "/api/auth/register", json={"email": "racer@example.eu", "password": "hunter2-strong"}
    )
    assert r.status_code == 400, r.text
    assert "already registered" in r.json()["detail"]
    # and the loser did not leave the session unusable: the next request still works
    assert client.post(
        "/api/auth/login", json={"email": "racer@example.eu", "password": "hunter2-strong"}
    ).status_code == 200
