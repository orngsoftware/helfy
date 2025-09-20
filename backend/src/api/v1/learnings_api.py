from fastapi import APIRouter, Depends
from fastapi import HTTPException
from ...database import get_session
from ...dependecies import get_current_user
from ...services.users import days
from typing import Annotated
from ...services.learnings import LearnService
from ...exceptions import DuplicateError
from sqlalchemy.orm import Session
from ...models import Users

router = APIRouter(prefix="/learning", tags=["learning"])

@router.get("/")
def get_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)], 
              short: bool | None = None):
    service = LearnService(db, user)
    user_day = days(user.current_plan.started)
    if short:
        learning = service.get_learning_short(user_day)
        result = {"ok": True, 
                  "learning": learning[0], 
                  "completed": learning[1]}
    else:
        learning = service.get_learning_day(user_day)
        result = {"ok": True, "learning": learning}
    if not learning:
        raise HTTPException(status_code=404, details="No learning for this day")
    return result

@router.post("/complete/{learning_id}")
def complete_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              learning_id: int):
    try:
        service = LearnService(db, user)
        service.learning_complete(learning_id)
        db.commit()
    except DuplicateError:
        raise HTTPException(status_code=400, detail="Can't complete one learning more than once")
    return {"ok": True}

    