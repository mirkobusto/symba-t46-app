"""SQLAlchemy ORM model for assessment sessions."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.answer import Answer
    from app.models.pathway_resolution import PathwayResolutionRecord


# Allowed values for ``Session.status``. Validated at the Pydantic schema
# layer so we can keep a portable VARCHAR column on SQLite.
SESSION_STATUSES = ("draft", "answers_complete", "pathway_resolved", "archived")


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(String(32), default="draft", nullable=False)
    case_name: Mapped[str | None] = mapped_column(String(256), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(4096), nullable=True)

    answers: Mapped[list[Answer]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )
    pathway_resolution: Mapped[PathwayResolutionRecord | None] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        uselist=False,
    )
