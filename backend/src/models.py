from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import BYTEA
from datetime import date, datetime, timedelta
from typing import List

class UserTasks(Base):
    __tablename__="users_tasks"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), primary_key=True)
    completed: Mapped[bool]

    user: Mapped["Users"] = relationship(back_populates="completed_tasks")
    task: Mapped["Tasks"] = relationship()

class UserCompletedLearnings(Base):
    __tablename__ = "user_completed_learnings"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    learning_id: Mapped[int] = mapped_column(ForeignKey("learnings.id"), primary_key=True)

    user: Mapped["Users"] = relationship(back_populates="completed_learnings")
    learning: Mapped["Learnings"] = relationship()

class CompanionAccessories(Base):
    __tablename__ = "companion_accessories"
    companion_id: Mapped[int] = mapped_column(ForeignKey("companions.id"), primary_key=True)
    accessory_id: Mapped[int] = mapped_column(ForeignKey("accessories.id"), primary_key=True)
    shown: Mapped[bool]

    companion: Mapped["Companions"] = relationship(back_populates="accessories")
    accessory: Mapped["Accessories"] = relationship(back_populates="accessory_companions")

class Users(Base):
    __tablename__="users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    password: Mapped[bytes] = mapped_column(BYTEA)
    auth_provider: Mapped[str] = mapped_column(default="local", nullable=True)

    last_completed: Mapped[date] = mapped_column(nullable=True, default=date.today() - timedelta(days=1))
    last_streak_update: Mapped[date] = mapped_column(nullable=True, default=date.today() - timedelta(days=1))
    streak: Mapped[int] = mapped_column(nullable=True, default=0)

    completed_tasks: Mapped[List["UserTasks"]] = relationship(back_populates="user")
    completed_learnings: Mapped[List["UserCompletedLearnings"]] = relationship(back_populates="user")

    habits: Mapped[List["UserHabits"]] = relationship(back_populates="user")

    # user has many plans
    plans: Mapped[List["UserPlans"]] = relationship(back_populates="user", foreign_keys="UserPlans.user_id")
    
    # user has one current plan
    current_plan_id: Mapped[int] = mapped_column(
        ForeignKey("user_plans.id", use_alter=True),
        nullable=True
    )
    current_plan: Mapped["UserPlans"] = relationship(
        "UserPlans",
        foreign_keys=[current_plan_id],
        uselist=False,
        post_update=True
    )

class UserPlans(Base):
    __tablename__="user_plans"
    id: Mapped[int] = mapped_column(primary_key=True)
    xp: Mapped[int] = mapped_column(nullable=True, default=0)
    learning_xp: Mapped[int] = mapped_column(nullable=True, default=0)
    started: Mapped[date]

    # user has many plans
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["Users"] = relationship(back_populates="plans", foreign_keys=[user_id])

    companion: Mapped["Companions"] = relationship(back_populates="user_plan")    
    
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"))
    plan: Mapped["Plans"] = relationship(back_populates="user_plans")


class Plans(Base):
    __tablename__="plans"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    category: Mapped[str]
    description: Mapped[str]
    default_companion_type: Mapped[str]

    user_plans: Mapped[List["UserPlans"]] = relationship(back_populates="plan")
    accessories: Mapped[List["Accessories"]] = relationship(back_populates="plan")

class RefreshSessions(Base):
    __tablename__="refresh_sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    refresh_token: Mapped[str] = mapped_column(index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime]
    created_at: Mapped[datetime]

class UserHabits(Base):
    __tablename__="user_habits"
    id: Mapped[int] = mapped_column(primary_key=True)
    habit_created: Mapped[date]
    last_completed: Mapped[date] = mapped_column(nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["Users"] = relationship(back_populates="habits")

    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"))
    task: Mapped["Tasks"] = relationship()

class Tasks(Base):
    __tablename__="tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    day_create_habit: Mapped[int] = mapped_column(nullable=True) # automatic habit creation
    day: Mapped[int]
    difficulty: Mapped[int]
    xp: Mapped[int]
    delayed_xp: Mapped[int]
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"))

class Learnings(Base):
    __tablename__="learnings"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    tldr: Mapped[str]
    day: Mapped[int]
    body: Mapped[str]
    learning_xp: Mapped[int]
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"))

class Companions(Base):
    __tablename__="companions"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(default="My Helfy")
    stage: Mapped[int] = mapped_column(default=1)
    type: Mapped[str] = mapped_column(default="plant")

    accessories: Mapped[List["CompanionAccessories"]] = relationship(back_populates="companion")

    user_plan_id: Mapped[int] = mapped_column(ForeignKey("user_plans.id"))
    user_plan: Mapped["UserPlans"] = relationship(back_populates="companion")

class Accessories(Base):
    __tablename__="accessories"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    price: Mapped[int]
    level: Mapped[int] = mapped_column(nullable=True)

    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"))
    plan: Mapped["Plans"] = relationship(back_populates="accessories")

    accessory_companions: Mapped[List["CompanionAccessories"]] = relationship(back_populates="accessory")
