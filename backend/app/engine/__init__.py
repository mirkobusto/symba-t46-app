"""Decision engine package — IS-case methodology runtime.

Pipeline phases (executed in this order; each phase is a separate module):

    L0 — l0_compute    derive ilcd_situation / lcc_type / slca_activation_state
                       from Q1-Q3 (the 3 trigger nodes)
    L1 — l1_blocks     check the 4 BLOCK cells; STOP if any fire
    --   pathway       derive IS-01..IS-05 from Q1 × Q2
    --   activate      activate the 186 Phase 1 nodes given Q1-Q7 + Q5 per-flow
    L2 — l2_validate   run the 40 L2 rules (18 IR + 10 CIR + 5 FU + 7 B; IR-04
                       and IR-10 are L3) against the case
    L3 — l3_report     enforce IR-04, IR-10 and surface the 12 CDPs at
                       reporting time

Plus utilities:

    loader     load + parse the 5 schema JSON files
    pipeline   orchestrator — single entry point that calls all phases
               in the correct order with short-circuit semantics on L1

Each pipeline phase has a single public entry point:
    `run(case: Case, schemas: LoadedSchemas) -> Case`
that mutates and returns the case (or raises a structured error).
"""
# ruff: noqa: F401 — re-export
from app.engine.loader import LoadedSchemas, load_schemas
from app.engine.pipeline import run as run_pipeline

__all__ = ["LoadedSchemas", "load_schemas", "run_pipeline"]
