"""SQLAlchemy ORM model for persisted DCF content (Network Builder).

Stores the analyst-entered Data Collection File rows (actors, flow
matrix, logistics, infrastructure) plus the Network Builder canvas
layout for one case, as a JSON text blob.

Separate table rather than a column on case_records, for the same two
reasons as case_scoring: adding a table is automatic via
Base.metadata.create_all (no migration script), and the Layer 2 content
stays out of the Layer 1 case body the engine consumes.
"""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class CaseDcfData(Base):
    __tablename__ = "case_dcf_data"

    case_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    data_json: Mapped[str] = mapped_column(Text, nullable=False)
    schema_version: Mapped[str] = mapped_column(
        String(16), nullable=False, default="1.0"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
