from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Plan

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/plans")
def list_plans(db: Session = Depends(get_db)):
    return db.query(Plan).all()


@router.get("/plans/{slug}")
def get_plan(slug: str, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.slug == slug).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    return {
        "id": plan.id,
        "title": plan.title,
        "slug": plan.slug,
        "description": plan.description,
        "image_url": plan.image_url,
        "days": [
            {
                "id": day.id,
                "day_number": day.day_number,
                "title": day.title,
                "steps": [
                    {
                        "id": step.id,
                        "step_order": step.step_order,
                        "step_type": step.step_type,
                        "content_markdown": step.content_markdown,
                        "scripture_reference": step.scripture_reference,
                    }
                    for step in sorted(day.steps, key=lambda s: s.step_order)
                ],
            }
            for day in sorted(plan.days, key=lambda d: d.day_number)
        ],
    }