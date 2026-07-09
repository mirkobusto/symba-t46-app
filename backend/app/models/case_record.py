"""SQLAlchemy ORM model for persisted Case records.

Server-side storage for user-saved IS-cases. The Case payload itself
is stored as JSON text (SQLite has no native JSON type and we never
query inside the case body — name + timestamps are the only indexed
fields).

The Pydantic Case in app.domain.models stays the source-of-truth for
the actual case content; this ORM model is just a wrapper for naming
+ persistence. Conversion is via Case.model_dump_json / Case.model_
validate_json on the API boundary.
"""
from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class CaseRecord(Base):
    __tablename__ = "case_records"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    case_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    pathway_id: Mapped[str | None] = mapped_column(String(16), nullable=True)
    # Phase D — ownership. Nullable so legacy rows (pre-auth) stay
    # readable by everyone; new rows created via authenticated calls
    # carry the owner user id and are filtered by it on list/get/update/delete.
    owner_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
