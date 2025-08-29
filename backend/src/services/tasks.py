from sqlalchemy.orm import Session
from sqlalchemy import select, Select
from typing import List
from ..exceptions import DuplicateError
from ..models import Tasks, UserTasks, UserHabits, Users
from .users import change_xp, update_last_completed, increase_streak

class TaskService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user
    
    def _get_completed_tasks(self) -> Select:
        return select(UserTasks.task_id).where(
            UserTasks.user_id == self.user.id
        )

    def get_uncompleted_tasks(self, user_day: int) -> list[dict]:
        """Get tasks relevant to the day, that user hasn't completed"""
        tasks = self.db.execute(select(Tasks).where(
            Tasks.id.not_in(self._get_completed_tasks()),
            Tasks.id.not_in(select(UserHabits.task_id).where(
                UserHabits.user_id == self.user.id)),
            Tasks.day <= user_day
        )).scalars().all()
        if not tasks:
            return []
        result = []
        for task in tasks:
            delayed = False
            if task.day < user_day:
                delayed = True
            result.append(
                {
                    "id": task.id,
                    "name": task.name,
                    "description": task.description,
                    "difficulty": task.difficulty,
                    "xp": task.xp,
                    "delayed_xp": task.delayed_xp,
                    "delayed": delayed
                }
            )
        return result
    
    def complete_task(self, task_id: int, user_day: int) -> None:
        """Completes task, updates streak and increases XP"""
        if task_id in self.db.execute(select(UserTasks.task_id).where(UserTasks.user_id == self.user.id, 
                                    UserTasks.task_id == task_id)).scalars().all():
            raise DuplicateError("User has completed this task already")
        
        task = self.db.execute(select(Tasks).where(
            Tasks.id == task_id)).scalar_one_or_none()
        
        new_complete = UserTasks(
            user_id=self.user.id,
            task_id=task_id,
            completed=True
        )
        update_last_completed(self.db, self.user.id)
        increase_streak(self.db, self.user.id)
        self.db.add(new_complete)
        if task.day < user_day:
            self.db.execute(change_xp(task.delayed_xp, self.user.id))
        else:
            self.db.execute(change_xp(task.xp, self.user.id))
        self.db.commit()
        return None
    
    def incomplete_task(self, task_id: int) -> None:
        """Marks task as incomplete and decreases XP"""
        if task_id in [task.id for task in self.user.completed_tasks]:
            raise DuplicateError("User has completed this task already")
        task = self.db.execute(select(Tasks).where(
            Tasks.id == task_id)).scalar_one_or_none()
        
        new_incomplete = UserTasks(
            user_id=self.user.id,
            task_id=task_id,
            completed=False
        )
        self.db.add(new_incomplete)
        self.db.execute(change_xp(task.xp, self.user.id, decrease=True))
        self.db.commit()
        return None