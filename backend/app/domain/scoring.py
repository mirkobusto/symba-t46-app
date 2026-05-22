"""Scoring domain models — placeholder for the CIRCE-produced scoring
system that will feed the multi-stakeholder reporting layer (T4.6
roadmap Phase B).

The tool does NOT compute these numbers itself (decision 2026-05-22,
framing B): the scoring system is produced externally by CIRCE / other
T4.1-T4.3 partners using SimaPro / OpenLCA / their own engines.
This module declares the INGEST schema — what shape we accept when
CIRCE sends us back the scoring for a Case.

The schema is intentionally generic so it can accommodate whatever
CIRCE finalizes (specification still TBD as of 2026-05-22). When the
CIRCE spec lands, we may add stricter sub-models (e.g. a closed set
of indicator ids) but the wire format will stay backwards-compatible.
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Dimension = Literal["env", "eco", "soc"]


class ScoringIndicator(BaseModel):
    """One indicator in the scoring payload.

    Examples (illustrative, NOT a fixed list):
      - id="env.gwp",          dim="env", value=12.3, unit="kg CO2-eq / FU"
      - id="env.water_use",    dim="env", value=4.5, unit="m3 / FU"
      - id="eco.npv",          dim="eco", value=2_350_000, unit="EUR2024"
      - id="eco.payback_y",    dim="eco", value=6.2, unit="years"
      - id="soc.local_jobs",   dim="soc", value=14, unit="FTE"
      - id="soc.community_satisfaction_score", dim="soc", value=72,
        scale_min=0, scale_max=100
    """

    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Stable indicator id (dotted-path style)")
    label_en: str = Field(..., description="Human-readable label")
    dimension: Dimension
    value: float | None = Field(
        None, description="Numeric value; None if not yet computed"
    )
    unit: str | None = Field(None, description="Native unit (free text)")
    scale_min: float | None = Field(
        None,
        description="Lower bound for normalized scores (e.g. 0 on a 0-100 scale)",
    )
    scale_max: float | None = None
    interpretation_en: str | None = Field(
        None, description="Optional textual gloss for non-specialist audiences"
    )
    source_ref: str | None = Field(
        None,
        description="Free-text traceability hint (e.g. 'SimaPro v9.5, ReCiPe MP'). Optional.",
    )


class ScoringPayload(BaseModel):
    """Full scoring deliverable for a single Case.

    Sent by CIRCE (or another quantitative-analysis partner) via
    PUT /api/scoring/{case_id} after they finish the LCA/LCC/S-LCA
    computation. The tool stores it as a JSON blob in the
    `case_scoring` table and surfaces it in the multi-stakeholder
    report views.
    """

    model_config = ConfigDict(extra="forbid")

    case_id: str = Field(..., description="UUID of the Case this scoring refers to")
    source: str = Field(
        "CIRCE",
        description="Identifier of the producing partner / engine",
    )
    schema_version: str = Field(
        "1.0-draft",
        description="ScoringPayload schema version (free-text)",
    )
    computed_at: datetime | None = Field(
        None,
        description="When the upstream engine produced this; not the ingestion time",
    )
    indicators: list[ScoringIndicator] = Field(
        default_factory=list,
        description="Flat list of indicators across all dimensions",
    )
    notes: str | None = Field(
        None,
        description="Free-text caveats, e.g. 'partial — SOC pending'",
    )
