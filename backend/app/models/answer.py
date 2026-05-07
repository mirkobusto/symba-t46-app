"""SQLAlchemy ORM model for individual answers within a session."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.session import Session


class Answer(Base):
    __tablename__ = "answers"
    __table_args__ = (
        UniqueConstraint("session_id", "question_id", name="uq_session_question"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    question_id: Mapped[str] = mapped_column(String(8), nullable=False)
    # Stored as JSON-encoded string for cross-type fidelity (booleans for
    # Q6/Q8, strings elsewhere).
    value: Mapped[str] = mapped_column(String(256), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    session: Mapped[Session] = relationship(back_populates="answers")
