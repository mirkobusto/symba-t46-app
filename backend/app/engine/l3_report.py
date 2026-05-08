"""L3 — Reporting-time enforcement.

Runs at result-interpretation time, AFTER computation. Two responsibilities:

1. Enforce IR-04 (Parallel Interpretation) and IR-10 (Anti-Aggregation):
   verify that `case.report.aggregation_method != 'single_score'` when
   Q3 has ≥2 dims, and that `case.report.public_disclosure.aggregation`
   is null whenever Q4 includes B/C/D.

2. Surface the 12 CDPs as `case.cdp_flags` entries: each CDP has a
   `tension`, `severity`, `methods`, and `resolution_at_l3` describing
   how the engine resolved the cross-method tension. The frontend
   "Show reasoning" panel displays these to the user.

For Sprint 4 this is partial scaffold: full implementation arrives when
the reporting layer is built (post 12-paper regression).

Implementation deferred to Sprint 4 Step 3.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import LoadedSchemas


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Enforce IR-04 + IR-10 and append all 12 CDP entries to case.cdp_flags.

    Mutates and returns `case`.
    """
    raise NotImplementedError("Sprint 4 Step 3 — not yet implemented")
