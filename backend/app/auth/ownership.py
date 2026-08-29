"""Ownership authorization helpers shared by the routers (Phase D).

Both `cases` and `scoring` answer the same two questions about a
`CaseRecord`: may this caller *see* it, and may this caller *change* it.
The rules live here so the two routers cannot drift apart.

Rule set (unchanged from the Phase D cases router):

- **Legacy / anonymous rows** (`owner_id IS NULL`) stay world-readable
  and world-writable. Pre-Phase-D rows have no owner, and the MVP still
  supports an unauthenticated analyst flow, so tightening this would
  break existing deployments.
- **Owned rows** are visible and modifiable only to their owner and to
  admins.
"""
from __future__ import annotations

from app.models import CaseRecord, User


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

    Same predicate as `can_view` today; kept separate because a future
    read-only sharing role would relax one without relaxing the other.
    """
    if record.owner_id is None:
        return True
    if user is None:
        return False
    if user.role == "admin":
        return True
    return record.owner_id == user.id
