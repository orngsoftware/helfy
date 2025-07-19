from .schemas import UserSchema, TokenSchema
from .database import get_session
from .models import Users
from .services.users import create_user, get_user, days
from .services.tasks import get_uncompleted
from .auth import utils as au
from .dependecies import get_current_user
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import FastAPI, Depends, HTTPException, Response, Cookie, status
from typing import Annotated

app = FastAPI(
    title="Helfy API",
    description="This is Helfy's API documentation",
    root_path="/api/v1"
)

@app.get("/")
def root():
    return {"msg": "Helfy backend is running"}

@app.post("/auth/sign-up")
def register(user_data: UserSchema, db: Annotated[Session, Depends(get_session)]):
    if create_user(db, user_data):
        return {"ok": True, "msg": "User has been added successfully"}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exsists")

@app.post("/auth/token")
def login(response: Response,
          user_data: UserSchema, 
          db: Annotated[Session, Depends(get_session)]):
    user = get_user(db, email=user_data.email)
    if user and au.validate_password(user.password, user_data.password):
        access_token = au.encode_jwt(payload={
            "sub": user.id
        })
        refresh_token = au.create_refresh_token(db, user.id)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)
        return {"ok": True, "token": TokenSchema(access_token=access_token, token_type="bearer")}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

@app.post("/auth/token/refresh")
def refresh_access_token(db: Annotated[Session, Depends(get_session)], 
                         response: Response, 
                         refresh_token: UUID = Cookie(None)):
    token_result = au.is_valid_refresh_token(db, refresh_token)
    if token_result == False:
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    new_refresh_token = au.create_refresh_token(db, user_id=token_result)
    access_token = au.encode_jwt(payload={
        "sub": token_result
    })
    response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True, secure=True)
    return {"ok": True, "token": TokenSchema(access_token=access_token, token_type="bearer")}

@app.post("/auth/log-out")
def logout(db: Annotated[Session, Depends(get_session)], 
                         response: Response, 
                         refresh_token: UUID = Cookie(None)):
    token_result = au.is_valid_refresh_token(db, refresh_token)
    if token_result == False:
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    response.delete_cookie("refresh_token")
    return {"ok": True, "msg": "Successfully logged out"}

@app.get("/tasks")
def get_tasks(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    user_day = days(user.started)
    tasks = get_uncompleted(db, user.id, user_day)
    if not tasks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, details="No tasks available")
    return {"ok": True, "tasks": tasks, "user_day": user_day}

@app.get("/tasks/habits")
def get_habits():
    # create habits automatically
    pass

@app.post("/tasks/complete")
def complete_task():
    pass

@app.post("/tasks/incomplete")
def incomplete_task():
    pass

@app.post("/tasks/habits/mark")
def mark_habit():
    pass

@app.post("/tasks/habits/unmark")
def unmark_habit():
    pass