"""HTTP wire-format DTOs (Pydantic).

Renamed from app/schemas/ during Sprint 4 Step 2 scaffold to disambiguate
from app/schemas/ which now holds the engine's JSON schema files.

These models define the shape of HTTP request/response payloads.
"""

from app.wire import pathway_schemas, session_schemas

__all__ = ["pathway_schemas", "session_schemas"]
