"""added phone number column to payment model

Revision ID: 5b8fe50b3760
Revises: ce230403318c
Create Date: 2024-11-22 12:19:51.543422

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5b8fe50b3760'
down_revision = 'ce230403318c'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('payments', 
                  sa.Column('phone_number', 
                           sa.String(15), 
                           nullable=False, 
                           server_default='default_number'))

def downgrade():
    op.drop_column('payments', 'phone_number')
