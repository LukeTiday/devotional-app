from database import SessionLocal
from models import Plan, PlanDay, PlanStep

db = SessionLocal()

plan = db.query(Plan).filter(Plan.slug == "abide-in-christ").first()

if not plan:
    plan = Plan(
        title="Abide in Christ",
        slug="abide-in-christ",
        description="A simple devotional plan about remaining in Jesus.",
        image_url=None,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

existing_day = (
    db.query(PlanDay)
    .filter(PlanDay.plan_id == plan.id, PlanDay.day_number == 1)
    .first()
)

if not existing_day:
    day = PlanDay(
        plan_id=plan.id,
        day_number=1,
        title="The Vine",
    )
    db.add(day)
    db.commit()
    db.refresh(day)

    steps = [
        PlanStep(
            day_id=day.id,
            step_order=1,
            step_type="devotional",
            content_markdown="Jesus invites us to remain in Him, not as a vague idea, but as the source of our daily life.",
        ),
        PlanStep(
            day_id=day.id,
            step_order=2,
            step_type="scripture",
            scripture_reference="John 15:1-11",
        ),
        PlanStep(
            day_id=day.id,
            step_order=3,
            step_type="closer",
            content_markdown="Take a few quiet minutes to ask God to teach you what abiding looks like today.",
        ),
    ]

    db.add_all(steps)
    db.commit()

db.close()

print("Seed complete!")