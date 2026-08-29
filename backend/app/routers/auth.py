"""Auth HTTP endpoints (Phase D).

  POST /api/auth/register  -> create user + return token
  POST /api/auth/login     -> verify password + return token
  GET  /api/auth/me        -> who am I (requires Bearer token)

The Bearer dependency lives in ``app.auth.deps`` and is reused by
protected routers (e.g. ``cases.py`` once ownership is wired up).
"""
from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
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

    First user signed up gets the ``admin`` role automatically; all
    subsequent ones get ``analyst``. Simple bootstrap so the deploy
    operator can self-serve.
    """
    existing = db.execute(
        select(User).where(User.email == payload.email.lower())
    ).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(
            status_code=400,
            detail=f"Email {payload.email!r} already registered",
        )

    is_first = db.execute(select(User).limit(1)).first() is None
    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role="admin" if is_first else "analyst",
    )
    db.add(user)
    db.commit()
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
