from sqlalchemy import text

from database import engine


with engine.begin() as connection:
    # Keep only the lowest id for each duplicate user/plan row.
    connection.execute(
        text(
            """
            DELETE FROM user_plan_progress a
            USING user_plan_progress b
            WHERE a.id > b.id
              AND a.user_key = b.user_key
              AND a.plan_slug = b.plan_slug;
            """
        )
    )

    # Keep only the lowest id for each duplicate user/plan/step row.
    connection.execute(
        text(
            """
            DELETE FROM user_step_progress a
            USING user_step_progress b
            WHERE a.id > b.id
              AND a.user_key = b.user_key
              AND a.plan_slug = b.plan_slug
              AND a.step_key = b.step_key;
            """
        )
    )

print("Duplicate progress rows cleaned up.")