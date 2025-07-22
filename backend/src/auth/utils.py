import jwt
import bcrypt
import uuid
from datetime import timedelta, datetime, timezone
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

def create_refresh_token(db: Session, 
                         user_id: int, 
                         ip_address: str = "127.0.0.1",  # <-- for testing purposes, no NGINX
                         expire_timedelta: timedelta | None = None, 
                         expire_days: int = settings.refresh_token_exp) -> uuid.UUID:
    """Creates and adds new refresh token to refresh_sessions table"""
    refresh_token = uuid.uuid4()
    
    new_token =  RefreshSessions(
        refresh_token=refresh_token,
        user_id=user_id,
        expires_at=now + (expire_timedelta or timedelta(days=expire_days)),
        created_at=now,
        ip_address=ip_address
    )
    db.add(new_token)
    db.commit()
    return refresh_token

def is_valid_refresh_token(db: Session, refresh_token: uuid.UUID) -> bool | int:
    """Returns user id if token is valid and deletes old one"""
    token = db.execute(select(RefreshSessions).where(RefreshSessions.refresh_token == refresh_token)).scalar_one_or_none()
    delete_query = delete(RefreshSessions).where(RefreshSessions.refresh_token == refresh_token)
    
    if not token:
        return False
    if is_expired(token.expires_at):
        db.execute(delete_query)
        db.commit()
        return False
    
    # When NGINX setup is done check IPs or Fingerprints.
    db.execute(delete_query)
    db.commit()
    return token.user_id