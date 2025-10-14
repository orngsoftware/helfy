from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
from datetime import date, timedelta
from typing import List
from ..exceptions import DuplicateError, TimeGapError
from ..models import Tasks, UserHabits, Users
from .users import change_xp, update_last_completed, increase_streak

class HabitService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user
    
    def get_uncompleted_habits(self) -> List[Tasks]:
        """Returns list of habits, that user hasn't completed today."""
        user_habits = select(UserHabits.task_id).where(
            UserHabits.user_id == self.user.id,
            UserHabits.last_completed != date.today())
        habits = self.db.execute(select(Tasks).where(
            Tasks.id.in_(user_habits)
        )).scalars().all()
        return habits
    
    def complete_habit(self, task_id: int) -> None:
        """Completes habit, updates streak and increases XP"""
        task = self.db.execute(select(Tasks).where(
            Tasks.id == task_id,
            Tasks.plan_id == self.user.current_plan.plan_id)).scalar_one_or_none()

        self.db.execute(update(UserHabits).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id
        ).values(last_completed=date.today()))
        
        update_last_completed(self.db, self.user.id)
        increase_streak(self.db, self.user.id)
        change_xp(self.db, task.xp*2, self.user.id, self.user.current_plan.id)
        self.db.commit()
        return None
    
    def incomplete_habit(self, task_id) -> None:
        """Incompletes habit and decreases XP"""
        task = self.db.execute(select(Tasks).where(
            Tasks.id == task_id,
            Tasks.plan_id == self.user.current_plan.plan_id)).scalar_one_or_none()
        
        self.db.execute(update(UserHabits).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id
        ).values(last_completed=date.today()))

        change_xp(self.db,
                  task.xp, 
                  self.user.current_plan.id,
                  decrease=True)
        self.db.commit()
        return None
    
    def create_habit(self, task_id: int) -> None:
        """Creates a new habit for the user"""

        if self.db.execute(select(UserHabits.task_id).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id
            )).scalar_one_or_none():
                raise DuplicateError("Can't mark one task as habit twice")
        new_habit = UserHabits(
            user_id=self.user.id,
            habit_created=date.today(),
            task_id=task_id,
            last_completed=date.today() - timedelta(days = 1)
        )
        self.db.add(new_habit)
        self.db.commit()
        return None

    def create_habits_auto(self, user_day: int) -> None:
        """Creates a new habit for the user automatically based on the day"""

        tasks = self.db.execute(select(Tasks).where(
            Tasks.day_create_habit == user_day, 
            Tasks.id.not_in(select(UserHabits.task_id).where(
        UserHabits.user_id == self.user.id)))).scalars().all()
        if tasks:
            for task in tasks:
                self.create_habit(task.id)
        return None

    def remove_habit(self, task_id: int) -> None:
        """Deletes habit from user_habits table"""
        created_at = self.db.execute(select(UserHabits.habit_created).where(
            UserHabits.task_id == task_id,
            UserHabits.user_id == self.user.id
        )).scalar_one_or_none()

        dif = date.today() - created_at
        if dif.days < 7:
            raise TimeGapError("7 days must pass after habit creation")
        
        self.db.execute(delete(UserHabits).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id))
        self.db.commit()
        return None