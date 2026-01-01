from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from ...exceptions import DuplicateError
from ...database import get_session
from ...models import Users
from ...dependecies import get_current_user
from typing import Annotated
from ...services.plans import PlanService
from ...services.companions import CompanionService
from ...services.users import update_current_plan, days, is_plus

router = APIRouter(prefix="/plans", tags=["plans"])

@router.get("/")
def get_plans(db: Annotated[Session, Depends(get_session)],
              user: Annotated[Users, Depends(get_current_user)]):
    service = PlanService(db, user)
    plans = service.get_plans_w_status()
    if not plans:
        raise HTTPException(status_code=404, detail="No plans were found") 
    return {"ok": True, "plans": plans}

@router.get("/current")
def get_current_plan(user: Annotated[Users, Depends(get_current_user)]):
    current_user_plan = {
        "name": user.current_plan.plan.name,
        "user_days": days(user.current_plan.started),
        "category": user.current_plan.plan.category
    }
    return {"ok": True, "current_plan": current_user_plan, "is_user_paid": is_plus(user)}

@router.post("/start/{plan_id}")
def start_plan(db: Annotated[Session, Depends(get_session)],
               user: Annotated[Users, Depends(get_current_user)],
               plan_id: int):
    try:
        if is_plus(user) or len(user.plans) == 0:
            plan_service = PlanService(db, user)
            plan_service.create_user_plan(plan_id)
            companion_service = CompanionService(db, user)
            companion_service.create_default_companion()
            msg = "Successfully started a new plan for the user"
        else:
            raise HTTPException(status_code=403, detail="User does not have rights to do it. Plan upgrade is required.")
    except DuplicateError:
        update_current_plan(db, user.id, plan_id)
        msg = "Couldn't start the same plan again. Switching instead"
    return {"ok": True, "msg": msg}


@router.patch("/switch/{plan_id}")
def switch_plan(db: Annotated[Session, Depends(get_session)],
                user: Annotated[Users, Depends(get_current_user)],
                plan_id: int):
    update_current_plan(db, user.id, plan_id)
    return {"ok": True, "msg": f"Switched to {user.current_plan.plan.name}"}

