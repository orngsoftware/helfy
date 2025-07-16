from pydantic import BaseModel, EmailStr
from datetime import date

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class UserSchema(BaseModel):
    email: EmailStr
    password: bytes