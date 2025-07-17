from pydantic import BaseModel, EmailStr

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class UserSchema(BaseModel):
    email: EmailStr
    password: str