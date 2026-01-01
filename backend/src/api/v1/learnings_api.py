from fastapi import APIRouter, Depends
from fastapi import HTTPException
from ...database import get_session
from ...dependecies import get_current_user
from ...services.users import days
from typing import Annotated
from ...services.learnings import LearnService
from ...exceptions import DuplicateError
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from ...models import Users

router = APIRouter(prefix="/learning", tags=["learning"])

@router.get("/")
def get_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)]):
    service = LearnService(db, user)
    user_day = days(user.current_plan.started)
    learning = service.get_learning_by_day(user_day)
    if not learning:
        raise HTTPException(status_code=404, detail="No learning for this day")
    result = {"ok": True, 
              "learning": learning[0], 
              "completed": learning[1],
              "saved": learning[2],
              "max_text_pos": learning[3]
              }
    return result

@router.post("/saved/new/{learning_id}")
def learning_save(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              learning_id: int):
    try:
        service = LearnService(db, user)
        service.save_learning(learning_id)
    except DuplicateError:
        raise HTTPException(status_code=400, detail="Can't save one learning more than once")
    return {"ok": True}

@router.delete("/saved/unsave/{learning_id}")
def learning_unsave(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              learning_id: int):
    try:
        service = LearnService(db, user)
        service.unsave_learning(learning_id)
    except NoResultFound:
        raise HTTPException(status_code=400, detail="User has not saved learning with this learning_id")
    return {"ok": True}

@router.get("/saved")
def saved_learnings(db: Annotated[Session, Depends(get_session)],
                    user: Annotated[Users, Depends(get_current_user)]):
    service = LearnService(db, user)
    return {"ok": True, "saved_learnings": service.get_saved_learnings()}

@router.get("/{learning_id}/text/{text_position}")
def get_text(db: Annotated[Session, Depends(get_session)], 
             user: Annotated[Users, Depends(get_current_user)],
             learning_id: int, text_position: int):
    service = LearnService(db, user)
    text = service.get_text_by_position(text_position, learning_id)
    if not text:
        raise HTTPException(status_code=404, detail="No text was found")
    return {"ok": True, "text": text}


@router.post("/complete/{learning_id}")
def complete_learning(db: Annotated[Session, Depends(get_session)], 
              user: Annotated[Users, Depends(get_current_user)],
              learning_id: int):
    try:
        service = LearnService(db, user)
        service.learning_complete(learning_id)
    except DuplicateError:
        raise HTTPException(status_code=400, detail="Can't complete one learning more than once")
    return {"ok": True}

    