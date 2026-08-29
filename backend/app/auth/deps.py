"""FastAPI dependencies for auth.

- ``get_current_user``: required Bearer token. Returns the User ORM row
  or raises 401.
- ``get_current_user_optional``: same but returns None when no token
  is present, so routes can be partially-anonymous (e.g. /api/cases
  in MVP still allows legacy unauthenticated reads).
"""
from __future__ import annotations

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session as OrmSession

from app.auth.security import decode_access_token
from app.db import get_db
from app.models import User

# auto_error=False so we can produce 401 with a friendlier message ourselves,
# AND so the optional dependency can detect "no token" without an exception.
_bearer_required = HTTPBearer(auto_error=True)
_bearer_optional = HTTPBearer(auto_error=False)


def _decode_or_401(token: str) -> dict:
    try:
        return decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(_bearer_required),
    db: OrmSession = Depends(get_db),
) -> User:
    payload = _decode_or_401(creds.credentials)
    user_id = payload.get("sub")
    if not isinstance(user_id, str):
        raise HTTPException(status_code=401, detail="Malformed token")
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


def get_current_user_optional(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer_optional),
    db: OrmSession = Depends(get_db),
) -> User | None:
    if creds is None:
        return None
    try:
        payload = decode_access_token(creds.credentials)
    except jwt.InvalidTokenError:
        return None
    user_id = payload.get("sub")
    if not isinstance(user_id, str):
        return None
    return db.get(User, user_id)
