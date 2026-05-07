"""FastAPI application entrypoint."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.db import Base, get_engine
from app.models import Answer, PathwayResolutionRecord, Session  # noqa: F401 — register
from app.routers import decision_engine, health, sessions

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.146:5174",
]


def _cors_origins() -> list[str]:
    raw = os.environ.get("BACKEND_CORS_ORIGINS")
    if not raw:
        return list(DEFAULT_CORS_ORIGINS)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def _init_database() -> None:
    """Create tables if they do not exist (MVP — no Alembic yet)."""
    Base.metadata.create_all(bind=get_engine())


@asynccontextmanager
async def _lifespan(app: FastAPI):
    _init_database()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="SYMBA T4.6 — IS Assessment App",
        version=__version__,
        lifespan=_lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=_cors_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api")
    app.include_router(decision_engine.router, prefix="/api/decision-engine")
    app.include_router(sessions.router, prefix="/api/sessions")

    # Backwards compatibility: keep the un-prefixed /health route used by
    # Sprint 1 smoke tests + the Docker healthcheck.
    app.include_router(health.router)

    return app


app = create_app()
