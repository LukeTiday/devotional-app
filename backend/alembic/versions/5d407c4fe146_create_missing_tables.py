"""Create missing tables

Revision ID: 5d407c4fe146
Revises: 330d5ab17eef
Create Date: 2026-06-04 16:32:03.336123

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5d407c4fe146'
down_revision: Union[str, Sequence[str], None] = '330d5ab17eef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from models import Base

    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    pass
