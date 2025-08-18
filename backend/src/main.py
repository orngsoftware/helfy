from .schemas import UserSchema, TokenSchema, CodeSchema
from .database import get_session
from .models import Users
from .services.users import create_user, get_user, days, calculate_streak
from .services.tasks import get_uncompleted_tasks, complete, create_habit, create_habits_auto, get_uncompleted_habits, remove_habit
from .services.learnings import get_learning_day, learning_complete, get_learning_short
from .services.companions import get_accessories, add_accessory, change_companion_type, change_companion_name, update_accessory_visibility
from .auth import utils as au
from .auth.oauth_google import generate_google_auth_redirect_uri, handle_code
from .exceptions import DuplicateError, TimeGapError
from .dependecies import get_current_user
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, Response, Cookie, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

app = FastAPI(
    title="Helfy API",
    description="This is Helfy's API documentation",
    root_path="/api/v1"
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:80",
    "http://localhost:443",
    "http://localhost",
    "http://72.60.32.234"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"msg": "Helfy backend is running"}

@app.post("/auth/sign-up")
def register(user_data: UserSchema, db: Annotated[Session, Depends(get_session)], response: Response):
    if create_user(db, user_data, "local"):
        user = get_user(db, email=user_data.email)
        access_token = au.encode_jwt(payload={
            "sub": user.id
        })
        refresh_token = au.create_refresh_token(db, user.id)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="strict", max_age=30*24*60*60)
        return {"ok": True, "msg": "User has been added successfully", "token": TokenSchema(access_token=access_token, token_type="bearer")}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exsists")

@app.post("/auth/token")
def login(response: Response,
          user_data: UserSchema, 
          db: Annotated[Session, Depends(get_session)]):
    user = get_user(db, email=user_data.email)
    if user.auth_provider != "local":
        raise HTTPException(status_code=401, detail="Use Google login for this account")
    if user and au.validate_password(user.password, user_data.password):
        access_token = au.encode_jwt(payload={
            "sub": user.id
        })
        refresh_token = au.create_refresh_token(db, user.id)
        response.set_cookie(key="refresh_token", 
                            value=refresh_token, 
                            httponly=True, 
                            secure=True, 
                            samesite="strict",
                            max_age=30*24*60*60)
        return {"ok": True, "token": TokenSchema(access_token=access_token, token_type="bearer")}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

@app.post("/auth/token/refresh")
def refresh_access_token(db: Annotated[Session, Depends(get_session)], 
                         response: Response,
                         refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    try:
        validation_result = au.is_valid_refresh_token(db, refresh_token)
    except HTTPException:
        response.delete_cookie("refresh_token")
        raise
    
    access_token = au.encode_jwt(payload={
        "sub": validation_result[0]
    })
    response.set_cookie(key="refresh_token", 
                        value=validation_result[1], 
                        httponly=True, 
                        secure=True, 
                        samesite="strict", 
                        max_age=30*24*60*60)
    return {"ok": True, "token": TokenSchema(access_token=access_token, token_type="bearer")}

@app.post("/auth/log-out")
def logout(db: Annotated[Session, Depends(get_session)], 
                         response: Response, 
                         refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    try:
        au.remove_refresh_session(db, refresh_token)
    except HTTPException:
        response.delete_cookie("refresh_token")
        raise
    
    response.delete_cookie("refresh_token")
    return {"ok": True, "msg": "Successfully logged out"}

@app.get("/auth/google/url")
def get_google_oauth_redirect():
    uri = generate_google_auth_redirect_uri()
    return RedirectResponse(url=uri, status_code=302)

@app.post("/auth/google/callback")
def google_callback(db: Annotated[Session, Depends(get_session)], code: CodeSchema, response: Response):
    email = handle_code(code.code, key="email")
    if not email:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to retrieve email from Google")
    user = get_user(db, email=email)
    if not user:
        new_user = UserSchema(email=email, password="random", auth_provider="google")
        create_user(db, new_user, "google")
        user = get_user(db, email=email)
    access_token = au.encode_jwt(payload={
            "sub": user.id
        })
    refresh_token = au.create_refresh_token(db, user.id)
    response.set_cookie(key="refresh_token", 
                        value=refresh_token, 
                        httponly=True, secure=False, samesite="lax", max_age=30*24*60*60)
    return {"ok": True, "token": TokenSchema(access_token=access_token, token_type="bearer")}

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
    return {"ok": True, "tasks": tasks}

@app.post("/tasks/complete/{task_id}")
def complete_task(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        complete(db, user, days(user.started), task_id)
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This task is already completed by the user")
    return {"ok": True, "msg": "Successfully completed the task"}

@app.post("/tasks/incomplete/{task_id}")
def incomplete_task(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        complete(db, user, days(user.started), task_id, completed=False)
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

@app.get("/learning")
def get_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)], short: bool | None = None):
    if not short:
        learning = get_learning_day(db, days(user.started))
        result = {"ok": True, "learning": learning}
    else:
        learning = get_learning_short(db, days(user.started), user)
        result = {"ok": True, "learning": learning[0], "completed": learning[1]}
    if not learning:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No learning for this day")
    return result

@app.post("/learning/complete/{learning_id}")
def complete_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              learning_id: int):
    try:
        learning_complete(db, learning_id, user)
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can't complete one learning more than once")
    return {"ok": True, "msg": "Successfully completed the learning"}

@app.get("/companion")
def companion(user: Annotated[Users, Depends(get_current_user)]):
    return {"ok": True, "companion": user.companion}

@app.get("/companion/accessories")
def accessories(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)], inventory: bool | None = None):
    if inventory:
        accessories = user.companion.accessories
    else:
        accessories = get_accessories(db, user)
    return {"ok": True, "accessories": accessories}

@app.post("/companion/accessories/buy/{accessory_id}")
def buy_accessory(db: Annotated[Session, Depends(get_session)], 
                  user: Annotated[Users, Depends(get_current_user)], 
                  accessory_id: int):
    try:
        add_accessory(db, user, accessory_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough XP to buy this accessory")
    except DuplicateError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has purchased this accessory already")
    return {"ok": True, "msg": "Successfully purchased new accessory"}

@app.post("/companion/change/{companion_type}")
def change_companion(db: Annotated[Session, Depends(get_session)], 
                    user: Annotated[Users, Depends(get_current_user)],
                    companion_type: str):
    change_companion_type(db, companion_type, user.id)
    return {"ok": True, "msg": f"Successfully changed companion type to {companion_type}"}

@app.patch("/companion/change-name/{new_name}")
def change_name(db: Annotated[Session, Depends(get_session)], 
                user: Annotated[Users, Depends(get_current_user)], 
                new_name: str):
    change_companion_name(db, new_name, user.id)
    return {"ok": True, "msg": f"Successfully change companion name to {new_name}"}

@app.patch("/companion/accessories/toggle/{accessory_id}")
def toggle_visibility(db: Annotated[Session, Depends(get_session)], 
                  user: Annotated[Users, Depends(get_current_user)], 
                  accessory_id: int):
    update_accessory_visibility(db, user, accessory_id)
    return {"ok": True, "msg": "Successfully changed visibility of the accessory"}
