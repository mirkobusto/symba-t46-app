"""Domain layer: pure business logic for the LCSA decision engine.

This package is independent from FastAPI and SQLAlchemy. The classes inside
load and reason over ``lcsa_decision_engine.v2.json`` (frozen for Sprint 2).
"""

from app.domain.engine import DecisionEngine, get_decision_engine

__all__ = ["DecisionEngine", "get_decision_engine"]
