from .schemas import UserSchema, TokenSchema, CodeSchema
from .database import get_session
from .models import Users
from .services.users import create_user, get_user, calculate_streak
from .auth import utils as au
from .auth.oauth_google import generate_google_auth_redirect_uri, handle_code
from .api.v1 import tasks_api, learnings_api, companion_api, plans_api
from .dependecies import get_current_user
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, Response, Cookie, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

app = FastAPI(
    title="Helfy API",
    description="This is Helfy's API documentation"
)
app.include_router(tasks_api.router)
app.include_router(learnings_api.router)
app.include_router(companion_api.router)
app.include_router(plans_api.router)

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
    return {"ok": True, "xp": user.current_plan.xp if not learning else user.current_plan.learning_xp}
