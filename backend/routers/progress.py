from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import UserStepProgress

router = APIRouter(prefix="/progress", tags=["progress"])


class StepProgressUpdate(BaseModel):
    user_key: str
    plan_slug: str
    step_key: str
    is_complete: bool


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{user_key}/{plan_slug}")
def get_progress(user_key: str, plan_slug: str, db: Session = Depends(get_db)):
    completed_steps = (
        db.query(UserStepProgress)
        .filter(
            UserStepProgress.user_key == user_key,
            UserStepProgress.plan_slug == plan_slug,
            UserStepProgress.is_complete == True,
        )
        .all()
    )

    return {
        "user_key": user_key,
        "plan_slug": plan_slug,
        "completed_steps": [step.step_key for step in completed_steps],
    }


@router.post("/step")
def update_step_progress(
    update: StepProgressUpdate,
    db: Session = Depends(get_db),
):
    progress = (
        db.query(UserStepProgress)
        .filter(
            UserStepProgress.user_key == update.user_key,
            UserStepProgress.plan_slug == update.plan_slug,
            UserStepProgress.step_key == update.step_key,
        )
        .first()
    )

    if progress:
        progress.is_complete = update.is_complete
    else:
        progress = UserStepProgress(
            user_key=update.user_key,
            plan_slug=update.plan_slug,
            step_key=update.step_key,
            is_complete=update.is_complete,
        )
        db.add(progress)

    db.commit()

    return {"status": "ok"}

@router.delete("/{user_key}/{plan_slug}")
def clear_progress(user_key: str, plan_slug: str, db: Session = Depends(get_db)):
    db.query(UserStepProgress).filter(
        UserStepProgress.user_key == user_key,
        UserStepProgress.plan_slug == plan_slug,
    ).delete()

    db.commit()

    return {"status": "ok"}