from typing import Optional

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    days = relationship("PlanDay", back_populates="plan", cascade="all, delete")


class PlanDay(Base):
    __tablename__ = "plan_days"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"), nullable=False)
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)

    plan = relationship("Plan", back_populates="days")
    steps = relationship("PlanStep", back_populates="day", cascade="all, delete")


class PlanStep(Base):
    __tablename__ = "plan_steps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    day_id: Mapped[int] = mapped_column(ForeignKey("plan_days.id"), nullable=False)
    step_order: Mapped[int] = mapped_column(Integer, nullable=False)
    step_type: Mapped[str] = mapped_column(String(50), nullable=False)
    content_markdown: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    scripture_reference: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    day = relationship("PlanDay", back_populates="steps")

class UserPlanProgress(Base):
    __tablename__ = "user_plan_progress"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Temporary user key until real auth exists.
    # Later this will become user_id with a ForeignKey to users.id.
    user_key: Mapped[str] = mapped_column(String(100), nullable=False)

    plan_slug: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_complete: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class UserStepProgress(Base):
    __tablename__ = "user_step_progress"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Temporary user key until real auth exists.
    user_key: Mapped[str] = mapped_column(String(100), nullable=False)

    plan_slug: Mapped[str] = mapped_column(String(200), nullable=False)
    step_key: Mapped[str] = mapped_column(String(100), nullable=False)
    is_complete: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)