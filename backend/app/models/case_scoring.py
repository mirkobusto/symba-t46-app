"""SQLAlchemy ORM model for persisted scoring payloads.

Storage for the ScoringPayload (Pydantic, app.domain.scoring) that
CIRCE / other partners deliver for a Case. The payload is stored as a
JSON text blob; only case_id, source, and timestamps are indexed.

A separate table (rather than a column on case_records) keeps the
migration story simple — adding a table is automatic via
Base.metadata.create_all, while adding a column to an existing table
is not.
"""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class CaseScoring(Base):
    __tablename__ = "case_scoring"

    case_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    scoring_json: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(64), nullable=False, default="CIRCE")
    computed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
