import datetime
from sqlalchemy import select, update, Update
from sqlalchemy.orm import Session
from ..models import Users, UserPlans
from ..schemas import UserSchema, StreakSchema
from ..auth.utils import hash_password

def get_today_date() -> datetime.date:
    return datetime.date.today()

def create_user(db: Session, user_data: UserSchema, auth_provider: str) -> bool:
    """Creates a new user"""
    if get_user(db, user_data.email):
        return False

    user = Users(
        email=user_data.email,
        password=hash_password(user_data.password),
        auth_provider=auth_provider
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
    dif = get_today_date() - start_date
    return dif.days

def change_xp(db: Session, 
              amount: int,
              current_plan_id: int,
              decrease: bool = False, 
              learning: bool = False) -> None:
    """Increases or decreases XP"""
    if learning:
        xp_stmt = UserPlans.learning_xp + amount
        db.execute(update(UserPlans).where(
            UserPlans.id == current_plan_id).values(learning_xp=xp_stmt))
        
    else: 
        xp_stmt = (UserPlans.xp - amount) if decrease else (UserPlans.xp + amount)
        db.execute(update(UserPlans).where(UserPlans.id == current_plan_id).values(xp=xp_stmt))
    db.commit()
    return None

def update_last_completed(db: Session, user_id: int) -> None:
    """Updates last_completed date of a user to today"""
    user = get_user(db, user_id=user_id)
    if user.last_completed != get_today_date():
        db.execute(update(Users).where(Users.id == user_id).values(
            last_completed=get_today_date()
        ))
        db.commit()
    return None

def increase_streak(db: Session, user_id: int) -> None:
    user = get_user(db, user_id=user_id)
    if user.last_completed == get_today_date() and user.last_streak_update != get_today_date():
        db.execute(update(Users).where(Users.id == user_id).values(
            streak=Users.streak + 1,
            last_streak_update=get_today_date()
        ))
        db.commit()
    return None

def calculate_streak(db: Session, user_id: int) -> StreakSchema:
    user = get_user(db, user_id=user_id)
    if user.last_completed == get_today_date() and user.last_streak_update == get_today_date():
        return {"streak": user.streak, "status": "kept"}
    elif user.last_completed == get_today_date() - datetime.timedelta(days = 1):
        return {"streak": user.streak, "status": "same"}
    else:
        db.execute(update(Users).where(Users.id == user_id).values(
            streak=0,
            last_streak_update=get_today_date()
        ))
        db.commit()
        return {"streak": 0, "status": "lost"}

def update_current_plan(db: Session, user_id: int, plan_id: int) -> None:
    new_current_plan = db.execute(select(UserPlans.id).where(
        UserPlans.plan_id == plan_id,
        UserPlans.user_id == user_id
    )).scalar_one_or_none()

    if not new_current_plan:
        raise KeyError("User doesn't have this plan")

    db.execute(update(Users).where(Users.id == user_id).values(
        current_plan_id=new_current_plan
    ))
    db.commit()
    return None