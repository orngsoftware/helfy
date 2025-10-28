from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func, delete
from sqlalchemy.exc import NoResultFound
from ..exceptions import DuplicateError
from .users import increase_streak, change_xp, update_last_completed
from ..models import UserCompletedLearnings, Learnings, Users, Texts, SavedLearnings
from .companions import CompanionService

class LearnService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user
    
    def _learn_max_text_pos(self, learning_id: int) -> int:
        """Returns maximum position 
        (length of the whole learning in terms of texts) 
        of texts"""
        result = self.db.execute(select(func.max(Texts.position)).where(
            Texts.learning_id == learning_id
        ))
        return result.scalar()
    
    def get_learning_info(self, learning: Learnings) -> tuple[bool, int]:
        user_completed_learnings = [l.learning_id for l in self.user.completed_learnings]
        user_saved_learnings = [l.learning_id for l in self.user.saved_learnings]

        completed = True if learning.id in user_completed_learnings else False
        saved = True if learning.id in user_saved_learnings else False

        max_text_pos = self._learn_max_text_pos(learning.id)

        return (completed, saved, max_text_pos)
    
    def save_learning(self, learning_id: int) -> None:
        """Adds new row to the SavedLearnings table"""
        user_saved_learnings = [l.learning_id for l in self.user.saved_learnings]
        
        if learning_id in user_saved_learnings:
            raise DuplicateError("Can't save same learning more than once")
        
        new_save = SavedLearnings(
            user_id=self.user.id,
            learning_id=learning_id
        )
        self.db.add(new_save)
        self.db.commit()
        return None
    
    def unsave_learning(self, learning_id: int) -> None:
        """Deletes row from SavedLearnings table"""
        user_saved_learnings = [l.learning_id for l in self.user.saved_learnings]
        
        if learning_id not in user_saved_learnings:
            raise NoResultFound
        
        self.db.execute(delete(SavedLearnings).where(
            SavedLearnings.learning_id == learning_id
        ))
        self.db.commit()
        return None
    
    def get_saved_learnings(self) -> list[Learnings]:
        """Returns saved learnings relevant to the user"""
        saved_learnings = self.db.execute(
            select(Learnings)
            .join(SavedLearnings, SavedLearnings.learning_id == Learnings.id)
            .where(SavedLearnings.user_id == self.user.id, 
                   Learnings.plan_id == self.user.current_plan.plan_id)
        ).scalars().all()

        result = []

        for learning in saved_learnings:
            info = self.get_learning_info(learning)
            result.append({ 
              "learning": learning, 
              "completed": info[0],
              "saved": info[1],
              "max_text_pos": info[2]
              })

        return result

    def get_text_by_position(self, text_pos: int, learning_id: int) -> Texts:
        """Returns text using its position and learning id"""

        result = self.db.execute(select(Texts).where(
            Texts.position == text_pos,
            Texts.learning_id == learning_id
        )).scalar_one_or_none()

        return result


    def get_learning_by_day(self, user_day: int) -> tuple[Learnings, bool, int] | None:
        """Returns tldr, title and xp of the learning, and whether user has completed and saved it"""
        learning = self.db.execute(select(Learnings)
            .where(Learnings.day <= user_day,
                   Learnings.plan_id == self.user.current_plan.plan_id)
            .order_by(desc(Learnings.day))
            .limit(1)
        ).scalars().first()
        if not learning:
            return None
        
        learning_info = self.get_learning_info(learning)
    
        return (learning, 
                learning_info[0], 
                learning_info[1], 
                learning_info[2])
    
    def learning_complete(self, learning_id: int) -> None:
        user_completed_learnings = [l.learning_id for l in self.user.completed_learnings]
        
        if learning_id in user_completed_learnings:
            raise DuplicateError("Can't complete same learning more than once")
        
        xp = self.db.execute(select(Learnings.learning_xp).where(
            Learnings.id == learning_id)).scalar_one_or_none()
        
        update_last_completed(self.db, self.user.id)
        increase_streak(self.db, self.user.id)
        change_xp(self.db,
                  xp,
                  self.user.current_plan.id, 
                  learning=True)
        new_complete = UserCompletedLearnings(
            user_id=self.user.id,
            learning_id=learning_id
        )
        self.db.add(new_complete)
        self.db.commit()
        return None