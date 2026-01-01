from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, not_
from ..models import Companions, Users, UserPlans, Accessories, CompanionAccessories
from ..exceptions import DuplicateError
from ..config import get_settings

class CompanionService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user
<<<<<<< HEAD

    def create_default_companion(self) -> None:
        """Create new default companion for the user"""
        if self.db.execute(select(Companions.id).where(
            Companions.user_plan_id == self.user.current_plan.id)).scalar_one_or_none():
            raise DuplicateError("User can't have more than one companion")
        
        settings = get_settings()
        BUCKET_NAME = settings.aws_s3_bucket_name
        src_url = f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/base_{self.user.current_plan.plan.base_companion}.png"

        companion = Companions(
            user_plan_id=self.user.current_plan.id,
            url=src_url
        )
=======
        self.accessory_ids = [a.accessory_id for a in self.user.companion.accessories]

    def create_default_companion(self) -> None:
        """Create new default companion for the user"""
        result = self.db.execute(select(Companions.id).where(
            Companions.user_id == self.user.id)).scalar_one_or_none()
        if result:
            raise DuplicateError("User can't have more than one companion")
        companion = Companions(user_id=self.user.id)
>>>>>>> origin/main
        self.db.add(companion)
        self.db.commit()
        return None

    def get_accessories(self) -> list[Accessories]:
        """Returns all accessories the user hasn't purchased"""
        accessories = self.db.execute(select(Accessories).where(
<<<<<<< HEAD
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
=======
            Accessories.id.not_in(self.accessory_ids))).scalars().all()
>>>>>>> origin/main

        return accessories

    def add_accessory(self, accessory_id: int) -> None:
        """Adds new accessory to the user companion and subtracts relevant XP from the user"""
<<<<<<< HEAD
        if accessory_id in [a.accessory_id for a in self.user.current_plan.companion.accessories]:
=======
        if accessory_id in self.accessory_ids:
>>>>>>> origin/main
            raise DuplicateError("Same accessory can't be added twice")
        
        accessory = self.db.execute(select(Accessories).where(
            Accessories.id == accessory_id)).scalar_one_or_none()
        
<<<<<<< HEAD
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
=======
        if accessory.price > self.user.xp:
            raise ValueError("Not enough XP to buy the accessory")

        self.db.execute(insert(CompanionAccessories).values(
            companion_id=self.user.companion.id,
            accessory_id=accessory.id,
            shown=True
        ))
        self.db.execute(update(Users).where(Users.id == self.user.id).values(
            xp=Users.xp - accessory.price
>>>>>>> origin/main
        ))
        self.db.commit()
        return None

    def update_accessory_visibility(self, accessory_id: int) -> None:
        self.db.execute(update(CompanionAccessories).where(
<<<<<<< HEAD
            CompanionAccessories.companion_id == self.user.current_plan.companion.id,
=======
            CompanionAccessories.companion_id == self.user.companion.id,
>>>>>>> origin/main
            CompanionAccessories.accessory_id == accessory_id
        ).values(shown=not_(CompanionAccessories.shown)))

        self.db.commit()
<<<<<<< HEAD
=======
        return None
    
    def change_companion_type(self, new_type: str) -> None:
        self.db.execute(update(Companions).where(
            Companions.user_id == self.user.id).values(
                type=new_type
        ))
        self.db.commit()
        return None

    def update_stage(self):
        new_stage = floor(self.user.learning_xp / 10)
        if self.user.companion.stage == new_stage:
            return None
        self.db.execute(update(Companions).where(Companions.user_id == self.user.id).values(
            stage=new_stage
        ))
        self.db.commit()
>>>>>>> origin/main
        return None