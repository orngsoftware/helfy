from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from ...database import get_session
from ...models import Users
from ...dependecies import get_current_user
from typing import Annotated
from ...services.companions import CompanionService
from ...exceptions import DuplicateError
from sqlalchemy.orm import Session

router = APIRouter(prefix="/companion", tags=["companion"])

@router.get("/")
def get_companion(user: Annotated[Users, Depends(get_current_user)]):
    return {"ok": True, "companion": user.current_plan.companion}

@router.get("/accessories")
def get_accessories(db: Annotated[Session, Depends(get_session)], 
                    user: Annotated[Users, Depends(get_current_user)], 
                    inventory: bool | None = None):
    if inventory:
        accessories = user.current_plan.companion.accessories
    else:
        companion = CompanionService(db, user)
        accessories = companion.get_accessories()
    return {"ok": True, "accessories": accessories}

@router.post("/accessories/buy/{accessory_id}")
def buy_accessory(db: Annotated[Session, Depends(get_session)], 
                  user: Annotated[Users, Depends(get_current_user)], 
                  accessory_id: int):
    try:
        companion = CompanionService(db, user)
        companion.add_accessory(accessory_id)
    except ValueError:
        raise HTTPException(status=400, detail="Not enough Action XP")
    except DuplicateError:
        raise HTTPException(status_code=400, 
                            detail="User has purchased this accessory already")
    return {"ok": True}

@router.post("/change/{companion_type}")
def change_companion(db: Annotated[Session, Depends(get_session)], 
                          user: Annotated[Users, Depends(get_current_user)],
                          companion_type: str):
    companion = CompanionService(db, user)
    companion.change_companion_type(companion_type)
    return {"ok": True}

@router.patch("/accessories/toggle/{accessory_id}")
def toggle_visibility(db: Annotated[Session, Depends(get_session)], 
                      user: Annotated[Users, Depends(get_current_user)], 
                      accessory_id: int):
    service = CompanionService(db, user)
    service.update_accessory_visibility(accessory_id)
    return {"ok": True}
