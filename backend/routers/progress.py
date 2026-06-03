from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Plan, UserPlanProgress, UserStepProgress

router = APIRouter(prefix="/progress", tags=["progress"])


class StepProgressUpdate(BaseModel):
    user_key: str
    plan_slug: str
    step_key: str
    is_complete: bool

class PlanProgressUpdate(BaseModel):
    user_key: str
    plan_slug: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def update_plan_completion_status(
    user_key: str,
    plan_slug: str,
    db: Session,
):
    plan = db.query(Plan).filter(Plan.slug == plan_slug).first()

    if not plan:
        return

    total_steps = sum(len(day.steps) for day in plan.days)

    completed_step_keys = (
        db.query(UserStepProgress.step_key)
        .filter(
            UserStepProgress.user_key == user_key,
            UserStepProgress.plan_slug == plan_slug,
            UserStepProgress.is_complete == True,
        )
        .distinct()
        .all()
    )

    completed_steps = len(completed_step_keys)

    plan_progress = (
        db.query(UserPlanProgress)
        .filter(
            UserPlanProgress.user_key == user_key,
            UserPlanProgress.plan_slug == plan_slug,
        )
        .first()
    )

    if not plan_progress:
        plan_progress = UserPlanProgress(
            user_key=user_key,
            plan_slug=plan_slug,
            is_active=True,
            is_complete=False,
        )
        db.add(plan_progress)

    if total_steps > 0 and completed_steps >= total_steps:
        plan_progress.is_complete = True
        plan_progress.is_active = False
    else:
        plan_progress.is_complete = False

    db.commit()

@router.get("/active/{user_key}")
def get_active_plans(user_key: str, db: Session = Depends(get_db)):
    active_plan_slugs = (
        db.query(UserPlanProgress.plan_slug)
        .filter(
            UserPlanProgress.user_key == user_key,
            UserPlanProgress.is_active == True,
        )
        .all()
    )

    slugs = [row[0] for row in active_plan_slugs]

    if not slugs:
        return []

    plans = db.query(Plan).filter(Plan.slug.in_(slugs)).all()

    return plans

@router.post("/start")
def start_plan(
    update: PlanProgressUpdate,
    db: Session = Depends(get_db),
):
    progress = (
        db.query(UserPlanProgress)
        .filter(
            UserPlanProgress.user_key == update.user_key,
            UserPlanProgress.plan_slug == update.plan_slug,
        )
        .first()
    )

    if progress:
        progress.is_active = True
        progress.is_complete = False
    else:
        progress = UserPlanProgress(
            user_key=update.user_key,
            plan_slug=update.plan_slug,
            is_active=True,
            is_complete=False,
        )
        db.add(progress)

    db.commit()

    return {"status": "ok"}

@router.post("/deactivate")
def deactivate_plan(
    update: PlanProgressUpdate,
    db: Session = Depends(get_db),
):
    progress = (
        db.query(UserPlanProgress)
        .filter(
            UserPlanProgress.user_key == update.user_key,
            UserPlanProgress.plan_slug == update.plan_slug,
        )
        .first()
    )

    if progress:
        progress.is_active = False
        db.commit()

    return {"status": "ok"}

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

    plan_progress = (
        db.query(UserPlanProgress)
        .filter(
            UserPlanProgress.user_key == user_key,
            UserPlanProgress.plan_slug == plan_slug,
        )
        .first()
    )

    return {
        "user_key": user_key,
        "plan_slug": plan_slug,
        "is_active": plan_progress.is_active if plan_progress else False,
        "is_complete": plan_progress.is_complete if plan_progress else False,
        "completed_steps": [step.step_key for step in completed_steps],
    }


@router.post("/step")
def update_step_progress(
    update: StepProgressUpdate,
    db: Session = Depends(get_db),
):
    matching_progress_rows = (
        db.query(UserStepProgress)
        .filter(
            UserStepProgress.user_key == update.user_key,
            UserStepProgress.plan_slug == update.plan_slug,
            UserStepProgress.step_key == update.step_key,
        )
        .all()
    )

    if matching_progress_rows:
        primary_progress = matching_progress_rows[0]
        primary_progress.is_complete = update.is_complete

        # Remove duplicate rows for the same user / plan / step.
        for duplicate_progress in matching_progress_rows[1:]:
            db.delete(duplicate_progress)
    else:
        progress = UserStepProgress(
            user_key=update.user_key,
            plan_slug=update.plan_slug,
            step_key=update.step_key,
            is_complete=update.is_complete,
        )
        db.add(progress)

    db.commit()

    update_plan_completion_status(
        user_key=update.user_key,
        plan_slug=update.plan_slug,
        db=db,
    )

    return {"status": "ok"}

@router.delete("/{user_key}/{plan_slug}")
def clear_progress(user_key: str, plan_slug: str, db: Session = Depends(get_db)):
    db.query(UserStepProgress).filter(
        UserStepProgress.user_key == user_key,
        UserStepProgress.plan_slug == plan_slug,
    ).delete()

    plan_progress = (
        db.query(UserPlanProgress)
        .filter(
            UserPlanProgress.user_key == user_key,
            UserPlanProgress.plan_slug == plan_slug,
        )
        .first()
    )

    if plan_progress:
        plan_progress.is_complete = False

    db.commit()

    return {"status": "ok"}

