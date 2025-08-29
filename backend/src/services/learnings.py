from sqlalchemy.orm import Session
from sqlalchemy import select
from ..exceptions import DuplicateError
from .users import increase_streak, change_xp, update_last_completed
from ..models import UserCompletedLearnings, Learnings, Users
from .companions import CompanionService

class LearnService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user

    def get_learning_day(self, user_day: int) -> Learnings | None:
        """Gets learning relevant for the day"""
        result = self.db.execute(select(Learnings).where(Learnings.day <= user_day)).scalars().first()
        return result

    def get_learning_short(self, user_day: int) -> tuple[Learnings, str] | None:
        """Returns tldr, title and xp of the learning, and whether user has completed it"""
        learning = self.db.execute(select(Learnings).where(Learnings.day <= user_day)).scalars().first()
        if not learning:
            return None
        
        user_completed_learnings = [l.learning_id for l in self.user.completed_learnings]
        completed = True if learning.id in user_completed_learnings else False

        return (learning, completed)
    
    def learning_complete(self, learning_id: int) -> None:
        user_completed_learnings = [l.learning_id for l in self.user.completed_learnings]
        
        if learning_id in user_completed_learnings:
            raise DuplicateError("Can't complete same learning more than once")
        
        xp = self.db.execute(select(Learnings.learning_xp).where(
            Learnings.id == learning_id)).scalar_one_or_none()
        
        update_last_completed(self.db, self.user.id)
        increase_streak(self.db, self.user.id)
        self.db.execute(change_xp(xp, self.user.id, learning=True))
        new_complete = UserCompletedLearnings(
            user_id=self.user.id,
            learning_id=learning_id
        )
        companion = CompanionService(self.db, self.user)
        companion.update_stage()
        self.db.add(new_complete)
        self.db.commit()
        return None