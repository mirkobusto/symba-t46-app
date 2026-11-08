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

import re
import unicodedata
from datetime import date
from typing import Annotated, Any, Literal

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


class ReportMeta(BaseModel):
    """Who and what the document is about, for its cover (UX round 2026-11-08,
    P8-01): the share fields of a saved case and the dates, already formatted
    in the reader's language by the browser."""

    model_config = ConfigDict(extra="forbid")

    case_name: str | None = Field(default=None, max_length=256)
    case_ref: str | None = Field(default=None, max_length=120)
    prepared_by: str | None = Field(default=None, max_length=120)
    contact: str | None = Field(default=None, max_length=200)
    generated_on: str | None = Field(default=None, max_length=60)
    saved_on: str | None = Field(default=None, max_length=60)
    state: Literal["saved", "diverged", "unsaved"] | None = None


class ReportSectorRule(BaseModel):
    strength: str
    text: str
    source: str | None = None
    note: str | None = None


class ReportSectorChapter(BaseModel):
    """A D4.1 Part 2 chapter as the result page words it, in `lang`."""

    chapter: str
    reason: str | None = None
    rules: list[ReportSectorRule] = Field(default_factory=list)


class ReportScenario(BaseModel):
    """What a scenario changes in the configuration rows and in its network,
    worded by the scenario comparison."""

    id: str
    config: list[str] = Field(default_factory=list)
    network: list[str] = Field(default_factory=list)


class ReportRequest(BaseModel):
    """The case plus what the result page has already worded, so the document
    and the screen say the same thing (UX rounds 2026-11-03 and 2026-11-08)."""

    model_config = ConfigDict(extra="forbid")

    case: Case
    rows: list[ReportRow] = Field(default_factory=list)
    meta: ReportMeta | None = None
    sector: list[ReportSectorChapter] | None = None
    scenarios: list[ReportScenario] = Field(default_factory=list)
    guided: bool = False


def _report_filename(name: str | None) -> str:
    """Report_<case>_<date>.docx, as the DCF files are named (P6-19, P7-07)."""
    stem = unicodedata.normalize("NFKD", name or "").encode("ascii", "ignore").decode()
    stem = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-")[:60] or "draft"
    return f"Report_{stem}_{date.today().isoformat()}.docx"


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
    if isinstance(payload, ReportRequest):
        case, rows, meta = payload.case, payload.rows, payload.meta
    else:
        case, rows, meta = payload, [], None
    try:
        result = pipeline_run(case, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    extras: dict[str, Any] = {}
    if isinstance(payload, ReportRequest):
        extras = {
            "meta": meta.model_dump() if meta else None,
            "sector": [c.model_dump() for c in payload.sector] if payload.sector else None,
            "scenarios": [s.model_dump() for s in payload.scenarios],
            "guided": payload.guided,
        }
    body = generate_case_report_bytes(result, lang=lang, rows=[r.model_dump() for r in rows], **extras)
    filename = _report_filename(meta.case_name if meta else None)
    return Response(
        content=body,
        media_type=DOCX_MIME,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
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
    overrides = dict(overrides)
    # Q5 per flow: {flow id: class} on the case's own flows; replacing the whole
    # `flows` list from a scenario is not allowed (round 4 leftover; P7-11)
    flow_q5 = overrides.pop("flow_q5", None)
    base.update(overrides)
    if flow_q5 is not None:
        if not isinstance(flow_q5, dict):
            raise ValueError("flow_q5: expected an object {flow id: a|b|c|d|e}")
        flows = {f["id"]: f for f in base.get("flows") or []}
        for flow_id, q5 in flow_q5.items():
            if flow_id not in flows:
                raise ValueError(f"flow_q5: no flow with id {flow_id!r} in the case")
            flows[flow_id]["q5"] = q5
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
