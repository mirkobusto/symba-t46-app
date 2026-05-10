"""Pipeline HTTP endpoint.

Exposes the engine pipeline (`app.engine.pipeline.run`) over HTTP so
that frontends, scripts, and external clients can submit a Case payload
and receive the fully-evaluated Case back. Stateless: no persistence,
no session affinity — every POST is an independent run.

Request: a Case JSON body (Pydantic v2 model in `app.domain.models`).
Response: the mutated Case JSON, with derived state populated:
  ilcd_situation, lcc_type, slca_activation_state, pathway_id,
  is_01_extended, activated_nodes, blocked_by, rule_violations,
  cdp_flags, and pillar dicts (lca/lcc/slca/report/...).

Errors: 400 for ValueError (e.g. Q1=None on a partial questionnaire).
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.domain.models import Case
from app.engine.loader import LoadedSchemas, load_schemas
from app.engine.pipeline import run as pipeline_run

router = APIRouter(tags=["pipeline"])


def _get_schemas() -> LoadedSchemas:
    """FastAPI dependency: a process-wide LoadedSchemas (loader is cached)."""
    return load_schemas()


@router.post("/run", response_model=Case)
def run_pipeline(case: Case, schemas: LoadedSchemas = Depends(_get_schemas)) -> Case:
    """Run the engine pipeline on the submitted Case and return the
    mutated result.

    The engine assumes Q1 is set; partial questionnaires (Q1=None) raise
    ValueError, which this endpoint translates to HTTP 400.
    """
    try:
        return pipeline_run(case, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
