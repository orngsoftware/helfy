from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from ...database import get_session
from ...models import Users
from ...dependecies import get_current_user
from typing import Annotated
from ...services.users import days
from ...services.tasks import TaskService
from ...services.habits import HabitService
from ...exceptions import DuplicateError, TimeGapError
from sqlalchemy.orm import Session

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/")
def get_tasks(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    service = TaskService(db, user)
    user_day = days(user.current_plan.started)
    return {"ok": True, "tasks": service.get_uncompleted_tasks(user_day)}

@router.get("/habits")
def get_habits(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    service = HabitService(db, user)
    service.create_habits_auto(days(user.current_plan.started))
    return {"ok": True, "habits": service.get_uncompleted_habits()}

@router.post("/habits/mark/{task_id}")
def mark_habit(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        service = HabitService(db, user)
        service.create_habit(task_id)
    except DuplicateError:
        raise HTTPException(status_code=400, detail="Can't mark one task as habit twice")
    return {"ok": True}

@router.post("/habits/unmark/{task_id}")
def unmark_habit(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        service = HabitService(db, user)
        service.remove_habit(task_id)
    except TimeGapError:
        raise HTTPException(status_code=400, detail="Can't unmark a habit that was created less than 7 days ago")
    return {"ok": True}

@router.post("/complete/{task_id}")
def complete_task_or_habit(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        if task_id in [habit.task_id for habit in user.habits]:
            service = HabitService(db, user)
            service.complete_habit(task_id)
        else:
            service = TaskService(db, user)
            service.complete_task(task_id, days(user.current_plan.started))
    except DuplicateError:
        raise HTTPException(status_code=400, detail="This task is already completed by the user")
    return {"ok": True}

@router.post("/incomplete/{task_id}")
def incomplete_task_or_habit(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              task_id: int):
    try:
        if task_id in [habit.task_id for habit in user.habits]:
            service = HabitService(db, user)
            service.incomplete_habit(task_id)
        else:
            service = TaskService(db, user)
            service.incomplete_task(task_id)
    except DuplicateError:
        raise HTTPException(status_code=400, detail="This task is already completed by the user")
    return {"ok": True}
