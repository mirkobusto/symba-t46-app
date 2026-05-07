"""SQLAlchemy ORM model that persists a resolved pathway for a session.

Named ``PathwayResolutionRecord`` to disambiguate from the Pydantic
``PathwayResolution`` value object in ``app.domain.models_domain``.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.session import Session


class PathwayResolutionRecord(Base):
    __tablename__ = "pathway_resolutions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    pathway_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    pathway_name: Mapped[str | None] = mapped_column(String(256), nullable=True)

    # JSON-serialized text payloads — SQLite has no native JSON type and we
    # do not query inside these blobs.
    configuration_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    applied_rules: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    warnings: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    trace_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")

    blocked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    block_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    block_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    block_resolutions: Mapped[str | None] = mapped_column(Text, nullable=True)

    match_distance: Mapped[int | None] = mapped_column(Integer, nullable=True)

    resolved_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    session: Mapped[Session] = relationship(back_populates="pathway_resolution")
