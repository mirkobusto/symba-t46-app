"""Shared pytest fixtures.

Provides:
* an in-memory SQLite database wired into the FastAPI app so that the
  ORM-backed tests are fully isolated per test;
* a :class:`fastapi.testclient.TestClient` already pointing at that DB;
* the loaded engine schemas (5 JSON files) for engine / pipeline tests.
"""

from __future__ import annotations

from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy.orm import sessionmaker

from app import db as db_module
from app.db import Base, get_db
from app.engine.loader import LoadedSchemas, load_schemas, reset_cache
from app.main import app


@pytest.fixture()
def sqlite_engine():
    """In-memory SQLite engine, schema created from ORM metadata."""
    eng = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    Base.metadata.create_all(bind=eng)
    try:
        yield eng
    finally:
        eng.dispose()


@pytest.fixture()
def db_session(sqlite_engine) -> Generator[OrmSession, None, None]:
    SessionLocal = sessionmaker(
        bind=sqlite_engine, autoflush=False, autocommit=False, future=True
    )
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(sqlite_engine) -> Generator[TestClient, None, None]:
    """TestClient bound to a fresh in-memory SQLite via dependency override."""
    SessionLocal = sessionmaker(
        bind=sqlite_engine, autoflush=False, autocommit=False, future=True
    )

    def _override_get_db() -> Generator[OrmSession, None, None]:
        session = SessionLocal()
        try:
            yield session
        finally:
            session.close()

    # Also patch the module-level singletons so the lifespan startup hook
    # (which calls Base.metadata.create_all on app.db engine) is harmless.
    db_module._engine = sqlite_engine  # type: ignore[attr-defined]
    db_module._SessionLocal = SessionLocal  # type: ignore[attr-defined]

    app.dependency_overrides[get_db] = _override_get_db
    try:
        with TestClient(app) as c:
            yield c
    finally:
        app.dependency_overrides.pop(get_db, None)
        db_module._engine = None  # type: ignore[attr-defined]
        db_module._SessionLocal = None  # type: ignore[attr-defined]


@pytest.fixture(scope="session")
def schemas() -> LoadedSchemas:
    """Load the 5 schema JSON files once per test session.

    Uses the default `app/schemas/` location. Tests that need to override
    the location should call `app.engine.loader.load_schemas(custom_dir)`
    directly and call `reset_cache()` afterwards.
    """
    reset_cache()
    return load_schemas()


@pytest.fixture
def schemas_dir() -> Path:
    """Absolute path to the schemas directory (for tests that read JSON directly)."""
    return Path(__file__).resolve().parent.parent / "app" / "schemas"
