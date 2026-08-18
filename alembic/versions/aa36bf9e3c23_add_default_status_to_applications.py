"""add default status to applications

Revision ID: aa36bf9e3c23
Revises: 035cb6fd05c2
Create Date: 2026-08-17 15:56:16.836617

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "aa36bf9e3c23"
down_revision: Union[str, Sequence[str], None] = "035cb6fd05c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "applications",
        "status",
        server_default="pending",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        "applications",
        "status",
        server_default=None,
    )
