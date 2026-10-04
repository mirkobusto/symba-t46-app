"""The production catch-all serves real files of the bundle and index.html for the rest."""
from __future__ import annotations

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import _mount_frontend


@pytest.fixture()
def client(tmp_path, monkeypatch):
    dist = tmp_path / "dist"
    (dist / "assets").mkdir(parents=True)
    (dist / "brand").mkdir()
    (dist / "index.html").write_text("<html>SPA</html>")
    (dist / "assets" / "app.js").write_text("console.log(1)")
    (dist / "brand" / "logo.png").write_bytes(b"\x89PNG-bytes")
    (dist / "favicon.svg").write_text("<svg/>")
    (tmp_path / "secret.txt").write_text("outside the bundle")
    monkeypatch.setenv("SYMBA_FRONTEND_DIST", str(dist))
    app = FastAPI()
    _mount_frontend(app)
    return TestClient(app)


def test_public_files_outside_assets_are_served_as_files(client):
    r = client.get("/brand/logo.png")
    assert r.status_code == 200 and r.content == b"\x89PNG-bytes"
    assert client.get("/favicon.svg").text == "<svg/>"


def test_assets_still_come_from_the_mount(client):
    assert client.get("/assets/app.js").text == "console.log(1)"


def test_client_side_routes_get_the_spa(client):
    for path in ("/", "/result", "/r/some-report", "/brand/missing.png"):
        assert client.get(path).text == "<html>SPA</html>"


def test_the_catch_all_cannot_escape_the_bundle(client):
    # httpx normalises a literal "/../" before sending, so only the %2f form reaches the
    # guard; either way the answer is the SPA, never the file outside the bundle.
    for path in ("/../secret.txt", "/..%2fsecret.txt", "/brand/../../secret.txt", "/..%2f..%2fsecret.txt"):
        r = client.get(path)
        assert r.text == "<html>SPA</html>"


def test_a_nul_byte_in_the_path_is_not_a_server_error(client):
    r = client.get("/%00x")
    assert r.status_code == 200 and r.text == "<html>SPA</html>"


def test_fonts_are_served_with_the_woff2_type(tmp_path, monkeypatch):
    dist = tmp_path / "dist"
    (dist / "fonts").mkdir(parents=True)
    (dist / "index.html").write_text("<html>SPA</html>")
    (dist / "fonts" / "f.woff2").write_bytes(b"wOF2")
    monkeypatch.setenv("SYMBA_FRONTEND_DIST", str(dist))
    app = FastAPI()
    _mount_frontend(app)
    r = TestClient(app).get("/fonts/f.woff2")
    assert r.status_code == 200 and r.headers["content-type"].startswith("font/woff2")
