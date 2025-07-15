from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from datetime import date
from typing import List

class Users(Base):
    __tablename__="users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    password: Mapped[str]
    started: Mapped[date]
    last_completed: Mapped[date]
    last_streak_update: Mapped[date]
    streak: Mapped[int]
    xp: Mapped[int]
    learning_xp: Mapped[int]

    tasks_completed: Mapped[List["Tasks"]] = relationship()
    learnings_completed: Mapped[List["Learnings"]] = relationship()
    habits: Mapped[List["UserHabits"]] = relationship(back_populates="user")
    companion: Mapped["Companions"] = relationship(back_populates="user")

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
    habit: Mapped[bool]
    day_create_habit: Mapped[int] = mapped_column(nullable=True)
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