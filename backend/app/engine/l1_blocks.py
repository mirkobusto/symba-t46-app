"""L1 — BLOCK cells.

Evaluates the 4 BLOCK cells from `cross_method_rules.json` against the
case. If any BLOCK fires, the engine STOPS and the case is returned with
`case.blocked_by` populated. No L2/L3 logic runs.

The 4 BLOCKs:
    block_C2_plus_E-LCC      Q1=D AND lcc_type ∈ {E-LCC, C+E, C+E+S}
    block_anyQ1_plus_AbsoluteSLCA   Q3.soc=true AND advanced.slca_framework_override='absolute'
    block_Q3_emptySelection  Q3 = no selection (env=eco=soc=false)
    block_Q1A_plus_Q5e       Q1=A AND all flows Q5=e

Implementation deferred to Sprint 4 Step 3.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Run all 4 BLOCK checks. If any fire, append to `case.blocked_by`.

    Returns the same `case` object (mutated). The pipeline orchestrator
    is responsible for short-circuiting on non-empty `blocked_by`.
    """
    raise NotImplementedError("Sprint 4 Step 3 — not yet implemented")
