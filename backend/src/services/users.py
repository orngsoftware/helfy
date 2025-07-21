import datetime
from sqlalchemy import select, update, Update
from sqlalchemy.orm import Session
from ..models import Users
from ..schemas import UserSchema, StreakSchema
from ..auth.utils import hash_password

today = datetime.date.today()

def create_user(db: Session, user_data: UserSchema) -> bool:
    """Creates a new user"""
    if get_user(db, user_data.email):
        return False

    user = Users(
        email=user_data.email,
        password=hash_password(user_data.password),
        started=today
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
    dif = today - start_date
    return dif.days

def change_xp(amount: int, user_id: int, decrease: bool = False) -> Update:
    """Constructs Update for increasing or decreasing XP"""
    xp_stmt = (Users.xp - amount) if decrease else (Users.xp + amount)
    result = update(Users).where(Users.id == user_id).values(
            xp=xp_stmt)
    return result

def update_last_completed(db: Session, user_id: int) -> None:
    """Updates last_completed date of a user to today"""
    user = get_user(db, user_id=user_id)
    if user.last_completed != today:
        db.execute(update(Users).where(Users.id == user_id).values(
            last_completed=today
        ))
        db.commit()
    return None

def increase_streak(db: Session, user_id: int) -> None:
    user = get_user(db, user_id=user_id)
    if user.last_completed == today and user.last_streak_update != today:
        db.execute(update(Users).where(Users.id == user_id).values(
            streak=Users.streak + 1,
            last_streak_update=today
        ))
        db.commit()
    return None

def calculate_streak(db: Session, user_id: int) -> StreakSchema:
    user = get_user(db, user_id=user_id)
    if user.last_completed == today and user.last_streak_update == today:
        return {"streak": user.streak, "status": "kept"}
    elif user.last_completed == today - datetime.timedelta(days = 1):
        return {"streak": user.streak, "status": "same"}
    else:
        db.execute(update(Users).where(Users.id == user_id).values(
            streak=0,
            last_streak_update=today
        ))
        db.commit()
        return {"streak": 0, "status": "lost"}
