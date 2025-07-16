from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID, CIDR
import uuid
from datetime import date, datetime
from typing import List

class Users(Base):
    __tablename__="users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    password: Mapped[str]
    started: Mapped[date]
    last_completed: Mapped[date] = mapped_column(nullable=True)
    last_streak_update: Mapped[date] = mapped_column(nullable=True)
    streak: Mapped[int] = mapped_column(nullable=True)
    xp: Mapped[int] = mapped_column(nullable=True)
    learning_xp: Mapped[int] = mapped_column(nullable=True)

    tasks_completed: Mapped[List["Tasks"]] = relationship()
    learnings_completed: Mapped[List["Learnings"]] = relationship()
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

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["Users"] = relationship(back_populates="habits")

    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"))
    task: Mapped["Tasks"] = relationship()

class Tasks(Base):
    __tablename__="tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    habit: Mapped[bool] # this is used for automatic habit creation
    day_create_habit: Mapped[int] = mapped_column(nullable=True) # this as well
    difficulty: Mapped[int]
    xp: Mapped[int]

class Learnings(Base):
    __tablename__="learnings"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    tldr: Mapped[str]
    body: Mapped[str]
    learning_xp: Mapped[int]

class Companions(Base):
    __tablename__="companions"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(default="My Helfy")
    stage: Mapped[int]
    type: Mapped[str] = mapped_column(default="plant")
    pot: Mapped[str] = mapped_column(default="classic")

    accessories: Mapped["Accessories"] = relationship()

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["Users"] = relationship(back_populates="companion")

class Accessories(Base):
    __tablename__="accessories"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    price: Mapped[int]