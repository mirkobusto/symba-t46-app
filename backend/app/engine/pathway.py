"""Pathway derivation — IS-01..IS-05 from Q1 × Q2.

Per v2 §3, each combination of Q1 (IS scenario archetype) and Q2 (temporal
stance) deterministically maps to one of 5 pathway IDs. The pathway then
gates pathway-specific defaults during activation.

Extracted from `activate.py` per Mirko nuance (Step 2 sub-issue 3): keeping
pathway logic in its own module makes it cheap to grow it later (e.g.,
pathway-specific defaults, pathway × Q3 interaction tables).

Implementation deferred to Sprint 4 Step 3.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def derive(case: Case, schemas: LoadedSchemas) -> Case:
    """Set `case.pathway_id` from Q1 × Q2 per v2 §3.

    Mutates and returns `case`.
    """
    raise NotImplementedError("Sprint 4 Step 3 — not yet implemented")
