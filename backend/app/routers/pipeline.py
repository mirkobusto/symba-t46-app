"""Pipeline HTTP endpoint.

Exposes the engine pipeline (`app.engine.pipeline.run`) over HTTP.
Stateless: every POST is an independent run.

Endpoints:
  POST /api/pipeline/run             -> single Case in, mutated Case out
  POST /api/pipeline/report          -> single Case in, .docx out
  POST /api/pipeline/run-scenarios   -> baseline Case + N scenarios in,
                                       baseline result + N scenario results out

Errors: 400 for ValueError (e.g. Q1=None on a partial questionnaire).
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel

from app.domain.models import Case
from app.engine.loader import LoadedSchemas, load_schemas
from app.engine.pipeline import run as pipeline_run
from app.services.reports import generate_case_report_bytes

router = APIRouter(tags=["pipeline"])

DOCX_MIME = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)


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


@router.post("/report")
def generate_report(
    case: Case, schemas: LoadedSchemas = Depends(_get_schemas)
) -> Response:
    """Run the pipeline on the submitted Case and stream a .docx
    validation-style report (8-section canonical layout).

    Returns the document as an `application/vnd.openxmlformats-
    officedocument.wordprocessingml.document` attachment so browsers
    prompt a download.
    """
    try:
        result = pipeline_run(case, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    body = generate_case_report_bytes(result)
    return Response(
        content=body,
        media_type=DOCX_MIME,
        headers={
            "Content-Disposition": (
                'attachment; filename="symba-case-report.docx"'
            ),
        },
    )


# ---------------------------------------------------------------------------
# Scenarios runner (Q2-D)
# ---------------------------------------------------------------------------


class ScenarioInput(BaseModel):
    """One scenario in a run-scenarios request.

    `overrides` is a sparse dict of Case-shaped key/values that are
    shallow-merged onto the baseline before the pipeline runs. Keys
    not present on Case are silently ignored by Pydantic
    (extra='forbid' applies at construction; we therefore validate
    via Case.model_copy(update=...) which is permissive on unknowns).
    """

    id: str
    label: str
    overrides: dict[str, Any] = {}


class ScenariosRequest(BaseModel):
    baseline: Case
    scenarios: list[ScenarioInput] = []


class ScenarioResult(BaseModel):
    id: str
    label: str
    result: Case


class ScenariosResponse(BaseModel):
    baseline: Case
    scenarios: list[ScenarioResult]


def _apply_overrides(baseline: Case, overrides: dict[str, Any]) -> Case:
    """Build a fresh Case from `baseline` with `overrides` merged in.

    Uses Pydantic v2 `model_dump` + dict merge + re-construct so we get
    fresh validation (the model_copy(update=...) shortcut bypasses
    field validators for nested models, which can produce inconsistent
    state for q3 / q4 etc.).
    """
    base = baseline.model_dump(mode="python")
    base.update(overrides)
    # Strip engine-output fields so the new pipeline run starts clean
    for k in (
        "activated_nodes", "blocked_by", "rule_violations", "cdp_flags",
        "pathway_id", "is_01_extended", "ilcd_situation", "lcc_type",
        "slca_activation_state",
        "lca", "lcc", "slca", "report", "governance",
        "methodological_charter", "review", "system",
    ):
        base.pop(k, None)
    return Case(**base)


@router.post("/run-scenarios", response_model=ScenariosResponse)
def run_scenarios(
    payload: ScenariosRequest,
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> ScenariosResponse:
    """Run the pipeline once for the baseline and once per scenario
    (overrides shallow-merged onto the baseline before each run).

    Returns the baseline result + a list of per-scenario results in
    input order. Each scenario gets its own fresh Case instance — no
    state leakage between scenarios.

    On a per-scenario ValueError the response still includes successful
    scenarios; the failed one is returned with the engine output
    untouched (so the client can detect by inspecting blocked_by /
    pathway_id == None). The endpoint itself returns 400 only if the
    baseline itself fails.
    """
    try:
        baseline_result = pipeline_run(payload.baseline, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"baseline: {exc}") from exc

    scenario_results: list[ScenarioResult] = []
    for scenario in payload.scenarios:
        try:
            sc_case = _apply_overrides(payload.baseline, scenario.overrides)
            sc_result = pipeline_run(sc_case, schemas)
        except ValueError:
            # On scenario failure, return an empty Case shell so the
            # client can flag it. Don't 400 the whole batch.
            sc_result = _apply_overrides(payload.baseline, scenario.overrides)
        scenario_results.append(
            ScenarioResult(id=scenario.id, label=scenario.label, result=sc_result)
        )

    return ScenariosResponse(
        baseline=baseline_result, scenarios=scenario_results
    )
