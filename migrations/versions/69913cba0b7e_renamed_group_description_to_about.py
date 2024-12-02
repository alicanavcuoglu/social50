"""renamed group description to about

Revision ID: 69913cba0b7e
Revises: 22ce66c82cb5
Create Date: 2024-11-21 14:09:35.269347

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '69913cba0b7e'
down_revision = '22ce66c82cb5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('group', schema=None) as batch_op:
        batch_op.add_column(sa.Column('about', sa.Text(), nullable=False))
        batch_op.drop_column('description')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('group', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.TEXT(), autoincrement=False, nullable=False))
        batch_op.drop_column('about')

    # ### end Alembic commands ###
