"""FastAPI application entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.routers import health


def create_app() -> FastAPI:
    app = FastAPI(
        title="SYMBA T4.6 — IS Assessment App",
        version=__version__,
    )

    # CORS: allow the local Vite dev server. Production origins TBD.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://192.168.1.146:5174",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    return app


app = create_app()
