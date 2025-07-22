from .schemas import UserSchema, TokenSchema
from .database import get_session
from .models import Users
from .services.users import create_user, get_user, days, calculate_streak
from .services.tasks import get_uncompleted_tasks, complete, create_habit, create_habits_auto, get_uncompleted_habits, remove_habit
from .services.learnings import get_learning_day, learning_complete
from .auth import utils as au
from .exceptions import DuplicateError, TimeGapError
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

@app.get("/users/stats/streak")
def get_streak(db: Annotated[Session, Depends(get_session)],
               user: Annotated[Users, Depends(get_current_user)]):
    streak = calculate_streak(db, user.id)
    return {"ok": True, "result": streak}

@app.get("/users/stats/xp")
def get_xp(user: Annotated[Users, Depends(get_current_user)], learning: bool | None = None):
    return {"ok": True, "xp": user.xp if not learning else user.learning_xp}

@app.get("/tasks")
def get_tasks(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    user_day = days(user.started)
    tasks = get_uncompleted_tasks(db, user.id, user_day)
    if not tasks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No tasks available")
    return {"ok": True, "tasks": tasks, "user_day": user_day}

@app.post("/tasks/complete/{task_id}")
def complete_task(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int, delayed: bool = False):
    try:
        complete(db, user.id, task_id, delayed=delayed)
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This task is already completed by the user")
    return {"ok": True, "msg": "Successfully completed the task"}

@app.post("/tasks/incomplete/{task_id}")
def incomplete_task(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        complete(db, user.id, task_id, completed=False)
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This task is already incompleted by the user")
    return {"ok": True, "msg": "Successfully incompleted the task"}

@app.get("/tasks/habits")
def get_habits(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    create_habits_auto(db, user.id, days(user.started))
    return {"ok": True, "habits": get_uncompleted_habits(db, user.id)}

@app.post("/tasks/habits/mark/{task_id}")
def mark_habit(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        create_habit(db, user.id, task_id)
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can't mark one task as habit twice")
    return {"ok": True, "msg": "Successfully marked the task as habit"}

@app.post("/tasks/habits/unmark/{task_id}")
def unmark_habit(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        remove_habit(db, user.id, task_id)
    except TimeGapError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can't unmark a habit that was created less than 7 days ago")
    return {"ok": True, "msg": "Successfully unmarked the habit"}

@app.get("/learning/")
def get_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    learning = get_learning_day(db, days(user.started))
    if not learning:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No learning for this day")
    return {"ok": True, "learning": learning}

@app.post("/learning/complete/{learning_id}")
def complete_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              learning_id: int):
    try:
        learning_complete(db, learning_id, user.id)
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can't complete one learning more than once")
    return {"ok": True, "msg": "Successfully completed the learning"}