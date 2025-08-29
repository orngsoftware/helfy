from math import floor
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, not_
from ..models import Companions, Users, Accessories, CompanionAccessories
from ..exceptions import DuplicateError

class CompanionService:
    def __init__(self, db: Session, user: Users):
        self.db = db
        self.user = user
        self.accessory_ids = [a.accessory_id for a in self.user.companion.accessories]

    def create_default_companion(self) -> None:
        """Create new default companion for the user"""
        result = self.db.execute(select(Companions.id).where(
            Companions.user_id == self.user.id)).scalar_one_or_none()
        if result:
            raise DuplicateError("User can't have more than one companion")
        companion = Companions(user_id=self.user.id)
        self.db.add(companion)
        self.db.commit()
        return None

    def get_accessories(self) -> list[Accessories]:
        """Returns all accessories the user hasn't purchased"""
        accessories = self.db.execute(select(Accessories).where(
            Accessories.id.not_in(self.accessory_ids))).scalars().all()

        return accessories

    def add_accessory(self, accessory_id: int) -> None:
        """Adds new accessory to the user companion and subtracts relevant XP from the user"""
        if accessory_id in self.accessory_ids:
            raise DuplicateError("Same accessory can't be added twice")
        
        accessory = self.db.execute(select(Accessories).where(
            Accessories.id == accessory_id)).scalar_one_or_none()
        
        if accessory.price > self.user.xp:
            raise ValueError("Not enough XP to buy the accessory")

        self.db.execute(insert(CompanionAccessories).values(
            companion_id=self.user.companion.id,
            accessory_id=accessory.id,
            shown=True
        ))
        self.db.execute(update(Users).where(Users.id == self.user.id).values(
            xp=Users.xp - accessory.price
        ))
        self.db.commit()
        return None

    def update_accessory_visibility(self, accessory_id: int) -> None:
        self.db.execute(update(CompanionAccessories).where(
            CompanionAccessories.companion_id == self.user.companion.id,
            CompanionAccessories.accessory_id == accessory_id
        ).values(shown=not_(CompanionAccessories.shown)))

        self.db.commit()
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
        return None