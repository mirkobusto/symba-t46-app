"""Pipeline orchestrator — chi-chiama-cosa.

Single entry point for running the engine end-to-end on a case:

    L0  l0_compute.run         derive ilcd_situation / lcc_type / slca_activation_state
    L1  l1_blocks.run          check 4 BLOCK cells; SHORT-CIRCUIT if any fire
    --  pathway.derive         derive pathway_id (IS-01..IS-05) from Q1 × Q2
    --  activate.run           activate 186 Phase 1 nodes; write pillar dicts
    L2  l2_validate.run        run 40 L2 rules (18 IR + 10 CIR + 5 FU + 7 B)
    L3  l3_report.run          enforce IR-04, IR-10; surface 12 CDPs

Short-circuit semantics: if `case.blocked_by` is non-empty after L1, the
pipeline returns immediately. The frontend shows the BLOCK message; no
activation/L2/L3 runs.

Per Mirko nuance (Step 2 sub-issue 4): introduced as scaffold so the
chi-chiama-cosa is documented BEFORE the individual phase modules are
implemented in Step 3. The orchestrator itself is real (not stub) but
each phase it calls raises NotImplementedError until Step 3.

Implementation: full body present; phase modules are stubs.
"""
from __future__ import annotations

from app.domain.models import Case
from app.engine import activate, l0_compute, l1_blocks, l2_validate, l3_report, pathway
from app.engine.loader import LoadedSchemas, load_schemas


def run(case: Case, schemas: LoadedSchemas | None = None) -> Case:
    """Run the full L0→L1→activate→L2→L3 pipeline on a case.

    Args:
        case: the IS-case to process. Mutated in-place AND returned.
        schemas: pre-loaded schemas; if None, loads from default location
            (uses the loader's lru_cache so this is cheap).

    Returns:
        the same `case`, with derived state, activated_nodes, pillar
        dicts, rule_violations, and cdp_flags populated as appropriate.

    Short-circuit:
        if any L1 BLOCK fires, returns after L1 with case.blocked_by
        populated; activation/L2/L3 are skipped.
    """
    sch = schemas if schemas is not None else load_schemas()

    # L0 — deterministic derivations from Q1-Q3
    l0_compute.run(case, sch)

    # L1 — BLOCK cells. Short-circuit on any block firing.
    l1_blocks.run(case, sch)
    if case.blocked_by:
        return case

    # Pathway — IS-01..IS-05 from Q1 × Q2
    pathway.derive(case, sch)

    # Node activation — 186 Phase 1 nodes
    activate.run(case, sch)

    # L2 — cross-method rules (18 IR + 10 CIR + 5 FU + 7 B = 40 rules)
    l2_validate.run(case, sch)

    # L3 — IR-04, IR-10 enforcement + 12 CDPs
    l3_report.run(case, sch)

    return case
