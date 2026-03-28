import json
import requests
from app.core.config import settings
from app.utils.user_query import normalize_user_query

MODEL_NAME = "phi3"

DATABASE_ENGINE = "MYSQL"

SYSTEM_PROMPT = """
You are an expert MySQL SQL generator.

Your task is to convert natural language into a SAFE SQL query.

DATABASE:
Table: real_estates

Allowed columns:
id, title, description, type, price, rooms, restroom, area_m2, location, published_date

Use ONLY the exact database column names in English:
id, title, description, type, price, rooms, restroom, area_m2, location, published_date

IMPORTANT VALUE MAPPING:
- The database values are in SPANISH.
- Always use SPANISH values for the type column.
- apartment / apartamento = departamento
- house / casa = casa
- land / terreno = terreno


STRICT RULES:
1. ONLY generate one SELECT statement
2. NEVER generate INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE
3. NEVER include markdown
4. NEVER include explanations
5. NEVER include comments
6. NEVER include text before or after the SQL
7. Response MUST start with SELECT
8. Response MUST end with semicolon

STRICT OUTPUT RULES:
- DO NOT use markdown
- DO NOT use ```sql
- RETURN plain text only
- START directly with SELECT
"""


def build_prompt(natural_query: str) -> str:
    prompt = f"""
    {SYSTEM_PROMPT}

    USER REQUEST:
    {natural_query}
    """

    return prompt


def generate_sql(natural_query: str) -> str:
    # normalized_user_query_result = normalize_user_query(natural_query)
    #
    # print("normalized_user_query_result..", normalized_user_query_result)

    prompt = build_prompt(natural_query)

    response = requests.post(
        f"{settings.ollama_api}/api/generate",
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "format": {
                "type": "object",
                "properties": {"sql": {"type": "string"}},
                "required": ["sql"],
            },
        },
    )

    response.raise_for_status()

    result = response.json()["response"]

    sql = json.loads(result)["sql"]

    return sql
