import datetime
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..models import Users
from ..schemas import UserSchema
from ..auth.utils import hash_password

def create_user(db: Session, user_data: UserSchema) -> bool:
    """Creates a new user"""
    if get_user(db, user_data.email):
        return False

    user = Users(
        email=user_data.email,
        password=hash_password(user_data.password),
        started=datetime.date.today()
    )
    db.add(user)
    db.commit()
    return True

def get_user(db: Session, email: str | None = None, user_id: int | None = None) -> Users | None:
    """Gets user from email or id"""
    if email:
        user = db.execute(select(Users).where(Users.email == email)).scalar_one_or_none()
    elif user_id:
        user = db.execute(select(Users).where(Users.id == user_id)).scalar_one_or_none()
    return user

def days(start_date: datetime.date) -> int:
    """Determines how many days have passed from the date"""
    dif = datetime.date.today() - start_date
    return dif.days