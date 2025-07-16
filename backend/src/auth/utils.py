import jwt
import bcrypt
from datetime import timedelta, datetime, timezone
from typing import Any
from ..config import get_settings

settings = get_settings().auth

def encode_jwt(payload: dict[str, Any], 
               key: str = settings.secret_key, 
               algorithm: str = settings.algorithm,
               expire_timedelta: timedelta | None = None,
               expire_min: int = settings.access_token_exp
) -> str:
    to_encode = payload.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expire_timedelta | timedelta(minutes=expire_min))

    to_encode.update({"exp": expire, "iat": now})
    encoded = jwt.encode(payload=to_encode, key=key, algorithm=algorithm)
    return encoded

def decode_jwt(
     token: str | bytes,
     key: str = settings.secret_key,
     algorithm: str = settings.algorithm   
) -> int:
    """Decodes JWT token and returns user ID"""
    decoded = jwt.decode(jwt=token, key=key, algorithms=[algorithm])
    return decoded.get("sub")

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def validate_password(hashed_password: bytes, password: str) -> bool:
    return bcrypt.checkpw(password=password.encode(), hashed_password=hashed_password)