import jwt
import bcrypt
import hashlib
import secrets
from datetime import timedelta, datetime, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from ..models import RefreshSessions
from typing import Any
from ..config import get_settings

settings = get_settings()
now = datetime.now(timezone.utc)

def encode_jwt(payload: dict[str, Any], 
               key: str = settings.secret_key, 
               algorithm: str = settings.algorithm,
               expire_timedelta: timedelta | None = None,
               expire_min: int = settings.access_token_exp
) -> str:
    to_encode = payload.copy()

    to_encode["sub"] = str(to_encode["sub"])
    expire = now + (expire_timedelta or timedelta(minutes=expire_min))

    to_encode.update({"exp": expire, "iat": now})
    encoded = jwt.encode(to_encode, key, algorithm)
    return encoded

def decode_jwt(
     token: str | bytes,
     key: str = settings.secret_key,
     algorithm: str = settings.algorithm   
) -> int:
    """Decodes JWT token and returns user ID"""
    try:
        decoded = jwt.decode(token, key, algorithms=[algorithm])
        return int(decoded.get("sub"))
    except jwt.exceptions.InvalidTokenError:
        return None

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def validate_password(hashed_password: bytes, password: str) -> bool:
    return bcrypt.checkpw(password=password.encode(), hashed_password=hashed_password)

def is_expired(expire_at: datetime):
    return expire_at.replace(tzinfo=timezone.utc) < now

def hash_token(token_raw: str):
    return hashlib.sha256(token_raw.encode()).hexdigest()

def create_refresh_token(db: Session, 
                         user_id: int,
                         expire_timedelta: timedelta | None = None, 
                         expire_days: int = settings.refresh_token_exp) -> str:
    """Creates and adds new refresh token to refresh_sessions table"""
    refresh_token = secrets.token_urlsafe(64)
    
    new_token =  RefreshSessions(
        refresh_token=hash_token(refresh_token),
        user_id=user_id,
        expires_at=now + (expire_timedelta or timedelta(days=expire_days)),
        created_at=now
    )
    db.add(new_token)
    db.commit()
    return refresh_token

def is_valid_refresh_token(db: Session, refresh_token: str) -> bool | int:
    input_hash = hash_token(refresh_token)
    token = db.execute(select(RefreshSessions).where(RefreshSessions.refresh_token == input_hash)).scalar_one_or_none()

    if token is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    if is_expired(token.expires_at):
        db.execute(delete(RefreshSessions).where(RefreshSessions.id == token.id))
        db.commit()
        raise HTTPException(status_code=401, detail="Refresh token expired")

    db.execute(delete(RefreshSessions).where(RefreshSessions.id == token.id))
    return token.user_id