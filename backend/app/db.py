"""SQLAlchemy engine + session factory.

Engine is created lazily so importing the package does not touch the
filesystem (helps tests and tooling). The SQLite file lives under
``backend/data/`` which is gitignored.
"""

from __future__ import annotations

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "app.db"


class Base(DeclarativeBase):
    """Base class for SQLAlchemy ORM models."""


_engine: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None


def _database_url() -> str:
    url = os.environ.get("DATABASE_URL")
    if url:
        return url
    DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{DEFAULT_DB_PATH}"


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        _engine = create_engine(
            _database_url(),
            connect_args={"check_same_thread": False}
            if _database_url().startswith("sqlite")
            else {},
            future=True,
        )
    return _engine


def get_session_factory() -> sessionmaker[Session]:
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(
            bind=get_engine(), autoflush=False, autocommit=False, future=True
        )
    return _SessionLocal


def get_db():
    """FastAPI dependency yielding a SQLAlchemy session."""
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()
