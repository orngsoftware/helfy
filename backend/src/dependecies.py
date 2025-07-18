from fastapi.security import OAuth2PasswordBearer
from .database import get_session
from fastapi import Depends, HTTPException, status
from .models import Users
from .services.users import get_user
from .auth.utils import decode_jwt
from sqlalchemy.orm import Session
from .config import Settings
from typing import Annotated

settings = Settings()
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)],
                     db: Annotated[Session, Depends(get_session)]) -> Users:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = decode_jwt(token)
    if not user_id:
        raise credentials_exception
    user = get_user(db, user_id=user_id)
    if not user:
        raise credentials_exception
    return user