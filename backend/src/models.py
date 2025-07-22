from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Table, Column
from sqlalchemy.dialects.postgresql import UUID, CIDR, BYTEA
import uuid
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

companion_accessories = Table(
    "companion_accessories",
    Base.metadata,
    Column("companion_id", ForeignKey("companions.id"), primary_key=True),
    Column("accessories_id", ForeignKey("accessories.id"), primary_key=True)
)

class Users(Base):
    __tablename__="users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    password: Mapped[bytes] = mapped_column(BYTEA)
    started: Mapped[date]
    last_completed: Mapped[date] = mapped_column(nullable=True, default=date.today() - timedelta(days = 1))
    last_streak_update: Mapped[date] = mapped_column(nullable=True, default=date.today() - timedelta(days = 1))
    streak: Mapped[int] = mapped_column(nullable=True, default=0)
    xp: Mapped[int] = mapped_column(nullable=True, default=0)
    learning_xp: Mapped[int] = mapped_column(nullable=True, default=0)

    completed_tasks: Mapped[List["UserTasks"]] = relationship(back_populates="user")
    completed_learnings: Mapped[List["UserCompletedLearnings"]] = relationship(back_populates="user")
    habits: Mapped[List["UserHabits"]] = relationship(back_populates="user")
    companion: Mapped["Companions"] = relationship(back_populates="user")

class RefreshSessions(Base):
    __tablename__="refresh_sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    refresh_token: Mapped[uuid.UUID] = mapped_column(UUID)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime]
    created_at: Mapped[datetime]
    ip_address: Mapped[str] = mapped_column(CIDR)

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

class Learnings(Base):
    __tablename__="learnings"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    tldr: Mapped[str]
    day: Mapped[int]
    body: Mapped[str]
    learning_xp: Mapped[int]

class Companions(Base):
    __tablename__="companions"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(default="My Helfy")
    stage: Mapped[int]
    type: Mapped[str] = mapped_column(default="plant")
    pot: Mapped[str] = mapped_column(default="classic")

    accessories: Mapped[List["Accessories"]] = relationship(secondary=companion_accessories)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["Users"] = relationship(back_populates="companion")

class Accessories(Base):
    __tablename__="accessories"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    price: Mapped[int]