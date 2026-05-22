"""Password hashing + JWT token utilities (Phase D).

Implementation choice:
- **bcrypt** for password hashing (industry standard, slow by design),
  used directly via the `bcrypt` package (passlib 1.7.4 has known
  compat issues with bcrypt >= 5.x).
- **PyJWT** for HS256 tokens, signed with a process-wide secret from
  the ``SYMBA_JWT_SECRET`` env var.

Token contents (minimum viable claims):
- ``sub``: user id (UUID string)
- ``email``: convenience for the UI to skip the /me call after login
- ``exp``: expiry timestamp
- ``iat``: issued-at timestamp

Tokens are short-lived (default 12h). No refresh-token flow in MVP —
the user re-logs in.
"""
from __future__ import annotations

import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt


# ---------------------------------------------------------------------------
# Password hashing (bcrypt direct)
# ---------------------------------------------------------------------------

# bcrypt hard-limits secrets to 72 bytes. Anything longer is silently
# truncated — to avoid surprise we cap explicitly and surface a
# deterministic behavior (truncate at 72 bytes, matching bcrypt's own
# rule).
_BCRYPT_MAX_BYTES = 72


def _to_bcrypt_bytes(plain: str) -> bytes:
    raw = plain.encode("utf-8")
    if len(raw) > _BCRYPT_MAX_BYTES:
        raw = raw[:_BCRYPT_MAX_BYTES]
    return raw


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(_to_bcrypt_bytes(plain), bcrypt.gensalt()).decode("ascii")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_to_bcrypt_bytes(plain), hashed.encode("ascii"))
    except (ValueError, UnicodeEncodeError):
        return False


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------


_DEFAULT_TTL_HOURS = 12
_ALG = "HS256"


def _secret() -> str:
    """Return the JWT signing secret.

    In production set ``SYMBA_JWT_SECRET`` to a long random value via
    the environment. In dev / tests, fall back to a per-process random
    secret so tokens issued by one run don't accidentally validate in
    another (good test hygiene, also makes leaks less impactful).
    """
    return os.environ.get("SYMBA_JWT_SECRET") or _process_secret()


_PROCESS_SECRET: str | None = None


def _process_secret() -> str:
    global _PROCESS_SECRET
    if _PROCESS_SECRET is None:
        _PROCESS_SECRET = secrets.token_urlsafe(48)
    return _PROCESS_SECRET


def create_access_token(
    *,
    sub: str,
    email: str,
    role: str,
    ttl_hours: int | None = None,
) -> str:
    ttl_hours = ttl_hours or _DEFAULT_TTL_HOURS
    now = datetime.now(tz=timezone.utc)
    payload: dict[str, Any] = {
        "sub": sub,
        "email": email,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=ttl_hours)).timestamp()),
    }
    return jwt.encode(payload, _secret(), algorithm=_ALG)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode + validate the token. Raises jwt.InvalidTokenError on bad
    signature / expired / malformed."""
    return jwt.decode(token, _secret(), algorithms=[_ALG])
