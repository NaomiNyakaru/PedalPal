"""added 2 columns to payment module

Revision ID: 7a751aa06c61
Revises: 5b8fe50b3760
Create Date: 2024-11-22 12:40:15.161550

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a751aa06c61'
down_revision = '5b8fe50b3760'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reference_code', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('payment_status', sa.String(length=20), nullable=True))
        batch_op.create_unique_constraint(None, ['reference_code'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('payment_status')
        batch_op.drop_column('reference_code')

    # ### end Alembic commands ###
