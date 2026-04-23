import json
import os
from groq import Groq
from app.utils.user_query import normalize_user_query

MODEL_NAME = "llama-3.1-70b-versatile"

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


RULES FOR TEXT SEARCH:
- For location  ALWAYS use LIKE with wildcards
- Example: location LIKE '%Zona 14%'
- Never use exact match for location
- For rooms, and restroom ALWAYS use INT values NO boolean


STRICT RULES:
1. ONLY generate one SELECT statement
2. NEVR generate INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE
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
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY", ""),
    )

    prompt = build_prompt(natural_query)

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0,
        response_format={
            "type": "json_object",
            "properties": {"sql": {"type": "string"}},
            "required": ["sql"],
        },
    )

    result = response.choices[0].message.content

    sql = json.loads(result)["sql"]

    return sql