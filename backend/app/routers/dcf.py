"""DCF HTTP endpoints.

Composition endpoints sit on top of `engine.dcf_compose.compose_dcf`:

  POST   /api/dcf/preview          -> Case in, DcfPayload JSON out (UI preview)
  POST   /api/dcf/export/xlsx      -> Case in, .xlsx out (download)
  POST   /api/dcf/export/docx      -> Case in, .docx out (download)
  GET    /api/dcf/{case_id}/export/xlsx -> .xlsx of a saved case, pre-filled
  GET    /api/dcf/{case_id}/export/docx -> .docx of a saved case, pre-filled
  GET    /api/dcf/{case_id}/data   -> stored DCF content + validation report
  PUT    /api/dcf/{case_id}/data   -> store the DCF content (Network Builder)
  DELETE /api/dcf/{case_id}/data   -> drop the stored content

The three POST endpoints are stateless: each runs the pipeline on the
input Case (idempotent), composes the DcfPayload, and either returns the
JSON or renders the worksheet / document.

The `/data` endpoints are the stateful half added for the Network
Builder: they persist what the analyst entered (actors, flow matrix,
logistics, infrastructure + canvas layout) for a *saved* case, and
validate it against that case's composed descriptor. Authorization
follows the owning case, like /api/scoring.

DCF schema + mandates census are cached per-process via lru_cache so we
pay the JSON-load cost only once.
"""
from __future__ import annotations

import json
from datetime import UTC, datetime
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session as OrmSession

from app.auth.deps import get_current_user_optional
from app.auth.ownership import can_modify, can_view
from app.db import get_db
from app.domain.dcf_data import DcfData, DcfDataEnvelope
from app.domain.models import Case
from app.engine.dcf_compose import DcfPayload, compose_dcf
from app.engine.dcf_data_validate import validate_dcf_data
from app.engine.loader import LoadedSchemas, load_schemas
from app.engine.pipeline import run as pipeline_run
from app.models import CaseDcfData, CaseRecord, User
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


# ---------------------------------------------------------------------------
# Stored DCF content (Network Builder)
# ---------------------------------------------------------------------------


def _load_case_for(
    case_id: str,
    db: OrmSession,
    user: User | None,
    *,
    for_write: bool,
) -> tuple[CaseRecord, Case]:
    """Fetch a saved case and check the caller may see / change it.

    404 (not 403) when the caller may not even see it, so an owned
    case's existence is not disclosed — same rule as /api/cases.
    """
    rec = db.get(CaseRecord, case_id)
    if rec is None or not can_view(rec, user):
        raise HTTPException(status_code=404, detail=f"Case {case_id!r} not found")
    if for_write and not can_modify(rec, user):
        raise HTTPException(
            status_code=403, detail="Not allowed to modify this case's DCF data"
        )
    return rec, Case.model_validate_json(rec.case_json)


def _envelope(
    data: DcfData, case: Case, schemas: LoadedSchemas
) -> DcfDataEnvelope:
    """Pair stored content with a freshly computed validation report.

    The report is recomputed on every read rather than stored: the
    descriptor depends on the case's answers, so editing Q1-Q7 can
    activate or deactivate fields under content that was already saved.
    """
    payload = _run_and_compose(case, schemas)
    validation = validate_dcf_data(data, payload, _load_dcf_schema(), case)
    return DcfDataEnvelope(data=data, validation=validation)


@router.get("/{case_id}/data", response_model=DcfDataEnvelope)
def get_dcf_data(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> DcfDataEnvelope:
    """Return the stored DCF content for a saved case.

    404 when nothing has been stored yet — the UI reads that as "empty
    file, start from the seeded flows" rather than as an error.
    """
    _, case = _load_case_for(case_id, db, current_user, for_write=False)
    rec = db.get(CaseDcfData, case_id)
    if rec is None:
        raise HTTPException(
            status_code=404, detail=f"No DCF content stored for case {case_id!r}"
        )
    return _envelope(DcfData.model_validate_json(rec.data_json), case, schemas)


@router.put("/{case_id}/data", response_model=DcfDataEnvelope)
def put_dcf_data(
    case_id: str,
    data: DcfData,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> DcfDataEnvelope:
    """Store the DCF content for a saved case (full replace).

    Rejects with 422 when the submission is structurally wrong for this
    case (unknown/derived section, field the pathway did not activate,
    broken reference, duplicate row id). Empty required fields are
    reported in `validation.missing_required` and do NOT block the
    write — a data collection file is filled in incrementally.
    """
    if data.case_id != case_id:
        raise HTTPException(
            status_code=400,
            detail=(
                f"data.case_id ({data.case_id!r}) != URL case_id ({case_id!r})"
            ),
        )

    _, case = _load_case_for(case_id, db, current_user, for_write=True)
    payload = _run_and_compose(case, schemas)
    validation = validate_dcf_data(data, payload, _load_dcf_schema(), case)
    if validation.errors:
        raise HTTPException(
            status_code=422,
            detail=[issue.model_dump() for issue in validation.errors],
        )

    data.updated_at = datetime.now(UTC)
    rec = db.get(CaseDcfData, case_id)
    if rec is None:
        rec = CaseDcfData(
            case_id=case_id,
            data_json=data.model_dump_json(),
            schema_version=data.schema_version,
        )
        db.add(rec)
    else:
        rec.data_json = data.model_dump_json()
        rec.schema_version = data.schema_version
    db.commit()

    return DcfDataEnvelope(data=data, validation=validation)


@router.delete("/{case_id}/data", status_code=status.HTTP_204_NO_CONTENT)
def delete_dcf_data(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> None:
    """Drop the stored DCF content (the case itself is untouched)."""
    _load_case_for(case_id, db, current_user, for_write=True)
    rec = db.get(CaseDcfData, case_id)
    if rec is None:
        raise HTTPException(
            status_code=404, detail=f"No DCF content stored for case {case_id!r}"
        )
    db.delete(rec)
    db.commit()


def _stored_data(db: OrmSession, case_id: str) -> DcfData | None:
    rec = db.get(CaseDcfData, case_id)
    return DcfData.model_validate_json(rec.data_json) if rec else None


@router.get("/{case_id}/export/xlsx")
def export_xlsx_for_case(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> Response:
    """Excel export of a *saved* case, pre-filled with what the Network
    Builder stored. The stateless POST /export/xlsx stays for drafts that
    have never been saved (it has no case id to look content up by)."""
    rec, case = _load_case_for(case_id, db, current_user, for_write=False)
    payload = _run_and_compose(case, schemas)
    blob = render_xlsx(payload, _stored_data(db, case_id), rec.name)
    filename = f"dcf_{rec.slug or case_id[:8]}.xlsx"
    return Response(
        content=blob,
        media_type=XLSX_MIME,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{case_id}/export/docx")
def export_docx_for_case(
    case_id: str,
    db: OrmSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
    schemas: LoadedSchemas = Depends(_get_schemas),
) -> Response:
    """Companion document of a saved case, with §2 reporting the drawn
    network instead of describing it."""
    rec, case = _load_case_for(case_id, db, current_user, for_write=False)
    payload = _run_and_compose(case, schemas)
    blob = generate_dcf_docx_bytes(payload, rec.name, _stored_data(db, case_id))
    filename = f"dcf_{rec.slug or case_id[:8]}.docx"
    return Response(
        content=blob,
        media_type=DOCX_MIME,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
