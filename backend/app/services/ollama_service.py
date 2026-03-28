import requests
from core.config import settings

MODEL_NAME = "llama3"

DATABASE_ENGINE = "MYSQL"

SYSTEM_PROMPT = """
You are an expert SQL generator.

Generate ONLY safe SELECT SQL queries for MYSQL

Table: real_estates

Allowed columns:
id, title, description, type, price, rooms, restroom, area_m2, location, published_date

Rules:
- ONLY SELECT statements
- NEVER INSERT, UPDATE, DELETE, DROP
- Return ONLY SQL
"""


def generate_sql(natural_query: str) -> str:
    response = requests.post(
        settings.ollama_api,
        json={
            "model": MODEL_NAME,
            "prompt": f"{SYSTEM_PROMPT}\n User Query: {natural_query}",
            "stream": False,
        },
    )

    response.raise_for_status()

    return response.json()["response"].strip()
