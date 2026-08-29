"""Persisted Data Collection File content (Network Builder, phase 1).

`DcfPayload` (app.engine.dcf_compose) describes *which* sections and
fields a case has to fill in; this module carries *what the analyst
actually filled in*. The two are deliberately separate objects: the
descriptor is recomputed from the schema on every request, the content
is stored per case.

Identity model
--------------
Every row carries a `row_id`, assigned client-side and stable for the
life of the row. It is the only identifier the storage layer knows:

- the schema's own id field (`actor.id`, `flow.id`, `infra.id`) is
  *derived* from `row_id` on export — clients do not set it;
- foreign keys between sections (`fk_actor`, `fk_flow`) reference the
  target row's `row_id`;
- `fk_site` is the exception: it references `case.sites[].id`, which
  lives in the Case, not in the DCF.

`layout` holds the Network Builder canvas positions, keyed by the actor
row_id, so reopening a case restores the graph the analyst drew rather
than re-running an auto-layout.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

DCF_DATA_SCHEMA_VERSION = "1.0"


class DcfRow(BaseModel):
    """One filled-in row of a DCF section (one actor, one flow, …).

    `values` is keyed by the DCF field id exactly as declared in
    `dcf_schema.json` (`actor.name`, `flow.origin_actor_id`, …). It is a
    free-form dict on purpose: the authoritative per-field typing lives
    in the schema JSON and is enforced by `engine.dcf_data_validate`,
    not by mirroring 60+ fields into Pydantic models that would drift.
    """

    model_config = ConfigDict(extra="forbid")

    row_id: str = Field(..., min_length=1, max_length=64)
    values: dict[str, Any] = Field(default_factory=dict)


class DcfNodePosition(BaseModel):
    """Canvas position of one actor node in the Network Builder."""

    model_config = ConfigDict(extra="forbid")

    x: float
    y: float


class DcfData(BaseModel):
    """Everything the analyst has entered for one case's DCF."""

    model_config = ConfigDict(extra="forbid")

    schema_version: str = DCF_DATA_SCHEMA_VERSION
    case_id: str
    rows_by_section: dict[str, list[DcfRow]] = Field(default_factory=dict)
    layout: dict[str, DcfNodePosition] = Field(default_factory=dict)
    updated_at: datetime | None = None


class DcfDataIssue(BaseModel):
    """One problem found while validating DcfData against the case's
    composed DcfPayload."""

    model_config = ConfigDict(extra="forbid")

    code: str
    section_id: str
    row_id: str | None = None
    field_id: str | None = None
    detail: str


class DcfSectionCompleteness(BaseModel):
    """Per-section fill progress, for the UI progress indicator."""

    model_config = ConfigDict(extra="forbid")

    section_id: str
    rows: int
    required_fields: int
    filled_required: int


class DcfDataValidation(BaseModel):
    """Outcome of validating a DcfData submission.

    `errors` block the write (422). `missing_required` does not: a data
    collection file is filled in over days or weeks, so a half-filled
    row is a normal intermediate state, not a rejection reason.
    """

    model_config = ConfigDict(extra="forbid")

    errors: list[DcfDataIssue] = Field(default_factory=list)
    missing_required: list[DcfDataIssue] = Field(default_factory=list)
    completeness: list[DcfSectionCompleteness] = Field(default_factory=list)


class DcfDataEnvelope(BaseModel):
    """What GET/PUT return: the stored content plus its validation
    report, so the UI never has to re-derive the required-field status."""

    model_config = ConfigDict(extra="forbid")

    data: DcfData
    validation: DcfDataValidation
