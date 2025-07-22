from sqlalchemy.orm import Session
from sqlalchemy import select
from ..exceptions import DuplicateError
from .users import increase_streak, change_xp, update_last_completed
from ..models import UserCompletedLearnings, Learnings

def get_learning_day(db: Session, day: int) -> Learnings | None:
    """Gets learning relevant for the day"""
    result = db.execute(select(Learnings).where(Learnings.day <= day)).scalars().first()
    return result
    
def learning_complete(db: Session, learning_id: int, user_id: int) -> None:
    user_completed_learnings = db.execute(select(UserCompletedLearnings.learning_id).where(
        UserCompletedLearnings.user_id == user_id
    )).scalars().all()
    
    if learning_id in user_completed_learnings:
        raise DuplicateError
    
    xp = db.execute(select(Learnings.learning_xp).where(Learnings.id == learning_id)).scalar_one_or_none()
    
    update_last_completed(db, user_id)
    increase_streak(db, user_id)
    db.execute(change_xp(xp, user_id, learning=True))
    new_complete = UserCompletedLearnings(
        user_id=user_id,
        learning_id=learning_id
    )
    db.add(new_complete)
    db.commit()
    return None

