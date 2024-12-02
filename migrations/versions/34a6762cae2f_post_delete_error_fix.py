"""post delete error fix

Revision ID: 34a6762cae2f
Revises: 69913cba0b7e
Create Date: 2024-11-29 19:12:42.888803

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '34a6762cae2f'
down_revision = '69913cba0b7e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notification', schema=None) as batch_op:
        batch_op.drop_constraint('notification_post_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'post', ['post_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notification', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('notification_post_id_fkey', 'post', ['post_id'], ['id'])

    # ### end Alembic commands ###
