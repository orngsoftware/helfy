from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, not_
from ..models import Companions, Users, UserPlans, Accessories, CompanionAccessories
from ..exceptions import DuplicateError
from ..config import get_settings

class CompanionService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user

    def create_default_companion(self) -> None:
        """Create new default companion for the user"""
        if self.db.execute(select(Companions.id).where(
            Companions.user_plan_id == self.user.current_plan.id)).scalar_one_or_none():
            raise DuplicateError("User can't have more than one companion")
        
        src_url = f"https://helfy.space/s3/base_{self.user.current_plan.plan.base_companion}.png"

        companion = Companions(
            user_plan_id=self.user.current_plan.id,
            url=src_url
        )
        self.db.add(companion)
        self.db.commit()
        return None

    def get_accessories(self) -> list[Accessories]:
        """Returns all accessories the user hasn't purchased"""
        accessories = self.db.execute(select(Accessories).where(
            Accessories.id.not_in(
                [a.accessory_id for a in self.user.current_plan.companion.accessories]
            ),
            Accessories.plan_id == self.user.current_plan.plan_id
            )).scalars().all()
        return accessories

    def get_inventory(self) -> list[Accessories]:
        result = self.db.execute(select(Accessories, CompanionAccessories).join(
            CompanionAccessories,
            (CompanionAccessories.accessory_id == Accessories.id) & 
            (CompanionAccessories.companion_id == self.user.current_plan.companion.id)
        )).all()

        accessories = []

        for acc, acc_comp in result:
            accessories.append({
                "accessory_id": acc_comp.accessory_id,
                "name": acc.name,
                "level": acc.level,
                "url": acc.url,
                "shown": bool(acc_comp.shown)
            })

        return accessories

    def add_accessory(self, accessory_id: int) -> None:
        """Adds new accessory to the user companion and subtracts relevant XP from the user"""
        if accessory_id in [a.accessory_id for a in self.user.current_plan.companion.accessories]:
            raise DuplicateError("Same accessory can't be added twice")
        
        accessory = self.db.execute(select(Accessories).where(
            Accessories.id == accessory_id)).scalar_one_or_none()
        
        if accessory.price > self.user.current_plan.xp:
            raise ValueError("Not enough XP to buy the accessory")

        self.db.execute(insert(CompanionAccessories).values(
            companion_id=self.user.current_plan.companion.id,
            accessory_id=accessory.id,
            shown=True
        ))
        self.db.execute(update(UserPlans).where(
            UserPlans.id == self.user.current_plan_id).values(
            xp=UserPlans.xp - accessory.price
        ))
        self.db.commit()
        return None

    def update_accessory_visibility(self, accessory_id: int) -> None:
        self.db.execute(update(CompanionAccessories).where(
            CompanionAccessories.companion_id == self.user.current_plan.companion.id,
            CompanionAccessories.accessory_id == accessory_id
        ).values(shown=not_(CompanionAccessories.shown)))

        self.db.commit()
        return None