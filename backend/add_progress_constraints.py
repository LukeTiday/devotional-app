from sqlalchemy import text

from database import engine


with engine.begin() as connection:
    connection.execute(
        text(
            """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'uq_user_plan_progress'
                ) THEN
                    ALTER TABLE user_plan_progress
                    ADD CONSTRAINT uq_user_plan_progress
                    UNIQUE (user_key, plan_slug);
                END IF;
            END $$;
            """
        )
    )

    connection.execute(
        text(
            """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'uq_user_step_progress'
                ) THEN
                    ALTER TABLE user_step_progress
                    ADD CONSTRAINT uq_user_step_progress
                    UNIQUE (user_key, plan_slug, step_key);
                END IF;
            END $$;
            """
        )
    )

print("Progress uniqueness constraints added.")