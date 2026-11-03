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

from typing import Annotated, Any

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Response
from pydantic import BaseModel, ConfigDict, Field, ValidationError

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


class ReportRow(BaseModel):
    """One row of the result page's "Your configuration", worded in `lang`."""

    label: str
    value: str
    why: str | None = None


class ReportRequest(BaseModel):
    """The case plus the configuration rows the result page computed, so the
    document and the screen show the same rows (UX round 2026-11-03)."""

    model_config = ConfigDict(extra="forbid")

    case: Case
    rows: list[ReportRow] = Field(default_factory=list)


@router.post("/report")
def generate_report(
    payload: Annotated[ReportRequest | Case, Body()],
    schemas: LoadedSchemas = Depends(_get_schemas),
    lang: str = Query("en"),
) -> Response:
    """Run the pipeline on the submitted Case and stream the .docx case
    report, in `lang`. The body is either a bare Case (scripts, older
    clients) or {case, rows} from the result page.

    Returns the document as an `application/vnd.openxmlformats-
    officedocument.wordprocessingml.document` attachment so browsers
    prompt a download.
    """
    case, rows = (payload.case, payload.rows) if isinstance(payload, ReportRequest) else (payload, [])
    try:
        result = pipeline_run(case, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    body = generate_case_report_bytes(result, lang=lang, rows=[r.model_dump() for r in rows])
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
# Scenarios runner
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
    # why the scenario could not be run; the result is then the bare answers,
    # not a configuration to compare (UX round 5, P7-11)
    error: str | None = None


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
        "applicable_rules", "warnings",
        "ilcd_situation", "lcc_type",
        "slca_activation_state",
        "lca", "lcc", "slca", "report", "governance",
        "methodological_charter", "review", "system",
    ):
        base.pop(k, None)
    return Case(**base)


def _scenario_error(exc: ValueError) -> str:
    """Why a scenario could not be run, in a line a user can act on: the
    model's "1 validation error for Case" said nothing (Fable review of #205)."""
    if isinstance(exc, ValidationError):
        return "; ".join(
            f"{'.'.join(str(p) for p in e['loc']) or 'answers'}: {e['msg']}" for e in exc.errors()
        )[:300]
    return (str(exc).splitlines() or [type(exc).__name__])[0][:300]


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
    ilcd_situation == None). The endpoint itself returns 400 only if the
    baseline itself fails.
    """
    try:
        baseline_result = pipeline_run(payload.baseline, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"baseline: {exc}") from exc

    scenario_results: list[ScenarioResult] = []
    for scenario in payload.scenarios:
        error = None
        try:
            sc_case = _apply_overrides(payload.baseline, scenario.overrides)
            sc_result = pipeline_run(sc_case, schemas)
        except ValueError as exc:
            error = _scenario_error(exc)
            # On scenario failure, return an empty Case shell so the
            # client can flag it. Don't 400 the whole batch. An override the
            # Case no longer accepts (a key of an old version) fails here
            # too: the shell is then the bare baseline answers.
            try:
                sc_result = _apply_overrides(payload.baseline, scenario.overrides)
            except ValueError:
                sc_result = _apply_overrides(payload.baseline, {})
        scenario_results.append(
            ScenarioResult(id=scenario.id, label=scenario.label, result=sc_result, error=error)
        )

    return ScenariosResponse(
        baseline=baseline_result, scenarios=scenario_results
    )
