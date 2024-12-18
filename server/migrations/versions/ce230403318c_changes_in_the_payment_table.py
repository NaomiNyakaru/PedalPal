"""changes in the payment table

Revision ID: ce230403318c
Revises: dbb018c36baa
Create Date: 2024-11-18 00:15:31.553955

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ce230403318c'
down_revision = 'dbb018c36baa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_constraint('payments_bike_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'bikes', ['bike_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('payments_bike_id_fkey', 'bikes', ['bike_id'], ['id'])

    # ### end Alembic commands ###
