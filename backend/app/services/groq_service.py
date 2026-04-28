import json
import os
from groq import Groq
from app.services.prompts import build_prompt
from app.core.config import settings

MODEL_NAME = "llama-3.1-70b-versatile"

DATABASE_ENGINE = "POSTGRESQL"


def generate_sql(natural_query: str) -> str:
    client = Groq(
        api_key=settings.groq_api_key,
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