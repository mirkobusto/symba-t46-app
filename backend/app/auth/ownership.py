"""Ownership authorization helpers shared by the routers (Phase D).

Both `cases` and `scoring` answer the same two questions about a
`CaseRecord`: may this caller *see* it, and may this caller *change* it.
The rules live here so the two routers cannot drift apart.

Rule set:

- **Rows without an owner** (`owner_id IS NULL`, saved without signing in)
  stay readable by anyone who has their id. They are writable by anyone
  only when anonymous saving is switched on (`SYMBA_ANON_SAVE=true`);
  otherwise only an admin may change or delete them. Off is the default
  since 2026-11-02: with it on, any visitor of a public deployment could
  delete or overwrite another visitor's study.
- **Owned rows** are visible and modifiable only to their owner and to
  admins.
"""
from __future__ import annotations

import os

from app.models import CaseRecord, User


def anonymous_save_enabled() -> bool:
    """Whether a caller without a token may save, change and delete cases
    that have no owner (`SYMBA_ANON_SAVE`, off unless set to true)."""
    return (os.environ.get("SYMBA_ANON_SAVE") or "").strip().lower() in {"1", "true", "yes"}


def can_view(record: CaseRecord, user: User | None) -> bool:
    """True when `user` may read `record` (and anything derived from it)."""
    if record.owner_id is None:
        return True
    if user is None:
        return False
    if user.role == "admin":
        return True
    return record.owner_id == user.id


def can_modify(record: CaseRecord, user: User | None) -> bool:
    """True when `user` may update or delete `record`.

    Stricter than `can_view` for rows without an owner: anyone may read
    them, only an admin may change them unless anonymous saving is on.
    """
    if record.owner_id is None:
        return anonymous_save_enabled() or (user is not None and user.role == "admin")
    if user is None:
        return False
    if user.role == "admin":
        return True
    return record.owner_id == user.id
