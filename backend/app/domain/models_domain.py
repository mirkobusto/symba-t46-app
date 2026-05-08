"""Backward-compat shim — re-exports the legacy domain models. See engine.py shim."""
# ruff: noqa: F401, F403
from app._legacy.models_domain import *  # type: ignore[import-untyped]
