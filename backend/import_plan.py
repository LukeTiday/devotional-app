import os
import re

from database import SessionLocal
from models import Plan, PlanDay, PlanStep

PLANS_DIR = "../plans"


def parse_frontmatter(text: str):
    match = re.match(r"---\n(.*?)\n---\n(.*)", text, re.DOTALL)

    if not match:
        raise Exception("Invalid frontmatter")

    frontmatter_text = match.group(1)
    content = match.group(2)

    metadata = {}

    for line in frontmatter_text.splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            metadata[key.strip()] = value.strip() or None

    return metadata, content


def parse_steps(day_content: str):
    pattern = r"::(\w+)\n(.*?)\n::"
    matches = re.findall(pattern, day_content, re.DOTALL)

    steps = []

    for index, (step_type, content) in enumerate(matches, start=1):
        content = content.strip()

        step = {
            "step_order": index,
            "step_type": step_type,
            "content_markdown": None,
            "scripture_reference": None,
        }

        if step_type == "scripture":
            step["scripture_reference"] = content
        else:
            step["content_markdown"] = content

        steps.append(step)

    return steps


def parse_days(content: str):
    day_pattern = r"# Day (\d+): (.*?)\n(.*?)(?=# Day|\Z)"

    matches = re.findall(day_pattern, content, re.DOTALL)

    days = []

    for day_number, title, day_content in matches:
        days.append(
            {
                "day_number": int(day_number),
                "title": title.strip(),
                "steps": parse_steps(day_content),
            }
        )

    return days


def import_plan(filepath: str):
    with open(filepath, "r", encoding="utf-8") as file:
        text = file.read()

    metadata, content = parse_frontmatter(text)

    db = SessionLocal()

    existing_plan = (
        db.query(Plan)
        .filter(Plan.slug == metadata["slug"])
        .first()
    )

    if existing_plan:
        db.delete(existing_plan)
        db.commit()

    plan = Plan(
        title=metadata["title"],
        slug=metadata["slug"],
        description=metadata["description"],
        image_url=metadata.get("image_url"),
    )

    db.add(plan)
    db.commit()
    db.refresh(plan)

    days = parse_days(content)

    for day_data in days:
        day = PlanDay(
            plan_id=plan.id,
            day_number=day_data["day_number"],
            title=day_data["title"],
        )

        db.add(day)
        db.commit()
        db.refresh(day)

        for step_data in day_data["steps"]:
            step = PlanStep(
                day_id=day.id,
                step_order=step_data["step_order"],
                step_type=step_data["step_type"],
                content_markdown=step_data["content_markdown"],
                scripture_reference=step_data["scripture_reference"],
            )

            db.add(step)

        db.commit()

    db.close()

    print(f"Imported: {metadata['title']}")


if __name__ == "__main__":
    for filename in os.listdir(PLANS_DIR):
        if filename.endswith(".md"):
            import_plan(os.path.join(PLANS_DIR, filename))