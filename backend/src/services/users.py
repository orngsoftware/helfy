import datetime
from sqlalchemy import select, update
from sqlalchemy.orm import Session
<<<<<<< HEAD
from ..models import Users, UserPlans
from ..schemas import UserSchema
=======
from .companions import CompanionService
from ..models import Users
from ..schemas import UserSchema, StreakSchema
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
        started=get_today_date(),
>>>>>>> origin/main
        auth_provider=auth_provider
    )
    db.add(user)
    db.commit()
<<<<<<< HEAD
=======
    companion = CompanionService(db, user)
    companion.create_default_companion()
>>>>>>> origin/main
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

def is_plus(user: Users) -> bool:
    """Determines whether user has active plus subscription"""
    if user.subscription_status == "active" or user.subscription_status == "trialing":
        return True
    return False

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
<<<<<<< HEAD
        xp_stmt = (UserPlans.xp - amount) if decrease else (UserPlans.xp + amount)
        db.execute(update(UserPlans).where(UserPlans.id == current_plan_id).values(xp=xp_stmt))
    db.commit()
    return None

def get_streak_w_status(user: Users) -> dict:
    if user.last_completed == get_today_date(): 
        # user has already completed something today
        return {"streak": user.streak, "status": "active"}
    elif user.last_completed ==  get_today_date() - datetime.timedelta(days=1):
        # user has not completed anything today
        return {"streak": user.streak, "status": "inactive"}
    else:
        # user has not completed anything today nor yesterday
        return {"streak": 0, "status": "inactive"}

def update_streak(db: Session, user: Users) -> dict:
    """Updates User streak and returns
    - streak: int , current streak of the user
    - celebrate: bool , should it be celebrated
    """
    if user.last_completed == get_today_date():
        return {"streak": user.streak, "celebrate": False}
    if user.last_completed == get_today_date() - datetime.timedelta(days=1):
        db.execute(update(Users).where(Users.id == user.id).values(
            streak=Users.streak + 1,
            last_completed=get_today_date()
=======
        xp_stmt = (Users.xp - amount) if decrease else (Users.xp + amount)
        result = update(Users).where(Users.id == user_id).values(
            xp=xp_stmt)
    return result

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
>>>>>>> origin/main
        ))
        db.commit()
        return {"streak": user.streak, "celebrate": True}
    db.execute(update(Users).where(Users.id == user.id).values(
        streak=1,
        last_completed=get_today_date()
    ))
    db.commit()
    return {"streak": user.streak, "celebrate": True}

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