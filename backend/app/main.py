"""FastAPI application entrypoint."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import __version__
from app.db import Base, get_engine
from app.models import (  # noqa: F401 — register
    Answer,
    CaseRecord,
    CaseScoring,
    PathwayResolutionRecord,
    Session,
    User,
)
from app.routers import auth, cases, dcf, health, pipeline, public, scoring

DEFAULT_CORS_ORIGINS = [
    # New non-default ports (followup-F to avoid clashes with other
    # local dev servers).
    "http://localhost:5180",
    "http://127.0.0.1:5180",
    # Legacy ports kept for any pre-existing dev setup that still
    # uses them.
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
    app.include_router(auth.router, prefix="/api/auth")
    app.include_router(pipeline.router, prefix="/api/pipeline")
    app.include_router(cases.router, prefix="/api/cases")
    app.include_router(dcf.router, prefix="/api/dcf")
    app.include_router(scoring.router, prefix="/api/scoring")
    app.include_router(public.router, prefix="/api/public")

    # Backwards compatibility: keep the un-prefixed /health route used by
    # Sprint 1 smoke tests + the Docker healthcheck.
    app.include_router(health.router)

    # Production mode: serve the pre-built React SPA from /app/frontend/dist
    # if the directory exists. Dev mode (vite on :5180) is unaffected
    # because the directory is absent. The SPA's index.html is served
    # for any non-API path so client-side routing works on hard refresh.
    _mount_frontend(app)

    return app


def _mount_frontend(app: FastAPI) -> None:
    """Mount the production frontend bundle if available.

    Behavior:
      - Static assets (JS/CSS/images) served from /assets and other
        Vite-built subdirectories.
      - Any other GET path returns the SPA index.html so React Router
        handles client-side routing on hard refresh.
      - API routes (already registered above) take precedence by
        FastAPI's FIFO ordering — the SPA catch-all only fires when no
        API handler matched.
    """
    # Env-var override for non-Docker deployments; default points to the
    # path inside the Docker image (Dockerfile.prod copies the build there).
    dist_dir_raw = os.environ.get("SYMBA_FRONTEND_DIST", "/app/frontend/dist")
    dist_dir = Path(dist_dir_raw)
    if not dist_dir.is_dir():
        return  # dev mode: vite serves the SPA, nothing to mount.

    index_html = dist_dir / "index.html"
    if not index_html.is_file():
        return

    # Mount vite-built static asset folders.
    assets_dir = dist_dir / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def _spa_catchall(full_path: str):  # noqa: ARG001 — captured by router
        # Note: requests to /api/* hit the API routers first. This
        # catch-all only matches paths the API doesn't claim.
        return FileResponse(index_html)


app = create_app()
