"""L0 — Trigger node computation.

Derives the 3 L0 trigger nodes from Q1-Q3 BEFORE any L1/L2/L3 logic runs:

    lca_t1         -> Case.ilcd_situation       (from Q1)
    lcc_trig_01    -> Case.lcc_type             (from Q1, Q3.eco)
    slca_t_01      -> Case.slca_activation_state (from Q3.soc)

These are deterministic functions of the user answers; they have no
violation semantics — they simply COMPUTE state that downstream phases
read. By convention these are the only 3 nodes with lifecycle_layer=L0.

Implementation deferred to Sprint 4 Step 3.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Compute L0 trigger node outputs and write them onto `case`.

    Returns the same `case` object (mutated).
    """
    raise NotImplementedError("Sprint 4 Step 3 — not yet implemented")
