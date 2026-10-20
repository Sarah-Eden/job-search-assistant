"""Convert accepted values to new format

Revision ID: ff008266d2b5
Revises: e9113b4ab514
Create Date: 2026-10-20 10:26:13.419408

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "ff008266d2b5"
down_revision: Union[str, Sequence[str], None] = "e9113b4ab514"
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

    result = connection.execute(sa.select(job_api_params))

    for row in result:
        if not row.accepted_values is None:
            new_values = {value: value for value in row.accepted_values}
            stmt = (
                sa.update(job_api_params)
                .where(
                    job_api_params.c.source == row.source,
                    job_api_params.c.param_name == row.param_name,
                )
                .values(accepted_values=new_values)
            )
            connection.execute(stmt)


def downgrade() -> None:
    """Downgrade schema."""
    pass
