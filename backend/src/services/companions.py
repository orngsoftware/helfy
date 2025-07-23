from math import floor
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update
from ..models import Companions, Users, Accessories, companion_accessories
from ..exceptions import DuplicateError

def get_companion(user: Users) -> dict | None:
    """Returns a user companion with accessories he has"""
    companion = user.companion
    if not companion:
        return None
    return {
        "id": companion.id,
        "name": companion.name,
        "stage": companion.stage,
        "type": companion.type,
        "accessory_ids": [a.id for a in companion.accessories]
    }

def create_default_companion(db: Session, user_id: int) -> None:
    """Create new default companion for the user"""
    result = db.execute(select(Companions.id).where(
        Companions.user_id == user_id)).scalar_one_or_none()
    if result:
        raise DuplicateError
    companion = Companions(user_id=user_id)
    db.add(companion)
    db.commit()
    return None

def get_accessories(db: Session, user: Users):
    """Returns all accessories the user hasn't purchased"""
    accessory_ids = [a.id for a in user.companion.accessories]
    accessories = db.execute(select(Accessories).where(
        Accessories.id.not_in(accessory_ids))).scalars().all()

    return accessories

def add_accessory(db: Session, user: Users, accessory_id: int) -> None:
    """Adds new accessory to the user companion and subtracts relevant XP from the user"""
    if accessory_id in [a.id for a in user.companion.accessories]:
        raise DuplicateError
    
    accessory = db.execute(select(Accessories).where(
        Accessories.id == accessory_id)).scalar_one_or_none()
    
    if accessory.price > user.xp:
        raise ValueError

    db.execute(insert(companion_accessories).values(
        companion_id=user.companion.id,
        accessories_id=accessory_id
    ))
    db.commit()
    db.execute(update(Users).where(Users.id == user.id).values(
        xp=Users.xp - accessory.price
    ))

    return None

def change_companion_type(db: Session, new_type: str, user_id: int) -> None:
    db.execute(update(Companions).where(Companions.user_id == user_id).values(
        type=new_type
    ))
    db.commit()
    return None

def change_companion_name(db: Session, new_name, user_id: int) -> None:
    db.execute(update(Companions).where(Companions.user_id == user_id).values(
        name=new_name
    ))
    db.commit()
    return None

def update_stage(db: Session, user: Users):
    new_stage = floor(user.learning_xp / 10)
    if user.companion.stage == new_stage:
        return None
    db.execute(update(Companions).where(Companions.user_id == user.id).values(
        stage=new_stage
    ))
    db.commit()
    return None