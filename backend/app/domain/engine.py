"""Backward-compat shim — re-exports the legacy engine.

This file lets `app/routers/sessions.py` and `app/routers/decision_engine.py`
continue importing `from app.domain.engine import ...` while the new
engine in `app/engine/` is under construction.

Removed in Sprint 4 Step 2 commit 5 when `app/api/` replaces `app/routers/`.
"""
# ruff: noqa: F401, F403
from app._legacy.engine import *  # type: ignore[import-untyped]
