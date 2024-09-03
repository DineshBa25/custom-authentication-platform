"""Add OTP fields with functions to User model

Revision ID: b92f6794e35b
Revises: 85693b31b1ed
Create Date: 2024-04-19 22:13:41.787111

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b92f6794e35b'
down_revision = '85693b31b1ed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('otp_expires_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('otp_expires_at')

    # ### end Alembic commands ###
