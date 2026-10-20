"""Improve Himalayas option labels

Revision ID: 1a812a9f646c
Revises: ff008266d2b5
Create Date: 2026-10-20 12:13:52.473858

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "1a812a9f646c"
down_revision: Union[str, Sequence[str], None] = "ff008266d2b5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    connection = op.get_bind()

    job_api_params = sa.table(
        "job_api_params",
        sa.column("source", sa.String()),
        sa.column("param_name", sa.String()),
        sa.column("accepted_values", sa.JSON()),
    )

    connection.execute(
        sa.update(job_api_params)
        .where(
            job_api_params.c.source == "himalayas",
            job_api_params.c.param_name == "sort",
        )
        .values(
            accepted_values={
                "Relevance": "relevant",
                "Most Recent": "recent",
                "Salary: Low to High": "salaryAsc",
                "Salary: High to Low": "salaryDesc",
                "Name (A-Z)": "nameAToZ",
                "Name (Z-A)": "nameZToA",
                "Number of Open Jobs": "jobs",
            }
        )
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
