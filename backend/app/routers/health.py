"""Health check endpoint."""

from fastapi import APIRouter

from app import __version__
from app.auth.ownership import anonymous_save_enabled

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str | bool]:
    # the frontend asks a visitor to sign in before saving when this is off
    return {"status": "ok", "version": __version__, "anonymous_save": anonymous_save_enabled()}
