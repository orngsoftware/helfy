from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
from datetime import date, timedelta
from typing import List
from ..exceptions import DuplicateError, TimeGapError
from ..models import Tasks, UserHabits, Users
from .users import change_xp

class HabitService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user

    def _update_streak(self, task_id: int) -> None:
        habit = self.db.execute(select(UserHabits).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id
        )).scalar_one_or_none()

        if habit.last_completed == date.today() - timedelta(days=1):
            self.db.execute(update(UserHabits).where(
                UserHabits.user_id == self.user.id,
                UserHabits.task_id == task_id
            ).values(streak=UserHabits.streak + 1))
            self.db.commit()
            return None
        
        elif habit.last_completed == date.today():
            return None
        
        self.db.execute(update(UserHabits).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id
        ).values(streak=1))
        
        self.db.commit()
        return None

    def get_uncompleted_habits(self) -> List[Tasks]:
        """Returns list of habits, that user hasn't completed today."""
        result = self.db.execute(select(UserHabits, Tasks).join(
            UserHabits,
            (UserHabits.task_id == Tasks.id) &
            (UserHabits.user_id == self.user.id) &
            (UserHabits.last_completed != date.today())
        )).all()
        user_habits = []

        for habit, task in result:
            user_habits.append({
                "id": task.id,
                "name": task.name,
                "description": task.description,
                "difficulty": task.difficulty,
                "xp": task.xp,
                "delayed_xp": task.delayed_xp,
                "streak": habit.streak
            })

        return user_habits
    
    def complete_habit(self, task_id: int) -> None:
        """Completes habit, updates streak and increases XP"""
        task = self.db.execute(select(Tasks).where(
            Tasks.id == task_id,
            Tasks.plan_id == self.user.current_plan.plan_id)).scalar_one_or_none()

        self._update_streak(task_id)

        self.db.execute(update(UserHabits).where(
            UserHabits.user_id == self.user.id,
            UserHabits.task_id == task_id
        ).values(last_completed=date.today()))
        
        change_xp(self.db, task.xp*2, self.user.current_plan.id)
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