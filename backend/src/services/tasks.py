from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models import Tasks, UserTasks

def get_uncompleted(db: Session, user_id: int, day: int):
    completed_tasks_subq = select(
        UserTasks.task_id).where(
        UserTasks.user_id == user_id)
    tasks = db.execute(select(Tasks).where(
        Tasks.id.not_in(completed_tasks_subq),
        Tasks.day <= day
    )).scalars().all()

    return tasks

def create_habit():
    # just add new habit in UserHabits
    pass

def create_habits_auto():
    # looks for tasks with "day_create_habit" that equals to the day and create_habit()
    pass