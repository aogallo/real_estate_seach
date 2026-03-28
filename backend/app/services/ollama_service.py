import requests
from app.core.config import settings

MODEL_NAME = "phi3"

DATABASE_ENGINE = "MYSQL"

SYSTEM_PROMPT = """
You are an expert MySQL SQL generator.

Your task is to convert natural language into a SAFE SQL query.

DATABASE:
Table: real_estates

Allowed columns:
id, title, description, type, price, rooms, restroom, area_m2, location, published_date

STRICT RULES:
1. ONLY generate one SELECT statement
2. NEVER generate INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE
3. NEVER include markdown
4. NEVER include explanations
5. NEVER include comments
6. NEVER include text before or after the SQL
7. Response MUST start with SELECT
8. Response MUST end with semicolon
"""


def build_prompt(natural_query: str) -> str:
    prompt = f"""
    {SYSTEM_PROMPT}

    USER REQUEST:
    {natural_query}
    """

    return prompt


def generate_sql(natural_query: str) -> str:
    prompt = build_prompt(natural_query)
    response = requests.post(
        f"{settings.ollama_api}/api/generate",
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
        },
    )

    response.raise_for_status()

    return response.json()["response"].strip()
