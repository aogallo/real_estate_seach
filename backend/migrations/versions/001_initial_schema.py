"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-04-28

"""
from alembic import op

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE real_estates (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            type VARCHAR(50) NOT NULL,
            price DECIMAL(12,2) NOT NULL,
            rooms INT NOT NULL,
            restroom INT NOT NULL,
            area_m2 DECIMAL(10,2),
            location VARCHAR(255),
            image_url VARCHAR(255),
            published_date DATE
        )
    """)


def downgrade() -> None:
    op.execute("DROP TABLE real_estates")
