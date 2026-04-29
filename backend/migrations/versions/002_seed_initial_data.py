"""seed initial data

Revision ID: 002
Revises: 001
Create Date: 2026-04-28

"""
import datetime

import sqlalchemy as sa
from alembic import op

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None

real_estates = sa.table(
    "real_estates",
    sa.column("title", sa.String),
    sa.column("description", sa.String),
    sa.column("type", sa.String),
    sa.column("price", sa.Numeric),
    sa.column("rooms", sa.Integer),
    sa.column("restroom", sa.Integer),
    sa.column("area_m2", sa.Numeric),
    sa.column("location", sa.String),
    sa.column("image_url", sa.String),
    sa.column("published_date", sa.Date),
)

today = datetime.date.today()


def _rows():
    return [
        {
            "title": "Casa familiar en zona 10",
            "description": "Ideal para familia, cerca de comercios",
            "type": "casa",
            "price": 220000.00,
            "rooms": 3,
            "restroom": 2,
            "area_m2": 160.00,
            "location": "Zona 10",
            "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            "published_date": today - datetime.timedelta(days=10),
        },
        {
            "title": "Casa moderna en zona 10",
            "description": "Diseño contemporáneo con jardín",
            "type": "casa",
            "price": 280000.00,
            "rooms": 3,
            "restroom": 3,
            "area_m2": 190.00,
            "location": "Zona 10",
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "published_date": today - datetime.timedelta(days=5),
        },
        {
            "title": "Apartamento económico",
            "description": "Perfecto para inversión",
            "type": "departamento",
            "price": 120000.00,
            "rooms": 2,
            "restroom": 1,
            "area_m2": 80.00,
            "location": "Zona 12",
            "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "published_date": today - datetime.timedelta(days=20),
        },
        {
            "title": "Departamento compacto",
            "description": "Ubicación céntrica",
            "type": "departamento",
            "price": 140000.00,
            "rooms": 1,
            "restroom": 1,
            "area_m2": 60.00,
            "location": "Zona 9",
            "image_url": "https://images.unsplash.com/photo-1494526585095-c41746248156",
            "published_date": today - datetime.timedelta(days=15),
        },
        {
            "title": "Casa amplia con jardín",
            "description": "Gran espacio para familia grande",
            "type": "casa",
            "price": 350000.00,
            "rooms": 4,
            "restroom": 3,
            "area_m2": 200.00,
            "location": "Zona 16",
            "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
            "published_date": today - datetime.timedelta(days=25),
        },
        {
            "title": "Residencia de lujo",
            "description": "Amplios espacios y acabados premium",
            "type": "casa",
            "price": 500000.00,
            "rooms": 5,
            "restroom": 4,
            "area_m2": 400.00,
            "location": "Zona 14",
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "published_date": today - datetime.timedelta(days=3),
        },
        {
            "title": "Casa reciente en zona 15",
            "description": "Nueva en el mercado",
            "type": "casa",
            "price": 300000.00,
            "rooms": 3,
            "restroom": 2,
            "area_m2": 170.00,
            "location": "Zona 15",
            "image_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
            "published_date": today - datetime.timedelta(days=7),
        },
        {
            "title": "Terreno económico",
            "description": "Ideal para construir vivienda",
            "type": "terreno",
            "price": 60000.00,
            "rooms": 0,
            "restroom": 0,
            "area_m2": 300.00,
            "location": "Villa Nueva",
            "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
            "published_date": today - datetime.timedelta(days=12),
        },
        {
            "title": "Terreno en venta accesible",
            "description": "Zona tranquila",
            "type": "terreno",
            "price": 90000.00,
            "rooms": 0,
            "restroom": 0,
            "area_m2": 450.00,
            "location": "Mixco",
            "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
            "published_date": today - datetime.timedelta(days=18),
        },
        {
            "title": "Apartamento en zona 15",
            "description": "Excelente ubicación",
            "type": "departamento",
            "price": 200000.00,
            "rooms": 2,
            "restroom": 2,
            "area_m2": 110.00,
            "location": "Zona 15",
            "image_url": "https://images.unsplash.com/photo-1484154218962-a197022b5858",
            "published_date": today - datetime.timedelta(days=8),
        },
        {
            "title": "Departamento moderno zona 15",
            "description": "Cerca de áreas comerciales",
            "type": "departamento",
            "price": 230000.00,
            "rooms": 2,
            "restroom": 2,
            "area_m2": 120.00,
            "location": "Zona 15",
            "image_url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
            "published_date": today - datetime.timedelta(days=2),
        },
    ]


_SEED_TITLES = [
    "Casa familiar en zona 10",
    "Casa moderna en zona 10",
    "Apartamento económico",
    "Departamento compacto",
    "Casa amplia con jardín",
    "Residencia de lujo",
    "Casa reciente en zona 15",
    "Terreno económico",
    "Terreno en venta accesible",
    "Apartamento en zona 15",
    "Departamento moderno zona 15",
]


def upgrade() -> None:
    op.bulk_insert(real_estates, _rows())


def downgrade() -> None:
    placeholders = ", ".join(f"'{t}'" for t in _SEED_TITLES)
    op.execute(f"DELETE FROM real_estates WHERE title IN ({placeholders})")
