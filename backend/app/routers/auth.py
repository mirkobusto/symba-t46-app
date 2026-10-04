"""Auth HTTP endpoints (Phase D).

  POST /api/auth/register  -> create user + return token
  POST /api/auth/login     -> verify password + return token
  GET  /api/auth/me        -> who am I (requires Bearer token)

The Bearer dependency lives in ``app.auth.deps`` and is reused by
protected routers (e.g. ``cases.py`` once ownership is wired up).
"""
from __future__ import annotations

import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as OrmSession

from app.auth import create_access_token, hash_password, verify_password
from app.auth.deps import get_current_user
from app.db import get_db
from app.models import User

router = APIRouter(tags=["auth"])


# ---------------------------------------------------------------------------
# DTOs
# ---------------------------------------------------------------------------


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class UserPublic(BaseModel):
    id: str
    email: str
    role: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


def _to_public(user: User) -> UserPublic:
    return UserPublic(
        id=user.id,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
    )


def _find_user_by_email(db: OrmSession, email: str) -> User | None:
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def _already_registered(email: str) -> HTTPException:
    return HTTPException(status_code=400, detail=f"Email {email!r} already registered")


def _registration_closed() -> bool:
    return (os.environ.get("SYMBA_REGISTRATION_OPEN") or "true").strip().lower() in {"false", "0", "no"}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post(
    "/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED
)
def register(
    payload: RegisterRequest,
    db: OrmSession = Depends(get_db),
) -> TokenResponse:
    """Create a new user account and return an access token.

    Roles. Without configuration the first user signed up gets ``admin`` and all
    later ones ``analyst``: a bootstrap so the deploy operator can self-serve.
    On a public instance that means whoever registers first becomes admin, so
    ``SYMBA_ADMIN_EMAIL`` pins the admin to one address (only that email is admin,
    whenever it registers).

    Registration. Open by default. ``SYMBA_REGISTRATION_OPEN=false`` closes it: only
    ``SYMBA_ADMIN_EMAIL`` can still register (to create the admin account), or, when
    that is not set, the very first user (the old bootstrap).
    """
    email = payload.email.lower()
    admin_email = (os.environ.get("SYMBA_ADMIN_EMAIL") or "").strip().lower()
    no_users_yet = db.execute(select(User).limit(1)).first() is None
    if _registration_closed() and not (
        (admin_email and email == admin_email) or (not admin_email and no_users_yet)
    ):
        raise HTTPException(status_code=403, detail="Registration is closed")
    if _find_user_by_email(db, email) is not None:
        raise _already_registered(payload.email)

    is_admin = (email == admin_email) if admin_email else no_users_yet
    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        role="admin" if is_admin else "analyst",
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        # Two requests for the same address passed the check above at once: the unique index
        # lets one in and refuses the other, which is the same answer as a plain duplicate.
        db.rollback()
        raise _already_registered(payload.email) from None
    db.refresh(user)

    token = create_access_token(sub=user.id, email=user.email, role=user.role)
    return TokenResponse(access_token=token, user=_to_public(user))


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: OrmSession = Depends(get_db),
) -> TokenResponse:
    user = db.execute(
        select(User).where(User.email == payload.email.lower())
    ).scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(sub=user.id, email=user.email, role=user.role)
    return TokenResponse(access_token=token, user=_to_public(user))


@router.get("/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)) -> UserPublic:
    return _to_public(current_user)
