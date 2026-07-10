"""DCF HTTP endpoints.

Three endpoints sit on top of `engine.dcf_compose.compose_dcf`:

  POST /api/dcf/preview        -> Case in, DcfPayload JSON out (UI preview)
  POST /api/dcf/export/xlsx    -> Case in, .xlsx out (download)
  POST /api/dcf/export/docx    -> Case in, .docx out (download)

All three are stateless: each POST runs the pipeline on the input Case
(idempotent), composes the DcfPayload, and either returns the JSON or
renders the worksheet / document.

DCF schema + mandates census are cached per-process via lru_cache so we
pay the JSON-load cost only once.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response

from app.domain.models import Case
from app.engine.dcf_compose import DcfPayload, compose_dcf
from app.engine.loader import LoadedSchemas, load_schemas
from app.engine.pipeline import run as pipeline_run
from app.services.dcf_docx import generate_dcf_docx_bytes
from app.services.dcf_excel import render_xlsx

router = APIRouter(tags=["dcf"])

XLSX_MIME = (
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
)
DOCX_MIME = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)


# ---------------------------------------------------------------------------
# Cached resource loaders
# ---------------------------------------------------------------------------


def _backend_root() -> Path:
    # app/routers/dcf.py → app/routers/ → app/ → backend/
    return Path(__file__).resolve().parents[2]


@lru_cache(maxsize=1)
def _load_dcf_schema() -> dict[str, Any]:
    path = _backend_root() / "app" / "schemas" / "dcf_schema.json"
    with open(path) as f:
        return json.load(f)


@lru_cache(maxsize=1)
def _load_mandates_census() -> dict[str, Any]:
    path = _backend_root() / "coordination" / "dcf_mandates_census.json"
    with open(path) as f:
        return json.load(f)


def _get_schemas() -> LoadedSchemas:
    return load_schemas()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _run_and_compose(case: Case, schemas: LoadedSchemas) -> DcfPayload:
    """Run the pipeline on Case (idempotent for already-run cases) and
    compose the DCF payload."""
    try:
        pipeline_run(case, schemas)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return compose_dcf(
        case,
        _load_dcf_schema(),
        _load_mandates_census(),
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post("/preview", response_model=DcfPayload)
def preview(
    case: Case,
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> DcfPayload:
    """Compose the DCF for the submitted Case and return the structured
    payload. Used by the in-app DataCollection page for the interactive
    section/field/network visualization."""
    return _run_and_compose(case, schemas)


@router.post("/export/xlsx")
def export_xlsx(
    case: Case,
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> Response:
    """Render the DCF as a multi-tab Excel workbook and stream it as a
    download. Default filename uses the case id."""
    payload = _run_and_compose(case, schemas)
    blob = render_xlsx(payload)
    filename = f"dcf_{payload.case_id[:8]}.xlsx"
    return Response(
        content=blob,
        media_type=XLSX_MIME,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/export/docx")
def export_docx(
    case: Case,
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> Response:
    """Render the DCF as a .docx companion document and stream it as a
    download."""
    payload = _run_and_compose(case, schemas)
    blob = generate_dcf_docx_bytes(payload)
    filename = f"dcf_{payload.case_id[:8]}.docx"
    return Response(
        content=blob,
        media_type=DOCX_MIME,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
