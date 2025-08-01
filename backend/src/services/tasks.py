from sqlalchemy.orm import Session
from sqlalchemy import select, update, Select, delete
from datetime import date
from typing import List
from ..exceptions import DuplicateError, TimeGapError
from ..models import Tasks, UserTasks, UserHabits, Users
from .users import change_xp, update_last_completed, increase_streak

def user_completed_tasks(user_id) -> Select:
    """Return Select with tasks which user has completed"""
    return select(
        UserTasks.task_id).where(
        UserTasks.user_id == user_id)

def get_uncompleted_tasks(db: Session, user_id: int, day: int) -> List[Tasks] | None:
    """Get a list of incompleted tasks for today"""
    tasks = db.execute(select(Tasks).where(
        Tasks.id.not_in(user_completed_tasks(user_id)),
        Tasks.day <= day
    )).scalars().all()
    if not tasks:
        return None
    result = []
    delayed = False
    for task in tasks:
        if task.day < day:
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

def get_uncompleted_habits(db: Session, user_id: int) -> List[Tasks]:
    """Get a list of incompleted habits for today"""
    user_habits = select(UserHabits.task_id).where(
        UserHabits.user_id == user_id,
        UserHabits.last_completed != date.today())
    habits = db.execute(select(Tasks).where(
        Tasks.id.in_(user_habits)
    )).scalars().all()
    return habits

def complete(db: Session, user: Users, user_day: int, task_id: int, completed: bool = True) -> None:
    """Completes and incompletes both habits and tasks"""
    task = db.execute(select(Tasks).where(Tasks.id == task_id)).scalar_one_or_none()
    xp = task.delayed_xp if task.day < user_day else task.xp
    change_xp_query = change_xp(xp, user.id) if completed else change_xp(task.xp, user.id, decrease=True)
    
    if task_id in [habit.id for habit in user.habits]:
        db.execute(update(UserHabits).where(
            UserHabits.user_id == user.id,
            UserHabits.task_id == task_id
        ).values(last_completed=date.today()))
        
        update_last_completed(db, user.id)
        increase_streak(db, user.id)
        db.execute(change_xp(xp*2, user.id))
        db.commit()
        return None

    if db.execute(select(UserTasks.task_id).where(UserTasks.user_id == user.id, 
                                                  UserTasks.task_id == task_id)).scalar_one_or_none():
        raise DuplicateError
    
    new_complete = UserTasks(
        user_id=user.id,
        task_id=task_id,
        completed=completed
    )
    update_last_completed(db, user.id)
    increase_streak(db, user.id)
    db.execute(change_xp_query)
    db.add(new_complete)
    db.commit()
    return None
    
def create_habit(db: Session, user_id: int, task_id: int) -> None:
    """Creates a new habit for the user"""
    if db.execute(select(UserHabits.task_id).where(UserHabits.user_id == user_id,
                                                   UserHabits.task_id == task_id)).scalar_one_or_none():
        raise DuplicateError
    new_habit = UserHabits(
        user_id=user_id,
        habit_created=date.today(),
        task_id=task_id
    )
    db.add(new_habit)
    db.commit()
    return None

def create_habits_auto(db: Session, user_id: int, day: int) -> None:
    """Creates a new habit for the user automatically based on the day"""
    user_habits = select(UserHabits.task_id).where(
        UserHabits.user_id == user_id)
    tasks = db.execute(select(Tasks).where(Tasks.day_create_habit == day, 
                                           Tasks.id.not_in(user_habits))).scalars().all()
    if tasks:
        for task in tasks:
            create_habit(db, user_id, task.id)
    return None

def remove_habit(db: Session, user_id: int, task_id: int) -> None:
    """Deletes habit from user_habits table"""
    created_at = db.execute(select(UserHabits.habit_created).where(
        UserHabits.task_id == task_id,
        UserHabits.user_id == user_id
    )).scalar_one_or_none()

    dif = date.today() - created_at
    if dif.days < 7:
        raise TimeGapError
    
    db.execute(delete(UserHabits).where(
        UserHabits.user_id == user_id,
        UserHabits.task_id == task_id))
    db.commit()
    return None