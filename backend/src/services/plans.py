from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import date
from .users import update_current_plan
from ..exceptions import DuplicateError
from ..models import Users, UserPlans, Plans

class PlanService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user

    def create_user_plan(self, new_plan_id: int) -> None:
        """Creates new user plan in user_plans 
        and updates current user plan to the new plan"""
        
        if self.db.execute(select(UserPlans.id).where(
            UserPlans.plan_id == new_plan_id,
            UserPlans.user_id == self.user.id
        )).scalar_one_or_none():
            raise DuplicateError("Can't create same plan twice")
        new_user_plan = UserPlans(
            started=date.today(),
            plan_id=new_plan_id,
            user_id=self.user.id
        )
        self.db.add(new_user_plan)
        self.db.commit()
        update_current_plan(self.db, self.user.id, new_plan_id)
        return None
    
    def get_plans_w_status(self) -> list[dict]:
        """
        Returns list of Plans with additional fields:
        - current: bool
        - status: bool
        1. current refers to whether it is current plan of the user.
        2. status refers to whether user has started this plan or not.
        """
        plans = self.db.execute(select(Plans)).scalars().all()
        if not plans:
            return []
        if not self.user.current_plan_id: # user has just signed up
            return plans
        result = []
        user_plans_ids = [p.plan_id for p in self.user.plans]
        for plan in plans:
            status = False
            if plan.id in user_plans_ids:
                status = True
            result.append(
                {
                    "id": plan.id,
                    "name": plan.name,
                    "category": plan.category,
                    "description": plan.description,

                    "current": (True 
                                if plan.id == self.user.current_plan.plan_id 
                                else False),
                    "status": status
                }
            )
        return result

    
