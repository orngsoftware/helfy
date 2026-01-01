from pydantic import BaseModel, EmailStr
from typing import Literal

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class UserSchema(BaseModel):
    email: EmailStr
    password: str

class StreakSchema(BaseModel):
    streak: int
    status: Literal['active', 'inactive']

class CodeSchema(BaseModel):
    code: str